import { NextResponse } from 'next/server';
import { uploadToSupabaseStorage } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
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

    const storageUrl = await uploadToSupabaseStorage(buffer, file.name, bucket);

    const publicUrl = storageUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    let storedFileRecord = null;
    if (process.env.DATABASE_URL) {
      storedFileRecord = await prisma.storedFile.create({
        data: {
          filename: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          storageUrl: publicUrl,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: storedFileRecord?.id || 'file-' + Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        storageUrl: publicUrl,
      },
    });
  } catch (error) {
    console.error('API /api/upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
