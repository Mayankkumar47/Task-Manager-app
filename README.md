# 🚀 Taskflow Workspace Platform

Taskflow is a premium, unified SaaS-themed task management and team workspace platform (inspired by platforms like Linear and Asana). It provides modern project tracking pipelines, real-time collaboration features, inline conversations, built-in stopwatch time logging, role-based approvals, and AI-driven workload assistants.

---

## 🌟 Key Features

### 1. Unified SaaS Kanban Board
* **Drag-and-Drop Status Pipelines:** Seamlessly move tasks across *Pending*, *In Progress*, and *Completed* columns.
* **Metadata Badges:** Visual cards showcasing checklist progress, priority weights (Low, Medium, High), stopwatch logs, and approval tags.

### 2. Rich Task Collaboration & Workspaces
* **Stopwatch Time Tracking:** Record active hours spent on tasks using the details sheet timer. Updates cumulative minutes directly in MongoDB.
* **Inline Conversations (Comments):** Discuss updates and collaborate in text-only comment feeds directly inside task sheets.
* **Task Approval Workflow:** Request supervisor reviews with official state changes (*None*, *Pending Approval*, *Approved*, *Rejected*). Admins approve or reject; users track status.

### 3. Real-Time Team Integrations
* **Global Team Chat Room:** Slack/Discord-style channel for general announcements. Includes Web Audio API chime alerts for new incoming messages.
* **Data Log Exports:** Download telemetry reports for tasks or user lists in Excel format (`.xlsx`) with a single click.

### 4. AI-Powered Workload Co-Pilot (M.I.N.D.)
* **Context-Aware Chat:** Connects directly to Gemini models to audit your active workloads, suggest subtasks, or summarize deadlines based on your MongoDB documents.
* **Voice-to-Task Dictation:** Use the browser's Web Speech API to dictate requirements, which are then parsed into structured tasks automatically.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS v4, Framer Motion, Redux Toolkit, React Router DOM, React Icons, Axios |
| **Backend** | Node.js, Express.js, MongoDB Atlas, Mongoose ODM, JWT Authentication |
| **Integrations** | Google Gemini API (`@google/generative-ai`), Web Audio API, Web Speech API |

---

## 📥 Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_signature_secret
   GEMINI_API_KEY=your_gemini_generative_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Live Deployments
* **Frontend live url:** [Click here to view live app](https://your-frontend-deployment.vercel.app) *(Replace with your URL)*
* **Backend api endpoint:** `https://your-backend-deployment.herokuapp.com` *(Replace with your URL)*

---

## 🔑 Seeding Guest Accounts
For demonstration purposes, you can log in immediately using these pre-seeded credentials:

* **Standard User Account:**
  * **Email:** `guest@taskflow.io`
  * **Password:** `guestpasscode123`
* **Admin Account:**
  * **Email:** `admin_guest@taskflow.io`
  * **Password:** `adminpasscode123`
