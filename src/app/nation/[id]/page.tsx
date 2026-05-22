'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NATIONS_DATA } from '@/lib/nations'
import { getUserPlan } from '@/lib/supabase/getPlan'

const FREE_COLOR = '#4ade80'

const TABS = [
  { id: 'overview',   label: 'Огляд' },
  { id: 'economics',  label: 'Економіка' },
  { id: 'philosophy', label: 'Філософія' },
  { id: 'music',      label: 'Музика' },
  { id: 'art',        label: 'Мистецтво' },
  { id: 'science',    label: 'Наука' },
  { id: 'conflicts',  label: 'Конфлікти' },
  { id: 'memes',      label: 'Меми' },
]

const ECON_LABELS: Record<string, { label: string; context: string }> = {
  gdp:              { label: 'ВВП',            context: 'Загальний обсяг економіки' },
  gdpPerCapita:     { label: 'ВВП на особу',   context: 'Середній дохід на людину' },
  population:       { label: 'Населення',      context: 'Станом на 2024' },
  happinessIndex:   { label: 'Індекс щастя',   context: 'World Happiness Report' },
  corruptionIndex:  { label: 'Індекс корупції',context: 'Transparency International' },
  humanDevelopment: { label: 'ІЛР',            context: 'Human Development Index' },
}

