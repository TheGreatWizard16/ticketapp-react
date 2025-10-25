# 🎟️ TicketApp (React)

A full-featured ticket management web application built with **React + Vite + TypeScript**.  
Implements authentication, protected routes, CRUD operations, validation, and consistent UI per HNG Stage 2 requirements.

---

## 🚀 Features
- Responsive layout (max-width 1440 px, centered)
- Wavy hero section + decorative circles
- Simulated authentication using `localStorage.ticketapp_session`
- Protected routes: `/dashboard`, `/tickets`
- CRUD operations for tickets (Create / Read / Update / Delete)
- Inline + toast error handling
- Status colors  
  - `open` → green  
  - `in_progress` → amber  
  - `closed` → gray
- Accessibility compliant (semantic HTML, visible focus, alt text, color contrast)

---

## 🧩 Tech Stack
- React 18
- Vite 5 (TypeScript template)
- React Router DOM v6
- CSS Modules / tokens.css
- LocalStorage for persistence

---

## 🧰 Setup & Run

```bash
git clone https://github.com/TheGreatWizard16/ticketapp-react.git
cd ticketapp-react
npm install
npm run dev
