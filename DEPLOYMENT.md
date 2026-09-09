# 🌐 QRVerse — Complete Production Deployment Guide

This document outlines the production architecture and step-by-step instructions to deploy **QRVerse** using **GitHub**, **Vercel**, **Supabase PostgreSQL**, and **Supabase Storage**.

---

## 🏗️ Production System Architecture

```text
                                QRVerse
                                   │
                                   ↓
                                Vercel
                        Frontend + Next.js Server
                                   │
                         ┌─────────┴─────────┐
                         ↓                   ↓
                  Supabase Database    Supabase Storage
                   PostgreSQL DB        PDFs / Documents
                         │                   │
                         └─────────┬─────────┘
                                   ↓
                             Dynamic QR
                                   ↓
                        https://<domain>/x/<slug>
                                   ↓
                             User's Phone
```

---

## 📋 Step 1: Create Supabase PostgreSQL & Storage Buckets

1. Log into your [Supabase Dashboard](https://database.new) and click **New Project**.
2. Name the project **`QRVerse-Production`** and select a database password.
3. Once provisioned, navigate to **Project Settings -> Database** and copy:
   - **Transaction Connection String (Pooled)** -> `DATABASE_URL`
   - **Session Connection String (Direct)** -> `DIRECT_URL`
4. Navigate to **Project Settings -> API** and copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** -> `SUPABASE_SERVICE_ROLE_KEY`
5. Navigate to **Storage** in Supabase and create 5 public buckets:
   - `resumes`
   - `documents`
   - `images`
   - `videos`
   - `other-files`

---

## 💾 Step 2: Push Prisma Schema to Supabase PostgreSQL

Run the following command locally with your `DATABASE_URL` configured in `.env`:

```bash
npx prisma db push
```

This will automatically create all production database tables (`User`, `QRCode`, `StoredFile`, `ScanLog`, `UserProfile`).

---

## 🚀 Step 3: Deploy to Vercel

1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Deploy QRVerse Platform"
   git remote add origin https://github.com/YOUR_USERNAME/qrverse.git
   git push -u origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Repository**.
3. Under **Environment Variables**, add:

| Key | Example Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://qrverse-theta.vercel.app` |
| `DATABASE_URL` | `postgresql://postgres:...@db.xxx.supabase.co:6543/postgres` |
| `DIRECT_URL` | `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` |

4. Click **Deploy**. Vercel will build and assign your production HTTPS URL (e.g. `https://qrverse.vercel.app`).

---

## 🧪 Step 4: End-to-End Production Verification

1. Open your deployed production URL (`https://qrverse.vercel.app`).
2. Go to **Dashboard -> Create QR**.
3. Create a dynamic PDF or Resume QR code and upload a file.
4. Verify that the generated QR payload uses your production domain (`https://qrverse.vercel.app/x/your-slug`).
5. Scan the QR code on a mobile phone to confirm the public experience page opens.
