import { useEffect, useState } from "react";
import BackgroundCanvas from "./components/BackgroundCanvas.jsx";
import Hero from "./components/Hero.jsx";
import AuthView from "./components/AuthView.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SignupForm from "./components/SignupForm.jsx";
import ForgotForm from "./components/ForgotForm.jsx";
import DoorScene from "./components/DoorScene.jsx";

const VIEWS = ["login", "signup", "forgot"];
const TITLES = {
  login: "Emberdoor — Log in",
  signup: "Emberdoor — Sign up",
  forgot: "Emberdoor — Reset password",
};

function viewFromHash() {
  if (typeof window === "undefined") return "login"; // server/pre-render
  const hash = window.location.hash.slice(1);
  return VIEWS.includes(hash) ? hash : "login";
}

export default function App() {
  const [view, setView] = useState(viewFromHash);
  const [ready, setReady] = useState(false);
  const [scene, setScene] = useState({ on: false, name: "" });
  const [clearSignal, setClearSignal] = useState(0);

  // Keep title and #hash in sync with the visible view.
  useEffect(() => {
    document.title = TITLES[view];
    if (window.location.hash !== `#${view}`) {
      window.history.replaceState(null, "", `#${view}`);
    }
  }, [view]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (VIEWS.includes(hash)) setView(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // While the full-screen scene is open, the page behind it must not scroll.
  useEffect(() => {
    if (!scene.on) return undefined;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [scene.on]);

  const enter = (name) => setScene({ on: true, name });

  const leave = () => {
    setScene({ on: false, name: "" });
    setClearSignal((n) => n + 1);
    setView("login");
  };

  return (
    <>
      <BackgroundCanvas />
      <div className="vig" aria-hidden="true" />
      <main>
        <div className={`card shell${scene.on ? " leaving" : ""}`}>
          <Hero view={view} ready={ready} onNavigate={setView} />
          <div className="panel">
            <AuthView
              id="login"
              title="Knock, knock."
              subtitle="Log in. Something is waiting on the other side."
              active={view === "login"}
            >
              <LoginForm
                active={view === "login"}
                sceneOn={scene.on}
                clearSignal={clearSignal}
                onSuccess={enter}
                onForgot={() => setView("forgot")}
                onReady={setReady}
              />
              <p className="swap">
                New here?{" "}
                <button type="button" className="link" onClick={() => setView("signup")}>
                  Create an account
                </button>
              </p>
            </AuthView>

            <AuthView
              id="signup"
              title="Join the house."
              subtitle="Create an account to open the door."
              active={view === "signup"}
            >
              <SignupForm
                active={view === "signup"}
                sceneOn={scene.on}
                clearSignal={clearSignal}
                onSuccess={enter}
                onReady={setReady}
              />
              <p className="swap">
                Already inside?{" "}
                <button type="button" className="link" onClick={() => setView("login")}>
                  Log in
                </button>
              </p>
            </AuthView>

            <AuthView
              id="forgot"
              title="Lost your key?"
              subtitle="Enter your email and we will send a reset link."
              active={view === "forgot"}
            >
              <ForgotForm active={view === "forgot"} onReady={setReady} />
              <p className="swap">
                <button type="button" className="link" onClick={() => setView("login")}>
                  Back to log in
                </button>
              </p>
            </AuthView>
          </div>
        </div>
      </main>
      <DoorScene on={scene.on} name={scene.name} onClose={leave} />
    </>
  );
}
