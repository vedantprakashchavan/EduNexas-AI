# EduNexus AI 🧠

> **Intelligent School Operations Platform** — An AI-powered system that transforms how schools manage daily operations.

![Status](https://img.shields.io/badge/Status-In%20Development-indigo)
![Phase](https://img.shields.io/badge/Phase-1%20Foundation-blue)

## 🏫 What is EduNexus AI?

EduNexus AI is a centralized, AI-first school operating system that:

- **Digitizes** physical school records using AI-powered document reading
- **Automates** timetable generation with intelligent conflict resolution
- **Predicts** staffing requirements and student risk factors
- **Alerts** administrators proactively about issues needing attention
- **Connects** all school operations in a single, modern platform

## 🚀 Tech Stack

| Layer | Technology |
|:--|:--|
| **Frontend** | React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui |
| **Backend** | Node.js · Express 5 · TypeScript · MongoDB · Mongoose |
| **AI** | Google Gemini 2.5 (document reading, analytics, assistant) |
| **Real-time** | Socket.IO |
| **State** | Zustand · TanStack Query |
| **Charts** | Recharts |

## 📁 Project Structure

```
edunexus-ai/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # UI components (layout, common, ui)
│   │   ├── pages/        # Page components (auth, dashboard, ...)
│   │   ├── services/     # API service layer
│   │   ├── store/        # Zustand state stores
│   │   ├── types/        # TypeScript interfaces
│   │   └── lib/          # Utilities
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── config/       # Database, environment
│   │   ├── modules/      # Feature modules (auth, dashboard, ...)
│   │   ├── middleware/   # Auth, RBAC, error handling
│   │   ├── services/     # Shared services (AI, etc.)
│   │   ├── socket/       # Socket.IO handlers
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Utilities
│   └── package.json
└── README.md
```

## 🏃 Getting Started

### Prerequisites
- Node.js 22+
- MongoDB (local or Atlas)

### Installation

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Configuration

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edunexus
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Run Development Servers

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm run dev
```

### Seed Demo Data

```bash
cd server && npm run seed
```

### Demo Credentials
| Role | Email | Password |
|:--|:--|:--|
| Super Admin | admin@edunexus.com | Admin@123 |
| Teacher | teacher@edunexus.com | Teacher@123 |
| Parent | parent@edunexus.com | Parent@123 |
| Student | student@edunexus.com | Student@123 |

## 🔐 Role-Based Access

9 roles with granular permissions:
`SUPER_ADMIN` · `ADMIN` · `PRINCIPAL` · `TEACHER` · `ACCOUNTANT` · `LIBRARIAN` · `STAFF` · `PARENT` · `STUDENT`

## 📋 Modules

| Module | Status | Description |
|:--|:--|:--|
| Auth & RBAC | ✅ Built | JWT + 9-role access control |
| Admin Dashboard | ✅ Built | Proactive alerts, AI insights, charts |
| Student Management | 🔜 Phase 2 | CRUD, profiles, parent linking |
| Teacher Management | 🔜 Phase 2 | Profiles, workload tracking |
| Smart Timetable | 🔜 Phase 3 | AI-powered conflict-free scheduling |
| AI Document Reader | 🔜 Phase 4 | OCR + Gemini extraction |
| Attendance | 🔜 Phase 5 | Manual, QR, RFID simulation |
| Exams & Results | 🔜 Phase 6 | Mark entry, report cards |
| Fees | 🔜 Phase 7 | Fee management, payments |
| AI Analytics | 🔜 Phase 8 | Risk prediction, staffing forecast |
| AI Assistant | 🔜 Phase 9 | Natural language school queries |
| Communication | 🔜 Phase 10 | Announcements, notifications |
| Library/Inventory | 🔜 Phase 11 | Book & equipment tracking |
| Production | 🔜 Phase 12 | Security hardening, deployment |

## 📜 License

MIT

## Production deployment

### Frontend — Vercel

Set the Vercel project **Root Directory** to `client`.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`

The included `client/vercel.json` keeps React Router routes working after refresh.

### Backend — Render/Railway or another persistent Node host

Set the backend **Root Directory** to `server`.

- Build command: `npm ci && npm run build`
- Start command: `npm start`

Required backend environment variables:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL`
- `NODE_ENV=production`
- `COOKIE_SAME_SITE=none`

`PORT`, `JWT_ACCESS_EXPIRY`, and `JWT_REFRESH_EXPIRY` have safe defaults.

### Important API/AI note

This codebase does **not currently call Google Gemini or another AI API**. The AI Assistant and document-reader processing are implemented as local/demo simulation logic, so there is no missing Gemini API key in the current runtime. Adding a Gemini key alone will not make those screens use Gemini; that requires a separate backend integration.

MongoDB is a real backend dependency. For production, use MongoDB Atlas and place its connection string in `MONGODB_URI`.

Do not commit `.env` files or put MongoDB/JWT/Gemini secrets in Vercel frontend variables.

