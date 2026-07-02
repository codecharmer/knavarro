'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Instagram, Mail, ArrowRight, ArrowUpRight, Plus, ChevronLeft, ChevronRight,
  MapPin, CalendarDays,
} from 'lucide-react'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'

/* ----------------------------- Assets ----------------------------- */
const ASSET = {
  reel: 'https://customer-assets.emergentagent.com/job_d68fb341-f28a-40bd-8ebc-5bb4f8729f65/artifacts/sbt482g5_performing%20reel.mp4',
  portrait: 'https://customer-assets.emergentagent.com/job_d68fb341-f28a-40bd-8ebc-5bb4f8729f65/artifacts/abalx8cf_Foto%20para%20semblanza%20Foro%20Koala%20.jpg',
  portrait2: 'https://customer-assets.emergentagent.com/job_d68fb341-f28a-40bd-8ebc-5bb4f8729f65/artifacts/j7r5vh01_FOTO%20PARA%20SEMBLANZA%202%20.jpg',
  p1: 'https://customer-assets.emergentagent.com/job_continuum-practice/artifacts/zdrmxdiz_123316255_3706762409342703_4365931987362005251_o%202.jpg',
  p2: 'https://customer-assets.emergentagent.com/job_continuum-practice/artifacts/5oz64w7k_122544436_3691961257489485_273637466979156333_o.jpg',
  p3: 'https://customer-assets.emergentagent.com/job_continuum-practice/artifacts/07mnznrs_951a80_859f7e305728460388c0601214fa6ee8%202.jpg',
  p4: 'https://customer-assets.emergentagent.com/job_continuum-practice/artifacts/g5ierjq5_18%27%27%27%27%27%27%27%27%202.JPG',
}

const IMG = {
  dance1: 'https://images.pexels.com/photos/19629386/pexels-photo-19629386.jpeg',
  dance2: 'https://images.pexels.com/photos/29046700/pexels-photo-29046700.jpeg',
  dance3: 'https://images.pexels.com/photos/5135102/pexels-photo-5135102.jpeg',
  dance4: 'https://images.unsplash.com/photo-1611216109227-7715b501698b',
  water1: 'https://images.pexels.com/photos/7505924/pexels-photo-7505924.jpeg',
  water2: 'https://images.pexels.com/photos/36618428/pexels-photo-36618428.jpeg',
  water3: 'https://images.pexels.com/photos/36282791/pexels-photo-36282791.jpeg',
  water4: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77',
  water5: 'https://images.unsplash.com/photo-1584968153986-3f5fe523b044',
}

/* ----------------------------- Content ----------------------------- */
const SECTIONS = ['home', 'about', 'continuum', 'performances', 'workshops', 'gallery', 'journal', 'contact']

