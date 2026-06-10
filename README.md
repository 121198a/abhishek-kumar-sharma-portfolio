# Bold Portfolio — React + Node.js

A bold, modern personal portfolio site with a React frontend and Node.js/Express backend.

## 📁 Project Structure

```
portfolio/
├── client/          # React frontend (Create React App)
│   └── src/
│       ├── components/    # Navbar, Hero, Work, Skills, About, Contact, Footer
│       ├── hooks/         # useApi, useAnimation (IntersectionObserver, scroll)
│       └── styles/        # Global CSS design tokens
└── server/          # Express API
    ├── index.js           # Server entry: /api/projects, /api/skills
    └── routes/contact.js  # POST /api/contact
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# From the root folder
npm run install:all
```

### 2. Run in Development (both servers)

```bash
npm run dev
```

- **React** dev server → http://localhost:3000
- **Express** API → http://localhost:5000

The React app proxies `/api/*` calls to port 5000 automatically.

### 3. Build for Production

```bash
npm run build
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| `--black` | `#0A0A0A` |
| `--white` | `#F0EDE8` |
| `--blue` | `#2563FF` |
| `--red` | `#FF2D20` |
| `--green` | `#00C896` |
| Font Display | Space Grotesk |
| Font Body | Inter |
| Font Mono | Space Mono |

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/projects` | Returns project list |
| `GET` | `/api/skills` | Returns skills by category |
| `POST` | `/api/contact` | Accepts `{ name, email, message }` |

## 📦 Tech Stack

- **Frontend**: React 18, CSS custom properties, IntersectionObserver API
- **Backend**: Node.js, Express, CORS
- **Email**: Nodemailer (plug in SMTP config in `server/routes/contact.js`)
- **Fonts**: Space Grotesk · Inter · Space Mono (Google Fonts)

## ✉️ Contact Form Email Setup

In `server/routes/contact.js`, replace the simulated delay with Nodemailer:

```js
const transporter = nodemailer.createTransport({
  host: "smtp.yourprovider.com",
  port: 587,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});
await transporter.sendMail({
  from: email,
  to: "you@yourdomain.com",
  subject: `Portfolio contact from ${name}`,
  text: message,
});
```
