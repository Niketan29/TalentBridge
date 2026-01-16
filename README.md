# TalentBridge 🚀

TalentBridge is a full-stack MERN application designed to connect **students** with **recruiters** and streamline the hiring process. It includes role-based dashboards, job posting & application flow, resume management, ATS checking, admin management, and a real-time notification system.

---

## 🔥 Features

### 👨‍🎓 Student
- Register / Login
- View all jobs
- Apply to jobs
- Track application status (Applied / Shortlisted / Rejected / Hired)
- Resume manager (Create / Edit / Preview)
- ATS Checker
- Notifications system

### 🧑‍💼 Recruiter
- Register / Login
- Recruiter dashboard with stats
- Post jobs
- Manage posted jobs
- View applicants per job
- Update candidate application status
- Notifications when students apply

### 🛡️ Admin
- Admin dashboard
- View all users
- Block / Unblock users
- View roles (student/recruiter/admin)
- Security: No sensitive fields exposed

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- TailwindCSS
- Axios
- React Router DOM

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (Access + Refresh tokens)
- Role-based authorization middleware

**Deployment**
- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

---



---


## ▶️ Run Locally

### 1) Clone Repository
```bash
git clone https://github.com/<your-username>/TalentBridge.git
cd TalentBridge
```

### 2) Start Backend
```bash
cd server
npm install
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

### 3) Start Frontend
```bash
cd ../client
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🔐 Authentication & Authorization

- Uses JWT access token for API authorization
- Refresh token stored in secure httpOnly cookie
- Role-based route protection:
  - Student → `/dashboard/*`
  - Recruiter → `/recruiter/*`
  - Admin → `/admin/*`

---

## 🔔 Notifications System

Notifications are created for:
- Recruiter when student applies to their job
- Student when recruiter updates application status

Unread count is shown as badge in sidebar.

---

## 🚀 Deployment

### ✅ Backend on Render
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

---

### ✅ Frontend on Vercel
- Root directory: `client`
- ENV variable:



✅ Important for React Router (refresh fix):

`client/vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## ✅ Production Links
- **Frontend (Vercel):** https://talent-bridge-umber.vercel.app/
- **Backend (Render):** https://talentbridge-znvw.onrender.com

---



## 👨‍💻 Author
**Niketan Udgire**  
TalentBridge (MERN Project)
