"use client";

import React, { useState, useEffect, useRef } from "react";
import { profile } from "@/data/profile";
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
          const subject = typeof parsed.subject === "string" ? parsed.subject : "";
          const message = typeof parsed.message === "string" ? parsed.message : "";
          setFormData({ name, email, phone, subject, message, honeypot: "" });
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
  }, [formData.name, formData.email, formData.phone, formData.subject, formData.message]);

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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
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
          <div className="relative overflow-hidden rounded-3xl border border-line bg-panel2/80 p-8 sm:p-12 lg:p-16 shadow-2xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              {/* Left Column: Context & Direct Contact Options */}
              <div>
                <span className="text-xs font-semibold text-purple">
                  Let&apos;s Connect
                </span>
                <h2 className="mt-3 text-[clamp(1.85rem,4vw,3rem)] font-black leading-[1.02] tracking-[-0.035em] text-ink">
                  Let&apos;s build <span className="gradient-text">something great</span> together.
                </h2>

                <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-muted">
                  Have an open role, an internship opportunity, a project proposal, or a technical inquiry?
                  Drop a message below or reach out directly.
                </p>

                {/* Direct Contact Cards */}
                <div className="mt-8 space-y-3.5">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3.5 rounded-2xl border border-line bg-panel p-4 transition-all duration-200 hover:border-purple/50"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/15 text-purple font-semibold">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted block">
                        Direct Email
                      </span>
                      <strong className="text-sm font-semibold text-ink group-hover:text-purple transition-colors">
                        {profile.email}
                      </strong>
                    </div>
                  </a>

                  <a
                    href={profile.phoneHref}
                    className="group flex items-center gap-3.5 rounded-2xl border border-line bg-panel p-4 transition-all duration-200 hover:border-purple/50"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/15 text-purple font-semibold">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted block">
                        Phone Contact
                      </span>
                      <strong className="text-sm font-semibold text-ink group-hover:text-purple transition-colors">
                        {profile.phone}
                      </strong>
                    </div>
                  </a>

                  <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-panel p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/15 text-purple font-semibold">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted block">
                        Current Location
                      </span>
                      <strong className="text-sm font-semibold text-ink">
                        {profile.currentLocation}
                      </strong>
                      <span className="mt-1 block text-xs text-muted">
                        Permanent: {profile.permanentLocation}
                      </span>
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
              </div>

              {/* Right Column: Contact Form */}
              <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
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
                          Your Name <span className="text-pink">*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          maxLength={100}
                          placeholder="Enter Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-semibold text-muted mb-1.5">
                          Email Address <span className="text-pink">*</span>
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

                    {/* Phone & Subject Row (Requirement 13) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-phone" className="block text-xs font-semibold text-muted mb-1.5">
                          Phone Number <span className="text-muted/60 font-normal"></span>
                        </label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          maxLength={40}
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-subject" className="block text-xs font-semibold text-muted mb-1.5">
                          Subject <span className="text-muted/60 font-normal"></span>
                        </label>
                        <input
                          id="contact-subject"
                          name="subject"
                          type="text"
                          maxLength={160}
                          placeholder="Project Inquiry / Opportunity"
                          value={formData.subject}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-message" className="text-xs font-semibold text-muted">
                          Your Message <span className="text-pink">*</span>
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
