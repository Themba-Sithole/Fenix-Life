# Fenix Life — Official Art Direction Document

**Document Version:** 1.0  
**Status:** Canonical — Visual Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Creative Director & Art Lead  
**Audience:** Art, UI/UX, Engineering, Audio, Marketing, QA, Live Ops, Partners  

---

## Document Authority

This Art Direction Document defines **how Fenix Life looks, feels, and moves** across every surface—UI dashboards, 2D world scenes, icons, typography, motion, and marketing. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Premium positioning, clarity-at-surface philosophy, diegetic interface |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, Citizen Equality, Legacy philosophy |
| [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | Screen layouts, navigation, component usage |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Client stack (React, Phaser 3, Tailwind), asset pipeline |

When visual polish conflicts with readability or accessibility, **readability wins**. When visual flair conflicts with professional trust (banking, HR, legal screens), **trust wins**.

Every art asset must trace to:

1. A Product Bible design tenet (§3)
2. A section of this document
3. A UI/UX guideline where applicable

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Visual Identity & Phoenix Theme](#2-visual-identity--phoenix-theme)
3. [Colour System](#3-colour-system)
4. [Typography](#4-typography)
5. [Iconography & Illustration](#5-iconography--illustration)
6. [Layout & Spatial Language](#6-layout--spatial-language)
7. [2D World Art Direction](#7-2d-world-art-direction)
8. [UI Component Visual Standards](#8-ui-component-visual-standards)
9. [Data Visualization & Charts](#9-data-visualization--charts)
10. [Animation & Motion](#10-animation--motion)
11. [Photography & Hero Imagery](#11-photography--hero-imagery)
12. [Accessibility & Inclusive Design](#12-accessibility--inclusive-design)
13. [Asset Production Pipeline](#13-asset-production-pipeline)
14. [Governance & Review Checklist](#14-governance--review-checklist)

---

# 1. Executive Summary

Fenix Life is a **premium 2D life and business simulation** whose interface reads like executive software—banking portals, HR dashboards, Bloomberg-style market views—while its world art evokes a living modern city with phoenix symbolism woven subtly through growth, renewal, and legacy.

**Visual north star:**

> *Professional at first glance. Alive on second look. Phoenix in the details.*

The art direction rejects:

- Cartoonish mobile-game chrome
- Generic dark-mode crypto aesthetics
- Cluttered spreadsheet ugliness
- Over-saturated "gamey" HUDs

The art direction embraces:

- Fintech-grade clarity with sim-depth beneath
- Emerald growth accents on authoritative navy foundations
- Gold reserved for achievement, legacy, and premium moments
- Soft gradients, rounded cards, and confident whitespace

---

# 2. Visual Identity & Phoenix Theme

## 2.1 Brand Essence

| Attribute | Expression |
|---|---|
| **Wealth** | Clean numerals, confident hierarchy, restrained luxury |
| **Growth** | Upward motion, emerald accents, area charts that breathe |
| **Professionalism** | Grid alignment, consistent spacing, no decorative noise |
| **Innovation** | Modern sans-serif, subtle glass overlays, crisp iconography |
| **Legacy** | Gold highlights, timeline motifs, generational visual threads |
| **Resilience** | Phoenix appears in logo, loading states, rebirth transitions—not as mascot clutter |

## 2.2 Phoenix Motif Usage

The phoenix is **symbolic**, not cartoon mascot.

**Approved placements:**

- Main menu logo and subtle parallax silhouette in skyline
- Character death → heir selection transition (feather dissolve, warm ember particles)
- Company bankruptcy → restructuring flow (ash-to-emerald gradient recovery animation)
- Legacy Score milestones and Hall of Legends
- Loading screen progress indicator (abstract wing arc, not a character)

**Prohibited placements:**

- Phoenix avatar companions following the player
- Comic speech bubbles with phoenix reactions
- Random phoenix stickers on banking forms

## 2.3 Reference Blend

Target aesthetic sits at the intersection of:

| Reference | What We Take |
|---|---|
| Modern fintech (Revolut, Mercury, Robinhood Pro) | Dashboard hierarchy, card layouts, trust |
| HR/ERP dashboards (Workday, BambooHR) | Tables, org charts, employee views |
| BitLife / Game Dev Tycoon | Diegetic life-sim framing, not their visual polish level |
| Startup Company | Business operator fantasy |
| The Sims 4 UI | Character stat clarity, not pastel playfulness |

---

# 3. Colour System

## 3.1 Core Palette (Canonical)

These tokens are defined in `src/styles/theme.css` and **must not drift** without Art Director approval.

| Token | Hex | Role |
|---|---|---|
| `--fenix-navy` | `#0B132B` | Primary dark backgrounds, hero overlays, authority |
| `--fenix-blue` | `#1C2541` | Secondary dark, headers, navigation bars, headings |
| `--fenix-emerald` | `#2EC4B6` | Primary accent, growth, positive trends, CTAs, links |
| `--fenix-gold` | `#F4B400` | Achievement, warnings (non-critical), legacy, prestige badges |
| `--fenix-white` | `#FFFFFF` | Card surfaces, primary text on dark |
| `--fenix-light` | `#F5F7FA` | Page backgrounds, subtle gradients |

## 3.2 Extended Semantic Palette

| Semantic | Hex | Usage |
|---|---|---|
| Success | `#2EC4B6` | Gains, deposits, approvals, health positive |
| Success Deep | `#1C9B8F` | Gradient end states, pressed buttons |
| Danger | `#DC2626` | Losses, defaults, critical alerts |
| Danger Soft | `#FEE2E2` | Error backgrounds |
| Warning | `#F4B400` | Due dates, medium priority, energy/stress |
| Info | `#3B82F6` | Neutral informational badges |
| Muted Text | `#6B7280` | Secondary labels, axis labels |
| Border | `#2EC4B6` at 20% opacity | Card borders (`border-[#2EC4B6]/20`) |

## 3.3 Five Capitals Colour Mapping

Each capital has a **secondary accent** for badges, profile rings, and timeline event chips. Financial and Business share emerald/navy; others extend without breaking the core palette.

| Capital | Primary Accent | Secondary |
|---|---|---|
| Financial Capital | Emerald `#2EC4B6` | Navy `#1C2541` |
| Human Capital | Sky `#38BDF8` | Blue `#1C2541` |
| Social Capital | Rose `#FB7185` | Navy `#1C2541` |
| Business Capital | Gold `#F4B400` | Emerald `#2EC4B6` |
| Legacy Capital | Gold `#F4B400` | Deep Purple `#7C3AED` |

## 3.4 Colour Application Rules

1. **80/15/5 rule:** 80% neutral (white, light gray, navy text), 15% emerald structural accent, 5% gold highlight moments.
2. **Never** use emerald and gold at equal visual weight in the same component—they compete.
3. **Charts:** Revenue/profit lines use emerald + gold (see Company Dashboard). Losses use danger red only.
4. **Dark headers:** Always apply gradient overlay `from-[#0B132B]/80 to-[#1C2541]/60` on hero photography.
5. **Dark mode** (future): Navy becomes base; cards lift to `#1C2541`; emerald brightens to `#3DD9CB`.

## 3.5 Contrast Requirements

All text pairings must meet **WCAG 2.1 AA** minimum (4.5:1 body, 3:1 large text). Pre-approved pairings:

| Foreground | Background | Pass |
|---|---|---|
| `#1C2541` | `#FFFFFF` | ✓ |
| `#FFFFFF` | `#0B132B` | ✓ |
| `#2EC4B6` | `#FFFFFF` | ✓ (large text / icons) |
| `#6B7280` | `#FFFFFF` | ✓ (secondary only) |

---

# 4. Typography

## 4.1 Type Stack

| Role | Family | Fallback | Notes |
|---|---|---|---|
| **UI Primary** | Inter | system-ui, sans-serif | All dashboards, forms, tables |
| **Display / Hero** | Inter (700–800) | — | Main menu, screen titles |
| **Monospace / Data** | JetBrains Mono | ui-monospace | Account numbers, tickers, IDs |
| **2D World Labels** | Inter Medium | — | Map pins, building labels |

## 4.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-xl` | 36px / 2.25rem | 700 | 1.2 | Hero screen titles |
| `display-lg` | 30px / 1.875rem | 700 | 1.25 | Dashboard headers |
| `heading-md` | 24px / 1.5rem | 600 | 1.3 | Card titles |
| `heading-sm` | 20px / 1.25rem | 600 | 1.4 | Section headers |
| `body-md` | 16px / 1rem | 400 | 1.5 | Body copy |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | Table cells, metadata |
| `caption` | 12px / 0.75rem | 500 | 1.4 | Badges, axis labels |
| `data-lg` | 30px / 1.875rem | 600 | 1.2 | Net worth, KPI values |
| `data-md` | 24px / 1.5rem | 600 | 1.2 | Account balances |

## 4.3 Typography Rules

- **Tabular figures** enabled for all currency and statistics (`font-variant-numeric: tabular-nums`).
- **Currency:** Always prefix `$`, use `toLocaleString()` grouping, two decimal places for cents contexts only.
- **Percentages:** Explicit `+` or `-` sign for changes; colour-coded via semantic tokens.
- **No all-caps** except ticker symbols and legal micro-copy.
- **Maximum two weights** per screen section (e.g., 600 + 400).

---

# 5. Iconography & Illustration

## 5.1 Icon System

**Primary library:** Lucide React (consistent with current codebase).

| Context | Size | Stroke |
|---|---|---|
| Navigation | 20px | 1.5px |
| Card header | 20px | 2px |
| Inline stat | 16px | 2px |
| Quick action tile | 24px | 2px |
| Empty state | 48px | 1.5px |

## 5.2 Icon Semantic Map

| Domain | Icon | Colour |
|---|---|---|
| Banking | `DollarSign`, `PiggyBank`, `CreditCard` | Emerald |
| Company | `Briefcase`, `Building2`, `Users` | Emerald / Navy |
| Stocks | `TrendingUp`, `TrendingDown`, `BarChart3` | Emerald / Red |
| Real Estate | `Home`, `MapPin` | Gold / Emerald |
| Vehicles | `Car` | Navy |
| Education | `GraduationCap` | Emerald |
| Family | `Users`, `Heart` | Gold / Rose |
| News | `Newspaper`, `Rss` | Navy |
| Legacy | `Award`, `Crown` | Gold |

## 5.3 Illustration Style

- **Flat-vector with soft gradients** for empty states and onboarding.
- **Isometric city blocks** (optional) for map loading screens—limited palette, no neon.
- **No** 3D renders in UI unless marketing-specific.
- **Character portraits:** 2D illustrated busts with modular layers (see Character Creation); consistent outline weight.

## 5.4 Logo & App Icon

- Wordmark: **Fenix Life** in Inter Bold; "Fenix" may use emerald accent on the "i" dot as subtle flame.
- App icon: Abstract phoenix wing forming upward chart curve on navy circle.

---

# 6. Layout & Spatial Language

## 6.1 Grid System

| Breakpoint | Max Width | Columns | Gutter |
|---|---|---|---|
| Mobile | 100% | 4 | 16px |
| Tablet (`md`) | 100% | 8 | 24px |
| Desktop (`lg`) | 1280px (`max-w-7xl`) | 12 | 24px |

## 6.2 Spacing Scale (Tailwind-aligned)

`4, 6, 8, 12, 16, 24, 32, 48` — use consistently. Dashboard page padding: `p-6`. Card padding: `p-6`.

## 6.3 Elevation & Shadows

| Level | Shadow | Usage |
|---|---|---|
| 0 | none | Flat tables |
| 1 | `shadow-lg` | Standard cards |
| 2 | `shadow-xl` + hover | Interactive account cards |
| 3 | `shadow-2xl` | Modals, drawers |

## 6.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Cards (default) |
| `rounded-full` | 9999px | Avatars, badges |

## 6.5 Hero Header Pattern

All major dashboards (Banking, Company, Stock Market) use the **48-height hero band**:

```
┌─────────────────────────────────────────────────────────────┐
│  [Photography + navy gradient overlay]                       │
│  ← Back          Screen Title              KPI Hero Value   │
│                  Subtitle                                    │
└─────────────────────────────────────────────────────────────┘
│  [Metric cards row]                                          │
│  [Primary chart 2/3]  [Secondary panel 1/3]                  │
```

---

# 7. 2D World Art Direction

## 7.1 City Map (Phaser 3)

| Element | Style |
|---|---|
| **Perspective** | Top-down or slight isometric (locked per world, no mixing) |
| **Buildings** | Simplified geometric silhouettes; window lights at night |
| **Roads** | Muted gray; traffic as animated dots, not detailed sprites |
| **Districts** | Colour-coded zones: commercial (navy tint), residential (warm gray), industrial (slate) |
| **Time of day** | Global tint overlay; emissive windows at night |
| **Citizens** | 2D sprite dots/clusters at T2/T3; detailed sprite only for player proximity |

## 7.2 Asset Resolution

| Asset Type | Base Size | Format |
|---|---|---|
| Building sprites | 64×64 to 128×128 | PNG/WebP |
| Tileset | 32×32 | PNG |
| Character layers | 256×256 | PNG |
| UI never uses unscaled world sprites | — | — |

## 7.3 Animation in World

- **Idle:** Subtle (flags, traffic, fountain particles)
- **Performance budget:** < 5% frame time for ambient animation on mid-tier mobile
- **Weather:** Particle overlays from Weather Engine state (rain, snow)

---

# 8. UI Component Visual Standards

Built on **shadcn/ui + Radix + Tailwind** (see `src/app/components/ui/`).

| Component | Visual Standard |
|---|---|
| **Button Primary** | `bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] text-white` |
| **Button Ghost (on dark)** | `text-white hover:bg-white/10` |
| **Card** | White surface, `border-[#2EC4B6]/20 shadow-lg` |
| **Badge Active** | Emerald fill or outline with 10% tint background |
| **Badge Warning** | Gold/red per severity |
| **Progress bars** | Stat-coloured fills on `#E5E7EB` track |
| **Tables** | Zebra optional; sticky header; row hover `#F5F7FA` |
| **Inputs** | White bg, navy text, emerald focus ring |
| **Toasts (Sonner)** | Top-right; icon + semantic border accent |

---

# 9. Data Visualization & Charts

**Library:** Recharts (current implementation).

## 9.1 Chart Palette

| Series | Colour | Stroke Width |
|---|---|---|
| Primary metric | `#2EC4B6` | 3px |
| Secondary metric | `#F4B400` | 3px |
| Tertiary | `#1C2541` | 2px |
| Negative | `#DC2626` | 3px |
| Grid | `#E0E0E0` dashed | 1px |
| Axis | `#6B7280` | — |

## 9.2 Chart Types by Screen

| Screen | Chart Types |
|---|---|
| Banking Dashboard | Area (balance history), Bar (cash flow), transaction list |
| Company Dashboard | Line (revenue/profit), Pie (departments), KPI cards |
| Stock Market | Candlestick/line, volume bars, watchlist sparklines |
| Timeline | Vertical event river with capital-coloured chips |
| Home Screen | Progress bars for vitals, mini stat cards |

## 9.3 Chart UX Rules

- Always show **units** in tooltip (USD, %, count).
- **Zero baseline** for honest bar charts unless log scale explicitly toggled.
- Provide **legend** when ≥2 series.
- Animate on first mount only (300ms ease-out); no continuous chart animation.

---

# 10. Animation & Motion

**Library:** Motion (Framer Motion successor) for UI; Phaser tweens for world.

## 10.1 Timing Tokens

| Token | Duration | Easing |
|---|---|---|
| `instant` | 100ms | ease-out |
| `fast` | 200ms | ease-out |
| `normal` | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `slow` | 500ms | ease-in-out |
| `emphasis` | 800ms | spring (stiffness 300, damping 30) |

## 10.2 Motion Principles

1. **Functional, not decorative** — motion confirms actions, reveals hierarchy, or celebrates milestones.
2. **Reduce motion** — honour `prefers-reduced-motion`; disable parallax and confetti.
3. **Screen transitions** — fade + 8px vertical slide (normal).
4. **Card hover** — shadow elevation only; no scale on data-heavy cards.
5. **Phoenix rebirth** — reserved for death/succession and major company restructuring (emphasis).

## 10.3 Main Menu Ambient Motion

Per UI prototype spec: skyline parallax, day/night cycle preview, ticker scroll, floating stats—all **subtle** and pausable.

---

# 11. Photography & Hero Imagery

Dashboard heroes use **full-bleed photography** with gradient overlay (see BankingDashboard, CompanyDashboard).

| Screen | Subject Matter |
|---|---|
| Banking | Finance technology, vault aesthetics, abstract currency |
| Company | Modern office towers, boardrooms, teamwork |
| Real Estate | Architecture, interiors, skyline |
| Education | Campus, libraries, graduation |
| Stock Market | Trading floors, abstract charts |
| Family | Warm domestic, multi-generational (respectful, diverse) |

**Rules:**

- License: royalty-free or owned; document in asset manifest.
- **Diversity:** Reflect global player base in imagery.
- Never use real bank logos or trademarked buildings without clearance.
- Fallback: `ImageWithFallback` component with branded gradient placeholder.

---

# 12. Accessibility & Inclusive Design

Aligned with Product Bible §18 and Constitution accessibility articles.

| Requirement | Standard |
|---|---|
| Colour contrast | WCAG 2.1 AA minimum |
| Focus indicators | 2px emerald ring, visible on all interactives |
| Touch targets | 44×44px minimum |
| Screen reader | All icons with `aria-label`; charts with data table fallback |
| Colour-blind modes | Do not rely on colour alone for gain/loss; use icons and signs |
| Text scaling | Support 200% browser zoom without horizontal scroll on dashboards |
| Photos | Meaningful `alt` text or decorative `alt=""` |
| Motion | `prefers-reduced-motion` disables non-essential animation |

---

# 13. Asset Production Pipeline

## 13.1 Workflow

```
Concept → Art Director Review → Production → Engineering Import → QA Visual Pass → Ship
```

## 13.2 File Naming

```
{domain}_{type}_{name}_{variant}.{ext}
```

Examples: `ui_icon_banking_emerald.svg`, `world_building_office_01.webp`

## 13.3 Deliverable Formats

| Type | Master | Runtime |
|---|---|---|
| UI icons | SVG | SVG or icon font |
| Illustrations | Figma / SVG | WebP |
| World sprites | Aseprite / PSD | WebP atlas |
| Photography | RAW / JPG | WebP (CDN) |

## 13.4 Source of Truth

- **Figma:** Fenix Life Design System (link TBD in doc 39)
- **Code tokens:** `src/styles/theme.css`
- **Components:** `src/app/components/ui/`

---

# 14. Governance & Review Checklist

Every screen or asset ships after passing:

| # | Question |
|---|---|
| 1 | Does it pass the **CEO Test** (recognizable professional layout)? |
| 2 | Are **core palette tokens** used (no one-off hex)? |
| 3 | Is **emerald/gold** hierarchy correct (80/15/5)? |
| 4 | Are **icons** from Lucide with consistent sizing? |
| 5 | Do **charts** follow palette and honesty rules? |
| 6 | Is **contrast** AA compliant? |
| 7 | Does **motion** respect reduced-motion? |
| 8 | Is phoenix branding **subtle**, not mascot clutter? |
| 9 | Does the asset connect to a **Five Capital** identity where relevant? |
| 10 | Is there an **accessibility fallback** for non-visual data? |

**Amendments:** Minor token additions require Art Director approval. Palette changes require Creative Director + UX Director sign-off and migration plan for existing screens.

---

*End of Art Direction Document*
