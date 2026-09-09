# 🌐 Qrixeva — Complete Production Deployment Guide

This document outlines the production architecture and step-by-step instructions to deploy **Qrixeva** using **GitHub**, **Vercel**, **Supabase PostgreSQL**, and **Supabase Storage**.

---

## 🏛️ Production Architecture Overview

```text
                                Qrixeva
                       (https://qrixeva.vercel.app)
                                   │
                 ┌─────────────────┴─────────────────┐
                 │                                   │
                 ▼                                   ▼
        Vercel (App Server)                 Supabase Platform
    ├─ Next.js App Router API          ├─ PostgreSQL Database (Prisma)
    ├─ Dynamic Route Engine (/x/slug)  └─ Storage Buckets (Files/PDFs)
    └─ Edge Function Processing
```

---

## 1. SUPABASE DATABASE & STORAGE SETUP

### A. Create PostgreSQL Database
1. Go to [Supabase Dashboard](https://database.new) and create a project named **`Qrixeva-Production`**.
2. Note down your **Database Password** and **Project Reference ID**.
3. Under **Project Settings -> Database**, retrieve your connection strings:
   - **Transaction Connection String (Port 6543 / PgBouncer):** `DATABASE_URL`
   - **Direct Connection String (Port 5432):** `DIRECT_URL`

### B. Create Supabase Storage Buckets
In the **Storage** section of your Supabase dashboard, create 5 public storage buckets:
1. `qrixeva-pdfs` (Public)
2. `qrixeva-images` (Public)
3. `qrixeva-videos` (Public)
4. `qrixeva-audio` (Public)
5. `qrixeva-resumes` (Public)

---

## 2. DATABASE MIGRATION & PRISMA CLIENT

Push the Prisma schema to your Supabase PostgreSQL instance:

```bash
# Set your environment variable
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Push schema tables to database
npx prisma db push
```

---

## 3. VERCEL DEPLOYMENT & PRODUCTION DOMAIN

1. Link your repository to Vercel:
   ```bash
   npx vercel --prod
   ```

2. In the Vercel Project Settings, add environment variables:

| Key | Example Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://qrixeva.vercel.app` |
| `DATABASE_URL` | `postgresql://postgres:...@db.xxx.supabase.co:6543/postgres` |
| `DIRECT_URL` | `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` |

3. Assign `https://qrixeva.vercel.app` as your primary production domain.
