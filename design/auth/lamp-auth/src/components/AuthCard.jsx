import { useEffect, useId, useRef } from 'react';
import { ArrowRight, Check, Circle, Eye, EyeOff, Lock, Mail, RefreshCw, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import Field from './Field';
import { FacebookIcon, GoogleIcon } from './SocialIcons';
import { content } from '../content';

const PANEL = 'glass-card mx-auto w-full max-w-md';
const TABS = ['login', 'signup'];
const CRITERIA = [
  ['len', '8+ characters'],
  ['mix', 'Upper and lower case'],
  ['num', 'A number'],
  ['sym', 'A symbol'],
];

export default function AuthCard({ form }) {
  const uid = useId();
  const id = (part) => `${uid}-${part}`;
  const { mode, strength } = form;
  const isLogin = mode === 'login';
  const copy = isLogin ? content.login : content.signup;

  // The card can scroll on short screens, so bring new messages into view.
  const messages = useRef(null);
  useEffect(() => {
    if (form.error || form.notice) messages.current?.scrollIntoView({ block: 'nearest' });
  }, [form.error, form.notice]);

  // Arrow keys, Home and End move between tabs, as the ARIA tabs pattern expects.
  const onTabKeyDown = (e) => {
    const next = { ArrowRight: 'other', ArrowLeft: 'other', Home: TABS[0], End: TABS[1] }[e.key];
    if (!next) return;
    e.preventDefault();
    const target = next === 'other' ? TABS[1 - TABS.indexOf(mode)] : next;
    form.switchMode(target);
    document.getElementById(id(`tab-${target}`))?.focus();
  };

  if (mode === 'granted') {
    return (
      <section aria-labelledby={id('granted')} className={`${PANEL} animate-fadeIn p-8 text-center`}>
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-200 text-stone-950 shadow-lg shadow-amber-500/30">
          <ShieldCheck aria-hidden="true" className="h-9 w-9" />
        </div>
        <h2 id={id('granted')} className="text-2xl font-extrabold">{content.granted.title}</h2>
        <p className="mt-2 text-sm text-body">{content.granted.sub}</p>
        <p className="surface-chip mt-5 break-all rounded-xl p-3 text-left font-mono text-xs">{form.email}</p>
        <button type="button" onClick={form.signOut} className="btn-primary mt-6">
          {content.granted.exit}
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby={id('title')} className={`${PANEL} p-5 sm:p-7`}>
      <div role="tablist" aria-label="Account access" className="relative mb-5 grid grid-cols-2 rounded-full bg-stone-200/80 p-1 dark:bg-black/40">
        {TABS.map((tab) => {
          const selected = mode === tab;
          return (
            <button
              key={tab}
              id={id(`tab-${tab}`)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={id('panel')}
              tabIndex={selected ? 0 : -1}
              onClick={() => form.switchMode(tab)}
              onKeyDown={onTabKeyDown}
              className={`btn-tab ${selected ? 'text-stone-950' : 'text-body hover:text-stone-950 dark:hover:text-white'}`}
            >
              {content.tabs[tab]}
            </button>
          );
        })}
        <span
          aria-hidden="true"
          className={`absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-amber-400 shadow-md transition-transform duration-300 ${isLogin ? '' : 'translate-x-full'}`}
        />
      </div>

      <div role="tabpanel" id={id('panel')} aria-labelledby={id(`tab-${mode}`)}>
        <h2 id={id('title')} className="text-2xl font-extrabold">{copy.title}</h2>
        <p className="mb-4 mt-1 text-sm text-body">{copy.sub}</p>

        <div ref={messages}>
          {form.error && (
            <p role="alert" className="alert-error mb-3 flex animate-fadeIn items-center gap-2 rounded-xl p-3 text-xs">
              <ShieldAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
              {form.error}
            </p>
          )}
          <div role="status">
            {form.notice && <p className="surface-chip mb-3 rounded-xl p-3 text-xs text-body">{form.notice}</p>}
          </div>
        </div>

        <form onSubmit={form.submit} noValidate className="space-y-3">
          {!isLogin && (
            <Field
              id={id('name')} label="Full name" icon={User} type="text" autoComplete="name"
              value={form.name} onChange={(e) => form.setName(e.target.value)} placeholder="Your name"
            />
          )}
          <Field
            id={id('email')} label="Email" icon={Mail} type="email" autoComplete="email" required
            value={form.email} onChange={(e) => form.setEmail(e.target.value)} placeholder="you@example.com"
            invalid={form.emailInvalid} hint={form.emailInvalid ? content.errors.email : undefined}
          />
          <Field
            id={id('password')} label="Password" icon={Lock} required
            type={form.showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'}
            value={form.password} onChange={(e) => form.setPassword(e.target.value)} placeholder="At least 8 characters"
            trailing={
              <button
                type="button" onClick={form.toggleShowPassword}
                aria-label={form.showPassword ? 'Hide password' : 'Show password'}
                className="btn-ghost absolute right-0.5 top-1/2 -translate-y-1/2"
              >
                {form.showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
              </button>
            }
          />

          {(!isLogin || form.password.length > 0) && (
            <div className="panel-inset space-y-2 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Password strength</span>
                <strong className="text-accent">{strength.grade}</strong>
              </div>
              <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-stone-300/60 dark:bg-white/10">
                <div className={`h-full transition-all duration-300 ${strength.bar}`} style={{ width: `${strength.score}%` }} />
              </div>
              <ul className="grid grid-cols-2 gap-1 pt-1">
                {CRITERIA.map(([key, text]) => {
                  const met = strength.criteria[key];
                  const Icon = met ? Check : Circle;
                  return (
                    <li key={key} className={`flex items-center gap-1 ${met ? 'text-accent' : 'text-muted'}`}>
                      <Icon aria-hidden="true" className="h-3 w-3" />
                      {text}
                      <span className="sr-only">{met ? ' (met)' : ' (not met)'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <label className="flex min-h-11 cursor-pointer select-none items-center gap-2 text-xs text-body">
              <input
                type="checkbox"
                checked={isLogin ? form.remember : form.agreed}
                onChange={(e) => (isLogin ? form.setRemember(e.target.checked) : form.setAgreed(e.target.checked))}
                className="h-[18px] w-[18px] rounded accent-amber-500"
              />
              {isLogin ? 'Remember me' : 'I agree to the privacy terms'}
            </label>
            {isLogin && (
              <button type="button" onClick={form.requestReset} className="btn-ghost">
                Forgot password?
              </button>
            )}
          </div>

          <button type="submit" disabled={form.submitting} className="btn-primary">
            {form.submitting ? (
              <>
                <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
                {copy.busy}
              </>
            ) : (
              <>
                {copy.submit}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div role="group" aria-label={content.social.label} className="mt-4">
          <p aria-hidden="true" className="mb-3 flex items-center gap-3 text-xs text-muted before:h-px before:flex-1 before:bg-stone-300 after:h-px after:flex-1 after:bg-stone-300 dark:before:bg-white/10 dark:after:bg-white/10">
            {content.social.label}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => form.socialLogin('google')} disabled={form.submitting} className="ctrl disabled:opacity-60">
              <GoogleIcon className="h-4 w-4" />
              {content.social.google}
            </button>
            <button type="button" onClick={() => form.socialLogin('facebook')} disabled={form.submitting} className="ctrl disabled:opacity-60">
              <FacebookIcon className="h-4 w-4" />
              {content.social.facebook}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
