'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NATIONS_DATA } from '@/lib/nations-data'
import type { Continent } from '@/lib/nations-data'

type ContinentId = 'all' | Continent

const ACCENT = '#378ADD'

const CONTINENTS: { id: ContinentId; name: string; path?: string }[] = [
  { id: 'all', name: 'Всі' },
  {
    id: 'europe', name: 'Європа',
    path: 'M 45 20 L 65 15 L 80 20 L 85 35 L 75 50 L 60 55 L 45 45 L 35 35 Z',
  },
  {
    id: 'asia', name: 'Азія',
    path: 'M 20 10 L 80 5 L 95 25 L 90 60 L 70 80 L 50 75 L 30 60 L 10 40 Z',
  },
  {
    id: 'americas', name: 'Америки',
    path: 'M 40 5 L 70 10 L 80 30 L 65 45 L 70 55 L 60 90 L 40 95 L 30 75 L 35 55 L 25 40 L 30 20 Z',
  },
  {
    id: 'africa', name: 'Африка',
    path: 'M 35 10 L 65 10 L 75 30 L 70 60 L 55 90 L 45 90 L 30 60 L 25 30 Z',
  },
  {
    id: 'oceania', name: 'Океанія',
    path: 'M 20 40 L 50 30 L 70 35 L 75 55 L 55 65 L 30 60 Z',
  },
]

function nationsLabel(n: number) {
  if (n === 1) return '1 нація'
  if (n >= 2 && n <= 4) return `${n} нації`
  return `${n} націй`
}

