import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon.jsx";
import { Bike, Car } from "./Vehicles.jsx";
import Speedometer from "./Speedometer.jsx";
import SettingsMenu from "./SettingsMenu.jsx";
import { useMotion, useTheme } from "../hooks/useTheme.js";
import { useDriving } from "../hooks/useDriving.js";
import { useEnvironment } from "../hooks/useEnvironment.js";
const LINKS = ["Inventory", "SUV", "Sedan", "Electric", "Luxury", "Service"];
const DOCK = [
  ["home", "Home"],
  ["car", "Browse cars"],
  ["bolt", "Electric"],
  ["pin", "Find dealer"],
  ["phone", "Call us"],
];
export default function VelocityNavbar() {
  const [theme, toggle] = useTheme("velocity-theme", "dark");
  const { preset, setPreset, mult, calm, systemReduced, force, setForce } =
    useMotion("velocity-speed");
  const dark = theme === "dark",
    vehicle = dark ? "car" : "bike";
  const root = useRef(null),
    timer = useRef(null),
    rev = useRef(false);
  const setRev = (on) => {
    rev.current = on;
  };
  const [link, setLink] = useState("Inventory"),
    [dock, setDock] = useState("home");
  const [pop, setPop] = useState(null),
    [menu, setMenu] = useState(false),
    [note, setNote] = useState(""),
    [q, setQ] = useState("");
  const rate = calm ? 1 : 1 / mult; // calm mode must not scale ambient rates by the near-zero multiplier
  const speed = useDriving(root, vehicle, rate, calm, rev);
  useEnvironment(root, theme, mult);
  const say = (m) => {
    setNote(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(""), 2400);
  };
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") {
        setPop(null);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("keydown", k);
      clearTimeout(timer.current);
    };
  }, []);
  const at = (n) => setPop((p) => (p === n ? null : n));
  const go = (l) => {
    setLink(l);
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
  const style = { "--rate": rate };
  return (
    <section className="vm-frame" aria-labelledby="vm-title">
      <h1 className="vm-tab" id="vm-title">
        <i /> Velocity Studio
      </h1>
      <article ref={root} className={`vm${calm ? " still" : ""}`} style={style}>
        <div className="vm-dayfx" aria-hidden="true">
          <i className="cl a" />
          <i className="cl b" />
        </div>
        <div className="vm-night" aria-hidden="true">
          {[
            ["44%", 1.4],
            ["38%", 1],
            ["54%", 0.8],
            ["50%", 1.2],
          ].map(([t, k], i) => (
            <i key={i} className="st" style={{ top: t, "--k": k }} />
          ))}
          <i className="vm-beam" />
        </div>
        <header className="vm-top">
          <p className="vm-brand">
            <span className="vm-logo">
              <Icon name="car" size={20} />
            </span>
            <strong>USNAYA Motors</strong>
          </p>
          <nav aria-label="Primary">
            <ul className="vm-links">
              {LINKS.map((l) => (
                <li key={l}>
                  <button
                    className={l === link ? "on" : ""}
                    aria-current={l === link ? "page" : undefined}
                    onClick={() => go(l)}
                  >
                    {l}
                  </button>
                  {l === link && (
                    <motion.span
                      layoutId="vm-ul"
                      className="vm-ul"
                      transition={{ duration: calm ? 0 : 0.3 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <menu className="vm-ibs" aria-label="Tools">
            <li>
              <button
                className="vm-ib"
                aria-label="Search"
                aria-expanded={pop === "search"}
                onClick={() => at("search")}
              >
                <Icon name="search" />
              </button>
            </li>
            <li>
              <button
                className="vm-ib"
                aria-label="Profile"
                aria-expanded={pop === "profile"}
                onClick={() => at("profile")}
              >
                <Icon name="user" />
              </button>
            </li>
            <li>
              <button
                className="vm-switch"
                role="switch"
                aria-checked={dark}
                aria-label={
                  dark
                    ? "Night: car. Switch to day bike"
                    : "Day: bike. Switch to night car"
                }
                onClick={toggle}
              >
                <motion.span
                  className="vm-thumb"
                  animate={{ x: dark ? 26 : 0 }}
                  transition={{ duration: 0.4 * Math.min(mult, 2) }}
                >
                  <Icon name={dark ? "moon" : "sun"} size={14} />
                </motion.span>
              </button>
            </li>
            <li>
              <button
                className="vm-ib"
                aria-label="Animation speed"
                aria-expanded={pop === "settings"}
                onClick={() => at("settings")}
              >
                <Icon name="gear" />
              </button>
            </li>
            <li className="vm-burger">
              <button
                className="vm-ib"
                aria-label="Menu"
                aria-expanded={menu}
                onClick={() => setMenu((m) => !m)}
              >
                <Icon name={menu ? "close" : "menu"} />
              </button>
            </li>
          </menu>
        </header>
        {menu && (
          <nav aria-label="Menu">
            <ul className="vm-drawer">
              {LINKS.map((l) => (
                <li key={l}>
                  <button
                    className={l === link ? "on" : ""}
                    aria-current={l === link ? "page" : undefined}
                    onClick={() => go(l)}
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {pop === "settings" && (
          <SettingsMenu
            preset={preset}
            setPreset={setPreset}
            systemReduced={systemReduced}
            force={force}
            setForce={setForce}
          />
        )}
        {pop === "search" && (
          <form className="pop" onSubmit={search}>
            <label htmlFor="vmq">Search the menu</label>
            <input
              id="vmq"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. electric"
            />
          </form>
        )}
        {pop === "profile" && (
          <section className="pop" aria-label="Profile">
            <p>Demo only</p>
            <small>Sign-in is not connected to a backend.</small>
          </section>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={vehicle}
            className="vm-veh"
            onPointerEnter={() => setRev(true)}
            onPointerLeave={() => setRev(false)}
            initial={{ x: 170, opacity: 0, scale: 0.92 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -210, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.55 * Math.min(mult, 2.6),
              ease: "easeInOut",
            }}
          >
            {vehicle === "car" ? <Car /> : <Bike />}
          </motion.figure>
        </AnimatePresence>
        <Speedometer value={speed} vehicle={vehicle} onRev={setRev} />
        <footer className="vm-bar">
          <menu className="vm-dock" aria-label="Quick actions">
            {DOCK.map(([n, t]) => (
              <li key={n}>
                <button
                  aria-label={t}
                  data-tip={t}
                  aria-pressed={dock === n}
                  className={dock === n ? "on" : ""}
                  onClick={() => {
                    setDock(n);
                    say(`Demo: ${t}`);
                  }}
                >
                  <Icon name={n} size={17} />
                </button>
              </li>
            ))}
          </menu>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="vm-cta"
            onClick={() => say("Demo: would open test-drive booking")}
          >
            Book<span className="long">&nbsp;Test Drive</span>{" "}
            <Icon name="arrow" size={14} />
          </motion.button>
        </footer>
        <p className="vm-note" role="status" aria-live="polite">
          {note}
        </p>
      </article>
    </section>
  );
}
