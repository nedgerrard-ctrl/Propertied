# PPM Property Project Marketing — Claude Design Brief v2
**For:** claude.ai/design  
**Site:** www.ppmproperty.com.au  
**Date:** June 2026  
**Supersedes:** PPM_Claude_Design_Brief.md (June 2026, v1)

---

## What has changed and why

The original brief specified a forest green and cream palette (deep green `#1B2B1A`, warm cream `#F5F1E8`). Since that brief was written, a fully built and deployed version of the site has been reviewed. The student development team (Monash University, Team 219) independently arrived at a darker, warmer, and more premium direction — warm black backgrounds, Cormorant Garamond in light weight, and a restrained warm gold accent throughout. That design is significantly more appropriate for PPM's target audiences (overseas investors, high-net-worth Melbourne owner-occupiers) and is already working in production.

**This brief updates Claude Design to match the built site's established aesthetic.** All new pages, sections, and design work should follow this specification rather than v1.

---

## Brand identity

**Brand name:** PPM · Property Project Marketing  
**Trading name:** Online Property Services  
**Tagline:** New apartment and townhouse specialists in Melbourne

**Logo:** Two slim gold roofline chevrons (right chevron layered in front of left) sitting as a restrained accent above the letters **PPM** in Cormorant Garamond or Playfair Display Bold. Below the letters: PROPERTY PROJECT MARKETING in small spaced caps. The chevrons are an accent — they must not overpower the letterforms.

---

## Colour palette — UPDATED

This replaces the green/cream palette from v1 entirely.

| Role | Hex | Usage |
|------|-----|-------|
| **Primary dark** | `#0a0806` | Hero background, CTA sections, page base |
| **Section dark** | `#1c1814` | Alternating dark sections (stats, Who We Are, Why Choose PPM) |
| **Section mid** | `#2f2a24` | Transition/contrast dark sections |
| **Cream** | `#f6f2eb` | Light sections (What We Do, off-the-plan content) |
| **White** | `#ffffff` | Occasional clean sections (Federal Budget, legal pages) |
| **Gold accent** | `#c8a96e` | All accents — labels, links, bullets, borders, CTA buttons |
| **Gold hover** | `#b8960a` | Button hover state |
| **Body text (dark bg)** | `#9e8d7a` | Paragraph text on dark backgrounds |
| **Secondary text (dark bg)** | `#8a7b6d` | Secondary/muted text, section labels on dark |
| **Subtle text** | `#6b5e54` | Captions, fine print, numbered icons on dark |
| **Very subtle** | `#4a3f37` | Decorative numbering, hairline borders |
| **Body text (light bg)** | `#3d3530` | Paragraph text on cream/white backgrounds |
| **Heading (light bg)** | `#1f1a17` | Headings on cream/white backgrounds |
| **Card bg** | `#1a1512` | Dropdown menus, card surfaces |
| **Hairline border (dark)** | `rgba(255,255,255,0.06)` | Section dividers, card borders on dark backgrounds |
| **Gold border subtle** | `rgba(200,169,110,0.15)` | Card borders, form input borders |

**The gold `#c8a96e` is the only accent colour.** It appears on: section labels, link underlines, bullet points, CTA button borders/fills, form focus states, navbar profile avatar, scroll indicator. It does not appear as a background or fill on large areas.

---

## Typography — UPDATED

| Role | Font | Weight | Size | Tracking |
|------|------|--------|------|---------|
| **Display headings** | Cormorant Garamond | 300–400 (Light) | 3.2–4rem | Default |
| **Large hero heading** | Cormorant Garamond | 300 (Light) | 3.6–4rem | Default |
| **Hero italic accent** | Cormorant Garamond | 300 Italic | Same as heading | Default |
| **Body text** | Inter or Geist Sans | 400 | 13.5–14px | Default |
| **Section labels** | Inter or Geist Sans | 400 | 10px | 0.32–0.38em |
| **CTA / link text** | Inter or Geist Sans | 500–600 | 11px | 0.18–0.22em |
| **Stats numbers** | Cormorant Garamond | 300 | 2.6rem | Default |
| **Stats units** | Cormorant Garamond | 300 | 1.4rem | Default |
| **Stats labels** | Inter or Geist Sans | 400 | 10px | 0.26em |

All body text uses 1.9–1.95 line height. Maximum paragraph width: 64–68 characters (`max-w-[64ch]` or `max-w-[68ch]`). This creates a narrow, authoritative editorial column — never full-width body text.

Both Cormorant Garamond and Inter are available on Google Fonts.

---

## Visual tone — UPDATED

Dark, editorial, cinematic. The overall feel is closer to a private wealth management firm or an architectural practice than a real estate agency. Think luxury watch brand, high-end Melbourne developer brochure, or international art gallery website.

The palette alternates between warm-black sections and occasional cream/white sections as the user scrolls — this creates strong visual rhythm without relying on imagery alone.

**The warmth in the blacks is important.** `#0a0806` and `#1c1814` are not cold grey-blacks — they have a brown undertone that makes the gold accent feel natural and warm rather than garish. Do not substitute neutral blacks or greys.

The site competes for the attention of overseas investors (primarily Asia-Pacific) and high-net-worth Melbourne owner-occupiers. Both audiences will leave immediately if the design feels generic, cheap, or like a standard Australian real estate website.

---

## Motion and interaction — UPDATED

The built site uses Framer Motion. These conventions should be followed in all new design work:

