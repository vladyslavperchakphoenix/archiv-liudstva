import Link from 'next/link'
import { NATIONS_DATA } from '@/lib/nations-data'

export default function NationsPage() {
  const nations = Object.entries(NATIONS_DATA)

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .nations-wrap { padding-left: 220px; }
        }
        .nations-wrap { padding-bottom: 80px; }
        @media (min-width: 768px) {
          .nations-wrap { padding-bottom: 0; }
        }
        .nations-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 480px) {
          .nations-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .nations-grid { grid-template-columns: 1fr 1fr 1fr; }
        }
        .nation-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          overflow: hidden;
        }
        .nation-card:hover {
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
        }
        .nation-card .flag-bg {
          position: absolute;
          top: -20px;
          right: -10px;
          font-size: 88px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
          opacity: 0.06;
          user-select: none;
          pointer-events: none;
        }
      `}</style>

      <div className="nations-wrap" style={{ padding: '48px 24px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', maxWidth: '640px' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 42px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: '12px',
          }}>
            Нації
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px', lineHeight: 1.6 }}>
            Архетипи народів — географія, злами, душа і тінь. {nations.length} націй в архіві.
          </p>
        </div>

        {/* Grid */}
        <div className="nations-grid">
          {nations.map(([id, nation]) => (
            <Link key={id} href={`/nation/${id}`} className="nation-card" style={{
              borderColor: `${nation.color}22`,
            }}>
              {/* Decorative flag code */}
              <div className="flag-bg" style={{ color: nation.color }}>
                {nation.flag}
              </div>

              {/* Flag badge */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: `${nation.color}18`,
                border: `1px solid ${nation.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', letterSpacing: '0.08em', fontWeight: 600,
                color: nation.color, flexShrink: 0,
              }}>
                {nation.flag}
              </div>

              {/* Name + soul */}
              <div>
                <div style={{
                  fontSize: '18px', fontWeight: 400, color: 'white',
                  marginBottom: '4px',
                }}>
                  {nation.name}
                </div>
                <div style={{
                  fontSize: '13px', fontStyle: 'italic',
                  color: nation.color, opacity: 0.85,
                }}>
                  {nation.soul}
                </div>
              </div>

              {/* Essence words */}
              <div style={{
                fontSize: '11px', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}>
                {nation.essenceWords}
              </div>

              {/* Soul desc */}
              <div style={{
                fontSize: '13px', lineHeight: 1.55,
                color: 'rgba(255,255,255,0.45)',
                paddingTop: '4px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                {nation.soulDesc}
              </div>

              {/* Arrow */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', letterSpacing: '0.12em',
                color: nation.color, opacity: 0.7,
                textTransform: 'uppercase', fontWeight: 600,
              }}>
                Відкрити архетип
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
