"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });
      if(data){
        setError("Please check your email for verification link before logging in.");
      }
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          {/* <Calendar className="text-primary-400 mr-2" size={32} /> */}
          <h1 className="text-2xl font-bold text-white">Sign Up for 42 Calendar</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md transition-colors"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-400 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
} 