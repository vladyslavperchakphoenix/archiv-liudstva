'use client'

import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeNation, setActiveNation] = useState<string | null>(null)

  const NATIONS_DATA: Record<string, {
    name: string, flag: string, soul: string, soulDesc: string, color: string,
    matrix: { key: string, val: string }[]
  }> = {
    '620': {
      name: 'Португалія', flag: 'PT', soul: 'Saudade',
      soulDesc: 'Солодка туга за втраченим золотим віком', color: '#c8a84b',
      matrix: [
        { key: 'Географія', val: 'Затиснута між Іспанією та Атлантикою. Єдиний вихід — у море.' },
        { key: 'Злам', val: 'Крах імперії. Загибель армії при Алкасер-Кібірі (1578). 60 років без незалежності.' },
        { key: 'Душа', val: 'Saudade — туга за втраченим. Fado — музика прийняття долі.' },
        { key: 'Контракт', val: 'Desenrascanço — мистецтво виплутатись у хаосі через чарівність.' },
        { key: 'Тінь', val: 'Себастіанізм — пасивне очікування месії замість дії.' },
      ]
    },
    '804': {
      name: 'Україна', flag: 'UA', soul: 'Воля',
      soulDesc: 'Свобода яку береш сам і відстоюєш', color: '#ffd700',
      matrix: [
        { key: 'Географія', val: 'Відкритий степ без кордонів. Перехрестя між Заходом і Сходом.' },
        { key: 'Злам', val: 'Синусоїда: спалах свободи → знищення. Голодомор, Руїна, сучасна війна.' },
        { key: 'Душа', val: 'Воля — одночасно свобода і сила волі. Козак як архетип вільної людини.' },
        { key: 'Контракт', val: 'Горизонтальна самоорганізація. Майдан, волонтери — рій без центру.' },
        { key: 'Тінь', val: 'Отаманщина — "Де два українці, там три гетьмани".' },
      ]
    },
    '826': {
      name: 'Великобританія', flag: 'GB', soul: 'Stiff Upper Lip',
      soulDesc: 'Стриманість перед лицем катастрофи', color: '#85b7eb',
      matrix: [
        { key: 'Географія', val: 'Острів із водяним ровом. Море як автомагістраль, а не стіна.' },
        { key: 'Злам', val: 'Еволюція замість революції. Magna Carta (1215) — Закон вищий за монарха.' },
        { key: 'Душа', val: 'Stiff upper lip — стриманість. Fair play — правила важливіші за перемогу.' },
        { key: 'Контракт', val: 'Noblesse oblige — еліта зобовʼязана служити. Прагматизм над ідеологією.' },
        { key: 'Тінь', val: 'Зверхність і снобізм. Брекзит як острівне самозамикання.' },
      ]
    },
    '76': {
      name: 'Бразилія', flag: 'BR', soul: 'Jeitinho',
      soulDesc: 'Мистецтво знаходити лазівки з посмішкою', color: '#5DCAA5',
      matrix: [
        { key: 'Географія', val: 'Континент усередині континенту. Тропічна щедрість — природа як партнер.' },
        { key: 'Злам', val: 'Mestiçagem — три цивілізації в одному тиглі. Найбільше рабство у світі.' },
        { key: 'Душа', val: 'Jeitinho — обійти правило через чарівність. Alegria — радість як щит.' },
        { key: 'Контракт', val: 'Homem Cordial — серце керує розумом. Для друзів все, для ворогів — закон.' },
        { key: 'Тінь', val: '"Rouba, mas faz" — толерантність до корупції як норма.' },
      ]
    },
    '840': {
      name: 'США', flag: 'US', soul: 'Self-Made Man',
      soulDesc: 'Людина яка створила себе сама', color: '#ED937B',
      matrix: [
        { key: 'Географія', val: 'Два океани + слабші сусіди. Фронтир — безкінечний Захід як можливість.' },
        { key: 'Злам', val: 'Народилися з тексту, а не крові. Декларація незалежності як ідея нації.' },
        { key: 'Душа', val: 'Self-made man — успіх як доказ чесноти. Гроші як мірило корисності.' },
        { key: 'Контракт', val: 'Радикальний індивідуалізм. Держава — найнятий менеджер якого терплять.' },
        { key: 'Тінь', val: 'Соціальний дарвінізм — якщо не досяг, сам винен. Hustle culture.' },
      ]
    },
  }

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return

    const W = () => canvas.parentElement?.clientWidth || window.innerWidth - 220
    const H = () => canvas.parentElement?.clientHeight || window.innerHeight

    async function init() {
      const THREE = await import('three')
      const topojson = await import('topojson-client')

      const renderer = new THREE.WebGLRenderer({ canvas: canvas as HTMLCanvasElement, antialias: true })
      renderer.setSize(W(), H())
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0x04080f)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100)
      camera.position.z = 2.5

      // Зірки
      const starPos = new Float32Array(3000)
      for (let i = 0; i < 3000; i++) starPos[i] = (Math.random() - 0.5) * 80
      const starGeo = new THREE.BufferGeometry()
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
      scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.6 })))

      // Глобус
      const group = new THREE.Group()
      scene.add(group)

      const globeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshPhongMaterial({ color: 0x0a1628, shininess: 20 })
      )
      group.add(globeMesh)

      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.06, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x1155ff, transparent: true, opacity: 0.05, side: THREE.BackSide })
      ))

      scene.add(new THREE.AmbientLight(0x223366, 1.5))
      const sun = new THREE.DirectionalLight(0x99bbff, 2.5)
      sun.position.set(4, 2, 5)
      scene.add(sun)

      // Кордони
      let allFeatures: any[] = []
      try {
        const resp = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        const world = await resp.json()
        const countries = topojson.feature(world, world.objects.countries)
        allFeatures = (countries as any).features

        const NATIONS: Record<string, string> = {
          '620': '#c8a84b',
          '826': '#85b7eb',
          '76': '#5DCAA5',
          '840': '#ED937B',
        }

        const normalPos: number[] = []
        const nationLines: Record<string, number[]> = {}
        Object.keys(NATIONS).forEach(k => nationLines[k] = [])
        const ukrainePos: number[] = []

        function addRing(ring: number[][], target: number[]) {
          for (let i = 0; i < ring.length - 1; i++) {
            const pt = (lon: number, lat: number) => {
              const phi = (90 - lat) * Math.PI / 180
              const theta = (lon + 180) * Math.PI / 180
              target.push(
                -Math.sin(phi) * Math.cos(theta),
                Math.cos(phi),
                Math.sin(phi) * Math.sin(theta)
              )
            }
            pt(ring[i][0], ring[i][1])
            pt(ring[i + 1][0], ring[i + 1][1])
          }
        }

        // Всі інші країни
        allFeatures.forEach((f: any) => {
          const id = String(f.id)
          if (id === '804') return // Україну малюємо окремо
          const geo = f.geometry
          const target = NATIONS[id] ? nationLines[id] : normalPos
          const rings = geo.type === 'Polygon' ? geo.coordinates : geo.coordinates.flatMap((p: any) => p)
          rings.forEach((ring: number[][]) => addRing(ring, target))
        })

        // Україна з world-atlas (основна частина)
        allFeatures.forEach((f: any) => {
          if (String(f.id) !== '804') return
          const geo = f.geometry
          const rings = geo.type === 'Polygon' ? geo.coordinates : geo.coordinates.flatMap((p: any) => p)
          rings.forEach((ring: number[][]) => addRing(ring, ukrainePos))
        })

        // Крим — вручну вписані координати
        const crimea: number[][] = [
          [33.62, 46.17], [34.10, 46.10], [34.60, 46.05], [35.02, 45.73],
          [35.38, 45.45], [35.55, 45.31], [36.09, 45.04], [36.47, 45.05],
          [36.63, 45.35], [36.20, 45.45], [35.76, 44.82], [35.22, 44.65],
          [35.02, 44.60], [34.42, 44.55], [34.10, 44.40], [33.57, 44.41],
          [33.00, 44.50], [32.49, 44.67], [32.00, 44.90], [31.49, 45.08],
          [31.61, 45.50], [32.00, 45.70], [32.18, 45.79], [32.84, 46.18],
          [33.30, 46.20], [33.62, 46.17],
        ]
        addRing(crimea, ukrainePos)

        // Рендеримо Україну з Кримом
        if (ukrainePos.length) {
          const g = new THREE.BufferGeometry()
          g.setAttribute('position', new THREE.Float32BufferAttribute(ukrainePos, 3))
          group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: new THREE.Color('#ffd700') })))
        }

        // Звичайні кордони
        if (normalPos.length) {
          const g = new THREE.BufferGeometry()
          g.setAttribute('position', new THREE.Float32BufferAttribute(normalPos, 3))
          group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x0d2a50, transparent: true, opacity: 0.7 })))
        }

        // Підсвічені нації
        Object.entries(nationLines).forEach(([id, pos]) => {
          if (!pos.length) return
          const g = new THREE.BufferGeometry()
          g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
          group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: new THREE.Color(NATIONS[id]) })))
        })
      } catch (e) {
        console.error('Map error:', e)
      }

      // Raycaster
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      function getLatLon(e: MouseEvent) {
        const rect = canvas.getBoundingClientRect()
        mouse.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        )
        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObject(globeMesh)
        if (!hits.length) return null
        const point = group.worldToLocal(hits[0].point.clone())
        const lat = 90 - Math.acos(Math.max(-1, Math.min(1, point.y))) * 180 / Math.PI
        let theta = Math.atan2(point.z, -point.x)
        if (theta < 0) theta += 2 * Math.PI
        const lon = theta * 180 / Math.PI - 180
        return { lat, lon }
      }

      function findNation(lat: number, lon: number): string | null {
        for (const f of allFeatures) {
          const geo = f.geometry
          const rings = geo.type === 'Polygon' ? geo.coordinates : geo.coordinates.flatMap((p: any) => p)
          const inside = rings.some((ring: number[][]) => {
            let inPoly = false
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
              const xi = ring[i][0], yi = ring[i][1]
              const xj = ring[j][0], yj = ring[j][1]
              if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
                inPoly = !inPoly
              }
            }
            return inPoly
          })
          if (inside) return String(f.id)
        }
        return null
      }

      // Керування
      let isDrag = false, didDrag = false, px = 0, py = 0
      let rotX = 0.1, rotY = Math.PI / 2
      let autoRotate = true
      let autoTimer: ReturnType<typeof setTimeout>

      canvas.addEventListener('mousedown', e => {
        isDrag = true; didDrag = false
        px = e.clientX; py = e.clientY
        autoRotate = false; clearTimeout(autoTimer)
        canvas.style.cursor = 'grabbing'
      })

      window.addEventListener('mousemove', e => {
        if (!isDrag) return
        const dx = e.clientX - px, dy = e.clientY - py
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true
        rotY += dx * 0.004
        rotX += dy * 0.004
        rotX = Math.max(-1.3, Math.min(1.3, rotX))
        group.rotation.set(rotX, rotY, 0)
        px = e.clientX; py = e.clientY
      })

      window.addEventListener('mouseup', () => {
        isDrag = false
        canvas.style.cursor = 'grab'
        autoTimer = setTimeout(() => autoRotate = true, 3000)
      })

      canvas.addEventListener('click', e => {
        if (didDrag) return
        const coords = getLatLon(e)
        if (!coords) return
        const id = findNation(coords.lat, coords.lon)
        if (id) setActiveNation(id)
      })

      canvas.addEventListener('wheel', e => {
        camera.position.z = Math.max(1.5, Math.min(5, camera.position.z + e.deltaY * 0.003))
        e.preventDefault()
      }, { passive: false })

      // Touch
      let lx = 0, ly = 0
      canvas.addEventListener('touchstart', e => {
        lx = e.touches[0].clientX; ly = e.touches[0].clientY
        autoRotate = false
      }, { passive: true })
      canvas.addEventListener('touchmove', e => {
        rotY += (e.touches[0].clientX - lx) * 0.004
        rotX += (e.touches[0].clientY - ly) * 0.004
        rotX = Math.max(-1.3, Math.min(1.3, rotX))
        group.rotation.set(rotX, rotY, 0)
        lx = e.touches[0].clientX; ly = e.touches[0].clientY
        e.preventDefault()
      }, { passive: false })
      canvas.addEventListener('touchend', () => {
        autoTimer = setTimeout(() => autoRotate = true, 3000)
      }, { passive: true })

      // Resize
      const onResize = () => {
        renderer.setSize(W(), H())
        camera.aspect = W() / H()
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      // Анімація
      group.rotation.set(rotX, rotY, 0)
      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (autoRotate && !isDrag) {
          rotY += 0.0008
          group.rotation.set(rotX, rotY, 0)
        }
        renderer.render(scene, camera)
      }
      animate()
    }

    init()
    return () => cancelAnimationFrame(animId)
  }, [])

  const nation = activeNation ? NATIONS_DATA[activeNation] : null

  return (
    <>
      <div style={{ position: 'fixed', top: 0, bottom: 0, left: '220px', right: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
        />
      </div>

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '360px',
        background: 'rgba(4,8,15,0.97)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        transform: nation ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 30,
        overflowY: 'auto',
        padding: '40px 28px',
      }}>
        <button
          onClick={() => setActiveNation(null)}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%', width: '32px', height: '32px',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        {nation && (
          <>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: nation.color + '22',
              border: `1px solid ${nation.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '11px', letterSpacing: '0.1em',
              color: nation.color, fontWeight: 500,
            }}>
              {nation.flag}
            </div>
            <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 400, marginBottom: '6px' }}>
              {nation.name}
            </h1>
            <div style={{ color: nation.color, fontSize: '1rem', fontStyle: 'italic', marginBottom: '4px' }}>
              {nation.soul}
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem',
              marginBottom: '32px', paddingBottom: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {nation.soulDesc}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {nation.matrix.map((m) => (
                <div key={m.key} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px', padding: '14px',
                }}>
                  <div style={{
                    fontSize: '10px', letterSpacing: '0.15em',
                    textTransform: 'uppercase', marginBottom: '6px',
                    color: nation.color, opacity: 0.8,
                  }}>
                    {m.key}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.6 }}>
                    {m.val}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}