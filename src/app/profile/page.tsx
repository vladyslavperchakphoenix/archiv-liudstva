'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(`Помилка: ${error.message}`)
      else setMessage('Акаунт створено! Тепер увійдіть.')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(`Помилка: ${error.message}`)
      else setUser(data.user)
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) return (
    <div style={{
      minHeight: '100vh', background: '#04080f',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(55,138,221,0.15)', border: '1px solid rgba(55,138,221,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: '24px'
        }}>👤</div>
        <h1 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 400, marginBottom: '8px' }}>
          Вітаємо!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>
          {user.email}
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            План
          </p>
          <p style={{ color: 'white', fontSize: '14px' }}>Free</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px',
          }}
        >
          Вийти
        </button>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#04080f',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '32px', textAlign: 'center' }}>
          Архів Людства
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer',
              background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: mode === m ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
              color: mode === m ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '14px',
            }}>
              {m === 'login' ? 'Увійти' : 'Реєстрація'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{
              padding: '12px 16px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', fontSize: '14px', outline: 'none',
            }}
          />
          <input
            type="password" placeholder="Пароль" value={password}
            onChange={e => setPassword(e.target.value)} required
            style={{
              padding: '12px 16px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', fontSize: '14px', outline: 'none',
            }}
          />
          <button
            type="submit" disabled={loading}
            style={{
              padding: '12px', borderRadius: '8px', marginTop: '4px',
              background: '#2563eb', border: 'none',
              color: 'white', fontSize: '14px', cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Завантаження...' : mode === 'login' ? 'Увійти' : 'Зареєструватись'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}