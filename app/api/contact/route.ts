import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { flags, emailLimits } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { readJsonObject } from "@/lib/request-guard";
import { isNonEmptyString, isValidEmail, clampLength, looksLikeSpam, stripControlChars } from "@/lib/validate";

export const runtime = "nodejs";

// Reject grossly oversized bodies before spending any work parsing them —
// security checks happen before expensive work, not after.
const MAX_BODY_BYTES = 20_000;

type ContactBody = {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // hidden field — bots tend to fill every field
};

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(req: NextRequest) {
  if (!flags.enableContactForm) {
    return fail("The contact form is currently disabled.", 503);
  }

  const guarded = await readJsonObject(req, MAX_BODY_BYTES, fail);
  if (!guarded.ok) return guarded.response;
  const body = guarded.body as unknown as ContactBody;

  // Honeypot: real visitors never fill this hidden field. Silently pretend
  // success — never reveal to a bot (or a script probing the endpoint)
  // that this specific check is what caught it.
  if (body.honeypot) {
    return NextResponse.json({ success: true });
  }

  if (!isNonEmptyString(body.name) || !isNonEmptyString(body.email) || !isNonEmptyString(body.message)) {
    return fail("Name, email and message are all required.", 400);
  }

  if (!isValidEmail(body.email.trim())) {
    return fail("Please enter a valid email address.", 400);
  }

  // stripControlChars: defense-in-depth against header injection via the
  // subject line (which embeds `name`) — see lib/validate.ts.
  const name = stripControlChars(clampLength(body.name.trim(), 120));
  const email = body.email.trim();
  const message = clampLength(body.message.trim(), 2000);

  if (looksLikeSpam(message)) {
    return fail("Message flagged as spam. Please revise and resend.", 400);
  }

  const ip = getClientIp(req.headers);
  const withinLimit = checkRateLimit(`contact:${ip}`, emailLimits.perIpPerHour, 60 * 60_000);
  if (!withinLimit) {
    return fail("You've hit the submission limit for now. Please try again later.", 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Never send unnecessary emails, and never pretend to send when
    // misconfigured — surface a clear, actionable error instead.
    return fail(
      "Email delivery isn't configured yet. Please reach out directly via the email or GitHub link in the footer.",
      503
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSource: Portfolio Contact Form\n\nMessage:\n${message}`,
    });

    if (error) {
      // Never leak the provider's internal error object to the browser.
      console.error("[contact] Resend send error:", error);
      return fail("Couldn't send your message right now. Please try the email link in the footer instead.", 502);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return fail("Couldn't send your message right now. Please try the email link in the footer instead.", 502);
  }
}
