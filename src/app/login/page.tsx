'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Logo } from '@/components/branding/Logo';
import {
  Phone,
  Lock,
  User as UserIcon,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

export default function LoginPage() {
  const { login, signup, loading } = useAuth();

  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Sign Up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);

  // 1. Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim()) {
      setLoginError('Please enter your phone number.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsSubmittingLogin(true);
    const res = await login(loginPhone.trim(), loginPassword);
    setIsSubmittingLogin(false);

    if (!res.success) {
      setLoginError(res.error || 'Invalid phone number or password.');
    }
  };

  // 2. Handle Direct Sign Up Submit (No OTP)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim()) {
      setSignUpError('Please enter your full name.');
      return;
    }
    if (!signUpPhone.trim() || signUpPhone.trim().length < 5) {
      setSignUpError('Please enter a valid phone number.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmittingSignup(true);
    const res = await signup({
      name: signUpName.trim(),
      phone: signUpPhone.trim(),
      password: signUpPassword,
    });
    setIsSubmittingSignup(false);

    if (!res.success) {
      setSignUpError(res.error || 'Failed to create account.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
        <div className="text-center space-y-4">
          <Logo size="lg" variant="light" className="justify-center animate-pulse" />
          <p className="text-sm text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand-500 relative overflow-hidden">
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brand-500/20 via-indigo-500/20 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 relative z-10">
        <div className="flex justify-center">
          <Link href="/">
            <Logo size="lg" variant="light" />
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {tab === 'login' ? 'Sign In to Qrixeva' : 'Create Your Qrixeva Account'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {tab === 'login'
              ? 'Access your QR codes, files, profiles & analytics'
              : 'Enter your name, phone number, and password to start'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-gray-900 border border-gray-800 py-8 px-4 shadow-2xl rounded-3xl sm:px-10 space-y-6 backdrop-blur-xl">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-gray-950 border border-gray-800">
            <button
              onClick={() => {
                setTab('login');
                setLoginError('');
              }}
              className={`py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                tab === 'login' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setSignUpError('');
              }}
              className={`py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                tab === 'signup' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Register
            </button>
          </div>

          {/* LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 font-bold text-sm text-white transition shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmittingLogin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTab('signup');
                    setSignUpError('');
                  }}
                  className="text-xs text-gray-400 hover:text-brand-400 transition"
                >
                  Don't have an account? <span className="font-bold text-white underline">Register here</span>
                </button>
              </div>
            </form>
          )}

          {/* SIGN UP TAB */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {signUpError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingSignup}
                className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 font-bold text-sm text-white transition shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmittingSignup ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    Create Account & Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setLoginError('');
                  }}
                  className="text-xs text-gray-400 hover:text-brand-400 transition"
                >
                  Already registered? <span className="font-bold text-white underline">Sign in here</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
