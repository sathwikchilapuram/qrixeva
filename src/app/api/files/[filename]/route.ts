import { NextResponse } from 'next/server';
import { getFileMemoryStore } from '@/lib/memory-store';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const store = getFileMemoryStore();
    let fileRecord = store.get(filename);

    if (!fileRecord) {
      const tmpPath = path.join('/tmp', filename);
      const metaPath = `${tmpPath}.meta`;
      if (fs.existsSync(tmpPath)) {
        const fileBuffer = await fs.promises.readFile(tmpPath);
        let origFilename = filename;
        let mimeType = 'application/pdf';
        if (fs.existsSync(metaPath)) {
          try {
            const metaStr = await fs.promises.readFile(metaPath, 'utf-8');
            const meta = JSON.parse(metaStr);
            origFilename = meta.filename || origFilename;
            mimeType = meta.mimeType || mimeType;
          } catch (e) {
            // ignore meta parse error
          }
        }
        fileRecord = {
          buffer: fileBuffer,
          filename: origFilename,
          mimeType: mimeType,
        };
      }
    }

    if (!fileRecord) {
      return NextResponse.json({ success: false, error: 'File not found or expired' }, { status: 404 });
    }

    return new Response(new Uint8Array(fileRecord.buffer), {
      headers: {
        'Content-Type': fileRecord.mimeType || 'application/pdf',
        'Content-Disposition': `inline; filename="${fileRecord.filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('API GET /api/files/[filename] error:', err);
    return NextResponse.json({ success: false, error: 'File retrieval failed' }, { status: 500 });
  }
}
