'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── Tunables ─────────────────────────────────────────────────────────────────

/** px from the viewport top edge that wakes the navbar on mouse proximity */
const WAKE_ZONE_PX    = 30
/** ms of inactivity after the last wake event before the navbar auto-hides */
const SLEEP_DELAY_MS  = 3500
/** Scroll delta (px) required before we react to direction */
const SCROLL_DEAD_PX  = 4
/** Luminance threshold below which we treat the page as "dark" */
const DARK_THRESHOLD  = 0.35

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About Us' },
  { href: '/buyers',      label: 'Buyers' },
  { href: '#',            label: 'Services' },
  { href: '/developer',   label: 'Developers' },
  { href: '/blog',        label: 'Blog' },
  { href: '/testimonial', label: 'Testimonials' },
  { href: '/contact',     label: 'Contact' },
  { href: '#',            label: 'Projects' },
  { href: '/login',       label: 'Login' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  /** Whether the navbar is slid into view */
  const [visible,    setVisible]    = useState(false)
  /** Adapts the navbar palette to the section behind it */
  const [isDark,     setIsDark]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  /**
   * Starts false so no transition plays on SSR / first paint.
   * Prevents the navbar from visibly sliding in during hydration.
   */
  const [mounted, setMounted] = useState(false)

  // ── Refs (safe inside event-handler closures) ─────────────────────────────

  const sleepTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollY   = useRef(0)
  const isMobileRef   = useRef(false)
  const mobileOpenRef = useRef(false)

  // ── Background luminance sampling ─────────────────────────────────────────

  /**
   * Reads the computed background colour of the page element sitting behind
   * the navbar and decides whether the dark or light palette should be used.
   *
   * Uses `elementsFromPoint` (stacked list) so we can skip the navbar itself —
   * important when the navbar is already visible and occludes the top of the page.
   */
  const sampleBackground = useCallback(() => {
    // Sample 80 px from the top — roughly where the body of the navbar sits
    const stack: Element[] =
      typeof document.elementsFromPoint === 'function'
        ? document.elementsFromPoint(window.innerWidth / 2, 80)
        : ([document.elementFromPoint(window.innerWidth / 2, 80)].filter(Boolean) as Element[])

    // Ignore elements that are part of the navbar itself
    const pageEl = stack.find((el) => !el.closest('header'))
    if (!pageEl) return

    const raw  = window.getComputedStyle(pageEl).backgroundColor
    const nums = raw.match(/[\d.]+/g)
    if (!nums || nums.length < 3) return

    const [r, g, b]  = nums.map(Number)
    const luminance   = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    setIsDark(luminance < DARK_THRESHOLD)
  }, [])

  // ── Sleep / wake core ─────────────────────────────────────────────────────

  /** Cancel any pending sleep timer */
  const clearSleep = useCallback(() => {
    if (sleepTimer.current) {
      clearTimeout(sleepTimer.current)
      sleepTimer.current = null
    }
  }, [])

  /**
   * Schedule the navbar to hide after `delay` ms.
   * Calling this resets the clock — the timer always runs from the most recent
   * wake event, so sustained activity keeps the navbar alive.
   */
  const scheduleSleep = useCallback(
    (delay = SLEEP_DELAY_MS) => {
      clearSleep()
      sleepTimer.current = setTimeout(() => {
        if (!mobileOpenRef.current) {
          setVisible(false)
          setMobileOpen(false)
          mobileOpenRef.current = false
        }
      }, delay)
    },
    [clearSleep],
  )

  /**
   * Wake: show the navbar and restart the inactivity clock.
   * Every user action that should reveal the navbar calls this.
   */
  const wake = useCallback(() => {
    sampleBackground()
    setVisible(true)
    scheduleSleep()
  }, [sampleBackground, scheduleSleep])

  // ── Mount ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    setMounted(true)
    isMobileRef.current = window.innerWidth < 768
    lastScrollY.current = window.scrollY

    if (isMobileRef.current) {
      // Mobile: always start visible; scroll direction handles hide/show
      setVisible(true)
    } else {
      // Desktop: brief initial reveal so the user sees the nav exists,
      // then the inactivity timer kicks in and hides it naturally.
      sampleBackground()
      setVisible(true)
      const t = setTimeout(() => setVisible(false), SLEEP_DELAY_MS)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Mouse proximity (desktop only) ────────────────────────────────────────

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isMobileRef.current) return
      // Mouse enters the wake zone → wake (also resets the sleep timer)
      if (e.clientY < WAKE_ZONE_PX) wake()
      // Outside the zone: let the currently-running sleep timer do its job;
      // we do not touch it here so the countdown is not reset by every
      // mousemove that happens below the zone.
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [wake])

  // ── Navbar hover: pause the sleep timer while cursor is over the nav ──────

  /**
   * While the mouse is hovering over a nav link or logo, cancel the countdown
   * so the navbar cannot vanish mid-click.
   */
  const onNavEnter = useCallback(() => {
    if (isMobileRef.current) return
    clearSleep()
  }, [clearSleep])

  /**
   * When the mouse leaves the navbar body, restart the sleep countdown
   * from the full delay — gives the user time to move elsewhere without
   * the nav disappearing immediately.
   */
  const onNavLeave = useCallback(() => {
    if (isMobileRef.current) return
    scheduleSleep()
  }, [scheduleSleep])

  // ── Scroll direction ──────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => {
      // Never auto-hide while the mobile menu is open
      if (mobileOpenRef.current) return

      const y     = window.scrollY
      const delta = y - lastScrollY.current

      if (Math.abs(delta) < SCROLL_DEAD_PX) return

      if (delta < 0) {
        // Scrolling up → wake (resets sleep timer too)
        wake()
      } else {
        // Scrolling down → hide promptly
        // Mobile: instant (0 ms) to keep the viewport clear while reading.
        // Desktop: 150 ms pause feels intentional rather than reactive.
        scheduleSleep(isMobileRef.current ? 0 : 150)
      }

      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [wake, scheduleSleep])

  // ── Mobile menu toggle ────────────────────────────────────────────────────

  const toggleMobile = useCallback(() => {
    const next = !mobileOpenRef.current
    mobileOpenRef.current = next
    setMobileOpen(next)
    // While the menu is open, suspend auto-sleep so the nav stays visible
    if (next) clearSleep()
    else scheduleSleep()
  }, [clearSleep, scheduleSleep])

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <header
      onMouseEnter={onNavEnter}
      onMouseLeave={onNavLeave}
      className={[
        // Layout — fixed so the navbar never displaces page content
        'fixed top-0 left-0 right-0 z-50',
        // Slide + fade — both transform and opacity animate together
        mounted
          ? 'transition-[transform,opacity] duration-300 ease-in-out'
          : 'transition-none',
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0',
        // Palette — adapts to whether the section behind it is dark or light
        isDark
          ? 'bg-[#1a1410]/85 backdrop-blur-md   border-b border-white/[0.07]'
          : 'bg-[#f6f2eb]/95 backdrop-blur-sm   border-b border-[#ddd3c6]',
      ].join(' ')}
    >
      {/* ── Main row ──────────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <Link
          href="/"
          className={`shrink-0 text-lg font-semibold uppercase tracking-[0.12em] transition hover:opacity-70 ${
            isDark ? 'text-[#e8d8c4]' : 'text-[#2f2a24]'
          }`}
        >
          Property Project Marketing Pty Ltd
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition ${
                isDark
                  ? 'text-[#9e8d7a] hover:text-[#e8d8c4]'
                  : 'text-[#5b5147] hover:text-[#1f1a17]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger — 3 lines animate to an × */}
        <button
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {(['top', 'mid', 'bot'] as const).map((id) => (
            <span
              key={id}
              className={[
                'block h-px w-6 origin-center transition-all duration-200',
                isDark ? 'bg-[#e8d8c4]' : 'bg-[#2f2a24]',
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
          'overflow-hidden md:hidden',
          `border-t ${isDark ? 'border-white/10' : 'border-[#ddd3c6]'}`,
          'transition-[max-height,opacity] duration-300 ease-in-out',
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav
          className={`flex flex-col px-6 py-2 ${
            isDark ? 'bg-[#1a1410]' : 'bg-[#f6f2eb]'
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={[
                'py-3.5 text-[11px] font-medium uppercase tracking-[0.16em]',
                'border-b last:border-b-0 transition',
                isDark
                  ? 'border-white/10 text-[#9e8d7a] hover:text-[#e8d8c4]'
                  : 'border-[#ede7de] text-[#5b5147] hover:text-[#1f1a17]',
              ].join(' ')}
              onClick={() => {
                mobileOpenRef.current = false
                setMobileOpen(false)
                scheduleSleep()
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