const T = {
  en: {
    nav: { home: 'Home', about: 'About', continuum: 'Estado Trófico', performances: 'Performances', workshops: 'Workshops', gallery: 'Gallery', journal: 'Journal', contact: 'Contact' },
    hero: {
      title: 'Move from within.',
      subtitle: 'Contemporary dance, choreography, and the Continuum movement practice — exploring breath, fluidity, perception, and embodied awareness.',
      cta1: 'Explore the Work',
      cta2: 'Upcoming Workshops',
      scroll: 'Scroll',
    },
    philosophy: {
      kicker: 'Philosophy',
      title: 'Movement as inquiry, not performance.',
      paragraphs: [
        'I approach movement as a form of inquiry — a way of asking questions that language cannot hold. Each gesture begins as a question addressed to the body and to the space around it.',
        'Beneath choreography lies a fluid intelligence: the body as water, responsive and porous, listening through tissue, breath, and sound. Perception becomes the material; curiosity becomes the method.',
        'Here, breath is not technique but conversation. Sound is not accompaniment but sensation. Awareness is not a destination but the texture of being present.',
      ],
      quote: 'I am less interested in how movement looks than in what it knows.',
    },
    about: {
      kicker: 'About',
      title: 'Kenia Navarro',
      role: 'Dancer · Choreographer · Movement Researcher',
      bio: [
        'Kenia Navarro is a contemporary dance artist, choreographer and movement researcher based in Cuernavaca, Mexico, with eighteen years of professional practice. Her work moves between the stage, the studio, and the field of somatic research.',
        'She danced for eleven years with Cía Fóramen M (2010–2023), co-directed the collective engrama (2013–2019), and has trained internationally — with the Iceland Dance Company, Deltebre Dansa in Spain, and within the lineage of contact improvisation and contemporary technique across México, Brazil, Costa Rica, Guatemala and New York.',
        'Trained as an environmental technology engineer, she bridges scientific thought with creative movement, conceiving art as a space for inquiry, ecological attention, and dialogue. She teaches within the Continuum movement network and directs Foro Koala.',
      ],
      statementTitle: 'Artistic statement',
      statement: 'I make work to study perception — to find out what the body understands before it explains. Choreography, for me, is a way of organizing attention so that something unrepeatable can occur.',
      trainingTitle: 'Selected training',
      training: [
        { y: '2025', t: 'Iceland Dance Company — Reykjavík' },
        { y: '2024–25', t: 'YYDC · Foco Technique — New York' },
        { y: '2022', t: 'Deltebre Dansa — Spain' },
        { y: '2019', t: 'Continuum pedagogical encounters — CDMX' },
        { y: '2013', t: 'Contact Improvisation — Jovair Longo' },
        { y: '2012', t: 'La métaphore du corps — Jean-Sébastien Lourdais' },
      ],
      awardsTitle: 'Distinctions',
      awards: [
        'PECDA Morelos 2018 — CENTRÍFUGA',
        'First place, choreography — Festival “Con los pies en el aire”',
        'Selected — Alleyne Dance Company mentorship (2024)',
      ],
    },
    continuum: {
      kicker: 'The Practice',
      title: 'What is Continuum?',
      intro: 'Continuum is an experiential movement practice originated by Emilie Conrad. It is an invitation to sense the body as a fluid, living process — an exploration rather than a method, a way of listening rather than a technique to master.',
      concepts: [
        { t: 'Breath', b: 'Breath is the first movement. Through sustained, sounding breath we soften the boundaries of the body and let attention travel inward, where motion begins long before it becomes visible.' },
        { t: 'Sound', b: 'Tone and resonance become tactile. Sound moves through tissue as sensation, dissolving habitual holding and opening unexpected pathways of motion.' },
        { t: 'Fluid movement', b: 'We sense the body as primarily fluid — wave, spiral, and undulation arising from within rather than imposed from outside. Form becomes a temporary gathering of flow.' },
        { t: 'Embodiment', b: 'Attention returns to lived sensation. We inhabit the body as experience rather than image, presence rather than shape.' },
        { t: 'Sensory awareness', b: 'Perception is refined and slowed. Small, micro-movements reveal a landscape of sensation usually hidden beneath everyday speed.' },
        { t: 'Improvisation & creativity', b: 'Without choreography to follow, the body discovers its own intelligence. Novelty emerges — not invented, but allowed.' },
        { t: 'Nervous system & regulation', b: 'Slowness and curiosity invite a quieter physiology. Many describe a deep sense of spaciousness and ease — explored here as experience, never as treatment.' },
      ],
      note: 'Presented as artistic and experiential research. Continuum is offered as an exploration, not as therapy or medical treatment.',
    },
    performances: {
      kicker: 'Work',
      title: 'Performances & Projects',
      intro: 'Choreographic works, performances, collaborations and research — developed across México and on international stages.',
      role: 'Role',
      items: [
        { t: 'Libre de Futuro', y: '2024–2025', r: 'Choreography & direction', d: 'A choreographic study on time, freedom, and the weight of what has not yet happened.', img: ASSET.p4 },
        { t: 'Fantasía Plástica', y: '2022–2025', r: 'Choreography', d: 'An evolving piece on material, body and ecology — with an accompanying version created for young audiences.', img: ASSET.p2 },
        { t: 'La Consagración de la Primavera', y: '2023', r: 'Performer · dir. Beatriz Madrid', d: 'A contemporary reading of Stravinsky’s rite, performed as part of an ensemble work.', img: ASSET.p1 },
        { t: 'El Nido', y: '2022', r: 'Choreography', d: 'Shelter, fragility and gathering — an intimate architecture built from bodies and breath.', img: ASSET.p3 },
        { t: 'La Metodología del Amor', y: '2021', r: 'Choreography', d: 'A research project examining tenderness as a structuring force in movement.', img: ASSET.portrait2 },
        { t: 'Paisajes de la Realidad', y: '2019', r: 'Choreography', d: 'Landscapes of perception — where the seen and the sensed continually exchange places.', img: IMG.water3 },
      ],
    },
    workshops: {
      kicker: 'Encounters',
      title: 'Workshops',
      intro: 'Special workshops and artistic encounters in Continuum and contemporary movement. These are immersive events rather than recurring classes.',
      register: 'Register',
      items: [
        { t: 'Estado Trófico — A Continuum Laboratory', loc: 'Cuernavaca, México', date: 'October 2025', d: 'A three-day immersion into breath, sound and fluid movement, tracing the body as a living, nourishing process.' },
        { t: 'Fluid Intelligence', loc: 'Mazatlán, México', date: 'November 2025', d: 'A weekend laboratory exploring wave and spiral as sources of choreographic material and perceptual research.' },
        { t: 'Breath · Sound · Awareness', loc: 'Bogotá, Colombia', date: 'February 2026', d: 'An intensive on sounding breath and sensory listening, developed within the PISO MÓVIL network.' },
      ],
    },
    gallery: { kicker: 'Images', title: 'Gallery', caption: 'Selected images from performance and research' },
    testimonials: {
      kicker: 'Voices',
      title: 'Testimonials',
      items: [
        { q: 'Kenia works at the threshold where dance becomes research. Her presence reorganizes the attention of an entire room.', a: 'Collaborating choreographer', r: 'Cía Fóramen M' },
        { q: 'A workshop with her is less a class than an invitation to remember that the body thinks. I left changed in how I listen.', a: 'Workshop participant', r: 'Continuum encounter, CDMX' },
        { q: 'Rare clarity and rigor. Her work belongs to the conversation of contemporary movement, not to wellness.', a: 'Festival curator', r: 'Independent arts programme' },
      ],
    },
    journal: {
      kicker: 'Journal',
      title: 'Notes & Reflections',
      readMore: 'Read',
      items: [
        { date: 'May 2025', t: 'On the body as water', e: 'Notes toward a choreography that begins not with shape but with flow — and what it asks of a dancer to trust it.' },
        { date: 'March 2025', t: 'Listening before moving', e: 'A reflection on sensory awareness and the long pause that precedes any honest gesture.' },
        { date: 'January 2025', t: 'Continuum and contemporary practice', e: 'How an experiential movement practice reshapes the way I make and teach choreography.' },
      ],
    },
    contact: {
      kicker: 'Connect',
      title: 'Get in touch',
      intro: 'For performances, collaborations, commissions, workshops and bookings.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send message',
      sending: 'Sending…',
      success: 'Thank you. Your message has been received.',
      error: 'Something went wrong. Please try again.',
      reach: 'Reach directly',
      newsletterTitle: 'Newsletter',
      newsletterText: 'Occasional notes on performances, workshops and movement research.',
      newsletterPlaceholder: 'Your email',
      subscribe: 'Subscribe',
      subSuccess: 'You are subscribed. Thank you.',
      subAlready: 'You are already subscribed.',
    },
    footer: {
      tagline: 'Contemporary dance · choreography · Continuum movement practice.',
      rights: 'All rights reserved.',
      crafted: 'Move from within.',
    },
    langLabel: 'Language',
  },

  es: {
    nav: { home: 'Inicio', about: 'Perfil', continuum: 'Estado Trófico', performances: 'Obra', workshops: 'Talleres', gallery: 'Galería', journal: 'Diario', contact: 'Contacto' },
    hero: {
      title: 'Moverse desde adentro.',
      subtitle: 'Danza contemporánea, coreografía y la práctica de movimiento Continuum — explorando la respiración, la fluidez, la percepción y la conciencia encarnada.',
      cta1: 'Explorar la obra',
      cta2: 'Próximos talleres',
      scroll: 'Desliza',
    },
    philosophy: {
      kicker: 'Filosofía',
      title: 'El movimiento como indagación, no como espectáculo.',
      paragraphs: [
        'Abordo el movimiento como una forma de indagación — una manera de hacer preguntas que el lenguaje no puede contener. Cada gesto comienza como una pregunta dirigida al cuerpo y al espacio que lo rodea.',
        'Bajo la coreografía habita una inteligencia fluida: el cuerpo como agua, sensible y poroso, escuchando a través del tejido, la respiración y el sonido. La percepción se vuelve materia; la curiosidad, método.',
        'Aquí la respiración no es técnica sino conversación. El sonido no es acompañamiento sino sensación. La conciencia no es un destino sino la textura de estar presente.',
      ],
      quote: 'Me interesa menos cómo se ve el movimiento que lo que el movimiento sabe.',
    },
    about: {
      kicker: 'Perfil',
      title: 'Kenia Navarro',
      role: 'Bailarina · Coreógrafa · Investigadora del movimiento',
      bio: [
        'Kenia Navarro es artista de danza contemporánea, coreógrafa e investigadora del movimiento, radicada en Cuernavaca, México, con dieciocho años de práctica profesional. Su trabajo transita entre el escenario, el estudio y la investigación somática.',
        'Bailó durante once años en Cía Fóramen M (2010–2023), codirigió el colectivo engrama (2013–2019) y se ha formado internacionalmente — con la Iceland Dance Company, Deltebre Dansa en España, y dentro del linaje de la improvisación de contacto y la técnica contemporánea en México, Brasil, Costa Rica, Guatemala y Nueva York.',
        'Formada como ingeniera en tecnología ambiental, tiende un puente entre el pensamiento científico y el movimiento creativo, concibiendo el arte como espacio de indagación, atención ecológica y diálogo. Es maestra dentro de la red de movimiento Continuum y dirige Foro Koala.',
      ],
      statementTitle: 'Declaración artística',
      statement: 'Creo para estudiar la percepción — para descubrir qué comprende el cuerpo antes de explicarlo. La coreografía, para mí, es una forma de organizar la atención para que ocurra algo irrepetible.',
      trainingTitle: 'Formación seleccionada',
      training: [
        { y: '2025', t: 'Iceland Dance Company — Reikiavik' },
        { y: '2024–25', t: 'YYDC · Técnica Foco — Nueva York' },
        { y: '2022', t: 'Deltebre Dansa — España' },
        { y: '2019', t: 'Encuentros pedagógicos Continuum — CDMX' },
        { y: '2013', t: 'Improvisación de contacto — Jovair Longo' },
        { y: '2012', t: 'La métaphore du corps — Jean-Sébastien Lourdais' },
      ],
      awardsTitle: 'Distinciones',
      awards: [
        'PECDA Morelos 2018 — CENTRÍFUGA',
        'Primer lugar de coreografía — Festival “Con los pies en el aire”',
        'Seleccionada — mentoría Alleyne Dance Company (2024)',
      ],
    },
    continuum: {
      kicker: 'La práctica',
      title: '¿Qué es Continuum?',
      intro: 'Continuum es una práctica de movimiento experiencial originada por Emilie Conrad. Es una invitación a sentir el cuerpo como un proceso fluido y vivo — una exploración más que un método, una forma de escuchar más que una técnica que dominar.',
      concepts: [
        { t: 'Respiración', b: 'La respiración es el primer movimiento. A través de una respiración sostenida y sonora suavizamos los límites del cuerpo y dejamos que la atención viaje hacia adentro, donde el movimiento comienza mucho antes de hacerse visible.' },
        { t: 'Sonido', b: 'El tono y la resonancia se vuelven táctiles. El sonido recorre el tejido como sensación, disolviendo tensiones habituales y abriendo trayectos inesperados de movimiento.' },
        { t: 'Movimiento fluido', b: 'Sentimos el cuerpo como esencialmente fluido — onda, espiral y ondulación que surgen desde adentro en lugar de imponerse desde afuera. La forma es una reunión temporal del flujo.' },
        { t: 'Encarnación', b: 'La atención regresa a la sensación vivida. Habitamos el cuerpo como experiencia y no como imagen, como presencia y no como figura.' },
        { t: 'Conciencia sensorial', b: 'La percepción se afina y se ralentiza. Pequeños micromovimientos revelan un paisaje de sensaciones habitualmente oculto bajo la velocidad cotidiana.' },
        { t: 'Improvisación y creatividad', b: 'Sin coreografía que seguir, el cuerpo descubre su propia inteligencia. Lo nuevo emerge — no inventado, sino permitido.' },
        { t: 'Sistema nervioso y regulación', b: 'La lentitud y la curiosidad invitan a una fisiología más serena. Muchas personas describen una sensación profunda de espacio y soltura — explorada aquí como experiencia, nunca como tratamiento.' },
      ],
      note: 'Presentado como investigación artística y experiencial. Continuum se ofrece como exploración, no como terapia ni tratamiento médico.',
    },
    performances: {
      kicker: 'Obra',
      title: 'Obra & Proyectos',
      intro: 'Trabajos coreográficos, interpretaciones, colaboraciones e investigación — desarrollados en México y en escenarios internacionales.',
      role: 'Rol',
      items: [
        { t: 'Libre de Futuro', y: '2024–2025', r: 'Coreografía y dirección', d: 'Un estudio coreográfico sobre el tiempo, la libertad y el peso de lo que aún no ha sucedido.', img: ASSET.p4 },
        { t: 'Fantasía Plástica', y: '2022–2025', r: 'Coreografía', d: 'Una pieza en evolución sobre materia, cuerpo y ecología — con una versión creada para públicos infantiles.', img: ASSET.p2 },
        { t: 'La Consagración de la Primavera', y: '2023', r: 'Intérprete · dir. Beatriz Madrid', d: 'Una lectura contemporánea del rito de Stravinsky, interpretada como parte de una obra de conjunto.', img: ASSET.p1 },
        { t: 'El Nido', y: '2022', r: 'Coreografía', d: 'Refugio, fragilidad y reunión — una arquitectura íntima construida con cuerpos y respiración.', img: ASSET.p3 },
        { t: 'La Metodología del Amor', y: '2021', r: 'Coreografía', d: 'Un proyecto de investigación sobre la ternura como fuerza que estructura el movimiento.', img: ASSET.portrait2 },
        { t: 'Paisajes de la Realidad', y: '2019', r: 'Coreografía', d: 'Paisajes de la percepción — donde lo visto y lo sentido intercambian continuamente su lugar.', img: IMG.water3 },
      ],
    },
    workshops: {
      kicker: 'Encuentros',
      title: 'Talleres',
      intro: 'Talleres especiales y encuentros artísticos en Continuum y movimiento contemporáneo. Son eventos inmersivos, no clases recurrentes.',
      register: 'Inscribirse',
      items: [
        { t: 'Estado Trófico — Un laboratorio Continuum', loc: 'Cuernavaca, México', date: 'Octubre 2025', d: 'Una inmersión de tres días en la respiración, el sonido y el movimiento fluido, siguiendo al cuerpo como proceso vivo y nutricio.' },
        { t: 'Inteligencia Fluida', loc: 'Mazatlán, México', date: 'Noviembre 2025', d: 'Un laboratorio de fin de semana que explora la onda y la espiral como fuentes de material coreográfico e investigación perceptiva.' },
        { t: 'Respiración · Sonido · Conciencia', loc: 'Bogotá, Colombia', date: 'Febrero 2026', d: 'Un intensivo sobre la respiración sonora y la escucha sensorial, desarrollado dentro de la red PISO MÓVIL.' },
      ],
    },
    gallery: { kicker: 'Imágenes', title: 'Galería', caption: 'Imágenes seleccionadas de obra e investigación' },
    testimonials: {
      kicker: 'Voces',
      title: 'Testimonios',
      items: [
        { q: 'Kenia trabaja en el umbral donde la danza se vuelve investigación. Su presencia reorganiza la atención de toda una sala.', a: 'Coreógrafa colaboradora', r: 'Cía Fóramen M' },
        { q: 'Un taller con ella es menos una clase que una invitación a recordar que el cuerpo piensa. Salí transformada en mi manera de escuchar.', a: 'Participante de taller', r: 'Encuentro Continuum, CDMX' },
        { q: 'Una claridad y un rigor poco comunes. Su obra pertenece a la conversación del movimiento contemporáneo, no al wellness.', a: 'Curador de festival', r: 'Programa artístico independiente' },
      ],
    },
    journal: {
      kicker: 'Diario',
      title: 'Notas y Reflexiones',
      readMore: 'Leer',
      items: [
        { date: 'Mayo 2025', t: 'Sobre el cuerpo como agua', e: 'Apuntes hacia una coreografía que comienza no con la forma sino con el flujo — y lo que le pide a quien danza confiar en él.' },
        { date: 'Marzo 2025', t: 'Escuchar antes de moverse', e: 'Una reflexión sobre la conciencia sensorial y la larga pausa que precede a todo gesto honesto.' },
        { date: 'Enero 2025', t: 'Continuum y práctica contemporánea', e: 'Cómo una práctica de movimiento experiencial transforma mi manera de crear y enseñar coreografía.' },
      ],
    },
    contact: {
      kicker: 'Conectar',
      title: 'Ponte en contacto',
      intro: 'Para funciones, colaboraciones, encargos, talleres y contrataciones.',
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
      send: 'Enviar mensaje',
      sending: 'Enviando…',
      success: 'Gracias. Tu mensaje ha sido recibido.',
      error: 'Algo salió mal. Inténtalo de nuevo.',
      reach: 'Contacto directo',
      newsletterTitle: 'Boletín',
      newsletterText: 'Notas ocasionales sobre funciones, talleres e investigación del movimiento.',
      newsletterPlaceholder: 'Tu correo',
      subscribe: 'Suscribirse',
      subSuccess: 'Te has suscrito. Gracias.',
      subAlready: 'Ya estás suscrito.',
    },
    footer: {
      tagline: 'Danza contemporánea · coreografía · práctica de movimiento Continuum.',
      rights: 'Todos los derechos reservados.',
      crafted: 'Moverse desde adentro.',
    },
    langLabel: 'Idioma',
  },
}

