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

  const globeActive = pathname === '/'

  return (
    <>
      <style>{`
        @keyframes globeSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .globe-meridians {
          transform-origin: 12px 12px;
          animation: globeSpin 8s linear infinite;
        }
        .globe-btn-center:hover .globe-meridians,
        .globe-btn-center:active .globe-meridians {
          animation-duration: 1.5s !important;
        }
        .globe-logo-link:hover .globe-meridians {
          animation-duration: 3s !important;
        }
        .nav-side-btn:hover {
          color: rgba(255,255,255,0.75) !important;
        }
        .desktop-nav-item:hover {
          background: rgba(255,255,255,0.05) !important;
          color: rgba(255,255,255,0.8) !important;
        }
      `}</style>

      {/* ── ПОШУК ОВЕРЛЕЙ ── */}
      {searchOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '100px', paddingLeft: '16px', paddingRight: '16px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', padding: '14px 18px',
            }}>
              <SearchIcon size={20} />
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

      {/* ── DESKTOP SIDEBAR ── */}
      {!isMobile && (
        <nav style={{
          position: 'fixed', left: 0, top: 0, bottom: 0, width: '220px',
          zIndex: 40, background: '#04080f',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Логотип з анімованим глобусом */}
          <Link href="/" className="globe-logo-link" style={{
            padding: '32px 20px 28px',
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: globeActive ? 'rgba(55,138,221,0.18)' : 'rgba(55,138,221,0.08)',
              border: `1px solid rgba(55,138,221,${globeActive ? '0.65' : '0.28'})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: globeActive ? '#60a5fa' : '#4a9fd4',
              transition: 'all 0.2s',
            }}>
              <SpinningGlobe size={17} />
            </div>
            <span style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
            }}>
              Архів Людства
            </span>
          </Link>

          {/* Пункти меню */}
          <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Link href="/" className="desktop-nav-item" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '8px', textDecoration: 'none',
              background: isActive('/') ? 'rgba(55,138,221,0.12)' : 'transparent',
              color: isActive('/') ? '#60a5fa' : 'rgba(255,255,255,0.4)',
              fontSize: '14px', fontWeight: isActive('/') ? 500 : 400,
              transition: 'all 0.15s',
            }}>
              <SmallGlobeIcon active={isActive('/')} /> Глобус
            </Link>

            <Link href="/nation" className="desktop-nav-item" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '8px', textDecoration: 'none',
              background: isActive('/nation') ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: isActive('/nation') ? 'white' : 'rgba(255,255,255,0.4)',
              fontSize: '14px', fontWeight: isActive('/nation') ? 500 : 400,
              transition: 'all 0.15s',
            }}>
              <NationsIcon size={20} /> Нації
            </Link>

            <button
              onClick={() => setSearchOpen(true)}
              className="desktop-nav-item"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '8px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)', fontSize: '14px',
                width: '100%', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <SearchIcon size={20} /> Пошук
            </button>
          </div>

          {/* Профіль */}
          <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Link href="/profile" className="desktop-nav-item" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '8px', textDecoration: 'none',
              background: isActive('/profile') ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: isActive('/profile') ? 'white' : 'rgba(255,255,255,0.4)',
              fontSize: '14px', transition: 'all 0.15s',
            }}>
              <ProfileIcon size={20} /> Увійти
            </Link>
            <p style={{ padding: '10px 14px 4px', color: 'rgba(255,255,255,0.12)', fontSize: '11px' }}>
              v0.1 · alpha
            </p>
          </div>
        </nav>
      )}

      {/* ── MOBILE BOTTOM BAR ── */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          height: '70px',
          background: 'rgba(4,8,15,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>

          {/* Нації */}
          <Link href="/nation" className="nav-side-btn" style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '4px', padding: '8px', textDecoration: 'none',
            color: isActive('/nation') ? 'white' : 'rgba(255,255,255,0.35)',
            fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            transition: 'color 0.15s',
          }}>
            <NationsIcon size={22} />
            Нації
          </Link>

          {/* Пошук */}
          <button
            onClick={() => setSearchOpen(true)}
            className="nav-side-btn"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.35)',
              fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'color 0.15s',
            }}
          >
            <SearchIcon size={22} />
            Пошук
          </button>

          {/* ─ ГЛОБУС центральна кнопка ─ */}
          <div style={{
            width: '80px', flexShrink: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            <Link
              href="/"
              className="globe-btn-center"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '56px', height: '56px', borderRadius: '50%',
                background: globeActive
                  ? 'linear-gradient(145deg, #0d1f3c, #071224)'
                  : '#04080f',
                border: `1.5px solid rgba(55,138,221,${globeActive ? '0.85' : '0.45'})`,
                boxShadow: globeActive
                  ? '0 0 28px rgba(55,138,221,0.4), 0 0 8px rgba(55,138,221,0.2), 0 4px 20px rgba(0,0,0,0.9)'
                  : '0 4px 20px rgba(0,0,0,0.8), 0 -1px 6px rgba(0,0,0,0.6)',
                transform: 'translateY(-20px)',
                color: globeActive ? '#60a5fa' : 'rgba(55,138,221,0.65)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                textDecoration: 'none',
              }}
            >
              <SpinningGlobe size={26} />
            </Link>
          </div>

          {/* Профіль */}
          <Link href="/profile" className="nav-side-btn" style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '4px', padding: '8px', textDecoration: 'none',
            color: isActive('/profile') ? 'white' : 'rgba(255,255,255,0.35)',
            fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            transition: 'color 0.15s',
          }}>
            <ProfileIcon size={22} />
            Профіль
          </Link>

          {/* Резерв */}
          <div style={{ flex: 1 }} />
        </nav>
      )}
    </>
  )
}

/* ── SVG КОМПОНЕНТИ ── */

function SpinningGlobe({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Зовнішнє коло */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      {/* Екватор */}
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      {/* Паралель (еліпс) */}
      <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
      {/* Меридіани що обертаються */}
      <g className="globe-meridians">
        <path
          d="M12 2C18 7 18 17 12 22C6 17 6 7 12 2Z"
          stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"
        />
        <path
          d="M12 2C18 7 18 17 12 22C6 17 6 7 12 2Z"
          stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"
          style={{ transform: 'rotate(60deg)', transformOrigin: '12px 12px' }}
        />
        <path
          d="M12 2C18 7 18 17 12 22C6 17 6 7 12 2Z"
          stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"
          style={{ transform: 'rotate(120deg)', transformOrigin: '12px 12px' }}
        />
      </g>
    </svg>
  )
}

function SmallGlobeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
      {active && <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6"/>}
    </svg>
  )
}

function NationsIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  )
}

function SearchIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function ProfileIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}
