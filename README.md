# 🚀 QRVerse — Universal Dynamic QR Experience Platform

**QRVerse** is a commercial-grade, modern SaaS platform for creating, customizing, managing, sharing, and tracking QR codes across 18 digital content modules.

---

## 🌐 Production Architecture

```text
Frontend + Backend → Vercel
Database           → Supabase PostgreSQL (Prisma ORM)
File Storage       → Supabase Storage (PDFs, Images, Videos, Audio)
Source Code        → GitHub
```

---

## ✨ Core Features

- **18 Content Modules:** Plain Text, URL, PDF, Cloud File, Bio Profile, Executive Resume, Digital ID Card, Contact vCard, Social Media, Business Hub, Restaurant Menu, Event Access Pass, GPS Location, Image Showcase, Audio Player, Video Player, Payment Link, and Custom QR Experience.
- **Customization Studio:** Colors, directional linear gradients, 6 dot matrix patterns, 4 corner eye shapes, custom logo overlays, scanner frames with custom text, and camera scannability scoring.
- **vCard .vcf Exporter:** 1-Click "Add to Contacts" generator for mobile address books.
- **Dynamic QR Engine (`/x/[slug]`):** Real-time backend routing, password lock screens, expiration dates, toggle disable, and live scan analytics logging.
- **Batch Generator:** Generate and download multiple QR codes simultaneously.
- **Scan Analytics Intelligence:** Interactive Recharts timelines, device hardware breakdown, browser & OS tracking.
- **AI QR Assistant:** Natural language requirement advisor with 1-click studio auto-filling.

---

## 🚀 Quick Start for Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT © QRVerse Team.
