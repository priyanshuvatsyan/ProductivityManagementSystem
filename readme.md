# ✅ [Check Website](https://productivitymanagementsystem.netlify.app/)

## 📌 Productivity Management System

A full-stack web application to manage your productivity by tracking tasks, breaks, and overall working time with session management and stats visualization.

---

## 🚀 Features

- ⏱️ Timer with Start, Pause, and Reset
- 📊 Session tracking with working and break time
- 📈 Recharts-based analytics dashboard
- 🔐 JWT-based authentication
- 🌐 Deployed on Netlify (Frontend) and Render (Backend)
- 🔁 CI/CD Pipeline with GitHub Actions:
  - Auto linting and build
  - Backend testing
  - Email notifications on success

---

## ⚙️ Tech Stack

### 💻 Frontend
- React.js
- React Router
- Recharts
- Lucide Icons
- Vite

### 🖥️ Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT

### ☁️ DevOps / Deployment
- **CI/CD:** GitHub Actions
  - Auto build + test on push to `master`
  - Email notifications via Gmail App Passwords
- **Deployment:** 
  - Frontend → Netlify
  - Backend → Render
- **Docker:** Dockerized client and server with Docker Compose

---

## 🔄 CI/CD Workflow

A GitHub Actions workflow automates the following on every push to `master`:

- ✅ Installs dependencies for both client & server
- ✅ Lints and builds the frontend
- ✅ Runs backend tests
- ✅ Sends an email notification if everything succeeds  


---

