'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ─── Tunables ─────────────────────────────────────────────────────────────────

/** px from the viewport top that wakes the navbar on mouse proximity */
const WAKE_ZONE_PX   = 30
/** ms of inactivity before the navbar auto-hides */
const SLEEP_DELAY_MS = 3500
/** Scroll delta (px) required before we react to direction */
const SCROLL_DEAD_PX = 4
/** Luminance threshold below which we treat the page as "dark" */
const DARK_THRESHOLD = 0.35

// ─── Link data ────────────────────────────────────────────────────────────────

const PRIMARY_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About' },
  { href: '/buyers',      label: 'Buyers' },
  { href: '/developer',   label: 'Developers' },
  { href: '/blog',        label: 'Blog' },
  { href: '/testimonial', label: 'Testimonials' },
  { href: '#',            label: 'Projects' },   // placeholder — muted
]

const UTIL_LINKS = [
  { href: '/login',   label: 'Login',   cta: false },
  { href: '/contact', label: 'Contact', cta: true  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()

  const [visible,    setVisible]    = useState(false)
  const [isDark,     setIsDark]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted,    setMounted]    = useState(false)

  const sleepTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollY   = useRef(0)
  const isMobileRef   = useRef(false)
  const mobileOpenRef = useRef(false)

  // ── Active-link helper ────────────────────────────────────────────────────

  const isActive = (href: string) =>
    href !== '#' &&
    (href === '/' ? pathname === '/' : pathname.startsWith(href))

  // ── Background luminance sampling ─────────────────────────────────────────

  const sampleBackground = useCallback(() => {
    const stack: Element[] =
      typeof document.elementsFromPoint === 'function'
        ? document.elementsFromPoint(window.innerWidth / 2, 80)
        : ([document.elementFromPoint(window.innerWidth / 2, 80)].filter(Boolean) as Element[])

    const pageEl = stack.find((el) => !el.closest('header'))
    if (!pageEl) return

    const raw  = window.getComputedStyle(pageEl).backgroundColor
    const nums = raw.match(/[\d.]+/g)
    if (!nums || nums.length < 3) return

    const [r, g, b] = nums.map(Number)
    setIsDark((0.299 * r + 0.587 * g + 0.114 * b) / 255 < DARK_THRESHOLD)
  }, [])

  // ── Sleep / wake ──────────────────────────────────────────────────────────

  const clearSleep = useCallback(() => {
    if (sleepTimer.current) { clearTimeout(sleepTimer.current); sleepTimer.current = null }
  }, [])

  const scheduleSleep = useCallback((delay = SLEEP_DELAY_MS) => {
    clearSleep()
    sleepTimer.current = setTimeout(() => {
      if (!mobileOpenRef.current) {
        setVisible(false); setMobileOpen(false); mobileOpenRef.current = false
      }
    }, delay)
  }, [clearSleep])

  const wake = useCallback(() => {
    sampleBackground(); setVisible(true); scheduleSleep()
  }, [sampleBackground, scheduleSleep])

  // ── Lifecycle effects (identical logic to before) ─────────────────────────

  useEffect(() => {
    setMounted(true)
    isMobileRef.current = window.innerWidth < 768
    lastScrollY.current = window.scrollY
    if (isMobileRef.current) {
      setVisible(true)
    } else {
      sampleBackground(); setVisible(true)
      const t = setTimeout(() => setVisible(false), SLEEP_DELAY_MS)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isMobileRef.current) return
      if (e.clientY < WAKE_ZONE_PX) wake()
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [wake])

  const onNavEnter = useCallback(() => { if (!isMobileRef.current) clearSleep() }, [clearSleep])
  const onNavLeave = useCallback(() => { if (!isMobileRef.current) scheduleSleep() }, [scheduleSleep])

  useEffect(() => {
    const onScroll = () => {
      if (mobileOpenRef.current) return
      const y     = window.scrollY
      const delta = y - lastScrollY.current
      if (Math.abs(delta) < SCROLL_DEAD_PX) return
      if (delta < 0) wake()
      else scheduleSleep(isMobileRef.current ? 0 : 150)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [wake, scheduleSleep])

  const toggleMobile = useCallback(() => {
    const next = !mobileOpenRef.current
    mobileOpenRef.current = next
    setMobileOpen(next)
    if (next) clearSleep(); else scheduleSleep()
  }, [clearSleep, scheduleSleep])

  const closeMobile = useCallback(() => {
    mobileOpenRef.current = false; setMobileOpen(false); scheduleSleep()
  }, [scheduleSleep])

  // ─── Palette tokens ───────────────────────────────────────────────────────

  const bg        = isDark ? 'bg-[#0f0c0a]/90 backdrop-blur-md  border-b border-white/[0.06]'
                           : 'bg-white/95      backdrop-blur-sm  border-b border-[#e8e2d9]'
  const logoColor = isDark ? 'text-white' : 'text-[#1f1a17]'
  const subColor  = isDark ? 'text-[#6b5e54]' : 'text-[#a09080]'
  const linkBase  = isDark ? 'text-[#9e8d7a] hover:text-white' : 'text-[#6b5e54] hover:text-[#1f1a17]'
  const linkActive= isDark ? 'text-white' : 'text-[#1f1a17]'
  const sepColor  = isDark ? 'bg-white/10' : 'bg-[#e8e2d9]'
  const barColor  = isDark ? 'bg-[#e8d8c4]' : 'bg-[#2f2a24]'

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <header
      onMouseEnter={onNavEnter}
      onMouseLeave={onNavLeave}
      className={[
        'fixed top-0 left-0 right-0 z-50',
        mounted ? 'transition-[transform,opacity] duration-300 ease-in-out' : 'transition-none',
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
        bg,
      ].join(' ')}
    >
      {/* ── Main row ──────────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3.5">

        {/* Logo — PPM mark + full name below */}
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          {/* Amber left accent */}
          <span className={`block h-7 w-0.5 transition-opacity ${
            isDark ? 'bg-[#c8a96e]' : 'bg-[#c8a96e]'
          }`} />
          <span>
            <span className={`block text-[13px] font-bold uppercase tracking-[0.22em] leading-none transition ${logoColor} group-hover:opacity-70`}>
              PPM
            </span>
            <span className={`block text-[8.5px] uppercase tracking-[0.14em] mt-1 leading-none transition ${subColor} group-hover:opacity-70`}>
              Property Project Marketing
            </span>
          </span>
        </Link>

        {/* ── Desktop nav ───────────────────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1">

          {/* Primary links */}
          {PRIMARY_LINKS.map((link) => {
            const active      = isActive(link.href)
            const placeholder = link.href === '#'
            return (
              <Link
                key={link.label}
                href={link.href}
                className={[
                  'relative px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition',
                  placeholder ? `${isDark ? 'text-[#3d3530]' : 'text-[#ccc0b4]'} cursor-default pointer-events-none` :
                    active ? linkActive : linkBase,
                ].join(' ')}
                tabIndex={placeholder ? -1 : undefined}
                aria-disabled={placeholder}
              >
                {link.label}
                {/* Amber underline for active page */}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-[#c8a96e]" />
                )}
              </Link>
            )
          })}

          {/* Separator */}
          <span className={`mx-3 h-4 w-px ${sepColor}`} />

          {/* Utility links */}
          {UTIL_LINKS.map((link) => {
            const active = isActive(link.href)
            if (link.cta) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={[
                    'ml-1 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] border transition',
                    isDark
                      ? 'border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0c0a]'
                      : 'border-[#1f1a17] text-[#1f1a17] hover:bg-[#1f1a17] hover:text-white',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className={[
                  'relative px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition',
                  active ? linkActive : linkBase,
                ].join(' ')}
              >
                {link.label}
                {active && <span className="absolute bottom-0 left-3 right-3 h-px bg-[#c8a96e]" />}
              </Link>
            )
          })}
        </nav>

        {/* ── Mobile hamburger ──────────────────────────────────────────── */}
        <button
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {(['top', 'mid', 'bot'] as const).map((id) => (
            <span
              key={id}
              className={[
                'block h-px w-6 origin-center transition-all duration-200',
                barColor,
                id === 'top' && mobileOpen ? 'translate-y-[5.5px] rotate-45'   : '',
                id === 'mid' && mobileOpen ? 'scale-x-0 opacity-0'              : '',
                id === 'bot' && mobileOpen ? '-translate-y-[5.5px] -rotate-45' : '',
              ].join(' ')}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────────────────────── */}
      <div
        aria-hidden={!mobileOpen}
        className={[
          'overflow-hidden lg:hidden',
          'transition-[max-height,opacity] duration-300 ease-in-out',
          mobileOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        {/* Amber accent rule at top of drawer */}
        <div className="h-px bg-gradient-to-r from-[#c8a96e] via-[#c8a96e]/40 to-transparent" />

        <nav className={`flex flex-col px-8 pb-4 pt-2 ${isDark ? 'bg-[#0f0c0a]' : 'bg-white'}`}>
          {[...PRIMARY_LINKS, ...UTIL_LINKS].map((link) => {
            const active      = isActive(link.href)
            const placeholder = link.href === '#'
            const isCta       = 'cta' in link && link.cta

            return (
              <Link
                key={link.label}
                href={link.href}
                tabIndex={placeholder ? -1 : undefined}
                aria-disabled={placeholder}
                className={[
                  'flex items-center justify-between py-4 text-[11px] font-medium uppercase tracking-[0.16em]',
                  'border-b transition',
                  isDark ? 'border-white/[0.06]' : 'border-[#f0ebe4]',
                  placeholder
                    ? `${isDark ? 'text-[#2d2218]' : 'text-[#d4c8bc]'} pointer-events-none cursor-default`
                    : isCta
                    ? 'text-[#c8a96e]'
                    : active
                    ? isDark ? 'text-white' : 'text-[#1f1a17]'
                    : isDark ? 'text-[#9e8d7a]' : 'text-[#6b5e54]',
                ].join(' ')}
                onClick={placeholder ? undefined : closeMobile}
              >
                <span>{link.label}</span>
                {active && !placeholder && (
                  <span className="h-1 w-1 rounded-full bg-[#c8a96e]" />
                )}
                {isCta && !active && (
                  <span className="text-[#c8a96e]">→</span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
