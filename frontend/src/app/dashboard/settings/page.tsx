'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import { AccentColor, ThemeMode } from '@/types';
import { Settings, Sun, Moon, Laptop, Palette, User, Phone, Lock, LogOut, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, accent, setAccent, addToast } = useApp();
  const { user, updateAccount, logout } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const accentList: { name: AccentColor; color: string }[] = [
    { name: 'violet', color: '#6366f1' },
    { name: 'blue', color: '#3b82f6' },
    { name: 'cyan', color: '#06b6d4' },
    { name: 'green', color: '#10b981' },
    { name: 'orange', color: '#f97316' },
    { name: 'rose', color: '#f43f5e' },
  ];

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setSaving(true);
    const res = await updateAccount({
      name,
      phone,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    });
    setSaving(false);

    if (res.success) {
      setSuccessMsg('Account details updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('success', 'Account updated successfully.');
    } else {
      setErrorMsg(res.error || 'Failed to update account.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              My Account & Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your personal Qrixeva account details, change password, and configure theme preferences.
            </p>
          </div>

          <div className="max-w-3xl space-y-8">
            {/* Account Details Card */}
            <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <User className="w-5 h-5 text-brand-500" /> Account Profile Details
              </h3>

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateAccount} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-900 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Change Account Password</h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Current Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 font-bold text-xs text-white transition shadow-lg shadow-brand-500/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Saving Changes...
                      </>
                    ) : (
                      'Save Account Details'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logout()}
                    className="px-5 py-3 rounded-2xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold text-xs transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout Account
                  </button>
                </div>
              </form>
            </div>

            {/* Theme Mode Card */}
            <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-4 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Sun className="w-5 h-5 text-brand-500" /> Interface Theme
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                    theme === 'light' ? 'border-brand-500 bg-brand-500/10 font-bold' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Sun className="w-6 h-6 text-yellow-500" />
                  <span className="text-xs">Light Mode</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                    theme === 'dark' ? 'border-brand-500 bg-brand-500/10 font-bold' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Moon className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs">Dark Mode</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                    theme === 'system' ? 'border-brand-500 bg-brand-500/10 font-bold' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <Laptop className="w-6 h-6 text-brand-400" />
                  <span className="text-xs">System Auto</span>
                </button>
              </div>
            </div>

            {/* Accent Colors Card */}
            <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-4 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Palette className="w-5 h-5 text-brand-500" /> Dynamic Accent Color Palette
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {accentList.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setAccent(item.name);
                      addToast('success', `Accent color changed to ${item.name.toUpperCase()}`);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition ${
                      accent === item.name
                        ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-900 font-bold'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                    <span className="text-xs capitalize">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
