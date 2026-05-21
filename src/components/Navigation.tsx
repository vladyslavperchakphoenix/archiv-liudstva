'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const navItems = [
    { href: '/', label: 'Глобус', icon: <GlobeIcon /> },
    { href: '/nation', label: 'Нації', icon: <NationsIcon /> },
  ]

  return (
    <>
      {/* Пошук оверлей */}
      {searchOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', paddingTop: '100px', paddingLeft: '16px', paddingRight: '16px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', padding: '14px 18px',
            }}>
              <SearchIcon />
              <input
                autoFocus
                type="text"
                placeholder="Португалія, Сократ, архетип..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                style={{
                  flex: 1, background: 'transparent',
                  border: 'none', outline: 'none',
                  color: 'white', fontSize: '16px',
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px', padding: '4px 8px',
                  color: 'rgba(255,255,255,0.4)', fontSize: '11px',
                  cursor: 'pointer', letterSpacing: '0.05em',
                }}
              >
                ESC
              </button>
            </div>
            <div style={{
              marginTop: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '24px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.3)', fontSize: '14px',
            }}>
              {query ? `Шукаємо "${query}"...` : 'Почніть вводити назву нації або імʼя'}
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <nav style={{
          position: 'fixed', left: 0, top: 0, bottom: 0,
          width: '220px', zIndex: 40,
          background: '#04080f',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Логотип */}
          <div style={{ padding: '32px 20px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'rgba(55,138,221,0.12)',
                border: '1px solid rgba(55,138,221,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#378ADD' }} />
              </div>
              <span style={{
                color: 'rgba(255,255,255,0.5)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
              }}>
                Архів Людства
              </span>
            </div>
          </div>

          {/* Пункти */}
          <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '8px',
                background: isActive(item.href) ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: isActive(item.href) ? 'white' : 'rgba(255,255,255,0.4)',
                fontSize: '14px', fontWeight: isActive(item.href) ? 500 : 400,
                transition: 'all 0.15s',
              }}>
                {item.icon} {item.label}
              </Link>
            ))}

            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '8px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)', fontSize: '14px',
                width: '100%', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <SearchIcon /> Пошук
            </button>
          </div>

          {/* Профіль внизу */}
          <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Link href="/profile" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '8px',
              background: isActive('/profile') ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: isActive('/profile') ? 'white' : 'rgba(255,255,255,0.4)',
              fontSize: '14px',
            }}>
              <ProfileIcon /> Увійти
            </Link>
            <p style={{ padding: '10px 14px 4px', color: 'rgba(255,255,255,0.12)', fontSize: '11px' }}>
              v0.1 · alpha
            </p>
          </div>
        </nav>
      )}

      {/* Mobile bottom bar */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          background: 'rgba(4,8,15,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'stretch',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '12px 8px',
              color: isActive(item.href) ? '#60a5fa' : 'rgba(255,255,255,0.4)',
              fontSize: '10px', fontWeight: 500, letterSpacing: '0.03em',
            }}>
              {item.icon}
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => setSearchOpen(true)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '12px 8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', fontSize: '10px',
              fontWeight: 500, letterSpacing: '0.03em',
            }}
          >
            <SearchIcon />
            Пошук
          </button>

          <Link href="/profile" style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '4px', padding: '12px 8px',
            color: isActive('/profile') ? '#60a5fa' : 'rgba(255,255,255,0.4)',
            fontSize: '10px', fontWeight: 500, letterSpacing: '0.03em',
          }}>
            <ProfileIcon />
            Профіль
          </Link>
        </nav>
      )}
    </>
  )
}

function GlobeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
}
function NationsIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
}
function SearchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}
function ProfileIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}