import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "../App.jsx";
import { passwordStrength } from "../lib/validation.js";

function mockReducedMotion(matches) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
}

beforeEach(() => {
  window.scrollTo = vi.fn();
  HTMLCanvasElement.prototype.getContext = () => null;
  window.location.hash = "";
  localStorage.clear();
  mockReducedMotion(true);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Emberdoor", () => {
  it("renders the login view with exactly one h1 and the right title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "Knock, knock." })).toBeTruthy();
    expect(document.title).toBe("Emberdoor — Log in");
    expect(document.querySelectorAll("h1")).toHaveLength(1); // hidden views use h2
  });

  it("every image on the page has meaningful alt text", () => {
    render(<App />);
    const all = [...document.querySelectorAll("img")];
    expect(all).toHaveLength(3);
    all.forEach((img) => expect(img.getAttribute("alt")?.trim().length).toBeGreaterThan(5));
  });

  it("shows validation errors on an invalid submit", () => {
    render(<App />);
    fireEvent.submit(document.getElementById("f-login"));
    expect(screen.getAllByText("This field is required.").length).toBeGreaterThanOrEqual(2);
    expect(document.getElementById("li-em").getAttribute("aria-invalid")).toBe("true");
  });

  it("switches views, updates title and hash, and shows password strength", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Create an account" }));
    expect(document.title).toBe("Emberdoor — Sign up");
    expect(window.location.hash).toBe("#signup");
    fireEvent.change(document.getElementById("su-pw"), { target: { value: "Abcdefg1!" } });
    expect(screen.getByText("Strong")).toBeTruthy();
    expect(passwordStrength("abc")).toBe(0);
  });

  it("logs in with valid details and plays the door scene", async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.change(document.getElementById("li-em"), { target: { value: "ada@example.com" } });
    fireEvent.change(document.getElementById("li-pw"), { target: { value: "secret1" } });
    fireEvent.submit(document.getElementById("f-login"));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(document.getElementById("scene").classList.contains("on")).toBe(true);
    expect(screen.getByText("Welcome in, ada.")).toBeTruthy();
    expect(document.getElementById("msg").classList.contains("on")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Close the door" }));
    expect(document.getElementById("scene").classList.contains("on")).toBe(false);
    expect(document.getElementById("li-pw").value).toBe("");
  });

  it("social buttons report that OAuth is not configured", async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Continue with GitHub" })[0]);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    expect(screen.getAllByText(/GitHub sign-in is not configured/).length).toBeGreaterThan(0);
  });

  it("persists the login email only when Remember me is enabled and never stores passwords", () => {
    render(<App />);
    const email = document.getElementById("li-em");
    const password = document.getElementById("li-pw");
    const remember = screen.getByRole("checkbox", { name: /remember me/i });

    fireEvent.change(email, { target: { value: "ada@example.com" } });
    expect(localStorage.getItem("emberdoor:v1:login:remembered-email")).toBeNull();

    fireEvent.click(remember);
    expect(localStorage.getItem("emberdoor:v1:login:remembered-email")).toBe("ada@example.com");
    fireEvent.change(password, { target: { value: "NeverStoreThis123!" } });
    expect([...Array(localStorage.length)].map((_, i) => localStorage.key(i)).join(" ")).not.toMatch(/password|token/i);
    expect([...Array(localStorage.length)].map((_, i) => localStorage.getItem(localStorage.key(i)) || "").join(" ")).not.toContain("NeverStoreThis123!");

    fireEvent.click(remember);
    expect(localStorage.getItem("emberdoor:v1:login:remembered-email")).toBeNull();
  });

  it("restores eligible drafts and safely ignores malformed stored JSON", () => {
    localStorage.setItem("emberdoor:v1:draft:signup", "{not-json");
    window.location.hash = "#signup";
    render(<App />);
    expect(document.getElementById("su-name").value).toBe("");
    expect(document.getElementById("su-em").value).toBe("");
    expect(localStorage.getItem("emberdoor:v1:draft:signup")).toBeNull();
    fireEvent.change(document.getElementById("su-name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(document.getElementById("su-em"), { target: { value: "ada@example.com" } });
    expect(JSON.parse(localStorage.getItem("emberdoor:v1:draft:signup"))).toEqual({ name: "Ada Lovelace", email: "ada@example.com" });
  });

  it("clears the signup draft after a successful submission", async () => {
    vi.useFakeTimers();
    window.location.hash = "#signup";
    render(<App />);
    fireEvent.change(document.getElementById("su-name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(document.getElementById("su-em"), { target: { value: "ada@example.com" } });
    fireEvent.change(document.getElementById("su-pw"), { target: { value: "Abcdefg1!" } });
    fireEvent.change(document.getElementById("su-pw2"), { target: { value: "Abcdefg1!" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /accept the terms/i }));
    fireEvent.submit(document.getElementById("f-signup"));
    await act(async () => { await vi.advanceTimersByTimeAsync(1150); });
    expect(localStorage.getItem("emberdoor:v1:draft:signup")).toBeNull();
    const allStored = [...Array(localStorage.length)].map((_, i) => localStorage.getItem(localStorage.key(i)) || "").join(" ");
    expect(allStored).not.toContain("Abcdefg1!");
  });

  it("keeps signup name/email as a draft across reloads, but never the password", () => {
    const first = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Create an account" }));
    fireEvent.change(document.getElementById("su-name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(document.getElementById("su-em"), { target: { value: "ada@example.com" } });
    fireEvent.change(document.getElementById("su-pw"), { target: { value: "Abcdefg1!" } });
    const stored = localStorage.getItem("emberdoor:v1:draft:signup");
    expect(JSON.parse(stored)).toEqual({ name: "Ada Lovelace", email: "ada@example.com" });
    expect(stored).not.toContain("Abcdefg1");

    first.unmount();
    window.location.hash = "#signup";
    render(<App />);
    expect(document.getElementById("su-name").value).toBe("Ada Lovelace");
    expect(document.getElementById("su-em").value).toBe("ada@example.com");
    expect(document.getElementById("su-pw").value).toBe("");
  });
});

describe("draft expiry", () => {
  const DAY = 24 * 60 * 60 * 1000;

  it("purges drafts older than 7 days, keeps fresh ones, and stamps legacy ones", async () => {
    const { purgeExpiredDrafts, DRAFT_KEYS, DRAFT_TTL_MS } = await import("../lib/storage.js");
    const now = Date.now();
    localStorage.setItem(DRAFT_KEYS.signup, JSON.stringify({ name: "Old", email: "old@example.com" }));
    localStorage.setItem(DRAFT_KEYS.forgot, JSON.stringify({ email: "fresh@example.com" }));
    localStorage.setItem(
      "emberdoor:v1:draft-stamps",
      JSON.stringify({ [DRAFT_KEYS.signup]: now - DRAFT_TTL_MS - DAY, [DRAFT_KEYS.forgot]: now - DAY }),
    );

    expect(purgeExpiredDrafts(undefined, now)).toEqual([DRAFT_KEYS.signup]);
    expect(localStorage.getItem(DRAFT_KEYS.signup)).toBeNull();
    expect(localStorage.getItem(DRAFT_KEYS.forgot)).not.toBeNull();

    // A draft saved before expiry tracking existed is kept and gets a timestamp.
    localStorage.removeItem("emberdoor:v1:draft-stamps");
    expect(purgeExpiredDrafts(undefined, now)).toEqual([]);
    expect(JSON.parse(localStorage.getItem("emberdoor:v1:draft-stamps"))[DRAFT_KEYS.forgot]).toBe(now);
  });
});

describe("static pre-render (what crawlers get without JavaScript)", () => {
  it("contains landmarks, a single h1, labelled inputs and alt text", async () => {
    const { render } = await import("../entry-server.jsx");
    const doc = new DOMParser().parseFromString(`<div id="root">${render()}</div>`, "text/html");

    const landmarks = ["header", "main", "aside", "section"].map((tag) => doc.querySelectorAll(tag).length);
    expect(landmarks[0]).toBeGreaterThanOrEqual(1); // header
    expect(landmarks[1]).toBe(1); // exactly one main
    expect(landmarks[2]).toBe(1); // aside
    expect(landmarks[3]).toBe(3); // login, signup, forgot

    const h1 = doc.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("Knock, knock.");

    const images = [...doc.querySelectorAll("img")];
    expect(images).toHaveLength(3);
    images.forEach((img) => expect(img.getAttribute("alt")?.trim().length).toBeGreaterThan(5));

    doc.querySelectorAll("input:not([type=checkbox])").forEach((input) => {
      expect(doc.querySelector(`label[for="${input.id}"]`), `label for #${input.id}`).toBeTruthy();
    });
  });
});

describe("audit fixes", () => {
  it("hero badge is sentence case, not a long all-caps run", () => {
    render(<App />);
    const badge = document.querySelector(".badge").textContent;
    expect(badge).toBe("New to the house?");
    expect(badge).not.toBe(badge.toUpperCase());
  });

  it("icons are SVG (no emoji or arrow characters), so name and contrast checks are unambiguous", () => {
    render(<App />);
    const eye = screen.getAllByRole("button", { name: "Show password" })[0];
    expect(eye.querySelector("svg")).toBeTruthy();
    expect(eye.textContent.trim()).toBe("");
    const cta = document.querySelector(".hero .cta");
    expect(cta.querySelector("svg")).toBeTruthy();
    expect(cta.textContent).not.toMatch(/[→🙈👁]/u);
  });

  it("the scene's close button reuses the shared cta button style", () => {
    render(<App />);
    expect(document.getElementById("re").classList.contains("cta")).toBe(true);
  });

  it("locks page scroll while the door scene is open and restores it afterwards", async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.change(document.getElementById("li-em"), { target: { value: "ada@example.com" } });
    fireEvent.change(document.getElementById("li-pw"), { target: { value: "secret1" } });
    fireEvent.submit(document.getElementById("f-login"));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Close the door" }));
    expect(document.documentElement.style.overflow).toBe("");
  });
});

describe("index.html: draft bridge and SEO head", () => {
  async function loadIndex() {
    const { readFileSync } = await import("node:fs");
    return readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  }

  function runBridge(html) {
    const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
    // eslint-disable-next-line no-new-func
    new Function(code)();
  }

  function mountPrerenderedFields() {
    document.body.innerHTML =
      '<input id="su-name"><input id="su-em"><input id="fg-em"><input id="li-pw" type="password">';
  }

  afterEach(() => {
    window.__emberdoorDraftBridge?.stop();
    delete window.__emberdoorDraftBridge;
    document.body.innerHTML = "";
  });

  it("refills pre-rendered fields from a saved draft and ignores malformed data", async () => {
    const html = await loadIndex();
    localStorage.setItem("emberdoor:v1:draft:signup", JSON.stringify({ name: "Ada", email: "ada@example.com" }));
    localStorage.setItem("emberdoor:v1:draft:forgot", "{not-json");
    mountPrerenderedFields();
    runBridge(html);
    expect(document.getElementById("su-name").value).toBe("Ada");
    expect(document.getElementById("su-em").value).toBe("ada@example.com");
    expect(document.getElementById("fg-em").value).toBe("");
    expect(localStorage.getItem("emberdoor:v1:draft:forgot")).toBeNull();
  });

  it("saves typed values before React mounts, but never passwords", async () => {
    const html = await loadIndex();
    mountPrerenderedFields();
    runBridge(html);
    for (const [id, value] of [["su-em", "ada@example.com"], ["li-pw", "NeverStoreThis123!"]]) {
      const input = document.getElementById(id);
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    window.__emberdoorDraftBridge.stop(); // flushes the debounce
    expect(JSON.parse(localStorage.getItem("emberdoor:v1:draft:signup"))).toEqual({ email: "ada@example.com" });
    const stored = [...Array(localStorage.length)].map((_, i) => localStorage.getItem(localStorage.key(i)) || "").join(" ");
    expect(stored).not.toContain("NeverStoreThis123!");
  });

  it("does not restore a draft that is older than 7 days", async () => {
    const html = await loadIndex();
    localStorage.setItem("emberdoor:v1:draft:signup", JSON.stringify({ name: "Old", email: "old@example.com" }));
    localStorage.setItem(
      "emberdoor:v1:draft-stamps",
      JSON.stringify({ "emberdoor:v1:draft:signup": Date.now() - 8 * 24 * 60 * 60 * 1000 }),
    );
    mountPrerenderedFields();
    runBridge(html);
    expect(document.getElementById("su-name").value).toBe("");
  });

  it("ships the SEO head tags (canonical, robots, Open Graph, Twitter, manifest, JSON-LD)", async () => {
    const html = await loadIndex();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const meta = (selector) => doc.querySelector(selector)?.getAttribute("content") || doc.querySelector(selector)?.getAttribute("href");
    expect(doc.documentElement.lang).toBe("en");
    expect(meta('meta[name="description"]').length).toBeGreaterThan(50);
    expect(meta('meta[name="robots"]')).toMatch(/index/);
    expect(meta('link[rel="canonical"]')).toContain("%SITE_URL%"); // replaced by vite.config.js
    for (const p of ["og:title", "og:description", "og:image", "og:url", "og:image:alt"]) {
      expect(meta(`meta[property="${p}"]`), p).toBeTruthy();
    }
    for (const n of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
      expect(meta(`meta[name="${n}"]`), n).toBeTruthy();
    }
    expect(meta('link[rel="manifest"]')).toBe("/manifest.webmanifest");
    expect(meta('link[rel="apple-touch-icon"]')).toBeTruthy();
    expect(JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent.replaceAll("%SITE_URL%", "https://example.test"))["@type"]).toBe("WebApplication");
  });
});
