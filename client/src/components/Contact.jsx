import { useState } from "react";
import { useInView } from "../hooks/useAnimation";
import "./Contact.css";

export default function Contact() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setServerMsg(data.message);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setServerMsg(err.message);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div ref={ref} className={`contact__inner ${inView ? "contact__inner--visible" : ""}`}>
          <div className="contact__left">
            <span className="section-eyebrow">Contact</span>
            <h2 className="contact__title">
              Let's build
              <br />
              something great.
            </h2>
            <p className="contact__sub">
              Have a project in mind, want to collaborate, or just want to say hi?
              Drop me a message — I typically respond within 24 hours.
            </p>
            <div className="contact__direct">
              <a href="mailto:sharmaabhishek121198@gmail.com" className="contact__email">
                sharmaabhishek121198@gmail.com
              </a>
            </div>
          </div>

          <div className="contact__right">
            {status === "success" ? (
              <div className="contact__success">
                <div className="contact__success-icon">✓</div>
                <p>{serverMsg}</p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className="form__row">
                  <div className="form__field">
                    <label className="form__label" htmlFor="name">Name</label>
                    <input
                      className="form__input"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form__field">
                    <label className="form__label" htmlFor="email">Email</label>
                    <input
                      className="form__input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form__field">
                  <label className="form__label" htmlFor="message">Message</label>
                  <textarea
                    className="form__input form__textarea"
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {status === "error" && (
                  <p className="form__error">{serverMsg}</p>
                )}

                <button
                  type="submit"
                  className={`form__submit ${status === "loading" ? "form__submit--loading" : ""}`}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="form__spinner" />
                  ) : (
                    <>
                      Send Message
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