export default function NationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isMobile, setIsMobile]   = useState(false)
  const [userPlan, setUserPlan]   = useState<'free' | 'premium'>('free')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    getUserPlan().then(setUserPlan)
  }, [])

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const t = p.get('tab')
    if (t && TABS.some(tab => tab.id === t)) setActiveTab(t)
  }, [])

  const nation = NATIONS_DATA[id]
  if (!nation) notFound()

  const c         = nation.color
  const px        = isMobile ? '20px' : '40px'
  const isPremium = userPlan === 'premium'
  const premiumPersons = nation.persons.filter(p => p.isPremium)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tabId)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <>
      <div
        className="nation-page-wrap"
        style={{
          paddingLeft: isMobile ? 0 : '220px',
          paddingBottom: isMobile ? '80px' : '60px',
          minHeight: '100vh',
          background: '#04080f',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: `0 ${px}` }}>

          {/* ── ГЕРОЙ ─────────────────────────────────────────────────── */}
          <section style={{
            paddingTop: isMobile ? '48px' : '56px',
            paddingBottom: '32px',
          }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              <Link href="/nation" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: 'rgba(255,255,255,0.3)', fontSize: '12px',
                letterSpacing: '0.06em', textDecoration: 'none',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Назад
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '12px' }}>·</span>
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '12px', letterSpacing: '0.1em' }}>
                Архів Людства · Нація
              </span>
            </div>

            {/* Badge + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: isMobile ? '52px' : '64px',
                height: isMobile ? '52px' : '64px',
                borderRadius: '50%',
                background: `${c}14`,
                border: `1px solid ${c}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isMobile ? '13px' : '15px',
                letterSpacing: '0.06em', fontWeight: 700,
                color: c, flexShrink: 0,
                boxShadow: `0 0 24px ${c}18`,
              }}>
                {nation.flag}
              </div>
              <h1 style={{
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: 300, letterSpacing: '-0.02em',
                color: 'white', lineHeight: 1.05, margin: 0,
              }}>
                {nation.name}
              </h1>
            </div>

            {/* Soul */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                fontSize: isMobile ? '18px' : '22px',
                fontStyle: 'italic', color: c, fontWeight: 400, marginRight: '12px',
              }}>
                {nation.soul}
              </span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                — {nation.soulDesc}
              </span>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              {nation.tags.map(tag => (
                <span key={tag} style={{
                  padding: '4px 12px',
                  border: `1px solid ${c}30`,
                  borderRadius: '100px',
                  fontSize: '11px', letterSpacing: '0.08em',
                  color: c, background: `${c}0a`,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* ── TABS ── */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '24px 0 0',
              marginTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}>
              {[
                { id: 'overview',   label: 'Огляд' },
                { id: 'economics',  label: 'Економіка' },
                { id: 'philosophy', label: 'Філософія' },
                { id: 'music',      label: 'Музика' },
                { id: 'art',        label: 'Мистецтво' },
                { id: 'science',    label: 'Наука' },
                { id: 'conflicts',  label: 'Конфлікти' },
                { id: 'memes',      label: 'Меми' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '20px',
                    border: activeTab === tab.id
                      ? `1px solid ${nation.color}`
                      : '1px solid rgba(255,255,255,0.12)',
                    background: activeTab === tab.id
                      ? `${nation.color}20`
                      : 'transparent',
                    color: activeTab === tab.id
                      ? nation.color
                      : 'rgba(255,255,255,0.45)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {/* ── ОГЛЯД ─────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Паспорт */}
              <section style={{ paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '40px' }}>
                <SectionHeader label="Паспорт архетипу">
                  <FreeLabel text="Безкоштовно" />
                </SectionHeader>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '12px',
                }}>
                  <PassportCard title="Суперсила"        value={nation.superpower} color={c}       icon={<BoltIcon />} />
                  <PassportCard title="Ахіллесова п'ята" value={nation.weakness}   color="#f87171" icon={<ShieldCrackIcon />} />
                  <PassportCard title="Ключовий концепт" value={nation.concept}    color={c}       icon={<KeyIcon />} />
                  <PassportCard title="Архетипна фігура" value={nation.figure}     color={c}       icon={<PersonIcon />} />
                </div>
              </section>

              {/* Матриця */}
              <section style={{ paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '40px' }}>
                <SectionHeader label="Матриця нації">
                  {!isPremium && <FreeLabel text="Безкоштовно · перші 3 з 5" />}
                </SectionHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {nation.matrix.slice(0, 3).map((m, i) => (
                    <MatrixRow key={m.key} item={m} color={c} index={i} />
                  ))}
                  {!isPremium && (
                    <div style={{
                      height: '1px',
                      background: `linear-gradient(to right, transparent, ${c}30, transparent)`,
                      margin: '8px 0',
                    }} />
                  )}
                  {nation.matrix.slice(3).map((m, i) => (
                    isPremium ? (
                      <MatrixRow key={m.key} item={m} color={c} index={i + 3} />
                    ) : (
                      <div key={m.key} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
                        <MatrixRow item={m} color={c} index={i + 3} />
                        <div style={{
                          position: 'absolute', inset: 0,
                          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                          background: 'rgba(4,8,15,0.6)', borderRadius: '10px', pointerEvents: 'none',
                        }} />
                      </div>
                    )
                  ))}
                </div>
              </section>

              {/* Культурний спадок */}
              <section style={{ paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '40px' }}>
                <SectionHeader label="Культурний спадок">
                  {!isPremium && <FreeLabel text="Безкоштовно · по одному прикладу" />}
                </SectionHeader>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                  gap: '12px',
                }}>
                  {[
                    { label: 'Філософія', data: nation.heritage.philosophy, icon: <PhiloIcon /> },
                    { label: 'Мистецтво', data: nation.heritage.art,        icon: <ArtIcon /> },
                    { label: 'Наука',     data: nation.heritage.science,     icon: <SciIcon /> },
                  ].map(({ label, data, icon }) => (
                    <div key={label} style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '12px', padding: '20px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
                        <span style={{ color: c, display: 'flex' }}>{icon}</span>
                        <span style={{
                          fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.35)', fontWeight: 600,
                        }}>{label}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                          {data.name}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', lineHeight: 1.5 }}>
                          {data.desc}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {data.others.map(name => (
                          <div key={name} style={{
                            fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                            filter: isPremium ? 'none' : 'blur(3px)',
                            opacity: isPremium ? 1 : 0.35,
                            userSelect: isPremium ? 'auto' : 'none',
                          }}>{name}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Персоналії */}
              <section style={{ paddingBottom: '40px' }}>
                <SectionHeader label="Персоналії" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {nation.persons.filter(p => !p.isPremium).map(person => (
                    <PersonCard key={person.name} person={person} color={c} blurred={false} />
                  ))}
                  {premiumPersons.slice(0, 2).map(person => (
                    <PersonCard key={person.name} person={person} color={c} blurred={!isPremium} />
                  ))}
                  {premiumPersons.length > 0 && (
                    isPremium ? (
                      <div style={{
                        marginTop: '8px', padding: '18px 20px',
                        background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                        <span style={{ color: '#ffd700', fontSize: '13px', fontWeight: 600 }}>
                          Premium активовано — всі персоналії відкриті
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        marginTop: '8px', padding: '24px',
                        background: `linear-gradient(135deg, ${c}0d 0%, rgba(255,255,255,0.02) 100%)`,
                        border: `1px solid ${c}28`, borderRadius: '14px',
                        display: 'flex', flexDirection: 'column', gap: '12px',
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: 500, color: 'white' }}>
                          +{premiumPersons.length} {personLabel(premiumPersons.length)} у повному архіві
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                          Повний архів містить детальні біографії, вплив на архетип нації та зв'язки між постатями.
                        </div>
                        <Link href="/profile" style={{
                          alignSelf: 'flex-start', padding: '10px 20px',
                          background: c, color: '#04080f', borderRadius: '100px',
                          fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                          textDecoration: 'none',
                        }}>
                          Розблокувати Premium
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </section>
            </>
          )}

          {/* ── ЕКОНОМІКА ─────────────────────────────────────────────── */}
          {activeTab === 'economics' && (
            <section style={{ paddingBottom: '40px' }}>
              {nation.economics ? (
                <>
                  <SectionHeader label="Економічні показники">
                    <FreeLabel text="Безкоштовно" />
                  </SectionHeader>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
                    gap: '10px',
                  }}>
                    {(Object.entries(nation.economics) as [string, string][]).map(([key, value]) => {
                      const meta = ECON_LABELS[key]
                      return (
                        <div key={key} style={{
                          background: 'rgba(255,255,255,0.025)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '12px', padding: '18px 16px',
                        }}>
                          <div style={{
                            fontSize: isMobile ? '20px' : '22px',
                            fontWeight: 600, color: c,
                            letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '6px',
                          }}>
                            {value}
                          </div>
                          <div style={{
                            fontSize: '11px', letterSpacing: '0.08em',
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px',
                          }}>
                            {meta?.label ?? key}
                          </div>
                          {meta?.context && (
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', lineHeight: 1.4 }}>
                              {meta.context}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '60px 0', textAlign: 'center',
                  color: 'rgba(255,255,255,0.2)', fontSize: '14px',
                }}>
                  Економічні дані скоро з'являться
                </div>
              )}
              <CrossLinks currentId={id} activeTab={activeTab} color={c} />
            </section>
          )}

          {/* ── КОНТЕНТ ВКЛАДОК ───────────────────────────────────────── */}
          {(['philosophy', 'music', 'art', 'science', 'conflicts', 'memes'] as const).map(tabId => {
            if (activeTab !== tabId) return null
            const data = nation.tabs?.[tabId]
            return (
              <section key={tabId} style={{ paddingBottom: '40px' }}>
                <TabContent
                  data={data}
                  isPremiumUser={isPremium}
                  nationColor={c}
                />
                <CrossLinks currentId={id} activeTab={activeTab} color={c} />
              </section>
            )
          })}

        </div>
      </div>
    </>
  )
}

// ─── TabContent ─────────────────────────────────────────────────────────────

function TabContent({
  data,
  isPremiumUser,
  nationColor,
}: {
  data: { intro: string; items: { name: string; desc: string; isPremium: boolean }[] } | undefined
  isPremiumUser: boolean
  nationColor: string
}) {
  if (!data) {
    return (
      <div style={{
        padding: '60px 0', textAlign: 'center',
        color: 'rgba(255,255,255,0.2)', fontSize: '14px',
      }}>
        Контент для цієї вкладки скоро з'явиться
      </div>
    )
  }

  const freeItems    = data.items.filter(i => !i.isPremium)
  const premiumItems = data.items.filter(i =>  i.isPremium)

  return (
    <div>
      <p style={{
        fontStyle: 'italic', color: 'rgba(255,255,255,0.5)',
        fontSize: '15px', lineHeight: 1.7, marginBottom: '28px',
        borderLeft: `2px solid ${nationColor}40`, paddingLeft: '16px',
      }}>
        {data.intro}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {freeItems.map((item, i) => (
          <TabItemCard key={item.name} item={item} index={i} color={nationColor} blurred={false} />
        ))}
        {premiumItems.map((item, i) => (
          isPremiumUser ? (
            <TabItemCard key={item.name} item={item} index={freeItems.length + i} color={nationColor} blurred={false} />
          ) : (
            <div key={item.name} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
              <TabItemCard item={item} index={freeItems.length + i} color={nationColor} blurred />
              <div style={{
                position: 'absolute', inset: 0,
                backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                background: 'rgba(4,8,15,0.55)', borderRadius: '12px', pointerEvents: 'none',
              }} />
            </div>
          )
        ))}
      </div>

      {!isPremiumUser && premiumItems.length > 0 && (
        <div style={{
          marginTop: '20px', padding: '20px 24px',
          background: `linear-gradient(135deg, ${nationColor}0d 0%, rgba(255,255,255,0.02) 100%)`,
          border: `1px solid ${nationColor}28`, borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
              +{premiumItems.length} у Premium архіві
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
              Відкрийте повний доступ до всіх розділів
            </div>
          </div>
          <Link href="/profile" style={{
            padding: '9px 18px', background: nationColor, color: '#04080f',
            borderRadius: '100px', fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.04em', textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Розблокувати →
          </Link>
        </div>
      )}
    </div>
  )
}

function TabItemCard({
  item, index, color, blurred,
}: {
  item: { name: string; desc: string; isPremium: boolean }
  index: number
  color: string
  blurred: boolean
}) {
  return (
    <div style={{
      display: 'flex', gap: '14px', alignItems: 'flex-start',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', padding: '16px',
      opacity: blurred ? 0.5 : 1,
    }}>
      <div style={{
        width: '28px', height: '28px', flexShrink: 0,
        borderRadius: '7px', background: `${color}12`,
        border: `1px solid ${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700, color,
      }}>
        {index + 1}
      </div>
      <div>
        <div style={{ color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
          {item.name}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.55 }}>
          {item.desc}
        </div>
      </div>
    </div>
  )
}

// ─── CrossLinks ─────────────────────────────────────────────────────────────

function CrossLinks({ currentId, activeTab, color }: {
  currentId: string; activeTab: string; color: string
}) {
  const others = Object.entries(NATIONS_DATA).filter(([id]) => id !== currentId)
  if (others.length === 0) return null

  return (
    <div style={{ marginTop: '56px' }}>
      <div style={{
        fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.2)', fontWeight: 600, marginBottom: '16px',
      }}>
        Порівняйте з іншими націями
      </div>
      <div
        className=""
        style={{
          display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {others.map(([id, nation]) => (
          <Link
            key={id}
            href={`/nation/${id}?tab=${activeTab}`}
            style={{
              flexShrink: 0, padding: '12px 16px',
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${nation.color}25`,
              borderRadius: '12px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '10px',
              minWidth: '140px',
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: `${nation.color}14`, border: `1px solid ${nation.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700, color: nation.color, flexShrink: 0,
            }}>
              {nation.flag}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{nation.name}</div>
              <div style={{ fontSize: '10px', fontStyle: 'italic', color: nation.color, opacity: 0.7, marginTop: '2px' }}>
                {nation.soul}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── helpers ────────────────────────────────────────────────────────────────

function personLabel(n: number) {
  if (n === 1) return 'персоналія'
  if (n >= 2 && n <= 4) return 'персоналії'
  return 'персоналій'
}

function SectionHeader({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
        <span style={{
          fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', fontWeight: 600,
        }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function FreeLabel({ text }: { text: string }) {
  return (
    <span style={{
      fontSize: '10px', letterSpacing: '0.08em',
      color: FREE_COLOR, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: '4px',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
      {text}
    </span>
  )
}

function PassportCard({ title, value, color, icon }: {
  title: string; value: string; color: string; icon: React.ReactNode
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${color}25`,
      borderRadius: '12px', padding: '18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ color, display: 'flex' }}>{icon}</span>
        <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color, fontWeight: 600 }}>
          {title}
        </span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px', lineHeight: 1.65, margin: 0 }}>
        {value}
      </p>
    </div>
  )
}

function MatrixRow({ item, color, index }: {
  item: { key: string; val: string }; color: string; index: number
}) {
  const icons = [<GeoIcon key={0}/>, <BreakIcon key={1}/>, <CoreIcon key={2}/>, <ContractIcon key={3}/>, <ShadowIcon key={4}/>]
  return (
    <div style={{
      display: 'flex', gap: '14px', alignItems: 'flex-start',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px', padding: '16px',
    }}>
      <div style={{
        width: '30px', height: '30px', flexShrink: 0,
        borderRadius: '7px', background: `${color}10`, border: `1px solid ${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>
        {icons[index]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color, fontWeight: 600, marginBottom: '6px' }}>
          {item.key}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.65 }}>
          {item.val}
        </div>
      </div>
    </div>
  )
}

function PersonCard({ person, color, blurred }: {
  person: { initials: string; name: string; role: string; year: string; desc: string; isPremium: boolean }
  color: string; blurred: boolean
}) {
  return (
    <div style={{
      display: 'flex', gap: '14px', alignItems: 'flex-start',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', padding: '18px',
      filter: blurred ? 'blur(3px)' : 'none',
      opacity: blurred ? 0.4 : 1,
      userSelect: blurred ? 'none' : 'auto',
      pointerEvents: blurred ? 'none' : 'auto',
    }}>
      <div style={{
        width: '44px', height: '44px', flexShrink: 0,
        borderRadius: '50%', background: `${color}14`, border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', color,
      }}>
        {person.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
          <span style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>{person.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{person.year}</span>
        </div>
        <div style={{ color, fontSize: '11px', letterSpacing: '0.08em', marginBottom: '8px', textTransform: 'uppercase' }}>
          {person.role}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
          {person.desc}
        </p>
      </div>
    </div>
  )
}

// ─── icons ──────────────────────────────────────────────────────────────────

function BoltIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
}
function ShieldCrackIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9.5 14 2-4 2 2 2-4"/></svg>
}
function KeyIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
}
function PersonIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function GeoIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/></svg>
}
function BreakIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
}
function CoreIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function ContractIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function ShadowIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
}
function PhiloIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function ArtIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
}
function SciIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
}