const GALLERY = [
  { src: ASSET.p4 }, { src: ASSET.p1 }, { src: ASSET.portrait2 },
  { src: ASSET.p2 }, { src: ASSET.p3 }, { src: ASSET.portrait },
]

/* ----------------------------- Helpers ----------------------------- */
const EASE = [0.16, 1, 0.3, 1]

function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function Kicker({ children }) {
  return (
    <span className="inline-block text-[11px] uppercase tracking-editorial text-brand-teal mb-5">
      {children}
    </span>
  )
}

/* ----------------------------- Page ----------------------------- */
export default function App() {
  const reduced = useReducedMotion()
  const [lang, setLang] = useState('es')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [lightbox, setLightbox] = useState(null) // index or null
  const t = T[lang]

  // language init from URL / storage
  useEffect(() => {
    let initial = 'es'
    try {
      const params = new URLSearchParams(window.location.search)
      const urlLang = params.get('lang')
      const stored = localStorage.getItem('kn_lang')
      if (urlLang === 'es' || urlLang === 'en') initial = urlLang
      else if (stored === 'es' || stored === 'en') initial = stored
    } catch (e) {}
    setLang(initial)
  }, [])

  useEffect(() => {
    try {
      document.documentElement.lang = lang
      localStorage.setItem('kn_lang', lang)
      const url = new URL(window.location.href)
      url.searchParams.set('lang', lang)
      window.history.replaceState({}, '', url)
    } catch (e) {}
  }, [lang])

  // scroll state + active section
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      let current = 'home'
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = useCallback((id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [reduced])

  // lightbox nav
  const closeLb = useCallback(() => setLightbox(null), [])
  const nextLb = useCallback(() => setLightbox((i) => (i === null ? null : (i + 1) % GALLERY.length)), [])
  const prevLb = useCallback(() => setLightbox((i) => (i === null ? null : (i - 1 + GALLERY.length) % GALLERY.length)), [])
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLb()
      if (e.key === 'ArrowRight') nextLb()
      if (e.key === 'ArrowLeft') prevLb()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, closeLb, nextLb, prevLb])

  return (
    <div className="bg-brand-white text-brand-charcoal antialiased overflow-x-hidden">
      <Nav t={t} lang={lang} setLang={setLang} scrolled={scrolled} active={active}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen} goTo={goTo} />

      <Hero t={t} goTo={goTo} reduced={reduced} />
      <Philosophy t={t} reduced={reduced} />
      <About t={t} />
      <Continuum t={t} />
      <Performances t={t} />
      <Workshops t={t} goTo={goTo} />
      <Gallery t={t} openLb={setLightbox} />
      <Testimonials t={t} />
      <Journal t={t} />
      <Contact t={t} lang={lang} />
      <Footer t={t} lang={lang} setLang={setLang} goTo={goTo} />

      <Lightbox index={lightbox} onClose={closeLb} onNext={nextLb} onPrev={prevLb} t={t} />
    </div>
  )
}

