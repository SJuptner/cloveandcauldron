'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setEmail('');
    } catch {
      setError('Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="font-body-md text-body-md text-primary">
        You&apos;re in — word is on its way when the next piece is live.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full text-left">
        <label className="font-label-sm text-label-sm uppercase tracking-widest mb-2 block opacity-60">
          Parchment Address
        </label>
        <input
          className="w-full bg-transparent border-0 border-b border-primary/20 focus:ring-0 focus:border-primary py-3 px-0 font-body-md placeholder:text-outline/40"
          placeholder="you@alchemy.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {status === 'error' && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-lg text-label-lg ink-border w-full md:w-auto hover:bg-secondary transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Send Word'}
      </button>
    </form>
  );
}
