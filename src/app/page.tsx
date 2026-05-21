'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { NATIONS_DATA } from '@/lib/nations-data'

const COUNTRY_NAMES: Record<string, string> = {
  '4': 'Афганістан', '8': 'Албанія', '12': 'Алжир', '20': 'Андорра',
  '24': 'Ангола', '31': 'Азербайджан', '32': 'Аргентина', '36': 'Австралія',
  '40': 'Австрія', '50': 'Бангладеш', '51': 'Вірменія', '56': 'Бельгія',
  '64': 'Бутан', '68': 'Болівія', '70': 'Боснія і Герцеговина', '72': 'Ботсвана',
  '84': 'Беліз', '100': 'Болгарія', '104': "М'янма", '108': 'Бурунді',
  '116': 'Камбоджа', '120': 'Камерун', '124': 'Канада', '140': 'ЦАР',
  '144': 'Шрі-Ланка', '152': 'Чилі', '156': 'Китай', '170': 'Колумбія',
  '178': 'Конго', '180': 'ДР Конго', '188': 'Коста-Ріка', '191': 'Хорватія',
  '192': 'Куба', '196': 'Кіпр', '203': 'Чехія', '204': 'Бенін',
  '208': 'Данія', '214': 'Домініканська Республіка', '218': 'Еквадор',
  '222': 'Сальвадор', '231': 'Ефіопія', '232': 'Еритрея', '233': 'Естонія',
  '246': 'Фінляндія', '250': 'Франція', '266': 'Габон', '268': 'Грузія',
  '276': 'Німеччина', '288': 'Гана', '300': 'Греція', '320': 'Гватемала',
  '324': 'Гвінея', '328': 'Гаяна', '332': 'Гаїті', '340': 'Гондурас',
  '348': 'Угорщина', '356': 'Індія', '360': 'Індонезія', '364': 'Іран',
  '368': 'Ірак', '372': 'Ірландія', '376': 'Ізраїль', '380': 'Італія',
  '384': "Кот-д'Івуар", '398': 'Казахстан', '400': 'Йорданія', '404': 'Кенія',
  '408': 'Північна Корея', '410': 'Південна Корея', '414': 'Кувейт',
  '417': 'Киргизстан', '418': 'Лаос', '422': 'Ліван', '428': 'Латвія',
  '430': 'Ліберія', '434': 'Лівія', '440': 'Литва', '442': 'Люксембург',
  '450': 'Мадагаскар', '454': 'Малаві', '458': 'Малайзія', '466': 'Малі',
  '478': 'Мавританія', '484': 'Мексика', '496': 'Монголія', '498': 'Молдова',
  '504': 'Марокко', '508': 'Мозамбік', '516': 'Намібія', '524': 'Непал',
  '528': 'Нідерланди', '554': 'Нова Зеландія', '558': 'Нікарагуа',
  '562': 'Нігер', '566': 'Нігерія', '578': 'Норвегія', '586': 'Пакистан',
  '591': 'Панама', '598': 'Папуа Нова Гвінея', '600': 'Парагвай',
  '604': 'Перу', '608': 'Філіппіни', '616': 'Польща', '634': 'Катар',
  '642': 'Румунія', '643': 'Росія', '646': 'Руанда', '682': 'Саудівська Аравія',
  '686': 'Сенегал', '688': 'Сербія', '703': 'Словаччина', '705': 'Словенія',
  '706': 'Сомалі', '710': 'Південна Африка', '716': 'Зімбабве',
  '724': 'Іспанія', '728': 'Південний Судан', '729': 'Судан',
  '740': 'Суринам', '748': 'Есватіні', '752': 'Швеція', '756': 'Швейцарія',
  '760': 'Сирія', '762': 'Таджикистан', '764': 'Таїланд', '768': 'Того',
  '780': 'Тринідад і Тобаго', '788': 'Туніс', '792': 'Туреччина',
  '800': 'Уганда', '818': 'Єгипет', '834': 'Танзанія', '854': 'Буркіна-Фасо',
  '858': 'Уругвай', '860': 'Узбекистан', '862': 'Венесуела',
  '887': 'Ємен', '894': 'Замбія', '704': "В'єтнам",
}

