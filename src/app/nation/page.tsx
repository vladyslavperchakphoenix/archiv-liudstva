'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NATIONS_DATA } from '@/lib/nations-data'

export default function NationsPage() {
  const nations = Object.entries(NATIONS_DATA)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      paddingLeft: isMobile ? 0 : '220px',
      paddingBottom: isMobile ? '80px' : '60px',
      minHeight: '100vh',
    }}>

      {/* ── ШАПКА ── */}
      <div style={{
        padding: isMobile ? '48px 24px 40px' : '56px 48px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '0',
      }}>
        <div style={{
          fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)', marginBottom: '14px', fontWeight: 600,
        }}>
          Архів Людства
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 64px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          color: 'white',
          lineHeight: 1,
          marginBottom: '16px',
        }}>
          Архів Націй
        </h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.5,
          }}>
            Географія, злами, душа і тіні
          </p>
          <div style={{
            padding: '3px 10px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            fontSize: '11px', letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.3)',
          }}>
            {nations.length} націй в архіві
          </div>
        </div>
      </div>

      {/* ── СПИСОК КАРТОК ── */}
      <div>
        {nations.map(([id, nation], index) => (
          <NationCard
            key={id}
            id={id}
            nation={nation}
            isMobile={isMobile}
            isLast={index === nations.length - 1}
          />
        ))}
      </div>

    </div>
  )
}

function NationCard({
  id, nation, isMobile, isLast,
}: {
  id: string
  nation: typeof NATIONS_DATA[string]
  isMobile: boolean
  isLast: boolean
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
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        color: nation.color,
        opacity: hovered ? 0.12 : 0.07,
        userSelect: 'none',
        pointerEvents: 'none',
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
            fontWeight: 400,
            color: 'white',
            letterSpacing: '-0.01em',
          }}>
            {nation.name}
          </span>
          <span style={{
            fontSize: isMobile ? '14px' : '16px',
            fontStyle: 'italic',
            color: nation.color,
          }}>
            {nation.soul}
          </span>
        </div>
        <div style={{
          fontSize: '11px', letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.22)',
          textTransform: 'uppercase',
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
          transition: 'color 0.25s',
          zIndex: 1,
        }}>
          Відкрити архетип
          <svg
            width="14" height="14" viewBox="0 0 24 24"
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      )}
    </Link>
  )
}
