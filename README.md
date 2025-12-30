# Flag Football Planner 🏈

A production-ready web application for planning and managing flag football training sessions. Built with **Angular 21**, **Firebase**, and **Tailwind CSS**, featuring full bilingual support.

![Angular](https://img.shields.io/badge/Angular-21-red)
![Firebase](https://img.shields.io/badge/Firebase-v12-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 🌟 Features

- **Drill Catalog**: Comprehensive database of drills fetched from **Firestore** with dynamic filtering by category and level.
- **Training Builder**: Create and manage custom training sessions with a reactive drag-and-drop interface.
- **Admin Portal**: Secure dashboard for administrators to manage drills, plays, and global content.
- **Bilingual Support (i18n)**: Full internationalization (English/Ukrainian) using `@ngx-translate`.
- **Media Integration**: Built-in video player with support for **YouTube** and **Instagram Reels**.
- **Modern Performance**: Utilizes **Angular Signals**, **Standalone Components**, and **Deferred Views** (`@defer`) for sub-second page loads.
- **Responsive Design**: Lightweight Tailwind-based UI optimized for mobile, tablet, and desktop.
- **PDF Export**: Generate professional, ready-to-print training plans.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/ihor-protsenko-theraven/flag-football-planer.git
   cd flag-football-planer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200`

## 🛠️ Tech Stack

- **Framework**: Angular 21 (Signals, Standalone, Modern Control Flow)
- **Styling**: Tailwind CSS (Native, zero UI-library overhead)
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **I18n**: ngx-translate
- **Utility**: Angular CDK (Drag & Drop), pdfmake (PDF Generation)
- **Build Tool**: Vitest (Unit Testing)

## 📦 Project Structure

```bash
src/
├── app/
│   ├── core/            # Guards, Interceptors, Constants (APP_ROUTES)
│   ├── pages/           # Feature pages (Admin, Catalog, Builder, Trainings)
│   ├── services/        # Firebase data services (Drill, Plays, Training)
│   ├── components/      # Shared UI components (Modals, Nav, Cards)
│   └── models/          # Strict TypeScript interfaces
├── assets/
│   ├── i18n/           # en.json, uk.json
│   └── images/         # Visual assets
└── styles.css          # Tailwind & Global styles
```

## 🔐 Administration

The **Admin Portal** is protected by `AdminGuard` and uses Firebase Authentication. It features:
- Centralized Routing via `APP_ROUTES`.
- Real-time statistics dashboard.
- Integrated editors for Drills and Plays with multi-language form support.

## 🌐 Internationalization

- **Default**: Ukrainian (`uk`) / English (`en`).
- Navigation and data strictly follow the locale, with fallback mechanisms.

## 🚀 Deployment

The project is configured for **Firebase Hosting**:

```bash
# Build and deploy in one command
npm run deploy
```

## 📄 License

This project is licensed under the MIT License.

---
**Built with ❤️ for flag football coaches and players**
