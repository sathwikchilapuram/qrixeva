import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { uploadToSupabaseStorage } from '@/lib/supabase';
import { getFileMemoryStore } from '@/lib/memory-store';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const authSession = await getAuthUser(req);
    const userId = authSession?.userId;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let bucket: 'resumes' | 'documents' | 'images' | 'videos' | 'other-files' = 'documents';
    if (file.type.includes('pdf') || file.name.endsWith('.pdf')) bucket = 'resumes';
    if (file.type.includes('image')) bucket = 'images';
    if (file.type.includes('video')) bucket = 'videos';

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileId = `file_${Date.now()}_${safeName}`;

    // Store binary file in server memory
    const fileStore = getFileMemoryStore();
    fileStore.set(fileId, {
      buffer,
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      userId: userId || undefined,
    });

    // Write file to /tmp for disk persistence in serverless env
    try {
      const tmpPath = path.join('/tmp', fileId);
      await fs.promises.writeFile(tmpPath, buffer);
      await fs.promises.writeFile(
        `${tmpPath}.meta`,
        JSON.stringify({
          filename: file.name,
          mimeType: file.type || 'application/pdf',
          userId: userId || null,
        })
      );
    } catch (fsErr) {
      console.warn('Failed writing to /tmp disk:', fsErr);
    }

    const host = req.headers.get('host') || 'qrixeva.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const serverFileUrl = `${protocol}://${host}/api/files/${fileId}`;

    const storageUrl = await uploadToSupabaseStorage(buffer, file.name, bucket);
    const finalPublicUrl = storageUrl || serverFileUrl;

    let storedFileRecord = null;
    if (process.env.DATABASE_URL) {
      try {
        storedFileRecord = await prisma.storedFile.create({
          data: {
            userId: userId || null,
            filename: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size,
            storageUrl: finalPublicUrl,
          },
        });
      } catch (dbErr) {
        console.warn('Prisma storedFile.create failed:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: storedFileRecord?.id || fileId,
        userId: userId || null,
        name: file.name,
        type: file.type,
        size: file.size,
        storageUrl: finalPublicUrl,
      },
    });
  } catch (error) {
    console.error('API /api/upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