/* ----------------------------- Navigation ----------------------------- */
function LangSwitch({ lang, setLang, dark }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] tracking-widest ${dark ? 'text-brand-white/80' : ''}`}>
      <button
        onClick={() => setLang('en')}
        aria-label="English"
        className={`transition-colors ${lang === 'en' ? 'text-brand-teal' : 'opacity-60 hover:opacity-100'}`}
      >EN</button>
      <span className="opacity-30">|</span>
      <button
        onClick={() => setLang('es')}
        aria-label="Español"
        className={`transition-colors ${lang === 'es' ? 'text-brand-teal' : 'opacity-60 hover:opacity-100'}`}
      >ES</button>
    </div>
  )
}

function Nav({ t, lang, setLang, scrolled, active, menuOpen, setMenuOpen, goTo }) {
  const solid = scrolled || menuOpen
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          solid ? 'bg-brand-white/90 backdrop-blur-md border-b border-brand-charcoal/10 py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="container flex items-center justify-between">
          <button
            onClick={() => goTo('home')}
            className={`font-serif text-xl md:text-2xl tracking-wide transition-colors ${solid ? 'text-brand-charcoal' : 'text-brand-white'}`}
          >
            Kenia&nbsp;Navarro
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {SECTIONS.filter((s) => s !== 'home').map((s) => (
              <button
                key={s}
                onClick={() => goTo(s)}
                className={`text-[12px] uppercase tracking-widest transition-colors ${
                  solid ? 'text-brand-charcoal/70 hover:text-brand-charcoal' : 'text-brand-white/80 hover:text-brand-white'
                } ${active === s ? '!text-brand-teal' : ''}`}
              >
                {t.nav[s]}
              </button>
            ))}
            <span className={`h-4 w-px ${solid ? 'bg-brand-charcoal/20' : 'bg-brand-white/30'}`} />
            <div className={solid ? 'text-brand-charcoal' : 'text-brand-white'}>
              <LangSwitch lang={lang} setLang={setLang} dark={!solid} />
            </div>
          </nav>

          <div className="flex items-center gap-5 lg:hidden">
            <div className={solid ? 'text-brand-charcoal' : 'text-brand-white'}>
              <LangSwitch lang={lang} setLang={setLang} dark={!solid} />
            </div>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className={solid ? 'text-brand-charcoal' : 'text-brand-white'}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-white lg:hidden flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => goTo(s)}
                  className="text-left font-serif text-4xl text-brand-charcoal py-2 hover:text-brand-teal transition-colors"
                >
                  {t.nav[s]}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ----------------------------- Hero ----------------------------- */
function Hero({ t, goTo, reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = reduced ? '0%' : yRaw

  return (
    <section id="home" ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay muted loop playsInline preload="auto"
          poster={IMG.water4}
        >
          <source src={ASSET.reel} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-oceandeep/55 via-brand-oceandeep/25 to-brand-oceandeep/75" />
        <div className="absolute inset-0 bg-brand-ink/20" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-center container">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
          className="max-w-4xl"
        >
          <span className="block text-[11px] uppercase tracking-editorial text-brand-sand/90 mb-7">
            Contemporary Dance · Continuum · Movement Research
          </span>
          <h1 className="font-serif text-brand-white text-6xl md:text-8xl lg:text-[8.5rem] leading-[0.92] font-light">
            {t.hero.title}
          </h1>
          <p className="mt-8 max-w-2xl text-brand-white/85 text-lg md:text-xl font-light leading-relaxed text-pretty">
            {t.hero.subtitle}
          </p>
          <div className="mt-11 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => goTo('performances')}
              className="group inline-flex items-center justify-center gap-3 bg-brand-white text-brand-charcoal px-8 py-4 text-[12px] uppercase tracking-widest hover:bg-brand-teal hover:text-brand-white transition-colors duration-500"
            >
              {t.hero.cta1}
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => goTo('workshops')}
              className="inline-flex items-center justify-center gap-3 border border-brand-white/50 text-brand-white px-8 py-4 text-[12px] uppercase tracking-widest hover:bg-brand-white/10 hover:border-brand-white transition-colors duration-500"
            >
              {t.hero.cta2}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {!reduced && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-editorial text-brand-white/60">{t.hero.scroll}</span>
          <motion.span
            className="block h-12 w-px bg-brand-white/40 origin-top"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
    </section>
  )
}

/* ----------------------------- Philosophy ----------------------------- */
function Philosophy({ t, reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const y = reduced ? 0 : yRaw

  return (
    <section className="relative py-28 md:py-40 bg-brand-white">
      <div className="container grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Kicker>{t.philosophy.kicker}</Kicker>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-brand-charcoal text-balance">
              {t.philosophy.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-hidden">
              <motion.img
                src={IMG.water3}
                alt=""
                style={{ y }}
                className="w-full h-[420px] object-cover grayscale-[15%]"
              />
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
          <div className="space-y-7">
            {t.philosophy.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={`text-pretty leading-relaxed ${i === 0 ? 'text-2xl md:text-3xl font-serif font-light text-brand-ocean leading-snug' : 'text-lg text-brand-charcoal/75 font-light'}`}>
                  {p}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <blockquote className="mt-12 border-l border-brand-teal pl-6 font-serif italic text-2xl md:text-3xl text-brand-ocean leading-snug">
                “{t.philosophy.quote}”
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- About ----------------------------- */
function About({ t }) {
  const a = t.about
  return (
    <section id="about" className="relative py-28 md:py-40 bg-brand-paper">
      <div className="container grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="relative">
              <img src={ASSET.portrait} alt="Kenia Navarro" className="w-full object-cover aspect-[4/5]" />
              <div className="absolute -bottom-5 -right-5 hidden md:block w-32 h-32 border border-brand-gold/60" />
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Kicker>{a.kicker}</Kicker>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-charcoal">{a.title}</h2>
            <p className="mt-3 text-[12px] uppercase tracking-widest text-brand-stone">{a.role}</p>
          </Reveal>
          <div className="mt-9 space-y-5">
            {a.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="text-lg text-brand-charcoal/75 font-light leading-relaxed text-pretty">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 border-l border-brand-teal pl-6">
              <p className="text-[12px] uppercase tracking-widest text-brand-stone mb-3">{a.statementTitle}</p>
              <p className="font-serif italic text-2xl text-brand-ocean leading-snug">{a.statement}</p>
            </div>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 gap-12">
            <Reveal>
              <p className="text-[12px] uppercase tracking-widest text-brand-stone mb-5">{a.trainingTitle}</p>
              <ul className="space-y-3">
                {a.training.map((it, i) => (
                  <li key={i} className="flex gap-4 text-sm">
                    <span className="text-brand-gold w-16 shrink-0 tabular-nums">{it.y}</span>
                    <span className="text-brand-charcoal/80">{it.t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[12px] uppercase tracking-widest text-brand-stone mb-5">{a.awardsTitle}</p>
              <ul className="space-y-3">
                {a.awards.map((it, i) => (
                  <li key={i} className="text-sm text-brand-charcoal/80 leading-relaxed">{it}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Continuum ----------------------------- */
function Continuum({ t }) {
  const c = t.continuum
  return (
    <section id="continuum" className="relative py-28 md:py-40 bg-brand-oceandeep text-brand-white overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <img src={IMG.water1} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-oceandeep/70" />
      </div>
      <div className="container relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Kicker>{c.kicker}</Kicker>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight text-brand-white">{c.title}</h2>
            <p className="mt-8 text-lg text-brand-white/80 font-light leading-relaxed text-pretty">{c.intro}</p>
            <p className="mt-10 text-xs text-brand-white/45 leading-relaxed border-l border-brand-teal/60 pl-4">{c.note}</p>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
              {c.concepts.map((it, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-brand-white/15">
                  <AccordionTrigger className="text-left font-serif text-2xl md:text-3xl text-brand-white hover:text-brand-teal hover:no-underline py-6 [&>svg]:text-brand-teal">
                    {it.t}
                  </AccordionTrigger>
                  <AccordionContent className="text-brand-white/70 text-base font-light leading-relaxed pb-7">
                    {it.b}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Performances ----------------------------- */
function Performances({ t }) {
  const p = t.performances
  return (
    <section id="performances" className="relative py-28 md:py-40 bg-brand-white">
      <div className="container">
        <div className="max-w-2xl">
          <Reveal>
            <Kicker>{p.kicker}</Kicker>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-charcoal">{p.title}</h2>
            <p className="mt-6 text-lg text-brand-charcoal/70 font-light leading-relaxed text-pretty">{p.intro}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-x-10 gap-y-16">
          {p.items.map((it, i) => (
            <Reveal key={i} delay={(i % 2) * 0.08}>
              <article className={`group ${i % 2 === 1 ? 'md:mt-20' : ''}`}>
                <div className="overflow-hidden">
                  <img
                    src={it.img}
                    alt={it.t}
                    className="w-full aspect-[3/2] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-3xl text-brand-charcoal group-hover:text-brand-teal transition-colors">{it.t}</h3>
                  <span className="text-sm text-brand-gold tabular-nums shrink-0">{it.y}</span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-brand-stone">{it.r}</p>
                <p className="mt-3 text-brand-charcoal/70 font-light leading-relaxed">{it.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Workshops ----------------------------- */
function Workshops({ t, goTo }) {
  const w = t.workshops
  return (
    <section id="workshops" className="relative py-28 md:py-40 bg-brand-paper">
      <div className="container">
        <div className="max-w-2xl">
          <Reveal>
            <Kicker>{w.kicker}</Kicker>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-charcoal">{w.title}</h2>
            <p className="mt-6 text-lg text-brand-charcoal/70 font-light leading-relaxed text-pretty">{w.intro}</p>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-brand-charcoal/15">
          {w.items.map((it, i) => (
            <Reveal key={i}>
              <div className="group grid md:grid-cols-12 gap-4 md:gap-8 items-center py-9 border-b border-brand-charcoal/15">
                <div className="md:col-span-7">
                  <h3 className="font-serif text-3xl md:text-4xl text-brand-charcoal group-hover:text-brand-teal transition-colors">{it.t}</h3>
                  <p className="mt-3 text-brand-charcoal/70 font-light leading-relaxed max-w-xl">{it.d}</p>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <p className="flex items-center gap-2 text-sm text-brand-charcoal/80"><MapPin size={15} className="text-brand-teal" /> {it.loc}</p>
                  <p className="flex items-center gap-2 text-sm text-brand-charcoal/80"><CalendarDays size={15} className="text-brand-teal" /> {it.date}</p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <button
                    onClick={() => goTo('contact')}
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-brand-ocean hover:text-brand-teal transition-colors"
                  >
                    {w.register} <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Gallery ----------------------------- */
function Gallery({ t, openLb }) {
  return (
    <section id="gallery" className="relative py-28 md:py-40 bg-brand-white">
      <div className="container">
        <Reveal>
          <Kicker>{t.gallery.kicker}</Kicker>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="font-serif text-5xl md:text-6xl text-brand-charcoal">{t.gallery.title}</h2>
            <p className="text-sm text-brand-stone max-w-xs">{t.gallery.caption}</p>
          </div>
        </Reveal>

        <div className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {GALLERY.map((g, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <button
                onClick={() => openLb(i)}
                className="group relative block w-full mb-5 overflow-hidden bg-brand-paper"
                aria-label={`Open image ${i + 1}`}
              >
                <img
                  src={g.src}
                  alt=""
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-brand-oceandeep/0 group-hover:bg-brand-oceandeep/20 transition-colors duration-500" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Lightbox({ index, onClose, onNext, onPrev, t }) {
  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-brand-ink/95 flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-brand-white/70 hover:text-brand-white" aria-label="Close">
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 md:left-8 text-brand-white/60 hover:text-brand-white" aria-label="Previous"
          >
            <ChevronLeft size={40} />
          </button>
          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            src={GALLERY[index].src}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[88vw] object-contain"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 md:right-8 text-brand-white/60 hover:text-brand-white" aria-label="Next"
          >
            <ChevronRight size={40} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ----------------------------- Testimonials ----------------------------- */
function Testimonials({ t }) {
  const tt = t.testimonials
  return (
    <section className="relative py-28 md:py-40 bg-brand-ocean text-brand-white">
      <div className="container">
        <Reveal>
          <div className="text-center max-w-xl mx-auto">
            <Kicker>{tt.kicker}</Kicker>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-white">{tt.title}</h2>
          </div>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {tt.items.map((it, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <figure className="flex flex-col h-full">
                <blockquote className="font-serif italic text-2xl leading-snug text-brand-white/90">“{it.q}”</blockquote>
                <figcaption className="mt-7 pt-5 border-t border-brand-white/20">
                  <p className="text-sm text-brand-white">{it.a}</p>
                  <p className="text-[12px] uppercase tracking-widest text-brand-teal mt-1">{it.r}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Journal ----------------------------- */
function Journal({ t }) {
  const j = t.journal
  return (
    <section id="journal" className="relative py-28 md:py-40 bg-brand-white">
      <div className="container">
        <Reveal>
          <Kicker>{j.kicker}</Kicker>
          <h2 className="font-serif text-5xl md:text-6xl text-brand-charcoal">{j.title}</h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-10">
          {j.items.map((it, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <article className="group cursor-pointer">
                <p className="text-[11px] uppercase tracking-widest text-brand-gold">{it.date}</p>
                <h3 className="mt-3 font-serif text-3xl text-brand-charcoal group-hover:text-brand-teal transition-colors leading-snug">{it.t}</h3>
                <p className="mt-4 text-brand-charcoal/70 font-light leading-relaxed">{it.e}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-brand-ocean group-hover:gap-3 transition-all">
                  {j.readMore} <ArrowRight size={14} />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Contact ----------------------------- */
function Contact({ t, lang }) {
  const c = t.contact
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | ok | err
  const [nlEmail, setNlEmail] = useState('')
  const [nlStatus, setNlStatus] = useState('idle') // idle | sending | ok | already | err

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale: lang }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('ok')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('err')
    }
  }

  const subscribe = async (e) => {
    e.preventDefault()
    setNlStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail, locale: lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error('failed')
      setNlStatus(data.alreadySubscribed ? 'already' : 'ok')
      setNlEmail('')
    } catch (err) {
      setNlStatus('err')
    }
  }

  const inputCls = 'w-full bg-transparent border-b border-brand-charcoal/25 py-3 text-brand-charcoal placeholder:text-brand-stone/70 focus:outline-none focus:border-brand-teal transition-colors'

  return (
    <section id="contact" className="relative py-28 md:py-40 bg-brand-paper">
      <div className="container grid lg:grid-cols-12 gap-14 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal>
            <Kicker>{c.kicker}</Kicker>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-charcoal">{c.title}</h2>
            <p className="mt-6 text-lg text-brand-charcoal/70 font-light leading-relaxed text-pretty">{c.intro}</p>

            <div className="mt-12">
              <p className="text-[12px] uppercase tracking-widest text-brand-stone mb-4">{c.reach}</p>
              <a href="mailto:hola@kenianavarro.com" className="flex items-center gap-3 text-brand-charcoal hover:text-brand-teal transition-colors py-1">
                <Mail size={18} /> hola@kenianavarro.com
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-brand-charcoal hover:text-brand-teal transition-colors py-1">
                <Instagram size={18} /> @kenia.navarro
              </a>
            </div>

            <div className="mt-12 border-t border-brand-charcoal/15 pt-8">
              <p className="text-[12px] uppercase tracking-widest text-brand-stone mb-2">{c.newsletterTitle}</p>
              <p className="text-brand-charcoal/70 font-light mb-5">{c.newsletterText}</p>
              <form onSubmit={subscribe} className="flex gap-3 max-w-sm">
                <input
                  type="email" required value={nlEmail} onChange={(e) => setNlEmail(e.target.value)}
                  placeholder={c.newsletterPlaceholder} className={inputCls}
                />
                <button type="submit" disabled={nlStatus === 'sending'} className="shrink-0 bg-brand-ocean text-brand-white px-6 text-[12px] uppercase tracking-widest hover:bg-brand-teal transition-colors disabled:opacity-60">
                  {c.subscribe}
                </button>
              </form>
              {nlStatus === 'ok' && <p className="mt-3 text-sm text-brand-teal">{c.subSuccess}</p>}
              {nlStatus === 'already' && <p className="mt-3 text-sm text-brand-stone">{c.subAlready}</p>}
              {nlStatus === 'err' && <p className="mt-3 text-sm text-red-600">{c.error}</p>}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="space-y-8">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-brand-stone">{c.name}</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-brand-stone">{c.email}</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-brand-stone">{c.message}</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} />
              </div>
              <button
                type="submit" disabled={status === 'sending'}
                className="group inline-flex items-center gap-3 bg-brand-charcoal text-brand-white px-9 py-4 text-[12px] uppercase tracking-widest hover:bg-brand-teal transition-colors disabled:opacity-60"
              >
                {status === 'sending' ? c.sending : c.send}
                <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
              </button>
              {status === 'ok' && <p className="text-sm text-brand-teal">{c.success}</p>}
              {status === 'err' && <p className="text-sm text-red-600">{c.error}</p>}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Footer ----------------------------- */
function Footer({ t, lang, setLang, goTo }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-brand-oceandeep text-brand-white/80">
      <div className="container py-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <button onClick={() => goTo('home')} className="font-serif text-3xl text-brand-white">Kenia Navarro</button>
            <p className="mt-5 max-w-sm text-brand-white/60 font-light leading-relaxed">{t.footer.tagline}</p>
            <p className="mt-8 font-serif italic text-2xl text-brand-teal">{t.footer.crafted}</p>
          </div>
          <div className="md:col-span-3">
            <nav className="flex flex-col gap-2">
              {SECTIONS.filter((s) => s !== 'home').map((s) => (
                <button key={s} onClick={() => goTo(s)} className="text-left text-sm text-brand-white/60 hover:text-brand-teal transition-colors">
                  {t.nav[s]}
                </button>
              ))}
            </nav>
          </div>
          <div className="md:col-span-4 md:text-right">
            <div className="flex md:justify-end gap-5 mb-6">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-brand-white/70 hover:text-brand-teal transition-colors"><Instagram size={20} /></a>
              <a href="mailto:hola@kenianavarro.com" className="text-brand-white/70 hover:text-brand-teal transition-colors"><Mail size={20} /></a>
            </div>
            <div className="flex md:justify-end items-center gap-2 text-[12px] tracking-widest">
              <span className="text-brand-white/40 uppercase mr-1">{t.langLabel}</span>
              <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-brand-teal' : 'text-brand-white/50 hover:text-brand-white'}>EN</button>
              <span className="text-brand-white/30">|</span>
              <button onClick={() => setLang('es')} className={lang === 'es' ? 'text-brand-teal' : 'text-brand-white/50 hover:text-brand-white'}>ES</button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-brand-white/10 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-brand-white/40">
          <p>© {year} Kenia Navarro. {t.footer.rights}</p>
          <p>Cuernavaca · México</p>
        </div>
      </div>
    </footer>
  )
}
