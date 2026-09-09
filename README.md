# Qrixeva

**Create. Customize. Connect.**

Qrixeva is a modern QR code platform that makes it easy to create, customize, manage, and share QR codes and digital QR experiences.

## 🌐 Live Demo

**[https://qrixeva.vercel.app/](https://qrixeva.vercel.app/)**

---

## 📌 About Qrixeva

Qrixeva is designed to bridge physical items and digital content through customizable, dynamic QR codes. Whether you need a simple link redirect, an executive resume, a digital business card, a restaurant menu, or dynamic file sharing, Qrixeva provides a unified platform to create, brand, and track your QR codes in real time.

Traditional static QR codes become useless when content changes or destination URLs update. Qrixeva solves this problem with a dynamic routing engine—allowing users to update content, replace destination links, or upload new document versions anytime without needing to re-print the physical QR code.

---

## ✨ Features

### 🎨 QR Creation & Customization
- **Custom Visual Styling**: Adjust foreground colors, background colors, custom gradients, eye patterns, and scanner frame badges.
- **Instant Live Preview**: Real-time rendering as customization options are modified.
- **High-Resolution Export**: Download high-resolution PNG or SVG formats suitable for print or digital media.

### 📱 Supported QR Types
- 🌐 **Website Link**: Redirect users to any web URL.
- 📝 **Plain Text**: Display formatted text or message announcements.
- 📇 **vCard / Contact**: Share digital contact details with downloadable `.vcf` integration.
- 📄 **PDF & Document**: Upload and share resumes, presentations, or documents via QR.
- 👤 **Digital Profile & ID**: Interactive personal profiles, executive portfolios, and digital pass cards.
- 🍽️ **Restaurant Menu**: Digital restaurant menus organized by dish categories and pricing.
- 📶 **Wi-Fi Credentials**: Provide instant Wi-Fi network joining without manually typing passwords.
- 💸 **UPI Payment**: Generate instant mobile payment QR codes.

### 📊 User Dashboard & Analytics
- **Personal Dashboard**: Dedicated workspace for managing active QR codes and hosted files.
- **Scan Analytics**: Track scan performance, device types, browser information, and geographic location logs.
- **Hosted Files**: Upload and manage media assets and documents attached to QR codes.
- **Account Settings**: Manage profile details, credentials, and user preferences.

### 🔄 Dynamic Routing Engine
- Dynamic QR codes route through Qrixeva's high-speed edge resolver (`/x/[slug]`).
- Change underlying destination URLs or attached file content instantly from the dashboard without altering the printed QR pattern.

---

## 🔄 How It Works

```text
1. Create an Account
        ↓
2. Choose a QR Type (Website, PDF, Contact, Menu, etc.)
        ↓
3. Enter Information & Content
        ↓
4. Customize QR Colors, Patterns & Badges
        ↓
5. Generate & Export QR Code
        ↓
6. Download, Share & Track Scan Analytics
```

---

## 👤 Personal Account & Security

Each user receives an isolated personal account and dashboard. Data isolation is enforced at the server and database level using **Supabase Auth** and **PostgreSQL Row Level Security (RLS)**, ensuring that every user's QR codes, files, profiles, and scan analytics remain strictly private to their account.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 14** | Full-Stack App Router Web Framework |
| **React 18** | Interactive User Interface Library |
| **TypeScript** | Type-Safe Application Development |
| **Tailwind CSS** | Custom Utility-First Design Engine |
| **Supabase** | Authentication, File Storage & Backend Engine |
| **PostgreSQL** | Relational Database Infrastructure |
| **Prisma** | Database ORM & Data Access |
| **Vercel** | Production Edge Deployment & CI/CD Pipeline |

---

## 📁 Project Structure

```text
Qrixeva/
├── public/                 # Favicons, icons, and public static assets
├── prisma/                 # PostgreSQL database schema (schema.prisma)
├── scripts/                # Utility scripts for asset generation
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # Server-side API endpoints (Auth, QRs, Files, Upload)
│   │   ├── dashboard/      # Dashboard pages (Overview, Analytics, Files, Profile)
│   │   ├── login/          # Sign In & Registration workspace
│   │   ├── x/              # Dynamic QR routing & resolution engine (/x/[slug])
│   │   ├── layout.tsx      # Root application layout & metadata
│   │   └── page.tsx        # Qrixeva homepage & landing page
│   ├── components/         # Reusable React UI components
│   │   ├── branding/       # Qrixeva logo & visual identity components
│   │   ├── layout/         # Header, Navbar, Sidebar, Footer components
│   │   ├── qr/             # Customization studio & scanner modal components
│   │   └── ui/             # UI elements, search modal, toast container
│   ├── lib/                # Core business logic, Auth, DB client, QR engines
│   └── types/              # TypeScript type definitions and data models
├── .env.example            # Environment variable configuration template
├── .gitignore              # Git ignore rules for security and build output
├── DEPLOYMENT.md           # Production deployment & architecture guide
├── package.json            # Project dependencies and build scripts
├── README.md               # Project documentation
├── supabase_rls_policies.sql # PostgreSQL Row Level Security (RLS) policies
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### 1. Clone & Install

```bash
git clone https://github.com/sathwikchilapuram/qrixeva.git
cd qrixeva
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory and specify your Supabase and PostgreSQL database credentials (see `.env.example` for details):

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

Open `http://localhost:3000` in your web browser to access the local application.

---

## ☁️ Deployment

Qrixeva is deployed on Vercel with automated CI/CD integration from GitHub.

- **Live Production URL**: **[https://qrixeva.vercel.app/](https://qrixeva.vercel.app/)**
