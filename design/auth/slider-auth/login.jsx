import { useState } from "react";
import "./login.css";

const Hero = ({ variant, title, text, buttonlabel, onSwitch }) => (
    <div className={`hero ${variant}`}>
        <h2>{title}</h2>
        <p>{text}</p>
        <button
            type="button"
            className="switch"
            onClick={onSwitch}
        >
            {buttonlabel}
        </button>
    </div>
);

const RegisterForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className="form register" onSubmit={handleSubmit}>
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Join us to start your journey</p>

            <div className="input-group">
                <label htmlFor="reg-name">Full Name</label>
                <input
                    id="reg-name"
                    type="text"
                    placeholder="John Doe"
                    required
                />
            </div>

            <div className="input-group">
                <label htmlFor="reg-email">Email</label>
                <input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="input-group">
                <label htmlFor="reg-pass">Password</label>
                <input
                    id="reg-pass"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button type="submit" className="btn-submit">
                Sign Up
            </button>
        </form>
    );
};

const LoginForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className="form login" onSubmit={handleSubmit}>
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">Welcome back! Please enter your details.</p>

            <div className="input-group">
                <label htmlFor="log-email">Email</label>
                <input
                    id="log-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="input-group">
                <label htmlFor="log-pass">Password</label>
                <input
                    id="log-pass"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            </div>

            <div className="form-options">
                <label>
                    <input type="checkbox" /> Remember me
                </label>
                <a href="#forgot">Forgot password?</a>
            </div>

            <button type="submit" className="btn-submit">
                Sign In
            </button>
        </form>
    );
};

export const Login = () => {
    const [isRegister, setRegister] = useState(false);

    return (
        <div className={`card ${isRegister ? "register" : ""}`}>
            <div className="card-bg"></div>

            <Hero
                variant="register"
                title="Welcome Back!"
                text="To keep connected with us please sign in with your personal info"
                buttonlabel="Sign In"
                onSwitch={() => setRegister(false)}
            />
            <RegisterForm />

            <Hero
                variant="login"
                title="Hello, Friend!"
                text="Enter your personal details and start your journey with us"
                buttonlabel="Sign Up"
                onSwitch={() => setRegister(true)}
            />
            <LoginForm />
        </div>
    );
};

export default Login;