/* app.js — validation · demo auth store · social sign-in · UI behaviour · Lenis smooth scroll
   (plain JavaScript, no build step) */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ───────────────── 1 · validation ───────────────── */
  const V = {
    email(v) {
      v = (v || "").trim();
      if (!v) return "Email is required";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
        ? ""
        : "Enter a valid email, e.g. name@mail.com";
    },
    password(v, strict) {
      if (!v) return "Password is required";
      if (strict) {
        if (v.length < 8) return "Use at least 8 characters";
        if (!/[A-Za-z]/.test(v) || !/\d/.test(v))
          return "Mix letters and numbers";
      }
      return "";
    },
    username(v) {
      v = (v || "").trim();
      if (!v) return "Username is required";
      if (v.length < 3) return "At least 3 characters";
      if (v.length > 20) return "Max 20 characters";
      return /^[A-Za-z0-9_.]+$/.test(v)
        ? ""
        : "Letters, numbers, “.” and “_” only";
    },
    strength(v) {
      if (!v) return 0;
      let s = 0;
      if (v.length >= 8) s++;
      if (/[A-Za-z]/.test(v) && /\d/.test(v)) s++;
      if (v.length >= 12 || (/[^A-Za-z0-9]/.test(v) && v.length >= 9)) s++;
      return Math.max(1, s);
    },
  };

  /* ───────────────── 2 · demo auth store (browser localStorage) ─────────────────
     Replace signIn / signUp with real fetch() calls to your backend to go live. */
  const mem = {};
  const store = (() => {
    try {
      localStorage.setItem("__t", 1);
      localStorage.removeItem("__t");
      return localStorage;
    } catch (_) {
      return {
        getItem: (k) => mem[k] ?? null,
        setItem: (k, v) => {
          mem[k] = String(v);
        },
        removeItem: (k) => {
          delete mem[k];
        },
      };
    }
  })();
  const users = () => {
    try {
      return JSON.parse(store.getItem("auth.users")) || {};
    } catch (_) {
      return {};
    }
  };
  const latency = () => sleep(850 + Math.random() * 500);
  async function hash(pw, salt) {
    const data = new TextEncoder().encode(salt + ":" + pw);
    if (window.crypto && crypto.subtle)
      return Array.from(
        new Uint8Array(await crypto.subtle.digest("SHA-256", data)),
      )
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    let h = 5381;
    for (const b of data) h = ((h << 5) + h + b) | 0;
    return "x" + (h >>> 0).toString(16);
  }
  const fail = (field, message) => Promise.reject({ field, message });
  const Auth = {
    async signUp({ username, email, password }) {
      await latency();
      const all = users(),
        key = email.trim().toLowerCase();
      if (all[key])
        return fail("email", "An account with this email already exists");
      const salt = Math.random().toString(36).slice(2);
      all[key] = {
        username: username.trim(),
        salt,
        hash: await hash(password, salt),
      };
      store.setItem("auth.users", JSON.stringify(all));
      return { username: username.trim(), email: key };
    },
    async signIn({ email, password }) {
      await latency();
      const u = users()[email.trim().toLowerCase()];
      if (!u)
        return fail(
          "form",
          "No account found for this email — please sign up first",
        );
      if ((await hash(password, u.salt)) !== u.hash)
        return fail("password", "Incorrect password, try again");
      return { username: u.username, email: email.trim().toLowerCase() };
    },
    remembered: () => store.getItem("auth.remember") || "",
    remember: (e) =>
      e ? store.setItem("auth.remember", e) : store.removeItem("auth.remember"),
  };

  /* ───────────────── 3 · Google / Facebook / GitHub ─────────────────
     DEMO MODE: simulated. To go live, replace a handler with the provider's real flow that resolves { name, email }:
       Google   → Google Identity Services   Facebook → Facebook Login SDK (FB.login)
       GitHub   → OAuth redirect + code exchange on your server (secrets must never live in front-end code) */
  const demo = (name) => async () => {
    await sleep(1300);
    return { name, demo: true };
  };
  const Social = {
    labels: { google: "Google", facebook: "Facebook", github: "GitHub" },
    handlers: {
      google: demo("Google User"),
      facebook: demo("Facebook User"),
      github: demo("GitHub User"),
    },
  };

  /* ───────────────── 4 · UI ───────────────── */
  const views = ["signin", "signup"];
  let card,
    done,
    busy = false;

  function toast(msg) {
    const box = $("#toasts"),
      t = document.createElement("div");
    t.className =
      "alert toast-in rounded-xl border-0 bg-ink px-4 py-2.5 text-[13.5px] text-white shadow-xl";
    t.textContent = msg;
    box.appendChild(t);
    while (box.children.length > 3) box.firstElementChild.remove();
    setTimeout(() => {
      t.style.transition = "opacity .3s, transform .3s";
      t.style.opacity = 0;
      t.style.transform = "translateY(8px)";
      setTimeout(() => t.remove(), 320);
    }, 2800);
  }
  const fieldOf = (i) => i.closest(".field");
  function setError(f, msg) {
    f.classList.toggle("is-invalid", !!msg);
    f.classList.toggle("is-valid", !msg && f.dataset.touched === "1");
    $(".f-msg", f).textContent = msg || "";
    $("input", f).setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function shake(el) {
    el.classList.remove("is-shaking");
    void el.offsetWidth;
    el.classList.add("is-shaking");
    el.addEventListener(
      "animationend",
      () => el.classList.remove("is-shaking"),
      { once: true },
    );
  }
  function check(input, form) {
    const strict = form.dataset.form === "signup";
    const err = {
      email: V.email,
      username: V.username,
      password: (v) => V.password(v, strict),
    }[input.name](input.value);
    setError(fieldOf(input), err);
    return err;
  }
  function formMsg(form, text) {
    const m = $("[data-form-msg]", form);
    m.textContent = text;
    m.classList.add("is-on");
  }
  function clearMsgs() {
    $$(".form-msg", card).forEach((m) => {
      m.classList.remove("is-on");
      m.textContent = "";
    });
  }
  function setBusy(form, on) {
    form.setAttribute("aria-busy", on);
    $$("input, .social", form).forEach((el) => {
      el.disabled = on;
    });
  }

  function setView(view, focus) {
    if (busy) return;
    card.classList.remove(...views);
    card.classList.add(view);
    $$(".card-nav [role=tab]", card).forEach((t) => {
      const on = t.classList.contains(view);
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
    });
    $$(".card-hero-content", card).forEach((c) =>
      c.setAttribute("aria-hidden", !c.classList.contains(view)),
    );
    clearMsgs();
    if (focus)
      setTimeout(
        () =>
          $(view === "signup" ? "#su-user" : "#si-email").focus({
            preventScroll: true,
          }),
        420,
      );
  }
  function showDone(title, text) {
    $("#done-title").textContent = title;
    $("#done-text").textContent = text;
    done.hidden = false;
    card.classList.add("is-done");
    $("#signout").focus({ preventScroll: true });
  }
  function reset() {
    $$("form", card).forEach((f) => {
      f.reset();
      setBusy(f, false);
      $(".btn-main", f).classList.remove("is-loading", "is-success");
      $$(".field", f).forEach((fl) => {
        fl.classList.remove("is-invalid", "is-valid");
        delete fl.dataset.touched;
        $(".f-msg", fl).textContent = "";
      });
      const m = $(".meter", f);
      if (m) m.removeAttribute("data-level");
    });
    const r = Auth.remembered();
    if (r) $("#si-email").value = r;
  }

  async function submit(form) {
    if (busy) return;
    const kind = form.dataset.form,
      btn = $(".btn-main", form);
    clearMsgs();
    const inputs = $$("input[name]:not([type=checkbox])", form);
    inputs.forEach((i) => {
      fieldOf(i).dataset.touched = "1";
    });
    const bad = inputs.filter((i) => check(i, form));
    if (bad.length) {
      bad.forEach((i) => shake(i.parentElement));
      bad[0].focus();
      return;
    }

    busy = true;
    btn.classList.add("is-loading");
    setBusy(form, true);
    const data = Object.fromEntries(inputs.map((i) => [i.name, i.value]));
    try {
      const user = await (kind === "signup"
        ? Auth.signUp(data)
        : Auth.signIn(data));
      if (kind === "signin")
        Auth.remember(form.elements.remember.checked ? user.email : "");
      btn.classList.replace("is-loading", "is-success");
      await sleep(800);
      busy = false;
      showDone(
        kind === "signup"
          ? `Welcome, ${user.username}!`
          : `Welcome back, ${user.username}`,
        kind === "signup"
          ? "Your account has been created and you are signed in."
          : "You are securely signed in.",
      );
      toast(kind === "signup" ? "Account created" : "Signed in successfully");
    } catch (e) {
      busy = false;
      btn.classList.remove("is-loading");
      setBusy(form, false);
      const f =
        e && e.field && e.field !== "form"
          ? $(`[data-field=${e.field}]`, form)
          : null;
      if (f) {
        setError(f, e.message);
        shake($("input", f).parentElement);
        $("input", f).focus();
      } else {
        formMsg(
          form,
          (e && e.message) || "Something went wrong. Please try again.",
        );
        shake($("[data-field=email] input", form).parentElement);
      }
    }
  }

  async function social(btn) {
    if (busy) return;
    const form = btn.closest("form"),
      up = form.dataset.form === "signup",
      p = btn.dataset.provider,
      label = Social.labels[p];
    busy = true;
    clearMsgs();
    $$(".social", form).forEach((b) => {
      b.disabled = true;
    });
    btn.classList.add("is-loading");
    try {
      const user = await Social.handlers[p]();
      busy = false;
      showDone(
        up ? `Welcome, ${user.name}!` : `Welcome back, ${user.name}`,
        `You have successfully signed ${up ? "up" : "in"} with ${label}.`,
      );
      toast(`${up ? "Sign up" : "Sign in"} with ${label} successful`);
    } catch (e) {
      busy = false;
      formMsg(
        form,
        `${label} sign-in failed. ${(e && e.message) || "Please try again."}`,
      );
    } finally {
      btn.classList.remove("is-loading");
      $$(".social", form).forEach((b) => {
        b.disabled = false;
      });
    }
  }

  function init() {
    card = $("#card");
    done = $("#done");
    const r = Auth.remembered();
    if (r) $("#si-email").value = r;

    $$(".card-nav [role=tab]", card).forEach((t) => {
      t.addEventListener("click", () =>
        setView(t.classList.contains("signup") ? "signup" : "signin"),
      );
      t.addEventListener("keydown", (e) => {
        if (
          !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)
        )
          return;
        e.preventDefault();
        const n = card.classList.contains("signin") ? "signup" : "signin";
        setView(n);
        $("#tab-" + n).focus();
      });
    });
    $$("[data-switch]", card).forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        setView(a.dataset.switch, true);
      }),
    );

    $$("form", card).forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        submit(form);
      });
      $$("input[name]:not([type=checkbox])", form).forEach((input) => {
        const f = fieldOf(input);
        input.addEventListener("blur", () => {
          if (input.value || f.dataset.touched) {
            f.dataset.touched = "1";
            check(input, form);
          }
        });
        input.addEventListener("input", () => {
          if (f.dataset.touched) check(input, form);
          if (input.name === "password" && form.dataset.form === "signup") {
            const lv = V.strength(input.value),
              m = $(".meter", f);
            lv ? (m.dataset.level = lv) : m.removeAttribute("data-level");
          }
          $("[data-form-msg]", form).classList.remove("is-on");
        });
      });
    });

    $$("[data-toggle]", card).forEach((btn) =>
      btn.addEventListener("click", () => {
        const input = $("input", btn.parentElement),
          show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-pressed", show);
        btn.setAttribute(
          "aria-label",
          show ? "Hide password" : "Show password",
        );
        $("use", btn).setAttribute("href", show ? "#i-eye" : "#i-eye-off");
      }),
    );

    $("[data-forgot]", card).addEventListener("click", (e) => {
      e.preventDefault();
      const input = $("#si-email");
      fieldOf(input).dataset.touched = "1";
      if (check(input, input.form)) {
        shake(input.parentElement);
        input.focus();
        return;
      }
      toast(`Reset link sent to ${input.value.trim()}`);
    });
    $$(".social", card).forEach((b) =>
      b.addEventListener("click", () => social(b)),
    );
    const termsModal = $("#terms-modal");
    $$("[data-terms]", card).forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (termsModal && typeof termsModal.showModal === "function") {
          termsModal.showModal();
        }
      }),
    );
    $("#download-terms-copy")?.addEventListener("click", () => {
      const text =
        `TERMS & CONDITIONS (v2.4 - October 2026)\n\n` +
        `1. Acceptance of Terms\nBy registering for an account, accessing, or using this authentication portal and related services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.\n\n` +
        `2. Account Security & Credentials\nYou are responsible for maintaining the confidentiality of your login credentials and passwords.\n\n` +
        `3. Privacy & Data Protection\nWe treat your personal data with utmost security and industry-standard encryption. Authentication passwords are salted and hashed.\n\n` +
        `4. Permitted Use & Code of Conduct\nYou agree not to misuse the authentication system or disrupt services.\n\n` +
        `5. Modifications & Termination\nWe reserve the right to modify these terms at any time with prior notice.\n`;
      const l = document.createElement("a");
      l.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      l.download = "terms-and-conditions.txt";
      document.body.appendChild(l);
      l.click();
      l.remove();
      setTimeout(() => URL.revokeObjectURL(l.href), 1000);
      toast("Terms & Conditions downloaded");
    });
    $("#signout").addEventListener("click", () => {
      done.hidden = true;
      card.classList.remove("is-done");
      reset();
      setView("signin", true);
      toast("Signed out");
    });

    // scale the fixed-size card down on small laptop screens (below 900px the stacked layout takes over)
    const stage = $("#stage");
    const fit = () => {
      const w = innerWidth,
        h = innerHeight;
      stage.style.setProperty(
        "--s",
        (w >= 900 ? Math.min(1, (w - 32) / 940, (h - 24) / 611) : 1).toFixed(4),
      );
    };
    fit();
    addEventListener("resize", fit);

    // Lenis smooth scroll & Unified 60fps RAF loop
    let lenis = null;
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    }

    // Interactive 3D Card Parallax Tilt & Cursor Spotlight
    const bgOrbs = $$(".bg i");
    let mouseX = 0,
      mouseY = 0,
      currentTiltX = 0,
      currentTiltY = 0,
      targetTiltX = 0,
      targetTiltY = 0;

    window.addEventListener(
      "mousemove",
      (e) => {
        if (window.innerWidth < 900) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        targetTiltX = -dy * 3;
        targetTiltY = dx * 4;
        mouseX = dx;
        mouseY = dy;

        if (card) {
          const rect = card.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * 100;
          const py = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--spot-x", `${px.toFixed(1)}%`);
          card.style.setProperty("--spot-y", `${py.toFixed(1)}%`);
        }
      },
      { passive: true },
    );

    window.addEventListener(
      "mouseleave",
      () => {
        targetTiltX = 0;
        targetTiltY = 0;
        mouseX = 0;
        mouseY = 0;
      },
      { passive: true },
    );

    // Single unified 60fps RAF loop
    function unifiedMotionFrame(time) {
      if (lenis) {
        lenis.raf(time);
      }

      if (window.innerWidth >= 900 && card) {
        const diffX = targetTiltX - currentTiltX;
        const diffY = targetTiltY - currentTiltY;

        if (Math.abs(diffX) > 0.005 || Math.abs(diffY) > 0.005) {
          currentTiltX += diffX * 0.08;
          currentTiltY += diffY * 0.08;
          card.style.transform = `perspective(1200px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

          if (bgOrbs.length >= 3) {
            bgOrbs[0].style.transform = `translate3d(${(-mouseX * 25).toFixed(1)}px, ${(-mouseY * 20).toFixed(1)}px, 0)`;
            bgOrbs[1].style.transform = `translate3d(${(mouseX * 30).toFixed(1)}px, ${(mouseY * 25).toFixed(1)}px, 0)`;
            bgOrbs[2].style.transform = `translate3d(${(-mouseX * 15).toFixed(1)}px, ${(mouseY * 18).toFixed(1)}px, 0)`;
          }
        }
      } else if (card && card.style.transform !== "none") {
        card.style.transform = "none";
      }

      requestAnimationFrame(unifiedMotionFrame);
    }
    requestAnimationFrame(unifiedMotionFrame);

    requestAnimationFrame(() =>
      document.documentElement.classList.add("is-ready"),
    );
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
