# 🅿️ Smart Parking System

A full-stack web application for managing parking slots, bookings, and users — built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 🚀 Live Demo

> Record your demo and add the Google Drive link here:  
> 📹 **Demo Video:** [Google Drive Link](#)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js 18 (Hooks, Fetch API) |
| Backend | Node.js + Express.js 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) |
| AI Tool | Claude AI (Anthropic) |

---

## ✨ Features

### 👤 User
- Register & Login (JWT-based)
- Browse parking slots (Car / Bike filter)
- Book a slot with vehicle number
- View & cancel own bookings

### 🛡️ Admin
- Analytics dashboard (bookings, revenue, 7-day trend)
- Add / Enable / Disable / Delete slots
- View & manage ALL bookings (complete / cancel / delete)
- User management (view, change role, delete users)

---

## 📁 Project Structure

```
smart-parking/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── ParkingSlot.js     # Parking slot schema
│   │   └── Booking.js         # Booking schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes + JWT middleware
│   │   ├── slots.js           # Slot CRUD routes
│   │   └── booking.js         # Booking routes + analytics
│   ├── server.js              # Express app entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.js             # Main React app (all components)
    │   └── index.js
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
node server.js
# Server runs on http://127.0.0.1:5000
```

### Frontend

```bash
cd frontend
npm install
npm start
# App opens at http://localhost:3000
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | None | Register new user |
| POST | /api/auth/login | None | Login → returns JWT token |
| GET | /api/auth/users | Admin | Get all users |
| PUT | /api/auth/users/:id/role | Admin | Update user role |
| DELETE | /api/auth/users/:id | Admin | Delete user |

### Slots
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/slots | Public | Get all slots |
| POST | /api/slots/add | Admin | Add new slot |
| PUT | /api/slots/:id | Admin | Update slot |
| DELETE | /api/slots/:id | Admin | Delete slot |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/bookings | User | Create booking |
| GET | /api/bookings | User/Admin | Get bookings |
| GET | /api/bookings/analytics | Admin | Get analytics |
| PUT | /api/bookings/:id | User/Admin | Update status |
| DELETE | /api/bookings/:id | Admin | Delete booking |

---

## 🗄️ Database Schema

### users
```js
{ name, email, password, role: "user"|"admin", timestamps }
```

### parkingslots
```js
{ location, slotNumber, type: "car"|"bike", pricePerHour, isAvailable, timestamps }
```

### bookings
```js
{ slotId (ref), userId (ref), userName, vehicleNumber, startTime, endTime, totalAmount, status: "active"|"completed"|"cancelled", timestamps }
```

---

## 👨‍💻 Author

**Rohit Saini**  
BITS ID: 2025TM93214 
SE ZG503 — FSAD | BITS Pilani