type Tooltip = { x: number; y: number; id: string } | null

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeNation, setActiveNation] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<Tooltip>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return

    const W = () => (canvas as HTMLCanvasElement).clientWidth || window.innerWidth
    const H = () => (canvas as HTMLCanvasElement).clientHeight || window.innerHeight

    const cleanups: (() => void)[] = []

    async function init() {
      const THREE = await import('three')
      const topojson = await import('topojson-client')

      const renderer = new THREE.WebGLRenderer({ canvas: canvas as HTMLCanvasElement, antialias: true })
      renderer.setSize(W(), H())
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0x000005)
      renderer.shadowMap.enabled = false

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100)
      const mobile = window.innerWidth < 768
      camera.position.z = mobile ? 3.2 : 2.2

      // ── ЗІРКИ (6000) — різні розміри у пікселях ─────────────────────────
      ;[
        { count: 3500, size: 1.0, opacity: 0.75 },
        { count: 1500, size: 1.5, opacity: 0.55 },
        { count: 700,  size: 2.0, opacity: 0.40 },
        { count: 270,  size: 2.8, opacity: 0.28 },
        { count: 30,   size: 4.0, opacity: 0.90 },
      ].forEach(({ count, size, opacity }) => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 120
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
          color: 0xffffff, size, transparent: true, opacity, sizeAttenuation: false,
        })))
      })

      // ── ТУМАННІСТЬ ────────────────────────────────────────────────────────
      ;[
        { color: 0x2255aa, count: 180, spread: 40, ox: 28,  oy: 14,  oz: -60 },
        { color: 0x8822aa, count: 120, spread: 30, ox: -30, oy: -8,  oz: -70 },
        { color: 0x1188aa, count: 140, spread: 35, ox: 10,  oy: -18, oz: -55 },
      ].forEach(({ color, count, spread, ox, oy, oz }) => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          pos[i * 3]     = ox + (Math.random() - 0.5) * spread
          pos[i * 3 + 1] = oy + (Math.random() - 0.5) * spread
          pos[i * 3 + 2] = oz + (Math.random() - 0.5) * spread
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
          color, size: 1.6, transparent: true, opacity: 0.25, sizeAttenuation: false,
        })))
      })

      // ── ОСВІТЛЕННЯ (NASA-стиль) ───────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x111133, 0.4))
      const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.8)
      sunLight.position.set(5, 2, 4)
      scene.add(sunLight)
      scene.add(new THREE.HemisphereLight(0x0033aa, 0x000000, 0.3))

      // ── ГЛОБУС ────────────────────────────────────────────────────────────
      const group = new THREE.Group()
      scene.add(group)

      const globeGeo = new THREE.SphereGeometry(1, 64, 64)
      const globeMat = new THREE.MeshStandardMaterial({
        color: 0x1a3a6e,
        roughness: 0.7,
        metalness: 0.0,
      })
      const globeMesh = new THREE.Mesh(globeGeo, globeMat)
      group.add(globeMesh)

      // Fresnel атмосфера — синє світіння по краях
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.08, 32, 32),
        new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.1, 0.4, 1.0, 1.0) * intensity;
            }
          `,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          transparent: true,
          depthWrite: false,
        })
      ))

      // ── ТЕКСТУРИ (NASA r128, каскад URL) ─────────────────────────────────
      const loader = new THREE.TextureLoader()

      const earthUrls = [
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
      ]

      let textureLoaded = false
      let textureTimeoutId: ReturnType<typeof setTimeout>
      let cloudMesh: THREE.Mesh | null = null

      const applyTexture = (tex: THREE.Texture) => {
        textureLoaded = true
        clearTimeout(textureTimeoutId)
        const mat = globeMesh.material as THREE.MeshStandardMaterial
        mat.map = tex
        mat.color.set(0xffffff)
        mat.needsUpdate = true
      }

      // Якщо всі текстури провалились — залишаємо синій базовий колір
      const onTextureFail = () => {
        if (textureLoaded) return
        const mat = globeMesh.material as THREE.MeshStandardMaterial
        mat.color.set(0x0a1628)
        mat.needsUpdate = true
      }

      const tryLoadTexture = (i: number) => {
        if (i >= earthUrls.length) { onTextureFail(); return }
        loader.load(earthUrls[i], applyTexture, undefined, () => tryLoadTexture(i + 1))
      }
      tryLoadTexture(0)

      textureTimeoutId = setTimeout(onTextureFail, 5000)
      cleanups.push(() => clearTimeout(textureTimeoutId))

      // Normal map (рельєф суші)
      loader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_normal_2048.jpg',
        (normalTex) => {
          const mat = globeMesh.material as THREE.MeshStandardMaterial
          mat.normalMap = normalTex
          mat.normalScale = new THREE.Vector2(0.6, 0.6)
          mat.needsUpdate = true
        },
        undefined, () => {}
      )

      // Specular → roughnessMap (океан блищить)
      loader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_specular_2048.jpg',
        (specTex) => {
          const mat = globeMesh.material as THREE.MeshStandardMaterial
          mat.roughnessMap = specTex
          mat.needsUpdate = true
        },
        undefined, () => {}
      )

      // Хмари
      loader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_clouds_1024.png',
        (cloudTex) => {
          cloudMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.005, 64, 64),
            new THREE.MeshPhongMaterial({
              map: cloudTex,
              transparent: true,
              opacity: 0.35,
              depthWrite: false,
            })
          )
          group.add(cloudMesh)
        },
        undefined, () => {}
      )

      // ── МІСЯЦЬ ────────────────────────────────────────────────────────────
      const moonOrbit = new THREE.Group()
      scene.add(moonOrbit)
      const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 24, 24),
        new THREE.MeshPhongMaterial({ color: 0x999999, shininess: 3 })
      )
      moonMesh.position.set(2.0, 0.18, 0)
      moonOrbit.add(moonMesh)

      // Маленький shine на місяці
      const moonLight = new THREE.PointLight(0xaaaacc, 0.15, 3)
      moonLight.position.set(2.0, 0.18, 0)
      moonOrbit.add(moonLight)

      // ── КОРДОНИ ───────────────────────────────────────────────────────────
      const NATION_COLORS: Record<string, string> = {}
      Object.entries(NATIONS_DATA).forEach(([id, n]) => { NATION_COLORS[id] = n.color })

      let allFeatures: any[] = []
      const countryBorders = new Map<string, THREE.LineSegments>()

      function addRing(ring: number[][], target: number[]) {
        for (let i = 0; i < ring.length - 1; i++) {
          const latLonToXyz = (lon: number, lat: number) => {
            const phi   = (90 - lat) * Math.PI / 180
            const theta = (lon + 180) * Math.PI / 180
            target.push(
              -Math.sin(phi) * Math.cos(theta),
               Math.cos(phi),
               Math.sin(phi) * Math.sin(theta)
            )
          }
          latLonToXyz(ring[i][0], ring[i][1])
          latLonToXyz(ring[i + 1][0], ring[i + 1][1])
        }
      }

      const crimea: number[][] = [
        [33.62, 46.17], [34.10, 46.10], [34.60, 46.05], [35.02, 45.73],
        [35.38, 45.45], [35.55, 45.31], [36.09, 45.04], [36.47, 45.05],
        [36.63, 45.35], [36.20, 45.45], [35.76, 44.82], [35.22, 44.65],
        [35.02, 44.60], [34.42, 44.55], [34.10, 44.40], [33.57, 44.41],
        [33.00, 44.50], [32.49, 44.67], [32.00, 44.90], [31.49, 45.08],
        [31.61, 45.50], [32.00, 45.70], [32.18, 45.79], [32.84, 46.18],
        [33.30, 46.20], [33.62, 46.17],
      ]

      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(r => r.json())
        .then(world => {
          const countries = topojson.feature(world, world.objects.countries)
          allFeatures = (countries as any).features

          for (const f of allFeatures) {
            const id  = String(f.id)
            const pos: number[] = []
            const geo  = f.geometry
            const rings = geo.type === 'Polygon'
              ? geo.coordinates
              : geo.coordinates.flatMap((p: any) => p)
            rings.forEach((ring: number[][]) => addRing(ring, pos))
            if (id === '804') addRing(crimea, pos)
            if (!pos.length) continue

            const color = NATION_COLORS[id]
              ? new THREE.Color(NATION_COLORS[id])
              : new THREE.Color(0xffffff)
            const bufGeo = new THREE.BufferGeometry()
            bufGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
            const mat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 })
            const lines = new THREE.LineSegments(bufGeo, mat)
            lines.visible = false
            lines.renderOrder = 1
            group.add(lines)
            countryBorders.set(id, lines)
          }
        })
        .catch(e => console.error('Map error:', e))

      // ── RAYCASTER ─────────────────────────────────────────────────────────
      const raycaster = new THREE.Raycaster()
      const mouse     = new THREE.Vector2()
      let hoveredId: string | null = null

      function getLatLon(clientX: number, clientY: number) {
        const rect = (canvas as HTMLCanvasElement).getBoundingClientRect()
        mouse.set(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          -((clientY - rect.top)  / rect.height) * 2 + 1
        )
        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObject(globeMesh)
        if (!hits.length) return null
        const point = group.worldToLocal(hits[0].point.clone())
        const lat = 90 - Math.acos(Math.max(-1, Math.min(1, point.y))) * 180 / Math.PI
        let theta = Math.atan2(point.z, -point.x)
        if (theta < 0) theta += 2 * Math.PI
        return { lat, lon: theta * 180 / Math.PI - 180 }
      }

      function findNation(lat: number, lon: number): string | null {
        for (const f of allFeatures) {
          const geo   = f.geometry
          const rings = geo.type === 'Polygon'
            ? geo.coordinates
            : geo.coordinates.flatMap((p: any) => p)
          const inside = rings.some((ring: number[][]) => {
            let inPoly = false
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
              const xi = ring[i][0], yi = ring[i][1]
              const xj = ring[j][0], yj = ring[j][1]
              if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
                inPoly = !inPoly
            }
            return inPoly
          })
          if (inside) return String(f.id)
        }
        return null
      }

      function showBorder(id: string | null) {
        if (hoveredId === id) return
        if (hoveredId) {
          const prev = countryBorders.get(hoveredId)
          if (prev) { (prev.material as THREE.LineBasicMaterial).opacity = 0; prev.visible = false }
        }
        hoveredId = id
        if (id) {
          const lines = countryBorders.get(id)
          if (lines) { lines.visible = true; (lines.material as THREE.LineBasicMaterial).opacity = 0.85 }
        }
      }

      // ── УПРАВЛІННЯ (drag / zoom / touch) ──────────────────────────────────
      let isDrag = false, didDrag = false, px = 0, py = 0
      let rotX = 0.1, rotY = Math.PI / 2
      let autoRotate = true
      let autoTimer: ReturnType<typeof setTimeout>

      const onMouseDown = (e: MouseEvent) => {
        isDrag = true; didDrag = false
        px = e.clientX; py = e.clientY
        autoRotate = false; clearTimeout(autoTimer)
        canvas!.style.cursor = 'grabbing'
      }
      canvas!.addEventListener('mousedown', onMouseDown)
      cleanups.push(() => canvas!.removeEventListener('mousedown', onMouseDown))

      const onMouseMove = (e: MouseEvent) => {
        if (isDrag) {
          const dx = e.clientX - px, dy = e.clientY - py
          if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true
          rotY += dx * 0.004; rotX += dy * 0.004
          rotX = Math.max(-1.3, Math.min(1.3, rotX))
          group.rotation.set(rotX, rotY, 0)
          px = e.clientX; py = e.clientY
          return
        }
        const coords = getLatLon(e.clientX, e.clientY)
        if (!coords) {
          showBorder(null); setTooltip(null)
          canvas!.style.cursor = 'grab'; return
        }
        const id = findNation(coords.lat, coords.lon)
        showBorder(id)
        if (id) {
          setTooltip({ x: e.clientX, y: e.clientY, id })
          canvas!.style.cursor = NATIONS_DATA[id] ? 'pointer' : 'default'
        } else {
          setTooltip(null); canvas!.style.cursor = 'grab'
        }
      }
      window.addEventListener('mousemove', onMouseMove)
      cleanups.push(() => window.removeEventListener('mousemove', onMouseMove))

      const onMouseUp = () => {
        isDrag = false
        canvas!.style.cursor = 'grab'
        autoTimer = setTimeout(() => { autoRotate = true }, 3000)
      }
      window.addEventListener('mouseup', onMouseUp)
      cleanups.push(() => window.removeEventListener('mouseup', onMouseUp))

      const onMouseLeave = () => { showBorder(null); setTooltip(null) }
      canvas!.addEventListener('mouseleave', onMouseLeave)
      cleanups.push(() => canvas!.removeEventListener('mouseleave', onMouseLeave))

      const onClick = (e: MouseEvent) => {
        if (didDrag) return
        const coords = getLatLon(e.clientX, e.clientY)
        if (!coords) return
        const id = findNation(coords.lat, coords.lon)
        if (id) setActiveNation(id)
      }
      canvas!.addEventListener('click', onClick)
      cleanups.push(() => canvas!.removeEventListener('click', onClick))

      const onWheel = (e: WheelEvent) => {
        const isMob = window.innerWidth < 768
        camera.position.z = Math.max(isMob ? 2.5 : 1.5, Math.min(isMob ? 5.0 : 4.0, camera.position.z + e.deltaY * 0.003))
        e.preventDefault()
      }
      canvas!.addEventListener('wheel', onWheel, { passive: false })
      cleanups.push(() => canvas!.removeEventListener('wheel', onWheel))

      // Touch
      let lx = 0, ly = 0
      const onTouchStart = (e: TouchEvent) => {
        lx = e.touches[0].clientX; ly = e.touches[0].clientY; autoRotate = false
      }
      const onTouchMove = (e: TouchEvent) => {
        rotY += (e.touches[0].clientX - lx) * 0.004
        rotX += (e.touches[0].clientY - ly) * 0.004
        rotX = Math.max(-1.3, Math.min(1.3, rotX))
        group.rotation.set(rotX, rotY, 0)
        lx = e.touches[0].clientX; ly = e.touches[0].clientY
        e.preventDefault()
      }
      const onTouchEnd = () => { autoTimer = setTimeout(() => { autoRotate = true }, 3000) }
      canvas!.addEventListener('touchstart', onTouchStart, { passive: true })
      canvas!.addEventListener('touchmove',  onTouchMove,  { passive: false })
      canvas!.addEventListener('touchend',   onTouchEnd,   { passive: true })

      // Resize
      const onResize = () => {
        renderer.setSize(W(), H())
        camera.aspect = W() / H()
        camera.updateProjectionMatrix()
        const isMob = window.innerWidth < 768
        if (camera.position.z < (isMob ? 2.5 : 1.5)) camera.position.z = isMob ? 2.5 : 1.5
        if (camera.position.z > (isMob ? 5.0 : 4.0)) camera.position.z = isMob ? 5.0 : 4.0
      }
      window.addEventListener('resize', onResize)
      cleanups.push(() => window.removeEventListener('resize', onResize))

      // ── АНІМАЦІЯ ──────────────────────────────────────────────────────────
      group.rotation.set(rotX, rotY, 0)
      let moonAngle = 0

      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (autoRotate && !isDrag) {
          rotY += 0.0005
          group.rotation.set(rotX, rotY, 0)
        }
        if (cloudMesh) cloudMesh.rotation.y += 0.0002
        moonAngle += 0.001
        moonOrbit.rotation.y = moonAngle
        moonOrbit.rotation.x = Math.sin(moonAngle * 0.4) * 0.12
        renderer.render(scene, camera)
      }
      animate()
    }

    init()
    return () => {
      cancelAnimationFrame(animId)
      cleanups.forEach(fn => fn())
    }
  }, [])

  const nation       = activeNation ? NATIONS_DATA[activeNation] : null
  const tooltipNation = tooltip ? NATIONS_DATA[tooltip.id] : null
  const tooltipName   = tooltip
    ? (tooltipNation?.name || COUNTRY_NAMES[tooltip.id] || null)
    : null

  return (
    <>
      {/* ── CANVAS ── */}
      <div style={{ position: 'fixed', top: 0, bottom: 0, left: isMobile ? 0 : 220, right: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
        />
      </div>

      {/* ── TOOLTIP ── */}
      {tooltip && tooltipName && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 18,
            top:  tooltip.y - 56,
            pointerEvents: 'none',
            zIndex: 20,
            background: 'rgba(4,8,15,0.92)',
            border: `1px solid ${tooltipNation ? tooltipNation.color + '45' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '8px',
            padding: '8px 14px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: tooltipNation
              ? `0 0 16px ${tooltipNation.color}22`
              : '0 4px 16px rgba(0,0,0,0.5)',
            transition: 'opacity 0.1s',
          }}
        >
          <div style={{ color: 'white', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {tooltipName}
          </div>
          {tooltipNation && (
            <div style={{
              color: tooltipNation.color,
              fontSize: '11px', fontStyle: 'italic', marginTop: '2px', whiteSpace: 'nowrap',
            }}>
              {tooltipNation.soul}
            </div>
          )}
        </div>
      )}

      {/* ── ПАНЕЛЬ НАЦІЇ ── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(360px, 100vw)',
        background: 'rgba(4,8,15,0.97)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        transform: nation ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 30, overflowY: 'auto',
        padding: '40px 28px 100px',
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

        {nation && activeNation && (
          <>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: nation.color + '22',
              border: `1px solid ${nation.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '11px', letterSpacing: '0.1em',
              color: nation.color, fontWeight: 600,
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
              marginBottom: '20px', paddingBottom: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {nation.soulDesc}
            </div>

            {/* Link to full nation page */}
            <Link href={`/nation/${activeNation}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '11px 16px', marginBottom: '24px',
              border: `1px solid ${nation.color}40`,
              borderRadius: '8px',
              background: nation.color + '12',
              color: nation.color, fontSize: '13px', fontWeight: 600,
              letterSpacing: '0.04em', textDecoration: 'none',
            }}>
              Відкрити повний архетип
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>

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
