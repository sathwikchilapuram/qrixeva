'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useApp } from '@/lib/AppContext';
import { FolderKanban, Upload, FileText, Download, Trash2, QrCode, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FilesPage() {
  const { files, addFile, deleteFile, addToast } = useApp();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (!fileObj) return;

    setUploading(true);
    setTimeout(() => {
      addFile({
        id: 'file-' + Date.now(),
        name: fileObj.name,
        type: fileObj.type || 'application/octet-stream',
        size: fileObj.size,
        storageUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        downloads: 0,
        createdAt: new Date().toISOString(),
      });
      setUploading(false);
    }, 1000);
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
                Cloud File Hosting Manager ({files.length})
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload PDFs, documents, audio, and media to attach to Dynamic File QR codes.
              </p>
            </div>

            <label className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition shadow-lg shadow-brand-500/20 flex items-center gap-2 cursor-pointer self-start">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload New File'}
              <input type="file" onChange={handleSimulatedUpload} className="hidden" />
            </label>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-xl transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{file.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.downloads} downloads
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      router.push(`/dashboard/create?type=file`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Attach QR
                  </button>

                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
