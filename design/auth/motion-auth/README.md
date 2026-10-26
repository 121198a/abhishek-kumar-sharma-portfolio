# Auth Site

A modern, responsive authentication interface built with HTML, Tailwind CSS 4, and vanilla JavaScript. No complex build step or framework required.

## Project Structure

```
auth-site/
├── assets/
│   ├── fonts/
│   │   └── outfit-latin-wght-normal.woff2    # Outfit variable web font
│   ├── hero-code.jpg                         # Hero visual background
│   └── logo-mark.svg                         # Vector branding icon
├── js/
│   └── app.js                                # Client validation, auth store, event handlers
├── vendor/
│   ├── daisyui.css                           # daisyUI 5 component utilities
│   ├── lenis.css                             # Lenis smooth scroll styling
│   ├── lenis.min.js                          # Lenis smooth scroll engine
│   └── tailwind-browser.js                   # Tailwind CSS 4 browser compiler
├── .env.example                              # Environment configuration template
├── .gitignore                                # Git ignore rules for repository hygiene
├── index.html                                # Main application markup & styles
└── README.md                                 # Project documentation
```

## How to Run

Zero install or build step required (100% native browser technologies — no Python or Node runtime required):

1. **Direct Browser Execution**: Simply double-click `index.html` in your file explorer to open it in Chrome, Edge, Safari, or Firefox.
2. **Local Static Server (Optional)**:
   ```bash
   npx serve .
   ```
   Or use VS Code's **Live Server** extension (`Alt + L, Alt + O`).

## Features

- **Interactive Tab Navigation**: Smooth transition choreography between Sign In and Sign Up views.
- **Form Validation**: Real-time validation for email formatting, password strength, and username constraints.
- **Client Auth Simulation**: LocalStorage-backed authentication store with secure salt + SHA-256 password hashing.
- **Interactive Terms & Conditions**: Integrated modal dialog with structured sections and download copy option.
- **Social Sign-In (SSO)**: Styled providers for Google, Facebook, and GitHub.
- **Offline Support**: All third-party libraries (Tailwind, daisyUI, Lenis) and fonts are bundled locally in `vendor/` and `assets/`.
