"use client";
import { useState, FormEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { PasswordInput } from '../../components/ui/PasswordInput';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { login } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Get the page the user was trying to access
  const from = '/admin';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    if (!password.trim()) {
      setFormError('Password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push(from, { replace: true });
    } catch (err: any) {
      const message = err?.message || err?.data?.error || 'Invalid credentials. Please try again.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/2Crown-logo.jpeg" alt="2Crown Clothing & Printing" className="h-24 w-auto rounded-md object-contain shadow-lg mb-4" />
          <h1 className="text-2xl font-bold text-primary tracking-wider">Admin Portal</h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-secondary mb-6 text-center">Sign In</h2>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-primary focus:border-primary outline-none transition"
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-primary focus:border-primary outline-none transition"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-secondary font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-secondary border-t-transparent animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          &copy; {new Date().getFullYear()} 2Crown Clothing &amp; Printing. All rights reserved.
        </p>
      </div>
    </div>
  );
}
