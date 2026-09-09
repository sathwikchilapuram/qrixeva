# Qrixeva

### Create. Customize. Connect.

A modern QR platform for creating, customizing, managing and sharing QR codes for different digital experiences.

## 🌐 Live Demo

**[https://qrixeva.vercel.app/](https://qrixeva.vercel.app/)**

---

## 📌 About Qrixeva

Qrixeva is a web application that allows users to create different types of QR codes from one platform.

Whether you need a simple link redirect, an executive resume, a digital business card, a restaurant menu, or dynamic file sharing, Qrixeva provides a unified platform to create, brand, and track your QR codes in real time.

Traditional static QR codes become unchangeable once printed. Qrixeva solves this problem through a dynamic routing system—allowing users to update the destination link, replace content, or upload new files anytime without needing to re-print the physical QR code.

---

## ✨ Features

### QR Creation
- **Multiple QR Types**: Support for URLs, documents, contact details, payment codes, and interactive digital cards.
- **Type-Specific Fields**: Custom input forms tailored to each QR experience.
- **Appearance Customization**: Customize foreground colors, background colors, custom gradients, module patterns, eye styles, and scanner frames.
- **Live Preview & Export**: Preview changes live and download high-resolution PNG or SVG files ready for print or web.
- **Easy Sharing**: Instant direct link sharing and QR image downloads.

### QR Types
- 🌐 **URL / Link**: Web links and landing pages.
- 📝 **Text**: Plain text, notes, and announcements.
- 📇 **vCard / Contact**: Contact details with instant `.vcf` file download.
- 📧 **Email**: Pre-filled email messages.
- 📞 **Phone Call**: Direct phone dialer triggers.
- 💬 **SMS**: Pre-formatted text messages.
- 📶 **Wi-Fi**: Instant Wi-Fi network credentials.
- 💸 **UPI / Payment**: Mobile payment QR codes.
- 📄 **PDF / File**: Dynamic document sharing and resume presentation.
- 👤 **Digital Profile**: Interactive personal portfolios and profiles.
- 📄 **Resume**: Dedicated executive resume showcase.
- 🪪 **Digital ID**: Digital pass cards and membership credentials.
- 🍽️ **Restaurant Menu**: Digital food menus categorized by items and pricing.
- 📅 **Event**: Event schedules and location details.

### Dashboard
- **My QR Codes**: Manage active QR codes, view scan counts, and update destinations.
- **Files Workspace**: Upload and host media files and documents attached to QR codes.
- **Analytics**: View scan activity, device breakdown, browser types, and timestamp logs.
- **Profile & Settings**: Manage account credentials and user profile information.

### Dynamic QR
Dynamic QR codes route through Qrixeva's edge resolver (`/x/[slug]`), enabling destination URLs and attached files to be updated at any time from the user dashboard without altering the printed QR pattern.

---

## 🔄 How It Works

```text
1. Create an account
        ↓
2. Choose a QR type
        ↓
3. Enter the required information
        ↓
4. Customize the QR code
        ↓
5. Generate the QR code
        ↓
6. Scan, download or share it
        ↓
7. Manage it from the dashboard
```

---

## 👤 Personal Account

Each user has their own dedicated Qrixeva account and personal dashboard. User data is kept strictly isolated using **Supabase Auth** and **PostgreSQL Row Level Security (RLS)**, ensuring that every user's QR codes, uploaded files, profiles, digital IDs, and scan analytics remain private to their account.

---

## 🛠️ Built With

| Technology | Purpose |
| :--- | :--- |
| **Next.js** | Web application framework |
| **React** | User interface library |
| **TypeScript** | Application development |
| **Supabase** | Backend engine, authentication & file storage |
| **PostgreSQL** | Relational database |
| **Prisma** | Database ORM |
| **Vercel** | Web deployment & hosting |

---

## 📁 Project Structure

```text
Qrixeva/
├── public/                 # Favicons, web icons, and static assets
├── prisma/                 # PostgreSQL database schema (schema.prisma)
├── scripts/                # Utility scripts for asset generation
├── src/
│   ├── app/                # App Router pages and server API routes
│   │   ├── api/            # Server API endpoints (Auth, QRs, Files, Upload)
│   │   ├── dashboard/      # User dashboard pages (Overview, Analytics, Files, Profile)
│   │   ├── login/          # Sign In & Registration workspace
│   │   ├── x/              # Dynamic QR routing & resolution engine (/x/[slug])
│   │   ├── layout.tsx      # Root application layout & metadata
│   │   └── page.tsx        # Qrixeva homepage & landing page
│   ├── components/         # Reusable UI & layout components
│   │   ├── branding/       # Brand logo & visual identity components
│   │   ├── layout/         # Header, Navbar, Sidebar, Footer components
│   │   ├── qr/             # Customization studio & scanner modal components
│   │   └── ui/             # Search modal, toast container, and UI elements
│   ├── lib/                # Business logic, Auth, DB client, QR engines
│   └── types/              # TypeScript definitions & data models
├── .env.example            # Environment variable template
├── .gitignore              # Security and build output ignore rules
├── DEPLOYMENT.md           # Production deployment & architecture guide
├── package.json            # Dependencies and build scripts
├── README.md               # Project documentation
├── supabase_rls_policies.sql # PostgreSQL Row Level Security (RLS) policies
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Run Locally

### 1. Clone & Install

```bash
git clone https://github.com/sathwikchilapuram/qrixeva.git
cd qrixeva
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory and add the required environment variables (see `.env.example` for details):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## ☁️ Deployment

Qrixeva is deployed using Vercel.

Live website: **[https://qrixeva.vercel.app/](https://qrixeva.vercel.app/)**

---

## 🎯 Project Goal

The goal of Qrixeva is to provide one simple platform where users can create, customize and manage different QR-based digital experiences.
