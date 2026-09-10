# ⚡ Qrixeva

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql) ![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel)

## 📌 About

**Qrixeva** is a modern QR code platform that allows users to create, customize, manage, share, and track QR codes through a simple and user-friendly interface.

It supports multiple QR experiences including websites, text, contact information, profiles, resumes, documents, payments, locations, restaurant menus, and other digital content.

Qrixeva combines **QR technology, dynamic content, authentication, cloud storage, database management, and analytics** into one platform.

## 🌐 Live Demo

**Qrixeva:** https://qrixeva.vercel.app/

## 🚀 Key Features

- Create customizable QR codes
- Static and dynamic QR experiences
- Digital Profile QR
- Resume / CV QR
- Digital ID Card QR
- Contact / vCard QR
- Website and URL QR
- Text, Email, SMS and Wi-Fi QR
- PDF / File QR
- Restaurant Menu QR
- Location Map QR
- UPI / Payment QR
- QR download and sharing
- QR code management dashboard
- QR analytics and tracking
- User authentication
- Secure personal accounts
- Cloud file storage
- Mobile-friendly interface

## 🧠 Core Concepts

- **QR Code Generation** – Converts user-provided information into scannable QR codes.
- **Dynamic QR Technology** – Uses short dynamic links that resolve to stored content.
- **Authentication & Authorization** – Provides secure user accounts and protected resources.
- **Database Management** – Stores users, QR codes, content, and related metadata.
- **Cloud Storage** – Handles uploaded documents and digital files.
- **Analytics Tracking** – Records QR interactions and scan-related information.
- **Full-Stack Web Development** – Combines frontend, backend logic, database, and cloud services.

## 🔄 Dynamic QR System

Qrixeva uses a dynamic QR architecture where the QR code contains a short Qrixeva link instead of storing large content directly.

**User Creates QR → Content is Stored → Unique Dynamic Link is Created → QR Code Encodes the Link → User Scans QR → Qrixeva Resolves the Link → Correct Content is Displayed**

This approach keeps QR codes **clean, compact, and easier to manage** while allowing the underlying content to be updated.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack web application |
| TypeScript | Application development |
| React | User interface |
| Tailwind CSS | UI styling |
| Supabase | Authentication, storage, and backend services |
| PostgreSQL | Database |
| Prisma | Database ORM |
| Vercel | Deployment |

## 📁 Project Structure

```text
qrixeva/
├── prisma/              # Database schema and configuration
├── public/              # Static assets and icons
├── scripts/             # Utility and setup scripts
├── src/                 # Main application source code
├── .env.example         # Environment variable template
├── .gitignore           # Git ignored files
├── DEPLOYMENT.md        # Deployment documentation
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── supabase_rls_policies.sql  # Database security policies
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration

## ⚙️ Setup Procedure

1. Clone the repository.
2. Navigate to the Qrixeva project directory.
3. Install the required dependencies using `npm install`.
4. Configure the required environment variables using `.env.example`.
5. Start the development server using `npm run dev`.
6. Open the application at `http://localhost:3000`.

## 🔐 Security

Qrixeva is designed with account-level data protection so users can securely manage their own QR codes, files, profiles, and analytics.

Authentication and database authorization are used to prevent users from accessing another user's private data.

## 🎯 Project Goal

The goal of Qrixeva is to provide a **simple, scalable, and feature-rich QR platform** that makes it easy for individuals and businesses to create and manage digital experiences through QR codes.

## 🔮 Future Improvements

- Advanced QR analytics
- More dynamic QR types
- Subscription and payment system
- AI-powered QR creation assistant
- Advanced customization
- QR campaign management
- Improved business features
- Expanded integrations

## 👨‍💻 Author

**Sathwik Chilapuram**

Computer Science & Engineering  
GRIET, Hyderabad

