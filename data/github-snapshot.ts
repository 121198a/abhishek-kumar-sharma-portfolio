// Fallback snapshot of the public repositories of github.com/121198a.
// Captured 2026-10-03 from the public profile page. It is used ONLY when the
// live GitHub API call fails (rate limit, outage, offline build), and the UI
// says so. Refresh by re-running the fetch in lib/github.ts or editing by hand.

import type { GitHubRepo } from "@/lib/github";

export const GITHUB_USER = "121198a";
export const SNAPSHOT_DATE = "2026-10-03";

export const githubSnapshot: GitHubRepo[] = [
  { name: "abhishek-kumar-sharma-portfolio", description: "A modern and responsive Full-Stack Portfolio Website built with React.js, Node.js, and Express.js, showcasing projects, technical skills, and professional experience.", language: "TypeScript", updatedAt: "2026-10-01T17:04:27Z" },
  { name: "ventureflow-web", description: "UnBound X web platform \u2014 UBverse portal and investment management experience.", language: "TypeScript", updatedAt: "2026-09-30T13:08:33Z" },
  { name: "sharma-kitchen", description: "Sharma Kitchen \u2014 Full-stack food ordering and restaurant management application", language: "TypeScript", updatedAt: "2026-08-26T19:30:29Z" },
  { name: "bank-management-system", description: "Full Stack Bank Management System built with React, Node.js, Express.js, MongoDB, JWT Authentication, Role-Based Access Control, Account Management, and Transaction Tracking.", language: "JavaScript", updatedAt: "2026-08-22T23:57:24Z" },
  { name: "enterprise-it-operations-and-windows-infrastructure-management", description: null, language: "JavaScript", updatedAt: "2026-08-20T21:40:36Z" },
  { name: "unboundx-admin-dashboard", description: "Admin dashboard for UnboundX \u2014 built with React 19, Vite, and Tailwind CSS. Features authenticated routing, paginated data tables across 20+ backend modules, and a dedicated Level Activity CRUD bui\u2026", language: "JavaScript", updatedAt: "2026-08-11T06:39:53Z" },
  { name: "121198a", description: "Passionate about building modern web applications and solving real-world problems. I enjoy creating projects that blend engaging frontend experiences with powerful backend systems. \ud83d\ude80 Tech Stack: HT\u2026", language: null, updatedAt: "2026-08-03T11:23:56Z" },
  { name: "E-Commerece_Website", description: "An e-commerce website built using the MERN stack. Includes user registration, product management, shopping cart functionality, and an admin dashboard. \ud83d\uded2 Features: - Responsive UI with cart and chec\u2026", language: null, updatedAt: "2026-06-22T11:50:51Z" },
  { name: "coverless-image-steganography-sift-orb", description: "Research project implementing Coverless Image Steganography using SIFT and ORB feature extraction techniques for secure information hiding and resistance against steganalysis attacks.", language: null, updatedAt: "2026-06-21T11:34:55Z" },
  { name: "ramp-waveform-generator-stm32", description: "Ramp Waveform Generator using STM32 and Embedded C. Developed during a one-month Embedded Systems Internship at C.V. Raman Global University, featuring timer-based waveform generation, GPIO control\u2026", language: null, updatedAt: "2026-06-21T11:15:43Z" },
  { name: "FIR_Management_System", description: "The Fir Automation case file system is the set of procedure used in police organization to address complaint and resolve disputes. This is a web application which can maintain records of crime like\u2026", language: null, updatedAt: "2026-06-21T10:32:02Z" },
  { name: "campus-connect-app", description: "CampusConnect is a native Android application built to streamline campus communication. It allows real-time dissemination of notices, event alerts, and academic updates with role-based access for s\u2026", language: null, updatedAt: "2025-07-06T18:41:52Z" },
];