**Entrance animations:** Every section animates in from below on scroll.  
`initial: { opacity: 0, y: 24 }` → `whileInView: { opacity: 1, y: 0 }`  
Easing: `[0.16, 1, 0.3, 1]` (smooth spring). Duration: 0.9–1.1s.

**Stagger:** Card grids stagger with `delay: index × 0.07s`.

**Hero parallax:** As the user scrolls past the hero, the video overlay darkens (`opacity 0.55 → 0.85`) and the text rises and fades out. This is handled by `useScroll` + `useTransform`.

**Scroll indicator:** A vertical gold line (`#c8a96e`, 60% opacity) pulses downward in a slow loop at the base of the hero.

**Vertical accent line:** A `120px × 1px` vertical gold gradient line sits on the left edge of the hero (`from-transparent via-[#c8a96e] to-transparent`). This is a subtle architectural detail, not a decorative flourish.

**Links:** All inline text links use a gold underline (`border-b border-[#c8a96e]/40`) that transitions to full opacity on hover. No blue links anywhere on the site.

**Buttons:** Two styles only —  
Primary: `border border-[#c8a96e]`, gold text, fills to gold background on hover (text becomes `#0a0806`)  
Secondary: `border border-white/20`, muted text, lightens on hover  
No rounded corners on buttons. Sharp edges (`border-radius: 0` or `2px` maximum).

---

## Page structure and section alternation

The landing page demonstrates the alternating rhythm — follow this pattern for all pages:

| Section | Background |
|---------|-----------|
| Hero | `#0a0806` |
| Stats strip | `#1c1814` |
| Who We Are | `#1c1814` |
| What We Do | `#f6f2eb` |
| Our Transition | `#2f2a24` |
| Federal Budget | `#ffffff` |
| Why Choose PPM | `#1c1814` |
| CTA banner | `#0a0806` |

The pattern is: dark → light → dark → light → dark → CTA. Never two light sections adjacent. Never two identical dark shades adjacent without a separator.

---

## Navigation — UPDATED

Navbar sits over the hero (transparent, then darkens on scroll). Contains:
- Logo left: **PPM · Property Project Marketing** in spaced caps, small
- Links centre/right: Home · About · Our People · Buyers (dropdown: Investors / Owner-Occupiers) · Developers · Insights · Testimonials · Resources · Contact
- Logged-in state: gold circular avatar with user initials (replaces Contact CTA)
- No social icons in the navbar

On scroll, navbar background: `rgba(10,8,6,0.92)` with `backdrop-filter: blur(12px)` and a `border-b border-white/[0.06]`.

---

## UI components

**Section labels:** 10px, uppercase, tracking `0.32em`, gold `#c8a96e` on dark backgrounds, muted `#8a7b6d` on light backgrounds. Always appear above the heading with 20px gap below.

**Divider/separator:** Not a horizontal rule — use `border-t border-white/[0.06]` on dark, `border-t border-[#ddd3c6]` on light.

**Cards (Why Choose PPM grid):** Dark background `#1c1814`, `border-t border-white/[0.06]`, padding `32px`. Number label in `#4a3f37` at 9px tracking `0.28em`. Title in white semibold. Body in `#9e8d7a`.

**Download cards (Resources page):** Background `#161C24`, border `0.5px solid rgba(200,169,110,0.15)`, border-radius `8px`. Gold PDF icon. Title white Inter 600 13px. Description `rgba(255,255,255,0.5)` Inter 400 12px. Download button: background `#c8a96e`, text `#0d1117`, Inter 600 12px, padding `8px 16px`, border-radius `3px`.

**Form inputs:** Background `rgba(255,255,255,0.06)`, border `0.5px solid rgba(200,169,110,0.3)`, padding `12px 16px`, Inter 400 13px white, placeholder `rgba(255,255,255,0.3)`. Focus: border `rgba(200,169,110,0.7)`. Error: border `#E24B4A`, error text `#E24B4A` 12px beneath field.

---

## What to avoid — UPDATED

- Forest green (`#1B2B1A`) or any green tones — this palette has been retired
- Cold or neutral blacks (use warm blacks `#0a0806`, `#1c1814` only)
- Cream as a primary background — it appears only as a contrast section, not the base
- Rounded, bubbly UI elements — all corners are sharp or minimal radius (3px max on buttons)
- Blue links anywhere
- Generic real estate aesthetic (blue and white, couples holding keys, stock photo suburbs)
- Over-designed hero animations or particle effects
- Heavy use of gold on large surfaces — it is an accent only
- Marketing language ("passionate about property", "your dream home", "amazing")
- Any reference to specific CRM, platform or software names

---

## What makes this design work

The combination of warm-black backgrounds, Cormorant Garamond in light weight, and the single restrained gold accent creates a look that reads as premium without being ostentatious. The typography column width (64–68 characters) forces disciplined writing. The alternating section rhythm creates pace. The parallax hero establishes mood before the user reads a word.

This is not a template — it is a considered design language. Every element should be tested against: *does this feel like a private wealth manager, or does it feel like a real estate agent?*

---

## Contact details

| | |
|---|---|
| Sales | sales@ppmproperty.com.au |
| Rental enquiries | rental@onlinepropertyservices.com.au |
| Admin / general | admin@onlinepropertyservices.com.au |
| Info | info@ppmproperty.com.au |
| Phone | 0418 520 714 · 0409 522 394 |
| Address | Level 7, 570 St Kilda Road, Melbourne VIC 3004 |
| ABN | 99 162 429 558 |
| Licence | 074846L |
| Website | www.ppmproperty.com.au |

---

*Prepared June 2026 · PPM Property Project Marketing*  
*Supersedes v1 brief dated June 2026*
