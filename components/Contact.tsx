"use client";

import React, { useState } from "react";
import { profile } from "@/data/profile";
import { trackEvent } from "@/lib/analytics";
import Reveal from "@/components/motion/Reveal";

interface ContactProps {
  contactEnabled: boolean;
}

export default function Contact({ contactEnabled }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData({ name: "", email: "", message: "", honeypot: "" });
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
          <div
            className="relative overflow-hidden rounded-3xl border border-line bg-panel2/80 p-8 sm:p-12 lg:p-16 shadow-2xl"
            style={{
              background:
                "radial-gradient(circle at 10% 20%, rgba(58, 103, 237, 0.14) 0%, transparent 50%), linear-gradient(135deg, rgba(20, 20, 23, 0.9) 0%, rgba(12, 12, 15, 0.95) 100%)",
            }}
          >
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              {/* Left Column: Context & Direct Contact Options */}
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#84a2fc] uppercase">
                  Let&apos;s Connect
                </span>
                <h2 className="mt-3 text-[clamp(2.25rem,5vw,4.25rem)] font-black leading-[0.98] tracking-[-0.04em] text-white">
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
                    className="group flex items-center gap-3.5 rounded-2xl border border-line/80 bg-white/[0.02] p-4 transition-all duration-200 hover:border-purple/50 hover:bg-purple/[0.06]"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/15 text-purple font-semibold">
                      ✉
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">
                        Direct Email
                      </span>
                      <strong className="text-sm font-semibold text-white group-hover:text-[#b4c6fe] transition-colors">
                        {profile.email}
                      </strong>
                    </div>
                  </a>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("github_click")}
                      className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-muted transition hover:border-purple/40 hover:text-white"
                    >
                      <span>GitHub</span>
                      <span>↗</span>
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("linkedin_click")}
                      className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-muted transition hover:border-purple/40 hover:text-white"
                    >
                      <span>LinkedIn</span>
                      <span>↗</span>
                    </a>
                    <a
                      href={profile.resumeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("resume_download")}
                      className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-muted transition hover:border-purple/40 hover:text-white"
                    >
                      <span>Resume ↓</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="rounded-2xl border border-line/90 bg-panel/90 p-6 sm:p-8">
                {!contactEnabled ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-muted">
                      The contact form is currently in direct-email mode.
                    </p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="glow mt-4 inline-block rounded-xl px-5 py-2.5 text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #3f66f5 0%, #2d52dc 100%)" }}
                    >
                      Email {profile.email}
                    </a>
                  </div>
                ) : status === "success" ? (
                  <div className="py-8 text-center flex flex-col items-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#86efac]/20 text-2xl text-[#86efac] mb-4">
                      ✓
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Message Delivered!
                    </h3>
                    <p className="mt-2 max-w-sm text-xs text-muted leading-relaxed">
                      Thank you for reaching out, Abhishek will review your note and respond promptly.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-6 rounded-xl border border-line px-4 py-2 text-xs font-semibold text-white transition hover:border-purple hover:bg-purple/10"
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
                      value={formData.honeypot}
                      onChange={handleChange}
                      className="hidden"
                      aria-hidden="true"
                    />

                    {/* Name Input */}
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
                        placeholder="e.g. Alex Smith"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-muted/50 outline-none transition duration-200 focus:border-purple focus:ring-1 focus:ring-purple/50"
                      />
                    </div>

                    {/* Email Input */}
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
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-muted/50 outline-none transition duration-200 focus:border-purple focus:ring-1 focus:ring-purple/50"
                      />
                    </div>

                    {/* Message Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="contact-message" className="text-xs font-semibold text-muted">
                          Your Message <span className="text-pink">*</span>
                        </label>
                        <span className="text-[10px] text-muted font-mono">
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
                        className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-muted/50 outline-none transition duration-200 focus:border-purple focus:ring-1 focus:ring-purple/50 resize-y"
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
                          className="mt-1.5 inline-block font-semibold underline hover:text-white"
                        >
                          Click here to send directly via your email client
                        </a>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="glow flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #3f66f5 0%, #2d52dc 100%)" }}
                    >
                      {status === "submitting" ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>Delivering Message...</span>
                        </>
                      ) : (
                        <span>Send Message</span>
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
