-- =========================================================
-- QRIXEVA PLATFORM ROW LEVEL SECURITY (RLS) POLICIES
-- Execute in Supabase SQL Editor to enforce strict user data isolation
-- =========================================================

-- Enable RLS on all primary tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QRCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StoredFile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ScanLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OtpCode" ENABLE ROW LEVEL SECURITY;

-- 1. USER POLICIES
-- Users can only read and update their own user record
CREATE POLICY "Users can select own record" ON "User"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own record" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

-- 2. QR CODE POLICIES
-- Authenticated users can view, insert, update, and delete their own QR codes
CREATE POLICY "Users view own QR codes" ON "QRCode"
  FOR SELECT USING (auth.uid()::text = "userId" OR "userId" IS NULL);

CREATE POLICY "Users create own QR codes" ON "QRCode"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId" OR "userId" IS NULL);

CREATE POLICY "Users update own QR codes" ON "QRCode"
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users delete own QR codes" ON "QRCode"
  FOR DELETE USING (auth.uid()::text = "userId");

-- 3. STORED FILE POLICIES
-- Users can manage their own files
CREATE POLICY "Users view own files" ON "StoredFile"
  FOR SELECT USING (auth.uid()::text = "userId" OR "userId" IS NULL);

CREATE POLICY "Users create own files" ON "StoredFile"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId" OR "userId" IS NULL);

CREATE POLICY "Users delete own files" ON "StoredFile"
  FOR DELETE USING (auth.uid()::text = "userId");

-- 4. USER PROFILE POLICIES
CREATE POLICY "Users view own profile" ON "UserProfile"
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users update own profile" ON "UserProfile"
  FOR ALL USING (auth.uid()::text = "userId");
