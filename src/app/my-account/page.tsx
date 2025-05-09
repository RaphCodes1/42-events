"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  // Mock user data
  const user = {
    username: "john_doe",
    email: "john.doe@example.com",
  };
  const router = useRouter();

  const handleSignOut = () => {
    alert("Signed out (mock)!");
  };

  const handleBack = () => {
    router.push("/");
  };

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
            <span className="text-gray-600 dark:text-gray-300 font-medium">Username:</span>
            <span className="text-gray-900 dark:text-white">{user.username}</span>
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