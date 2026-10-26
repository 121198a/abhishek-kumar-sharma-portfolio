import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon.jsx";
import Scene from "./Scene.jsx";
import SettingsMenu from "./SettingsMenu.jsx";
import { useMotion, useTheme } from "../hooks/useTheme.js";
const LINKS = [
  "Destinations",
  "Treks",
  "Camping",
  "Packages",
  "Gallery",
  "Contact",
];
const TOOLS = [
  ["globe", "Explore the world"],
  ["peak", "Peaks"],
  ["map", "Trail map"],
  ["route", "Routes"],
];
export default function TrailVerseNavbar() {
  const [theme, toggle] = useTheme("trailverse-theme", "light");
  const { preset, setPreset, mult, reduced } = useMotion("trailverse-speed");
  const [active, setActive] = useState("Treks");
  const [pop, setPop] = useState(null);
  const [menu, setMenu] = useState(false);
  const [fav, setFav] = useState(false);
  const [q, setQ] = useState("");
  const [note, setNote] = useState("");
  const timer = useRef(null),
    nav = useRef(null),
    trig = useRef({});
  const say = (m) => {
    setNote(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(""), 2400);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const k = (e) => {
      if (e.key !== "Escape") return;
      const opener = pop || (menu ? "menu" : null);
      setPop(null);
      setMenu(false);
      trig.current[opener]?.focus(); // return focus to whatever opened it
    };
    const out = (e) => {
      if (pop && !e.target.closest?.(".popwrap, [aria-haspopup]")) setPop(null);
    };
    window.addEventListener("keydown", k);
    window.addEventListener("pointerdown", out);
    return () => {
      window.removeEventListener("keydown", k);
      window.removeEventListener("pointerdown", out);
    };
  }, [pop, menu]);
  useEffect(() => {
    if (pop === "settings")
      nav.current?.querySelector(".pop-settings [aria-pressed=true]")?.focus();
  }, [pop]);
  const move = (e) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = nav.current.getBoundingClientRect();
    nav.current.style.setProperty(
      "--px",
      ((e.clientX - r.left) / r.width - 0.5).toFixed(3),
    );
  };
  const leave = () => nav.current.style.setProperty("--px", 0);
  const toggleAt = (n) => setPop((p) => (p === n ? null : n));
  const go = (l) => {
    setActive(l);
    setMenu(false);
  };
  const search = (e) => {
    e.preventDefault();
    const hit = LINKS.find((l) =>
      l.toLowerCase().includes(q.trim().toLowerCase()),
    );
    if (q.trim() && hit) {
      go(hit);
      say(`Jumped to ${hit}`);
    } else say("Demo: only the menu is searchable (no backend).");
    setPop(null);
  };
  const dark = theme === "dark";
  return (
    <div className="tv-frame">
      <div className="tv-tab">
        <span className="tv-tab-dot" /> TRAVEL &amp; TREKKING
      </div>
      <nav
        ref={nav}
        className="tv"
        aria-label="TrailVerse"
        onPointerMove={move}
        onPointerLeave={leave}
        style={{
          "--t": `${1.2 * mult}s`,
          "--cloud": `${70 * mult}`,
          "--tw": `${3 * mult}`,
        }}
      >
        <Scene theme={theme} mult={mult} />
        <div className="tv-ctl">
          <button
            className="tv-switch"
            role="switch"
            aria-checked={dark}
            aria-label="Dark mode"
            data-tip={dark ? "Switch to sunrise" : "Switch to night"}
            onClick={toggle}
          >
            <motion.span
              className="tv-thumb"
              animate={{ x: dark ? 26 : 0 }}
              transition={{
                duration: 0.4 * Math.min(mult, 2),
                ease: "easeInOut",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={dark ? "moon" : "sun"}
                  className="tv-ico"
                  initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                >
                  <Icon name={dark ? "moon" : "sun"} size={14} />
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </button>
          <button
            className="tv-ib sm"
            ref={(el) => (trig.current.settings = el)}
            aria-label="Animation speed"
            data-tip="Animation speed"
            aria-haspopup="dialog"
            aria-expanded={pop === "settings"}
            onClick={() => toggleAt("settings")}
          >
            <Icon name="gear" />
          </button>
          <button
            className="tv-ib sm tv-burger"
            ref={(el) => (trig.current.menu = el)}
            aria-label="Menu"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
        <ul className="tv-links">
          {LINKS.map((l) => (
            <li key={l}>
              <button
                className={l === active ? "on" : ""}
                aria-current={l === active ? "page" : undefined}
                onClick={() => go(l)}
              >
                {l}
              </button>
              {l === active && (
                <motion.span
                  layoutId="tv-ul"
                  className="tv-ul"
                  transition={{ duration: reduced ? 0 : 0.3 }}
                />
              )}
            </li>
          ))}
        </ul>
        {menu && (
          <ul className="tv-drawer">
            {LINKS.map((l) => (
              <li key={l}>
                <button
                  className={l === active ? "on" : ""}
                  aria-current={l === active ? "page" : undefined}
                  onClick={() => go(l)}
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="tv-icons">
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="tv-ib"
            ref={(el) => (trig.current.search = el)}
            aria-label="Search"
            data-tip="Search"
            aria-haspopup="dialog"
            aria-expanded={pop === "search"}
            onClick={() => toggleAt("search")}
          >
            <Icon name="search" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="tv-ib"
            ref={(el) => (trig.current.profile = el)}
            aria-label="Profile"
            data-tip="Profile"
            aria-haspopup="dialog"
            aria-expanded={pop === "profile"}
            onClick={() => toggleAt("profile")}
          >
            <Icon name="user" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            className={`tv-ib${fav ? " fav" : ""}`}
            aria-label="Favorites"
            data-tip={fav ? "Remove favorite" : "Save to favorites"}
            aria-pressed={fav}
            onClick={() => {
              setFav((f) => !f);
              say(
                fav
                  ? "Removed from favorites (demo)"
                  : "Saved to favorites (demo, not persisted)",
              );
            }}
          >
            <Icon name="heart" />
          </motion.button>
        </div>
        {pop === "settings" && (
          <div className="popwrap left">
            <SettingsMenu
              preset={preset}
              setPreset={setPreset}
              reduced={reduced}
            />
          </div>
        )}
        {pop === "search" && (
          <div className="popwrap right">
            <form className="pop" onSubmit={search}>
              <label htmlFor="tvq">Search the menu</label>
              <input
                id="tvq"
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. camping"
              />
            </form>
          </div>
        )}
        {pop === "profile" && (
          <div className="popwrap right">
            <div className="pop">
              <p>Demo only</p>
              <small>Sign-in is not connected to a backend.</small>
            </div>
          </div>
        )}
        <div className="tv-brand">
          <span className="tv-logo">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            >
              <path d="M8 19 12 5l4 9-3 5zM8 19l3-3" />
            </svg>
          </span>
          <strong>TrailVerse</strong>
        </div>
        <div className="tv-tools">
          {TOOLS.map(([n, t], i) => (
            <button
              key={n}
              className="tv-tool"
              style={{ "--i": i }}
              aria-label={t}
              data-tip={t}
              onClick={() => say(`Demo: ${t}`)}
            >
              <Icon name={n} size={18} />
            </button>
          ))}
        </div>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="tv-cta"
          onClick={() => say("Demo: would open the trips catalogue")}
        >
          Explore Trips <Icon name="arrow" size={14} />
        </motion.button>
        <div className="tv-note" role="status" aria-live="polite">
          {note}
        </div>
      </nav>
    </div>
  );
}
