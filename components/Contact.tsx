"use client";

import React, { useState, useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { countryCodes, type CountryCode } from "@/data/country-codes";
import { trackEvent } from "@/lib/analytics";
import Reveal from "@/components/motion/Reveal";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Check } from "@/components/ui/Icons";

interface ContactProps {
  contactEnabled: boolean;
}

const DRAFT_STORAGE_KEY = "contact_form_draft_v2";

export default function Contact({ contactEnabled }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    countryCodes.find((c) => c.code === "IN") || countryCodes[0]
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const isLoadedRef = useRef(false);

  // Restore non-sensitive draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const name = typeof parsed.name === "string" ? parsed.name : "";
          const email = typeof parsed.email === "string" ? parsed.email : "";
          const phone = typeof parsed.phone === "string" ? parsed.phone : "";
          const savedCountry = typeof parsed.countryCode === "string" ? parsed.countryCode : "IN";
          const matchedCountry =
            countryCodes.find((c) => c.code === savedCountry || c.dialCode === savedCountry) ||
            countryCodes.find((c) => c.code === "IN") ||
            countryCodes[0];
          const subject = typeof parsed.subject === "string" ? parsed.subject : "";
          const message = typeof parsed.message === "string" ? parsed.message : "";
          setFormData({ name, email, phone, subject, message, honeypot: "" });
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
          }
          if (name || email || message || phone || subject) {
            setIsDraftRestored(true);
          }
        }
      }
    } catch {
      // Safe fallback if localStorage is disabled
    }
  }, []);

  // Persist draft changes only after initial mount
  useEffect(() => {
    if (!isLoadedRef.current) {
      isLoadedRef.current = true;
      return;
    }
    try {
      if (formData.name || formData.email || formData.message || formData.phone || formData.subject) {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            countryCode: selectedCountry.code,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
          })
        );
      } else {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setIsDraftRestored(false);
      }
    } catch {
      // Safe fallback
    }
  }, [formData.name, formData.email, selectedCountry, formData.phone, formData.subject, formData.message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Safe fallback
    }
    setFormData({ name: "", email: "", phone: "", subject: "", message: "", honeypot: "" });
    setIsDraftRestored(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const fullPhone = formData.phone.trim()
        ? `${selectedCountry.dialCode} ${formData.phone.trim()}`
        : undefined;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          subject: formData.subject || undefined,
          message: formData.message,
          honeypot: formData.honeypot,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatus("error");
        setErrorMessage(
          json.error ?? "Failed to send message. Please try emailing directly."
        );
        return;
      }

      setStatus("success");
      trackEvent("contact_submit");
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Safe fallback
      }
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", honeypot: "" });
      setIsDraftRestored(false);
    } catch {
      setStatus("error");
      setErrorMessage(
        "Network error. Please check your connection or email directly."
      );
    }
  }

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-shell px-6 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-line bg-panel2/80 p-8 sm:p-12 lg:p-16 shadow-lg">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              {/* Left Column: Context & Direct Contact Options */}
              <div>
                <h2 className="text-[clamp(1.85rem,4vw,3rem)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
                  Let&apos;s build <span className="gradient-text">something great</span> together.
                </h2>

                <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-muted">
                  Have an open role, an internship opportunity, a project proposal, or a technical inquiry?
                  Drop a message below or reach out directly.
                </p>

                {/* Direct Contact List */}
                <div className="mt-8 divide-y divide-line border-y border-line">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3.5 py-3.5 transition-colors hover:text-purple"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-panel2 text-purple font-semibold shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted block">
                        Direct Email
                      </span>
                      <strong className="text-sm font-semibold text-ink group-hover:text-purple transition-colors">
                        {profile.email}
                      </strong>
                    </div>
                  </a>

                  <a
                    href={profile.phoneHref}
                    className="group flex items-center gap-3.5 py-3.5 transition-colors hover:text-purple"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-panel2 text-purple font-semibold shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted block">
                        Phone Contact
                      </span>
                      <strong className="text-sm font-semibold text-ink group-hover:text-purple transition-colors">
                        {profile.phone}
                      </strong>
                    </div>
                  </a>

                  <div className="flex items-center gap-3.5 py-3.5">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-panel2 text-purple font-semibold shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted block">
                        Current Location
                      </span>
                      <strong className="text-sm font-semibold text-ink">
                        {profile.currentLocation}
                      </strong>
                      <span className="mt-0.5 block text-xs text-muted">
                        Permanent: {profile.permanentLocation}
                      </span>
                    </div>
                  </div>
                </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("github_click")}
                      className="btn-secondary"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("linkedin_click")}
                      className="btn-secondary"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="rounded-xl border border-line bg-panel p-6 sm:p-8">
                {!contactEnabled ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-muted">
                      The contact form is currently in direct-email mode.
                    </p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="btn-primary mt-4"
                    >
                      Email {profile.email}
                    </a>
                  </div>
                ) : status === "success" ? (
                  <div className="py-8 text-center flex flex-col items-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#86efac]/20 text-2xl text-[#86efac] mb-4">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink">
                      Message Delivered!
                    </h3>
                    <p className="mt-2 max-w-sm text-xs text-muted leading-relaxed">
                      Thank you for reaching out, Abhishek will review your note and respond promptly.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary mt-6"
                    >
                      Send Another Note
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Bot Honeypot Field */}
                    <input
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-label="Leave this field blank"
                      value={formData.honeypot}
                      onChange={handleChange}
                      className="hidden"
                      aria-hidden="true"
                    />

                    {isDraftRestored && (
                      <div className="flex items-center justify-between rounded-lg border border-purple/30 bg-purple/10 px-3 py-1.5 text-xs text-purple">
                        <span>Draft restored from browser storage</span>
                        <button
                          type="button"
                          onClick={handleClearDraft}
                          className="font-semibold underline hover:text-ink"
                        >
                          Clear
                        </button>
                      </div>
                    )}

                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-semibold text-muted mb-1.5">
                          Your Name <span className="text-purple">*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          maxLength={100}
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-semibold text-muted mb-1.5">
                          Email Address <span className="text-purple">*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          maxLength={120}
                          placeholder="example@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Phone & Subject Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                      <div>
                        <label htmlFor="contact-phone" className="block text-xs font-semibold text-muted mb-1.5">
                          Phone Number
                        </label>
                        <div className="flex gap-2 items-center">
                          <CountrySelector
                            selected={selectedCountry}
                            onSelect={(c) => setSelectedCountry(c)}
                          />
                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            maxLength={30}
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-field flex-1 min-w-0 h-11 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-subject" className="block text-xs font-semibold text-muted mb-1.5">
                          Subject
                        </label>
                        <input
                          id="contact-subject"
                          name="subject"
                          type="text"
                          maxLength={160}
                          placeholder="Project Inquiry / Opportunity"
                          value={formData.subject}
                          onChange={handleChange}
                          className="input-field h-11"
                        />
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-message" className="text-xs font-semibold text-muted">
                          Your Message <span className="text-purple">*</span>
                        </label>
                        <span className="text-xs text-muted font-mono">
                          {formData.message.length}/2000
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={4}
                        maxLength={2000}
                        placeholder="Tell me about your team, project or inquiry..."
                        value={formData.message}
                        onChange={handleChange}
                        className="input-field resize-y"
                      />
                    </div>

                    {/* Error Banner */}
                    {status === "error" && (
                      <div className="rounded-xl border border-pink/30 bg-pink/10 p-3 text-xs text-[#fca5a5]">
                        <p>{errorMessage}</p>
                        <a
                          href={`mailto:${profile.email}?subject=Direct Portfolio Message&body=${encodeURIComponent(
                            formData.message
                          )}`}
                          className="mt-1.5 inline-block font-semibold underline hover:text-ink"
                        >
                          Click here to send directly via your email client
                        </a>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-primary w-full"
                    >
                      {status === "submitting" ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-bg/40 border-t-bg animate-spin" />
                          <span>Delivering Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Country flag image with emoji fallback
 */
function CountryFlag({ code, flag, name }: { code: string; flag: string; name?: string }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return <span className="text-xs leading-none shrink-0" aria-label={name ? `${name} flag` : `${code} flag`}>{flag}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={name ? `${name} flag` : `${code} flag`}
      width={18}
      height={13}
      onError={() => setImgError(true)}
      className="h-3.5 w-[18px] object-cover rounded-[2px] shrink-0 shadow-xs"
      loading="lazy"
    />
  );
}

/**
 * Clean, compact Country Flag + Calling Code Selector
 * Displays [ 🇮🇳 +91 ▼ ] with instant searchable country list.
 */
function CountrySelector({
  selected,
  onSelect,
}: {
  selected: CountryCode;
  onSelect: (country: CountryCode) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Auto-focus search input when opening dropdown
  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [open]);

  const filtered = search.trim()
    ? countryCodes.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : countryCodes;

  return (
    <div ref={containerRef} className="relative shrink-0">
      {/* Trigger Button: [ 🇮🇳 +91 ▼ ] */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Selected country: ${selected.name} (${selected.dialCode}). Click to choose country.`}
        className="country-select-btn"
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <CountryFlag code={selected.code} flag={selected.flag} name={selected.name} />
          <span className="font-mono text-xs text-ink truncate">
            {selected.dialCode}
          </span>
        </span>
        <span className="text-[8px] text-muted shrink-0 transition-transform duration-200">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          role="listbox"
          aria-label="Select Country"
          className="country-dropdown"
        >
          {/* Search Input */}
          <div className="relative mb-1.5">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code..."
              aria-label="Search country or code"
              className="country-search-input"
            />
          </div>

          {/* Scrollable Country List */}
          <div className="max-h-56 overflow-y-auto overscroll-contain space-y-0.5 pr-1">
            {filtered.length === 0 ? (
              <div className="py-3 text-center text-xs text-muted">
                No country found
              </div>
            ) : (
              filtered.map((c) => {
                const isSelected = c.code === selected.code;
                return (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(c);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`country-option ${
                      isSelected ? "country-option-active" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CountryFlag code={c.code} flag={c.flag} name={c.name} />
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="font-mono text-xs text-muted shrink-0 ml-2">
                      {c.dialCode}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