export default function NationsPage() {
  const allNations = Object.entries(NATIONS_DATA)
  const [isMobile, setIsMobile] = useState(false)
  const [activeContinent, setActiveContinent] = useState<ContinentId>('all')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const filteredNations = activeContinent === 'all'
    ? allNations
    : allNations.filter(([, n]) => n.continent === activeContinent)

  const countOf = (id: ContinentId) =>
    id === 'all'
      ? allNations.length
      : allNations.filter(([, n]) => n.continent === id).length

  return (
    <>
      <style>{`
        .continent-scroll::-webkit-scrollbar { display: none; }
        @keyframes nationFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        paddingLeft: isMobile ? 0 : '220px',
        paddingBottom: isMobile ? '80px' : '60px',
        minHeight: '100vh',
      }}>

        {/* ── ШАПКА ── */}
        <div style={{
          padding: isMobile ? '48px 24px 40px' : '56px 48px 48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)', marginBottom: '14px', fontWeight: 600,
          }}>
            Архів Людства
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 7vw, 64px)',
            fontWeight: 300, letterSpacing: '-0.03em',
            color: 'white', lineHeight: 1, marginBottom: '16px',
          }}>
            Архів Націй
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.5 }}>
              Географія, злами, душа і тіні
            </p>
            <div style={{
              padding: '3px 10px', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px', fontSize: '11px', letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.3)',
            }}>
              {allNations.length} націй в архіві
            </div>
          </div>
        </div>

        {/* ── ФІЛЬТР КОНТИНЕНТІВ ── */}
        <div style={{ padding: isMobile ? '24px 24px 0' : '28px 48px 0' }}>
          <div
            className="continent-scroll"
            style={{
              display: 'flex', gap: '10px',
              overflowX: 'auto', paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            {CONTINENTS.map(c => (
              <ContinentCard
                key={c.id}
                continent={c}
                active={activeContinent === c.id}
                count={countOf(c.id)}
                empty={c.id !== 'all' && countOf(c.id) === 0}
                onClick={() => setActiveContinent(c.id)}
              />
            ))}
          </div>
        </div>

        {/* ── СПИСОК КАРТОК ── */}
        <div style={{ marginTop: '8px' }}>
          {filteredNations.length === 0 ? (
            <div style={{
              padding: isMobile ? '56px 24px' : '72px 48px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.22)',
              fontSize: '15px',
              letterSpacing: '0.02em',
            }}>
              Поки немає націй в цьому регіоні
            </div>
          ) : (
            filteredNations.map(([id, nation], index) => (
              <NationCard
                key={`${id}-${activeContinent}`}
                id={id}
                nation={nation}
                isMobile={isMobile}
                isLast={index === filteredNations.length - 1}
                animDelay={index * 45}
              />
            ))
          )}
        </div>

      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function ContinentCard({
  continent, active, count, empty, onClick,
}: {
  continent: { id: ContinentId; name: string; path?: string }
  active: boolean
  count: number
  empty: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const lit = active || hovered

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '140px', height: '90px',
        background: active
          ? 'rgba(55,138,221,0.12)'
          : hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? ACCENT : lit ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        transition: 'background 0.2s, border-color 0.2s, opacity 0.2s',
        opacity: empty && !active ? 0.45 : 1,
        textAlign: 'left',
      }}
    >
      {/* SVG силует */}
      {continent.path ? (
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            top: '-8%', left: '-8%',
            width: '116%', height: '116%',
            opacity: active ? 0.22 : hovered ? 0.16 : 0.1,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={continent.path} fill={active ? ACCENT : 'white'} />
        </svg>
      ) : (
        /* "Всі" — стилізований глобус */
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            top: '-8%', left: '-8%',
            width: '116%', height: '116%',
            opacity: active ? 0.22 : hovered ? 0.14 : 0.08,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
          }}
        >
          <circle cx="50" cy="50" r="36" fill="none" stroke={active ? ACCENT : 'white'} strokeWidth="5" />
          <line x1="14" y1="50" x2="86" y2="50" stroke={active ? ACCENT : 'white'} strokeWidth="3.5" />
          <ellipse cx="50" cy="50" rx="20" ry="36" fill="none" stroke={active ? ACCENT : 'white'} strokeWidth="3.5" />
          <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke={active ? ACCENT : 'white'} strokeWidth="2.5" />
        </svg>
      )}

      <div style={{
        position: 'relative', zIndex: 1,
        fontSize: '13px', fontWeight: 500,
        color: active ? 'white' : 'rgba(255,255,255,0.7)',
        marginBottom: '3px',
        transition: 'color 0.2s',
        lineHeight: 1.2,
      }}>
        {continent.name}
      </div>
      <div style={{
        position: 'relative', zIndex: 1,
        fontSize: '11px', letterSpacing: '0.03em',
        color: active ? ACCENT : empty ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.32)',
        transition: 'color 0.2s',
      }}>
        {empty ? 'Скоро' : nationsLabel(count)}
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function NationCard({
  id, nation, isMobile, isLast, animDelay,
}: {
  id: string
  nation: typeof NATIONS_DATA[string]
  isMobile: boolean
  isLast: boolean
  animDelay: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/nation/${id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '16px' : '32px',
        padding: isMobile ? '24px 24px' : '28px 48px',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
        background: hovered ? `${nation.color}08` : 'transparent',
        transition: 'background 0.25s',
        cursor: 'pointer',
        animation: `nationFadeIn 0.35s ease ${animDelay}ms both`,
      }}
    >
      {/* Hover glow */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 20% 50%, ${nation.color}12 0%, transparent 60%)`,
        }} />
      )}

      {/* Великий код нації на фоні */}
      <div style={{
        position: 'absolute',
        left: isMobile ? '-8px' : '16px',
        top: '50%', transform: 'translateY(-50%)',
        fontSize: isMobile ? '72px' : '96px',
        fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
        color: nation.color,
        opacity: hovered ? 0.12 : 0.07,
        userSelect: 'none', pointerEvents: 'none',
        transition: 'opacity 0.25s',
      }}>
        {nation.flag}
      </div>

      {/* Ліва частина: бейдж */}
      <div style={{
        flexShrink: 0,
        width: isMobile ? '44px' : '52px',
        height: isMobile ? '44px' : '52px',
        borderRadius: '50%',
        background: `${nation.color}15`,
        border: `1px solid ${nation.color}${hovered ? '60' : '35'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', letterSpacing: '0.08em', fontWeight: 700,
        color: nation.color,
        transition: 'border-color 0.25s',
        zIndex: 1,
      }}>
        {nation.flag}
      </div>

      {/* Центр: назва + душа + суть */}
      <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '12px',
          flexWrap: 'wrap', marginBottom: '6px',
        }}>
          <span style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: 400, color: 'white', letterSpacing: '-0.01em',
          }}>
            {nation.name}
          </span>
          <span style={{
            fontSize: isMobile ? '14px' : '16px',
            fontStyle: 'italic', color: nation.color,
          }}>
            {nation.soul}
          </span>
        </div>
        <div style={{
          fontSize: '11px', letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
        }}>
          {nation.essenceWords}
        </div>
      </div>

      {/* Права частина: кнопка */}
      {!isMobile && (
        <div style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', letterSpacing: '0.1em',
          fontWeight: 600, textTransform: 'uppercase',
          color: hovered ? nation.color : 'rgba(255,255,255,0.2)',
          transition: 'color 0.25s', zIndex: 1,
        }}>
          Відкрити архетип
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: hovered ? 'translateX(3px)' : 'translateX(0)',
              transition: 'transform 0.2s',
            }}
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      )}

      {isMobile && (
        <div style={{ flexShrink: 0, color: nation.color, opacity: 0.5, zIndex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      )}
    </Link>
  )
}
