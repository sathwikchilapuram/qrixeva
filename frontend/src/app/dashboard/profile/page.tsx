'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { User, Save, Plus, Trash2, Briefcase, GraduationCap, Code } from 'lucide-react';

export default function ProfileEditorPage() {
  const { profile, updateProfile } = useApp();
  const [form, setForm] = useState(profile);
  const [skillInput, setSkillInput] = useState('');

  const handleSave = () => {
    updateProfile(form);
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Digital Profile & Resume Editor
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Customize your public mobile bio page attached to Profile & Resume dynamic QRs.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition shadow-lg shadow-brand-500/20 flex items-center gap-2 self-start"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">General Overview</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Executive Bio</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Key Technical Skills</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add skill (e.g. Next.js)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm"
                  />
                  <button onClick={addSkill} className="px-4 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs">
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {form.skills.map((sk, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
                      {sk}
                      <button onClick={() => removeSkill(idx)} className="hover:text-rose-400">✕</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Mobile Card Preview */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-950 text-white space-y-6 shadow-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Public Experience Preview</span>

                <div className="text-center space-y-3">
                  <img
                    src={form.avatarUrl}
                    alt={form.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-brand-500 shadow-xl"
                  />
                  <h4 className="font-extrabold text-lg text-white">{form.name}</h4>
                  <p className="text-xs text-brand-400 font-semibold">{form.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{form.bio}</p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {form.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-gray-900 text-[10px] text-gray-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
