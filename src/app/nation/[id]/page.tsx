'use client'

import { use, useState, useEffect, useRef } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NATIONS_DATA, type InfluenceLink } from '@/lib/nations'
import { getUserPlan } from '@/lib/supabase/getPlan'
import { createClient } from '@/lib/supabase/client'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

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

function renderBlock(block: any, nationColor: string, isPremium: boolean) {
  const content = (
    <div key={block.id} style={{ marginBottom: 28 }}>
      {block.title && (
        <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>
          {block.title}
        </p>
      )}

      {block.content_type === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {block.data.items.map((item: any, i: number) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 300, color: nationColor, marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      )}

      {block.content_type === 'chart_line' && (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={block.data.series}>
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0d1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: 'white' }} />
            {block.data.annotations?.map((a: any) => (
              <ReferenceLine key={a.x} x={a.x} stroke={a.color} strokeDasharray="4 4" label={{ value: a.label, fill: a.color, fontSize: 9 }} />
            ))}
            <Line type="monotone" dataKey="value" stroke={block.data.color || nationColor} strokeWidth={2} dot={{ fill: block.data.color || nationColor, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {block.content_type === 'chart_bar' && (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={block.data.series}>
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0d1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
            <Bar dataKey="value" fill={block.data.color || nationColor} opacity={0.8} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {block.content_type === 'list' && (
        <div>
          {block.data.items.map((item: any, i: number) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.name}</span>
                <span style={{ fontSize: 13, color: item.color || block.data.color || nationColor, fontWeight: 500 }}>{item.value}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                <div style={{ width: `${item.value}%`, height: '100%', background: item.color || block.data.color || nationColor, borderRadius: 2, opacity: 0.8 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {block.content_type === 'text' && block.data?.paragraphs && (
        <div>
          {block.data.paragraphs.map((p: any, i: number) => (
            <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < block.data.paragraphs.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: nationColor, marginBottom: 6 }}>{p.question}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{p.answer}</p>
            </div>
          ))}
        </div>
      )}

      {block.content_type === 'text' && block.body && (
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{block.body}</p>
      )}

      {block.content_type === 'timeline' && (
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.1)' }} />
          {block.data.events.map((event: any, i: number) => (
            <div key={i} style={{ position: 'relative', marginBottom: 24 }}>
              <div style={{ position: 'absolute', left: -21, top: 4, width: 10, height: 10, borderRadius: '50%', background: nationColor, border: '2px solid #04080f' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: nationColor, fontWeight: 500, flexShrink: 0 }}>{event.year}</span>
                <span style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>{event.title}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{event.desc}</p>
            </div>
          ))}
        </div>
      )}

      {block.content_type === 'influence_map' && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {block.data.nodes.map((node: any) => (
              <div key={node.id} style={{
                padding: '6px 14px', borderRadius: 20,
                border: `1px solid ${node.color}`,
                background: `${node.color}15`,
                fontSize: 12, color: node.color,
              }}>
                {node.name} · {node.year}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {block.data.links.map((link: any, i: number) => {
              const from = block.data.nodes.find((n: any) => n.id === link.from)
              const to   = block.data.nodes.find((n: any) => n.id === link.to)
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 13, color: from?.color || nationColor }}>{from?.name}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>→</span>
                  <span style={{ fontSize: 13, color: to?.color || nationColor }}>{to?.name}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>{link.desc}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  if (block.is_premium && !isPremium) {
    return (
      <div key={block.id} style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{ opacity: 0.15, pointerEvents: 'none', userSelect: 'none' }}>
          {content}
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(4,8,15,0.7)', borderRadius: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>🔒 Premium</span>
        </div>
      </div>
    )
  }

  return content
}


export default function NationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isMobile, setIsMobile]     = useState(false)
  const [userPlan, setUserPlan]     = useState<'free' | 'premium'>('free')
  const [activeTab, setActiveTab]   = useState('overview')
  const [tabContent, setTabContent] = useState<any[]>([])

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
    const loadTabContent = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('nation_tabs')
        .select('*')
        .eq('nation_id', id)
        .eq('tab_id', activeTab)
        .order('sort_order')
      if (data) setTabContent(data)
    }
    loadTabContent()
  }, [id, activeTab])

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

  const tabsRef    = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX     = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current     = e.pageX - (tabsRef.current?.offsetLeft || 0)
    scrollLeft.current = tabsRef.current?.scrollLeft || 0
    if (tabsRef.current) tabsRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x    = e.pageX - (tabsRef.current?.offsetLeft || 0)
    const walk = (x - startX.current) * 1.5
    if (tabsRef.current) tabsRef.current.scrollLeft = scrollLeft.current - walk
  }
  const onMouseUp = () => {
    isDragging.current = false
    if (tabsRef.current) tabsRef.current.style.cursor = 'grab'
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
            <style>{`
              .tabs-container::-webkit-scrollbar { display: none; }
              .tabs-container { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div
              ref={tabsRef}
              className="tabs-container"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'scroll',
                WebkitOverflowScrolling: 'touch',
                padding: '24px 0 8px',
                marginBottom: '32px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                cursor: 'grab',
              }}
            >
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
                  onClick={() => handleTabClick(tab.id)}
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
                    <div key={m.key} style={{ opacity: isPremium ? 1 : 0.25, pointerEvents: isPremium ? 'auto' : 'none' }}>
                      <MatrixRow item={m} color={c} index={i + 3} />
                    </div>
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
                            opacity: isPremium ? 1 : 0.22,
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
              {tabContent.length > 0 ? (
                <div>
                  {tabContent.map(block => renderBlock(block, c, isPremium))}
                  {!isPremium && tabContent.some((b: any) => b.is_premium) && (
                    <div style={{ border: `1px solid ${c}33`, borderRadius: 12, padding: 24, textAlign: 'center', marginTop: 8 }}>
                      <p style={{ fontSize: 15, fontWeight: 500, color: 'white', marginBottom: 8 }}>Повний економічний аналіз</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20, lineHeight: 1.6 }}>Графіки динаміки · Структура · Архетип аналіз</p>
                      <Link href="/profile" style={{ display: 'block', background: c, color: '#04080f', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>
                        Розблокувати Premium →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
                  Економічні дані скоро з'являться
                </div>
              )}
              <CrossLinks currentId={id} activeTab={activeTab} color={c} />
            </section>
          )}

          {/* ── КОНТЕНТ ВКЛАДОК ───────────────────────────────────────── */}
          {(['philosophy', 'music', 'art', 'science', 'conflicts', 'memes'] as const).map(tabId => {
            if (activeTab !== tabId) return null
            return (
              <section key={tabId} style={{ paddingBottom: '40px' }}>
                {tabContent.length > 0 ? (
                  <div>
                    {tabContent.map(block => renderBlock(block, c, isPremium))}
                    {!isPremium && tabContent.some((b: any) => b.is_premium) && (
                      <div style={{ border: `1px solid ${c}33`, borderRadius: 12, padding: 24, textAlign: 'center', marginTop: 8 }}>
                        <p style={{ fontSize: 15, fontWeight: 500, color: 'white', marginBottom: 8 }}>Повний архів</p>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20, lineHeight: 1.6 }}>Відкрийте повний доступ до всіх розділів</p>
                        <Link href="/profile" style={{ display: 'block', background: c, color: '#04080f', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, textAlign: 'center', textDecoration: 'none' }}>
                          Розблокувати Premium →
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '60px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
                    Контент для цієї вкладки скоро з'явиться
                  </div>
                )}
                <CrossLinks currentId={id} activeTab={activeTab} color={c} />
              </section>
            )
          })}

        </div>
      </div>
    </>
  )
}

// ─── TabContent helpers (defined before TabContent for webpack HMR) ───────────

type RichTabItem = {
  name: string
  dates?: string
  tag?: string
  core?: string
  quote?: string
  quoteSource?: string
  desc: string
  context?: string
  isPremium: boolean
}

function InfluenceTimelineSVG({
  items,
  links,
  color,
}: {
  items: RichTabItem[]
  links: InfluenceLink[]
  color: string
}) {
  const SPACING = 68
  const PAD_TOP = 28
  const W = 280
  const nodeX = 12
  const arcOriginX = 146

  const sorted = [...items].sort((a, b) => {
    const yA = parseInt(a.dates?.split('–')[0] ?? '9999')
    const yB = parseInt(b.dates?.split('–')[0] ?? '9999')
    return yA - yB
  })

  const H = PAD_TOP + (sorted.length - 1) * SPACING + 44

  const getY = (name: string) => {
    const idx = sorted.findIndex(p => p.name === name)
    return idx >= 0 ? PAD_TOP + idx * SPACING : -1
  }

  const preparedLinks = links
    .map(l => ({ ...l, fy: getY(l.from), ty: getY(l.to) }))
    .filter(l => l.fy >= 0 && l.ty >= 0)

  const laneRanges: Array<[number, number][]> = []
  const linkLanes = new Map<string, number>()

  const bySpan = [...preparedLinks].sort((a, b) =>
    Math.abs(a.ty - a.fy) - Math.abs(b.ty - b.fy)
  )
  for (const link of bySpan) {
    const key = `${link.from}→${link.to}`
    const lo = Math.min(link.fy, link.ty)
    const hi = Math.max(link.fy, link.ty)
    let lane = 0
    while (lane < 10) {
      if (!laneRanges[lane]) { laneRanges[lane] = []; break }
      const conflict = laneRanges[lane].some(([a, b]) => !(hi < a || lo > b))
      if (!conflict) break
      lane++
    }
    if (!laneRanges[lane]) laneRanges[lane] = []
    laneRanges[lane].push([lo, hi])
    linkLanes.set(key, lane)
  }

  const getBend = (lane: number) => 24 + lane * 24

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={nodeX} y1={PAD_TOP - 14} x2={nodeX} y2={H - 22}
        stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

      {sorted.map((item, i) => {
        const y = PAD_TOP + i * SPACING
        const dim = item.isPremium
        return (
          <g key={item.name}>
            <circle cx={nodeX} cy={y} r={5} fill={dim ? `${color}44` : color} />
            <text x={nodeX + 15} y={y + 5}
              fill={dim ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.88)'}
              fontSize={11.5} fontWeight={dim ? '400' : '500'}>
              {item.name.split(' ').pop()}
            </text>
            {item.dates && (
              <text x={nodeX + 15} y={y + 14} fill="rgba(255,255,255,0.22)" fontSize={8}>
                {item.dates}
              </text>
            )}
            {item.tag && (
              <text x={nodeX + 15} y={y + 26}
                fill={dim ? `${color}44` : `${color}90`}
                fontSize={7.5} fontStyle="italic">
                {item.tag}
              </text>
            )}
          </g>
        )
      })}

      {preparedLinks.map(link => {
        const key = `${link.from}→${link.to}`
        const lane = linkLanes.get(key) ?? 0
        const bend = getBend(lane)
        const { fy, ty, type } = link
        const maxX = arcOriginX + bend
        const arcColor =
          type === 'mutual'   ? '#ED937B' :
          type === 'indirect' ? `${color}55` : color
        const dashArray = type === 'indirect' ? '4 3' : undefined
        const d = `M ${arcOriginX} ${fy} C ${maxX} ${fy} ${maxX} ${ty} ${arcOriginX} ${ty}`
        const aSize = 5
        return (
          <g key={key} opacity={0.8}>
            <path d={d} fill="none" stroke={arcColor} strokeWidth={1.5} strokeDasharray={dashArray} />
            {type !== 'mutual' && (
              <polygon
                points={`${arcOriginX},${ty} ${arcOriginX + aSize},${ty - aSize / 2} ${arcOriginX + aSize},${ty + aSize / 2}`}
                fill={arcColor}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

function PhilosophyInfluenceMap({
  items,
  influenceMap,
  color,
}: {
  items: RichTabItem[]
  influenceMap: { links: InfluenceLink[]; insight: string }
  color: string
}) {
  const { links, insight } = influenceMap
  const directCount   = links.filter(l => l.type === 'direct').length
  const indirectCount = links.filter(l => l.type === 'indirect').length
  const mutualCount   = links.filter(l => l.type === 'mutual').length

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 3, height: 18, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
          Карта впливів
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
        {[
          { val: items.length, label: 'мислителів' },
          { val: links.length, label: "зв'язків" },
          { val: `${directCount} / ${indirectCount} / ${mutualCount}`, label: 'прям · непр · взаєм', small: true },
        ].map(({ val, label, small }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '13px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: small ? 13 : 22, fontWeight: 600, color, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {val}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', marginTop: 4, textTransform: 'uppercase' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '20px 16px', marginBottom: 16,
      }}>
        <InfluenceTimelineSVG items={items} links={links} color={color} />
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { label: 'Прямий вплив', clr: color },
            { label: 'Непрямий',     clr: `${color}55` },
            { label: 'Взаємний',     clr: '#ED937B' },
          ].map(({ label, clr }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 2, background: clr, borderRadius: 1 }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: `${color}0a`, border: `1px solid ${color}28`,
        borderRadius: 12, padding: '16px 18px',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color, fontWeight: 700, marginBottom: 8 }}>
          Ключовий інсайт
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', lineHeight: 1.7 }}>
          {insight}
        </div>
      </div>
    </div>
  )
}

function TabItemCard({
  item, index, color, blurred,
}: {
  item: RichTabItem
  index: number
  color: string
  blurred: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      onClick={() => !blurred && setOpen(o => !o)}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${open && !blurred ? color + '40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '12px', padding: '16px',
        opacity: blurred ? 0.5 : 1,
        cursor: blurred ? 'default' : 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{
          width: '28px', height: '28px', flexShrink: 0,
          borderRadius: '7px', background: `${color}12`,
          border: `1px solid ${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color,
        }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{item.name}</span>
            {item.dates && (
              <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px' }}>{item.dates}</span>
            )}
          </div>
          {item.tag && (
            <span style={{
              display: 'inline-block',
              padding: '2px 9px', borderRadius: '100px',
              border: `1px solid ${color}35`, background: `${color}0d`,
              fontSize: '10px', letterSpacing: '0.06em', color,
              marginBottom: item.core ? '6px' : '0',
            }}>
              {item.tag}
            </span>
          )}
          {item.core && (
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', fontStyle: 'italic', marginTop: '4px' }}>
              {item.core}
            </div>
          )}
        </div>
        {!blurred && (
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.3)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              flexShrink: 0, marginTop: '7px',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        )}
      </div>

      {open && !blurred && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.65 }}>
            {item.desc}
          </div>
          {item.quote && (
            <div style={{ margin: '16px 0', paddingLeft: '14px', borderLeft: `2px solid ${color}60` }}>
              <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '6px' }}>
                «{item.quote}»
              </div>
              {item.quoteSource && (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>— {item.quoteSource}</div>
              )}
            </div>
          )}
          {item.context && (
            <div style={{
              marginTop: '14px', padding: '14px 16px',
              background: `${color}0d`, border: `1px solid ${color}25`,
              borderRadius: '8px',
            }}>
              <div style={{
                fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                color, fontWeight: 700, marginBottom: '8px',
              }}>
                Через призму архетипу
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.65 }}>
                {item.context}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── TabContent ───────────────────────────────────────────────────────────────

function TabContent({
  data,
  isPremiumUser,
  nationColor,
}: {
  data: { intro: string; items: RichTabItem[]; influenceMap?: { links: InfluenceLink[]; insight: string } } | undefined
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

      {data.influenceMap && (
        <PhilosophyInfluenceMap
          items={data.items}
          influenceMap={data.influenceMap}
          color={nationColor}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {freeItems.map((item, i) => (
          <TabItemCard key={item.name} item={item} index={i} color={nationColor} blurred={false} />
        ))}
        {premiumItems.map((item, i) => (
          <TabItemCard
            key={item.name}
            item={item}
            index={freeItems.length + i}
            color={nationColor}
            blurred={!isPremiumUser}
          />
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

// ─── EconomicsTab ────────────────────────────────────────────────────────────

type EconData = NonNullable<(typeof NATIONS_DATA)[string]['economics']>

type DataPoint = { year: number; value: number }

function SimpleLineChart({ data, color, height = 160, refLines }: {
  data: DataPoint[]
  color: string
  height?: number
  refLines?: { x: number; label: string; stroke: string }[]
}) {
  const W = 280, H = height
  const pad = { t: 10, r: 10, b: 26, l: 38 }
  const cW = W - pad.l - pad.r
  const cH = H - pad.t - pad.b
  const vals = data.map(d => d.value)
  const mn = Math.min(...vals), mx = Math.max(...vals)
  const rng = mx - mn || 1
  const px = (i: number) => pad.l + (i / (data.length - 1)) * cW
  const py = (v: number) => H - pad.b - ((v - mn) / rng) * cH
  const pts = data.map((d, i) => `${px(i)},${py(d.value)}`).join(' ')
  const step = Math.ceil(data.length / 5)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block', maxWidth: '100%' }}>
      {[0, 0.5, 1].map(t => (
        <line key={t} x1={pad.l} y1={H - pad.b - t * cH} x2={W - pad.r} y2={H - pad.b - t * cH}
          stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      ))}
      {refLines?.map(rl => {
        const idx = data.findIndex(d => d.year === rl.x)
        if (idx < 0) return null
        const rx = px(idx)
        return (
          <g key={rl.x}>
            <line x1={rx} y1={pad.t} x2={rx} y2={H - pad.b} stroke={rl.stroke} strokeWidth={1} strokeDasharray="3 3" />
            <text x={rx + 3} y={pad.t + 9} fill={rl.stroke} fontSize={8}>{rl.label}</text>
          </g>
        )
      })}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={px(i)} cy={py(d.value)} r={3} fill={color} />
      ))}
      {data.map((d, i) => (
        (i % step === 0 || i === data.length - 1)
          ? <text key={i} x={px(i)} y={H - 7} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={8}>{d.year}</text>
          : null
      ))}
      {[0, 0.5, 1].map(t => (
        <text key={t} x={pad.l - 4} y={H - pad.b - t * cH + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={8}>
          {Math.round(mn + t * rng)}
        </text>
      ))}
    </svg>
  )
}

function SimpleBarChart({ data, color, height = 140 }: {
  data: DataPoint[]
  color: string
  height?: number
}) {
  const W = 280, H = height
  const pad = { t: 5, r: 5, b: 26, l: 38 }
  const cW = W - pad.l - pad.r
  const cH = H - pad.t - pad.b
  const mx = Math.max(...data.map(d => d.value))
  const slot = cW / data.length
  const bW = slot * 0.65

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block', maxWidth: '100%' }}>
      {[0, 0.5, 1].map(t => (
        <line key={t} x1={pad.l} y1={H - pad.b - t * cH} x2={W - pad.r} y2={H - pad.b - t * cH}
          stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const bH = Math.max((d.value / mx) * cH, 2)
        const bx = pad.l + i * slot + (slot - bW) / 2
        const by = H - pad.b - bH
        return (
          <g key={i}>
            <rect x={bx} y={by} width={bW} height={bH} fill={color} opacity={0.8} rx={2} />
            <text x={bx + bW / 2} y={H - 7} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={8}>{d.year}</text>
          </g>
        )
      })}
      {[0, 0.5, 1].map(t => (
        <text key={t} x={pad.l - 4} y={H - pad.b - t * cH + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={8}>
          {Math.round(mx * t)}
        </text>
      ))}
    </svg>
  )
}


function MetricCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '18px 16px',
    }}>
      <div style={{ fontSize: 22, fontWeight: 600, color, letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 6 }}>
        {value}{unit.startsWith('/') || unit.startsWith('І') ? '' : ' '}{unit}
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  )
}

function EconomicsTab({ econ, color, isPremium, isMobile }: {
  econ: EconData; color: string; isPremium: boolean; isMobile: boolean; nationId: string
}) {
  const gdpFree = econ.gdpHistory.filter(d => d.year >= 2020)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* FREE: 3 метрики */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              Ключові показники
            </span>
          </div>
          <FreeLabel text="Безкоштовно" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: 10 }}>
          <MetricCard label="ВВП" value={econ.gdp.value} unit={econ.gdp.unit} color={color} />
          <MetricCard label="Населення" value={econ.population.value} unit={econ.population.unit} color={color} />
          <MetricCard label="Індекс щастя" value={econ.happinessRank.value} unit={econ.happinessRank.unit} color={color} />
        </div>
      </div>

      {/* FREE: ВВП 2020–2023 */}
      <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 16px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, margin: '0 0 12px' }}>
          ВВП динаміка (млрд $) · 2020–2023
        </p>
        <SimpleLineChart data={gdpFree} color={color} height={160} />
      </div>

      {/* FREE: перше питання архетипу */}
      <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            Економіка через архетип
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color, marginBottom: 6 }}>{econ.archetypeAnalysis[0].question}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{econ.archetypeAnalysis[0].answer}</div>
      </div>

      {/* PREMIUM: весь інший контент */}
      {isPremium ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 4 premium метрики */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 10 }}>
            <MetricCard label="ВВП на особу" value={econ.gdpPerCapita.value} unit={econ.gdpPerCapita.unit} color={color} />
            <MetricCard label="Корупція" value={econ.corruptionIndex.value} unit={econ.corruptionIndex.unit} color={color} />
            <MetricCard label={econ.humanDevelopment.unit} value={econ.humanDevelopment.value} unit="" color={color} />
            <MetricCard label="Діаспора" value={econ.diaspora.value} unit={econ.diaspora.unit} color={color} />
          </div>

          {/* ВВП 2014–2023 */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 16px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, margin: '0 0 12px' }}>
              ВВП повна динаміка (млрд $) · 2014–2023
            </p>
            <SimpleLineChart data={econ.gdpHistory} color={color} height={180}
              refLines={[
                { x: 2014, label: 'Майдан', stroke: 'rgba(255,200,0,0.6)' },
                { x: 2022, label: 'Вторгнення', stroke: 'rgba(255,100,100,0.7)' },
              ]}
            />
          </div>

          {/* Мінімальна зарплата */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 16px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, margin: '0 0 12px' }}>
              Мінімальна зарплата ($/міс)
            </p>
            <SimpleBarChart data={econ.minWageHistory} color={color} height={140} />
          </div>

          {/* Інфляція */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 16px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, margin: '0 0 12px' }}>
              Інфляція (%)
            </p>
            <SimpleLineChart data={econ.inflationHistory} color="#ED937B" height={140} />
          </div>

          {/* Безробіття */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 16px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, margin: '0 0 12px' }}>
              Безробіття (%)
            </p>
            <SimpleBarChart data={econ.unemploymentHistory} color="#ED937B" height={140} />
          </div>

          {/* Структура економіки */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, margin: '0 0 16px' }}>
              Структура економіки
            </p>
            {econ.economicSectors.map(s => (
              <div key={s.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{s.name}</span>
                  <span style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.value}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
                  <div style={{ width: `${s.value}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Топ-5 експорту */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600, margin: '0 0 16px' }}>
              Топ-5 експортних товарів
            </p>
            {econ.topExports.map(e => (
              <div key={e.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{e.name}</span>
                  <span style={{ fontSize: 13, color, fontWeight: 600 }}>{e.percent}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
                  <div style={{ width: `${e.percent}%`, height: '100%', background: color, borderRadius: 3, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Решта питань архетипу */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                Економіка через архетип
              </span>
            </div>
            {econ.archetypeAnalysis.slice(1).map((item, i) => (
              <div
                key={i}
                style={{
                  paddingBottom: i < econ.archetypeAnalysis.length - 2 ? 16 : 0,
                  marginBottom: i < econ.archetypeAnalysis.length - 2 ? 16 : 0,
                  borderBottom: i < econ.archetypeAnalysis.length - 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color, marginBottom: 6 }}>{item.question}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{item.answer}</div>
              </div>
            ))}
          </div>

      </div>
      ) : (
        <div style={{
          border: `1px solid ${color}33`, borderRadius: 12,
          padding: 24, textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'white', marginBottom: 8 }}>Premium контент</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20, lineHeight: 1.6 }}>
            Графіки динаміки · Структура · Архетип аналіз
          </div>
          <Link href="/profile" style={{
            display: 'inline-block', background: color, color: '#04080f',
            padding: '10px 24px', borderRadius: 8,
            fontSize: 13, fontWeight: 500, textDecoration: 'none',
          }}>
            Розблокувати Premium →
          </Link>
        </div>
      )}

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
      opacity: blurred ? 0.28 : 1,
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
