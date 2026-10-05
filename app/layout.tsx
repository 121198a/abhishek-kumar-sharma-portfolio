import { jsonLdString } from "@/lib/json-ld";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { profile } from "@/data/profile";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// next/font self-hosts Google Fonts at build time — no runtime request to
// fonts.googleapis.com, which is both faster and keeps bandwidth/requests
// off any third-party quota.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${profile.name} | ${profile.title}`,
  description: `${profile.name} — ${profile.title}. ${profile.tagline} React, Node.js, Spring Boot, MySQL, MongoDB, and AWS cloud engineering.`,
  keywords: [
    "Abhishek Kumar Sharma",
    "Frontend Developer",
    "Full-Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Spring Boot",
    "Portfolio",
    "India",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} | ${profile.title}`,
    description: profile.tagline,
    url: siteConfig.url,
    siteName: `${profile.name} — Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | ${profile.title}`,
    description: profile.tagline,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteConfig.url },
  icons: {
    icon: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.title,
      url: siteConfig.url,
      email: profile.email,
      sameAs: [profile.github, profile.linkedin],
      address: { "@type": "PostalAddress", addressRegion: profile.location },
      alumniOf: "C.V. Raman Global University",
    },
    {
      "@type": "WebSite",
      name: `${profile.name} — Portfolio`,
      url: siteConfig.url,
    },
    {
      "@type": "ProfilePage",
      name: `${profile.name} | ${profile.title}`,
      url: siteConfig.url,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-ink font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-bg focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
