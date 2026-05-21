import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NATIONS_DATA } from '@/lib/nations-data'

export default async function NationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const nation = NATIONS_DATA[id]

  if (!nation) notFound()

  const c = nation.color

  const matrixIcons = [
    <GeoIcon key="geo" />,
    <BreakIcon key="break" />,
    <CoreIcon key="core" />,
    <ContractIcon key="contract" />,
    <ShadowIcon key="shadow" />,
  ]

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .nation-wrap { padding-left: 220px; }
        }
        .nation-wrap { padding-bottom: 80px; }
        @media (min-width: 768px) {
          .nation-wrap { padding-bottom: 0; }
        }
        .passport-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 600px) {
          .passport-grid { grid-template-columns: 1fr 1fr; }
        }
        .game-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 600px) {
          .game-grid { gap: 16px; }
        }
        .culture-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 600px) {
          .culture-grid { grid-template-columns: 1fr 1fr 1fr; }
        }
        .back-btn:hover { opacity: 1 !important; }
      `}</style>

      <div className="nation-wrap">

        {/* ── ГЕРОЙ ── */}
        <section style={{
          minHeight: '100svh',
          background: `radial-gradient(ellipse at 60% 40%, ${c}18 0%, #04080f 65%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Back */}
          <Link href="/" className="back-btn" style={{
            position: 'absolute', top: '24px', left: '24px',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'rgba(255,255,255,0.35)', fontSize: '13px',
            opacity: 0.8, transition: 'opacity 0.15s',
          }}>
            <BackArrow /> Глобус
          </Link>

          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: '10%', right: '-10%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: `radial-gradient(circle, ${c}12 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '720px' }}>
            {/* Flag code */}
            <div style={{
              fontSize: 'clamp(72px, 18vw, 160px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: c,
              opacity: 0.15,
              marginBottom: '-16px',
              userSelect: 'none',
            }}>
              {nation.flag}
            </div>

            {/* Nation name */}
            <h1 style={{
              fontSize: 'clamp(36px, 8vw, 72px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '24px',
            }}>
              {nation.name}
            </h1>

            {/* 3 essence words */}
            <div style={{
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '32px',
            }}>
              {nation.essenceWords}
            </div>

            {/* Soul keyword */}
            <div style={{
              display: 'inline-block',
              padding: '10px 20px',
              borderRadius: '100px',
              border: `1px solid ${c}55`,
              background: `${c}10`,
            }}>
              <span style={{ color: c, fontSize: '18px', fontStyle: 'italic', fontWeight: 500 }}>
                {nation.soul}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginLeft: '12px' }}>
                — {nation.soulDesc}
              </span>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute', bottom: '32px', left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.2)', fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          }}>
            <ChevronDown color={c} />
          </div>
        </section>

        {/* ── ПАСПОРТ АРХЕТИПУ ── */}
        <section style={{ padding: '64px 24px', maxWidth: '900px', margin: '0 auto' }}>
          <SectionLabel color={c}>Паспорт архетипу</SectionLabel>
          <div className="passport-grid">
            <div style={{
              background: `linear-gradient(135deg, ${c}12 0%, transparent 60%)`,
              border: `1px solid ${c}30`,
              borderRadius: '16px', padding: '28px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: `${c}20`, border: `1px solid ${c}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <PowerIcon color={c} />
                </div>
                <div style={{
                  fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: c, fontWeight: 600,
                }}>
                  Суперсила
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.65 }}>
                {nation.superpower}
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,80,80,0.2)',
              borderRadius: '16px', padding: '28px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <HeelIcon />
                </div>
                <div style={{
                  fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#ff6060', fontWeight: 600,
                }}>
                  Ахіллесова пʼята
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.65 }}>
                {nation.achillesHeel}
              </p>
            </div>
          </div>
        </section>

        {/* ── МАТРИЦЯ ── */}
        <section style={{
          padding: '0 24px 64px', maxWidth: '900px', margin: '0 auto',
        }}>
          <SectionLabel color={c}>Матриця нації</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {nation.matrix.map((m, i) => (
              <div key={m.key} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '20px',
                transition: 'border-color 0.2s',
              }}>
                <div style={{
                  width: '36px', height: '36px', flexShrink: 0,
                  borderRadius: '8px',
                  background: `${c}12`,
                  border: `1px solid ${c}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: c,
                }}>
                  {matrixIcons[i]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: c, fontWeight: 600, marginBottom: '8px',
                  }}>
                    {m.key}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.65 }}>
                    {m.val}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── КУЛЬТУРНИЙ КОД (premium) ── */}
        <section style={{
          padding: '0 24px 64px', maxWidth: '900px', margin: '0 auto',
        }}>
          <SectionLabel color={c}>Культурний код</SectionLabel>
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Content underneath blur */}
            <div className="culture-grid" style={{ padding: '0' }}>
              {[
                { label: 'Філософія та релігія', text: nation.culturalCode.philosophy, icon: <PhiloIcon /> },
                { label: 'Естетика', text: nation.culturalCode.aesthetics, icon: <AestIcon /> },
                { label: 'Меми та розпаковка', text: nation.culturalCode.memes, icon: <MemeIcon /> },
              ].map((item) => (
                <div key={item.label} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '24px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
                  }}>
                    <span style={{ color: c }}>{item.icon}</span>
                    <span style={{
                      fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)', fontWeight: 600,
                    }}>
                      {item.label}
                    </span>
                  </div>
                  <p style={{
                    color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.65,
                    filter: 'blur(4px)', userSelect: 'none',
                  }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Lock overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, #04080f 0%, #04080f88 40%, transparent 100%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-end',
              padding: '32px 24px',
              gap: '12px',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `${c}15`, border: `1px solid ${c}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: c,
              }}>
                <LockIcon />
              </div>
              <div style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.5,
              }}>
                Преміум розділ — доступний після реєстрації
              </div>
              <Link href="/profile" style={{
                padding: '12px 28px',
                background: c,
                color: '#04080f',
                borderRadius: '100px',
                fontSize: '14px', fontWeight: 600,
                letterSpacing: '0.04em',
              }}>
                Отримати доступ
              </Link>
            </div>
          </div>
        </section>

        {/* ── ІГРОВІ МЕХАНІКИ ── */}
        <section style={{
          padding: '0 24px 80px', maxWidth: '900px', margin: '0 auto',
        }}>
          <SectionLabel color={c}>Ігрові механіки</SectionLabel>
          <div className="game-grid">
            {[
              {
                label: 'Пасивна здібність',
                text: nation.gameMechanics.passive,
                icon: <ShieldIcon />,
                accent: c,
              },
              {
                label: 'Економіка',
                text: nation.gameMechanics.economy,
                icon: <ChartIcon />,
                accent: c,
              },
              {
                label: 'Кризовий баф',
                text: nation.gameMechanics.crisis,
                icon: <LightningIcon />,
                accent: c,
              },
              {
                label: 'Вразливість',
                text: nation.gameMechanics.vulnerability,
                icon: <CrackIcon />,
                accent: '#ff6060',
              },
            ].map((card) => (
              <div key={card.label} style={{
                background: `linear-gradient(160deg, ${card.accent}0e 0%, transparent 50%)`,
                border: `1px solid ${card.accent}28`,
                borderRadius: '14px', padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    background: `${card.accent}15`,
                    border: `1px solid ${card.accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: card.accent, flexShrink: 0,
                  }}>
                    {card.icon}
                  </div>
                  <div style={{
                    fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: card.accent, fontWeight: 700,
                  }}>
                    {card.label}
                  </div>
                </div>
                <p style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.6,
                  flex: 1,
                }}>
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      marginBottom: '24px',
    }}>
      <div style={{ width: '3px', height: '20px', borderRadius: '2px', background: color }} />
      <span style={{
        fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)', fontWeight: 600,
      }}>
        {children}
      </span>
    </div>
  )
}

function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  )
}

function ChevronDown({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}

function PowerIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}

function HeelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function GeoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20"/>
      <path d="M2 12h20"/>
    </svg>
  )
}

function BreakIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}

function CoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function ContractIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function ShadowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function PhiloIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function AestIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  )
}

function MemeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

function LightningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}

function CrackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9.5 14 2-4 2 2 2-4"/>
    </svg>
  )
}
