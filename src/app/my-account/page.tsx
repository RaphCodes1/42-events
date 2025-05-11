"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MyAccountPage() {
  const [user, setUser] = useState<{ email: string | null; name?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0]
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500">Please log in to view your account</div>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-12 flex flex-col">
        <button
          onClick={handleBack}
          className="mb-6 self-start text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Account</h1>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Name:</span>
            <span className="text-gray-900 dark:text-white">{user.name || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Email:</span>
            <span className="text-gray-900 dark:text-white">{user.email}</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-auto w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 