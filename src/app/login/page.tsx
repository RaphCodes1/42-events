"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      console.log('Auth successful, user:', authData.user.id);
      console.log('Access Token:', authData.session.access_token);
      console.log('Refresh Token:', authData.session.refresh_token);

      console.log("Auth Session:", authData.session);
      await supabase.auth.setSession({
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      });


      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .single();

      console.log('Role check result:', { roleData, roleError });

      // If there's no role data, treat as regular user
      if (roleError && roleError.code === 'PGRST116') {
        console.log('No role found, redirecting to home');
        router.push('/');
        return;
      }

      if (roleError) {
        throw roleError;
      }

      // Redirect based on role
      if (roleData?.role === 'admin') {
        console.log('Redirecting to admin page');
        setTimeout(() => {
          router.push('/admin-page');
        }, 1000);
      } else {
        console.log('Redirecting to home');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a debug effect to check session
  // useEffect(() => {
  //   const checkSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     console.log('Current session:', session);
  //   };
  //   checkSession();
  // }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          {/* <Calendar className="text-primary-400 mr-2" size={32} /> */}
          <h1 className="text-2xl font-bold text-white">Login to 42 Calendar</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary-400 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
} 