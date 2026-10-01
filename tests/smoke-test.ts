// End-to-end smoke test for the consolidated Next.js portfolio.
// Validates:
// 1. Production server startup & route responses
// 2. Canonical SEO routes (robots.txt, sitemap.xml, icon.svg)
// 3. Static resume asset availability
// 4. AI chat API fallback without API keys
// 5. Contact API form validation, honeypot defense, and graceful unconfigured Resend handling
// 6. Project deep dive server-side context resolution

import http from "http";
import { spawn, ChildProcess } from "child_process";
import path from "path";

const PORT = 3001; // Use non-conflicting port for smoke test
const BASE_URL = `http://127.0.0.1:${PORT}`;

let serverProcess: ChildProcess | null = null;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRoute(route: string, options?: RequestInit) {
  const url = `${BASE_URL}${route}`;
  return fetch(url, options);
}

async function waitForServer(): Promise<boolean> {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) return true;
    } catch {
      // server not ready yet
    }
    await wait(1000);
  }
  return false;
}

async function runSmokeTests() {
  console.log(`Starting Next.js production server on port ${PORT}...`);

  const nextBin = path.resolve(__dirname, "..", "node_modules", "next", "dist", "bin", "next");

  serverProcess = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
  });

  const isReady = await waitForServer();
  if (!isReady) {
    console.error("❌ Failed to start Next.js server within 30 seconds.");
    process.exit(1);
  }
  console.log("✓ Server ready! Running smoke test suite...\n");

  const results: { test: string; passed: boolean; details?: string }[] = [];

  // Test 1: Homepage loads with 200 and expected markup
  try {
    const res = await fetchRoute("/");
    const html = await res.text();
    const passed =
      res.status === 200 &&
      html.includes("Abhishek Kumar Sharma") &&
      html.includes("Building real products") &&
      html.includes("application/ld+json");
    results.push({
      test: "1. Homepage loads with 200 and valid schema markup",
      passed,
      details: passed ? "OK" : `Status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "1. Homepage loads", passed: false, details: String(err) });
  }

  // Test 2: Robots.txt
  try {
    const res = await fetchRoute("/robots.txt");
    const txt = await res.text();
    const passed =
      res.status === 200 &&
      txt.toLowerCase().includes("user-agent: *") &&
      txt.includes("sitemap.xml");
    results.push({
      test: "2. Canonical robots.txt route",
      passed,
      details: passed ? "OK" : `Status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "2. Robots.txt", passed: false, details: String(err) });
  }

  // Test 3: Sitemap.xml
  try {
    const res = await fetchRoute("/sitemap.xml");
    const xml = await res.text();
    const passed = res.status === 200 && xml.includes("<urlset");
    results.push({
      test: "3. Canonical sitemap.xml route",
      passed,
      details: passed ? "OK" : `Status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "3. Sitemap.xml", passed: false, details: String(err) });
  }

  // Test 4: Static Resume asset
  try {
    const res = await fetchRoute("/resume.pdf");
    const passed = res.status === 200 && (res.headers.get("content-type")?.includes("pdf") ?? false);
    results.push({
      test: "4. Canonical public/resume.pdf asset",
      passed,
      details: passed ? "OK" : `Status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "4. Resume asset", passed: false, details: String(err) });
  }

  // Test 5: Favicon icon.svg
  try {
    const res = await fetchRoute("/icon.svg");
    const passed = res.status === 200;
    results.push({
      test: "5. Favicon icon.svg route",
      passed,
      details: passed ? "OK" : `Status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "5. Icon route", passed: false, details: String(err) });
  }

  // Test 6: AI Chat API deterministic fallback without API keys
  try {
    const res = await fetchRoute("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Who is Abhishek?" }),
    });
    const json = await res.json();
    const passed =
      res.status === 200 &&
      json.reply &&
      json.reply.includes("Abhishek Kumar Sharma") &&
      (json.mode === "fallback" || json.mode === "ai");
    results.push({
      test: "6. AI assistant API deterministic fallback",
      passed,
      details: passed ? `Mode: ${json.mode}` : `Failed: ${JSON.stringify(json)}`,
    });
  } catch (err) {
    results.push({ test: "6. AI Chat API", passed: false, details: String(err) });
  }

  // Test 7: AI Chat API Project Deep Dive server resolution
  try {
    const res = await fetchRoute("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What database does this project use?",
        selectedProject: "unboundx-admin-dashboard",
      }),
    });
    const json = await res.json();
    const passed = res.status === 200 && json.reply && json.reply.length > 0;
    results.push({
      test: "7. AI Chat Project Deep Dive resolution",
      passed,
      details: passed ? "OK" : `Failed: ${JSON.stringify(json)}`,
    });
  } catch (err) {
    results.push({ test: "7. AI Chat Deep Dive", passed: false, details: String(err) });
  }

  // Test 8: Contact Form API Validation (reject missing fields)
  try {
    const res = await fetchRoute("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", email: "", message: "" }),
    });
    const json = await res.json();
    const passed = res.status === 400 && json.success === false;
    results.push({
      test: "8. Contact Form rejects empty submission (400)",
      passed,
      details: passed ? "OK" : `Status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "8. Contact validation", passed: false, details: String(err) });
  }

  // Test 9: Contact Form Honeypot defense
  try {
    const res = await fetchRoute("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bot",
        email: "bot@spammer.com",
        message: "Spam link",
        honeypot: "Spam Company Inc",
      }),
    });
    const json = await res.json();
    const passed = res.status === 200 && json.success === true;
    results.push({
      test: "9. Contact Form silently catches honeypot bot",
      passed,
      details: passed ? "OK" : `Status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "9. Honeypot check", passed: false, details: String(err) });
  }

  // Test 10: Contact Form Honest Unconfigured State
  try {
    const res = await fetchRoute("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Recruiter",
        email: "recruiter@tech.com",
        message: "Hello Abhishek, let's connect!",
      }),
    });
    const json = await res.json();
    // If RESEND_API_KEY is not configured, it must return honest 503 explaining email delivery is not configured
    // If RESEND_API_KEY is configured, it sends and returns 200 or 502
    const passed =
      (res.status === 503 && json.error.includes("Email delivery isn't configured yet")) ||
      (res.status === 200 && json.success === true);
    results.push({
      test: "10. Contact Form honest unconfigured Resend handling",
      passed,
      details: passed ? `Status ${res.status} (${json.error || "Sent"})` : `Unexpected status ${res.status}`,
    });
  } catch (err) {
    results.push({ test: "10. Contact unconfigured handling", passed: false, details: String(err) });
  }

  // Shutdown server
  if (serverProcess) {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"]);
    } else {
      serverProcess.kill("SIGTERM");
    }
  }

  console.log("\n================ SMOKE TEST REPORT ================\n");
  let allPassed = true;
  for (const r of results) {
    const mark = r.passed ? "✓ PASS" : "✗ FAIL";
    if (!r.passed) allPassed = false;
    console.log(`${mark} : ${r.test} [${r.details ?? ""}]`);
  }
  console.log("\n===================================================\n");

  if (!allPassed) {
    console.error("Some smoke tests failed.");
    process.exit(1);
  } else {
    console.log("All 10 E2E smoke tests passed successfully!");
    process.exit(0);
  }
}

runSmokeTests().catch((err) => {
  console.error("Smoke test error:", err);
  if (serverProcess) {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"]);
    } else {
      serverProcess.kill("SIGTERM");
    }
  }
  process.exit(1);
});
