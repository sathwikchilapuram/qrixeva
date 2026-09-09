import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a binary file buffer to Supabase Storage bucket
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer | Blob | File,
  filename: string,
  bucketName: 'resumes' | 'documents' | 'images' | 'videos' | 'other-files' = 'documents'
): Promise<string | null> {
  try {
    const filePath = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Supabase Storage Upload Error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Supabase Storage Upload Exception:', err);
    return null;
  }
}
