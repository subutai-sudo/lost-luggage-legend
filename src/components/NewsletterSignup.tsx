'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setMessage(data.message || 'Welcome aboard! Check your inbox to confirm your subscription.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Connection failed. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c9a96e]/20 mb-6">
          <svg className="w-8 h-8 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#1a1814] mb-3" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
          You&apos;re on the list!
        </h3>
        <p className="text-[#6b6560] max-w-md mx-auto">{message}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Decorative top border */}
      <div className="w-12 h-0.5 bg-[#c9a96e] mx-auto mb-10" />

      {/* Decorative icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-[#c9a96e]/20 blur-xl rounded-full" />
          <svg className="relative w-12 h-12 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} data-newsletter className="max-w-lg mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="input-editorial"
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="spinner" />
                Joining...
              </span>
            ) : (
              'Subscribe Free'
            )}
          </button>
        </div>

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-600" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{message}</p>
        )}
      </form>

      {/* Social proof */}
      <div className="mt-10 pt-8 border-t border-[#d9d0c4]">
        <div className="flex items-center justify-center gap-8">
          {[
            { num: '2,400+', label: 'Subscribers' },
            { num: '4.9★', label: 'Avg. Rating' },
            { num: 'Weekly', label: 'Digest' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-[#1a1814]" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.num}</div>
              <div className="text-[0.65rem] uppercase tracking-widest text-[#6b6560] mt-0.5" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
