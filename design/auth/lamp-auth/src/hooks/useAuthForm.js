import { useMemo, useState } from 'react';
import { authenticate, authenticateWithProvider } from '../services/auth';
import { audio } from '../lib/acoustics';
import { calculateStrength } from '../lib/entropy';
import { content } from '../content';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuthForm() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'granted'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const emailInvalid = email.length > 3 && !EMAIL_RE.test(email);
  const strength = useMemo(() => calculateStrength(password), [password]);

  const clearMessages = () => {
    setError('');
    setNotice('');
  };

  const switchMode = (next) => {
    audio.tick(780);
    setMode(next);
    clearMessages();
  };

  const fail = (message) => {
    audio.alertDim();
    setError(message);
  };

  const submit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!EMAIL_RE.test(email)) return fail(content.errors.email);
    if (password.length < 8) return fail(content.errors.password);
    if (mode === 'signup' && !agreed) return fail(content.errors.terms);

    setSubmitting(true);
    audio.tick(660);
    try {
      await authenticate({ mode, email, password, name, remember });
      audio.successArpeggio();
      setMode('granted');
    } catch (err) {
      fail(err?.message || content.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const requestReset = () => {
    audio.tick(620);
    setError('');
    setNotice(content.notices.reset);
  };

  const socialLogin = async (provider) => {
    clearMessages();
    setSubmitting(true);
    audio.tick(640);
    try {
      const result = await authenticateWithProvider(provider);
      setEmail(result.email);
      audio.successArpeggio();
      setMode('granted');
    } catch (err) {
      fail(err?.message || content.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = () => {
    audio.tick(600);
    setMode('login');
    setEmail('');
    setPassword('');
    clearMessages();
  };

  return {
    mode, email, password, name, showPassword, remember, agreed, submitting, error, notice,
    emailInvalid, strength,
    setEmail, setPassword, setName, setRemember, setAgreed,
    toggleShowPassword: () => { setShowPassword((v) => !v); audio.tick(850); },
    switchMode, submit, requestReset, socialLogin, signOut,
  };
}
