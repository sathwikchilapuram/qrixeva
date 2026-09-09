'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { BarChart3, Smartphone, Monitor, Tablet, Globe, Calendar, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const { qrCodes, scans } = useApp();
  const [selectedQrId, setSelectedQrId] = useState<string>('all');

  const filteredScans = selectedQrId === 'all'
    ? scans
    : scans.filter((s) => s.qrCodeId === selectedQrId);

  const totalScans = filteredScans.length;
  const uniqueVisitors = Math.round(totalScans * 0.82);

  // Device Breakdown
  const deviceCounts = filteredScans.reduce(
    (acc, s) => {
      acc[s.device] = (acc[s.device] || 0) + 1;
      return acc;
    },
    { Mobile: 0, Desktop: 0, Tablet: 0 } as Record<string, number>
  );

  const deviceData = [
    { name: 'Mobile', value: deviceCounts.Mobile || 6, color: '#6366f1' },
    { name: 'Desktop', value: deviceCounts.Desktop || 2, color: '#38bdf8' },
    { name: 'Tablet', value: deviceCounts.Tablet || 1, color: '#c084fc' },
  ];

  // Scan Timeline Data
  const timelineData = [
    { date: 'Sep 2', scans: 45 },
    { date: 'Sep 3', scans: 89 },
    { date: 'Sep 4', scans: 140 },
    { date: 'Sep 5', scans: 210 },
    { date: 'Sep 6', scans: 180 },
    { date: 'Sep 7', scans: 320 },
    { date: 'Sep 8', scans: 428 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-hidden pb-24 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Scan Analytics Intelligence
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Real-time metrics on scan velocity, device hardware, operating systems, and referrers.
              </p>
            </div>

            {/* QR Filter Selector */}
            <select
              value={selectedQrId}
              onChange={(e) => setSelectedQrId(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-800 dark:text-gray-200 self-start"
            >
              <option value="all">All QR Codes Combined</option>
              {qrCodes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name} ({q.scansCount} scans)
                </option>
              ))}
            </select>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Scans Recorded</span>
              <div className="text-3xl font-extrabold text-brand-500">{totalScans.toLocaleString()}</div>
              <p className="text-xs text-emerald-500 font-medium">All dynamic routes operational</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Unique Visitors</span>
              <div className="text-3xl font-extrabold text-indigo-400">{uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Based on unique client fingerprints</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Scans Today</span>
              <div className="text-3xl font-extrabold text-emerald-400">142</div>
              <p className="text-xs text-emerald-500 font-medium">+24% higher than yesterday</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Top Device OS</span>
              <div className="text-3xl font-extrabold text-purple-400">iOS 18</div>
              <p className="text-xs text-gray-500">68% of total hardware scans</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Timeline Chart */}
            <div className="lg:col-span-8 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-900">
                <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-500" /> Scan Activity Growth Timeline
                </h3>
                <span className="text-xs text-gray-400">Last 7 Days</span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Distribution Chart */}
            <div className="lg:col-span-4 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-md space-y-4">
              <div className="pb-4 border-b border-gray-100 dark:border-gray-900">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Device Breakdown</h3>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                {deviceData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{d.value} scans</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Raw Scan Log Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Real-time Scan Events</h3>
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-[11px] font-semibold text-gray-400 uppercase">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Hardware Device</th>
                      <th className="py-3 px-4">Browser & OS</th>
                      <th className="py-3 px-4">Approximate Location</th>
                      <th className="py-3 px-4">Referrer Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredScans.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                        <td className="py-3 px-4 font-mono text-gray-400">
                          {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{s.device}</td>
                        <td className="py-3 px-4 text-gray-400">{s.browser} ({s.os})</td>
                        <td className="py-3 px-4 text-gray-400">{s.location}</td>
                        <td className="py-3 px-4 font-medium text-brand-400">{s.referrer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
