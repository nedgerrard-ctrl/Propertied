# PPM — Claude Design Update Prompt
**Use this prompt first, before any new design work.**  
Paste this entire document into Claude Design to update the existing design system.

---

I need to update the PPM design system. Keep all existing components and page structures exactly as built. Make only the following changes:

## 1. Replace the colour palette entirely

The cream-and-green palette is retired. Replace with:

| Token | Old value | New value |
|-------|-----------|-----------|
| Page background | `#FAF5EA` (cream) | `#0a0806` (warm near-black) |
| Primary dark section | `#1B2B1A` (forest green) | `#1c1814` (dark warm brown) |
| Mid dark section | `#243621` (mid green) | `#2f2a24` (mid warm brown) |
| Deep dark / footer | `#131F12` (deep green) | `#0a0806` |
| Cream (contrast only) | `#FAF5EA` | `#f6f2eb` (warm cream — light sections only, not default) |
| Gold accent | `#C4883A` | `#c8a96e` (antique gold — quieter, more sophisticated) |
| Gold hover | `#B07A30` | `#b8960a` |
| Gold soft (on dark) | `#D6A765` | `#c8a96e` |
| Body text on dark | `rgba(237,233,221,0.66)` | `#9e8d7a` |
| Muted text on dark | — | `#8a7b6d` |
| Section labels on dark | — | `#c8a96e` |
| Subtle text / numbers | — | `#6b5e54` |
| Decorative / hairlines | — | `#4a3f37` |
| Body text on light | `#2A2A26` | `#3d3530` |
| Headings on light | `#1A1A18` | `#1f1a17` |
| Hairline on dark | `rgba(245,241,232,0.16)` | `rgba(255,255,255,0.06)` |
| Gold border subtle | `rgba(196,136,58,0.40)` | `rgba(200,169,110,0.15)` |

**Important:** The warm blacks (`#0a0806`, `#1c1814`) have a brown undertone — they are not grey or charcoal. This warmth is what makes the gold accent read as premium rather than garish. Do not substitute neutral blacks.

## 2. Change the display typeface

| | Old | New |
|--|-----|-----|
| Display font | Playfair Display, weight 700 (Bold) | Cormorant Garamond, weight 300 (Light) |
| Hero heading | Playfair Display Bold | Cormorant Garamond Light |
| All h1–h3 | Playfair Display Bold | Cormorant Garamond Light |
| Stats numbers | Playfair Display | Cormorant Garamond Light |
| Hero italic accent | — | Cormorant Garamond Light Italic in `#c8a96e` |

Keep Inter for all body text, UI labels, buttons, captions, and eyebrow labels. Only the display/heading font changes.

The hero headline reads:  
**Management Consultants.**  
*Licensed Real Estate Agents.* ← this line in Cormorant Garamond Light Italic, colour `#c8a96e`  
**Off-the-Plan Specialists.**

## 3. Update section background rhythm

Pages should alternate dark and light sections in this order:

| Section | Background |
|---------|-----------|
| Hero | `#0a0806` |
| Stats strip | `#1c1814` |
| Who We Are | `#1c1814` |
| What We Do | `#f6f2eb` (cream) |
| Our Transition | `#2f2a24` |
| Federal Budget | `#ffffff` |
| Why Choose PPM | `#1c1814` |
| CTA banner | `#0a0806` |

Never place two cream or white sections adjacent to each other.

## 4. Update button styles

- Primary button: `border: 1px solid #c8a96e`, text `#c8a96e`, background transparent. On hover: background fills to `#c8a96e`, text becomes `#0a0806`.
- Secondary button: `border: 1px solid rgba(255,255,255,0.20)`, text `#8a7b6d`. On hover: border lightens, text becomes white.
- No rounded corners. Border-radius 0 or maximum 2px.

## 5. Update inline links

All inline text links: `border-bottom: 1px solid rgba(200,169,110,0.40)`, colour `#c8a96e`. On hover: border opacity increases to 1. No blue links anywhere.

## 6. Add hero vertical accent

On the hero section, add a vertical line on the left edge:  
`width: 1px, height: 120px, background: linear-gradient(to bottom, transparent, #c8a96e, transparent)`  
Positioned `left: 32px, top: 50%, transform: translateY(-50%)`.

## 7. Update Higgsfield video brief

Change the hero film grade direction from "warm vivid sunlit" to:
- Cinematic, dark-graded, slow camera moves
- Melbourne CBD at dusk or golden hour
- Building reflections on glass and water
- Mood: private wealth manager, not real estate agent
- Harmonise footage with warm blacks (`#0a0806`), not cream
- No fast cuts, no lens flares, no crowds

---

## What stays the same

- All page structures and component layouts
- All copy and content
- Inter for body, UI, buttons, labels
- Navigation structure
- Footer layout and content
- Form field layouts
- Card grid structures

---

*PPM Property Project Marketing · June 2026*  
*Applies to: all pages in the PPM design system*
