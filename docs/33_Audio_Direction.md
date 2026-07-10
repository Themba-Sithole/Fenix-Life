# Fenix Life — Official Audio Direction Document

**Document Version:** 1.0  
**Status:** Canonical — Audio Source of Truth  
**Last Updated:** July 10, 2026  
**Owner:** Audio Director & Lead Sound Designer  
**Audience:** Audio, Engineering, Design, QA, Live Ops, Marketing  

---

## Document Authority

This Audio Direction Document defines **how Fenix Life sounds**—music, ambient beds, UI feedback, business operations, city life, notifications, and legacy moments. It is subordinate to, and must not contradict:

| Document | Role |
|---|---|
| [FENIX-LIFE-PRODUCT-BIBLE.md](../prd/FENIX-LIFE-PRODUCT-BIBLE.md) | Premium tone, diegetic interface, pacing with breathing room |
| [Fenix-Life-Design-Constitution.md](./Fenix-Life-Design-Constitution.md) | Five Capitals, Living World, Legacy philosophy |
| [32_Art_Direction.md](./32_Art_Direction.md) | Visual pacing, phoenix theme, professional aesthetic |
| [34_UI_UX_Guidelines.md](./34_UI_UX_Guidelines.md) | Screen-specific UX and notification patterns |
| [Fenix-Life-Technical-Design-Document.md](./Fenix-Life-Technical-Design-Document.md) | Client audio architecture, asset streaming |

Audio must reinforce **professional calm at the surface, emotional depth at milestones**—never arcade chaos, never silent spreadsheet.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Sonic Identity & Phoenix Theme](#2-sonic-identity--phoenix-theme)
3. [Audio Architecture](#3-audio-architecture)
4. [Music Direction](#4-music-direction)
5. [Ambient & Environmental Audio](#5-ambient--environmental-audio)
6. [Menu & UI Sound Design](#6-menu--ui-sound-design)
7. [Business & Finance Sounds](#7-business--finance-sounds)
8. [City & World Sounds](#8-city--world-sounds)
9. [Notification & Alert Audio](#9-notification--alert-audio)
10. [Character & Life Event Audio](#10-character--life-event-audio)
11. [Mixing, Loudness & Platform Standards](#11-mixing-loudness--platform-standards)
12. [Accessibility & Player Controls](#12-accessibility--player-controls)
13. [Production Pipeline & Asset Specs](#13-production-pipeline--asset-specs)
14. [Governance & Review Checklist](#14-governance--review-checklist)

---

# 1. Executive Summary

Fenix Life audio design supports a **premium life and business simulation** where players spend hundreds of hours in dashboards, city maps, and family moments. The sonic palette is:

- **Modern orchestral-electronic hybrid** for music
- **Clean, tactile UI** sounds inspired by fintech apps
- **Layered city ambiences** that reflect time, weather, and district
- **Restrained celebration** for wins; **weighted gravity** for losses and legacy transitions

**Audio north star:**

> *Sounds like a city that works. Feels like a life that matters.*

---

# 2. Sonic Identity & Phoenix Theme

## 2.1 Brand Sound Keywords

| Keyword | Sonic Translation |
|---|---|
| Professional | Clean transients, minimal reverb on UI, controlled dynamics |
| Growth | Rising intervals, major keys, subtle pulse |
| Legacy | Warm strings, solo piano motifs, longer reverb tails |
| Resilience | Phoenix motif—minor resolve to major, ember crackle textures |
| Wealth | Not glittery—confident, understated, bass clarity |
| Living World | Always-on ambient beds; muting feels intentional |

## 2.2 Phoenix Leitmotif

A **four-note motif** (C–E♭–F–G or regionally transposed) appears:

- Main menu theme variation
- Company founding cinematic
- Death → heir succession sting
- Hall of Legends entry

**Never** loop the leitmotif obnoxiously during routine UI clicks.

## 2.3 Emotional Range

| Intensity | When | Example |
|---|---|---|
| 0–2 | Routine dashboard browsing | Soft office AC hum, faint keyboard |
| 3–5 | Active decision-making | UI confirm tones, subtle music stem |
| 6–8 | Major life events | Marriage, IPO, graduation themes |
| 9–10 | Legacy/death/rebirth | Full orchestral swell, phoenix motif |

Routine play stays **0–3**. Intensity 6+ is **rare by design**.

---

# 3. Audio Architecture

## 3.1 Bus Structure

```
Master
├── Music
│   ├── Menu
│   ├── Gameplay_Base
│   ├── Gameplay_Tension
│   └── Stingers
├── Ambient
│   ├── City
│   ├── Interior
│   └── Weather
├── UI
│   ├── Navigation
│   ├── Confirm
│   └── Error
├── Gameplay_SFX
│   ├── Business
│   ├── Finance
│   ├── Character
│   └── Transport
├── Voice (future)
└── Cinematic
```

## 3.2 Diegetic vs Non-Diegetic

| Type | Rule |
|---|---|
| **Diegetic** | Phone notification ping, office phone ring, city traffic—exists in world |
| **Non-diegetic** | Music score, abstract UI whoosh—supports player only |
| **Hybrid** | News broadcast VO from TV in world + subtle underscore |

Settings screen (`Settings.tsx`) exposes: Master, Music, Effects—mapped to buses above.

## 3.3 Simulation-Driven Audio

Audio parameters bind to simulation state (FSF engines):

| State Source | Audio Response |
|---|---|
| Time Engine (hour, season) | Ambient day/night, bird vs cricket mix |
| Weather Engine | Rain overlay, wind intensity |
| Economy Engine (recession flag) | Music tension stem crossfade |
| Company Engine (cash crisis) | Low-frequency pulse under company dashboard |
| Media Engine (breaking news) | Stinger + ticker tempo increase |

---

# 4. Music Direction

## 4.1 Genre & Instrumentation

**Primary palette:**

- Piano (felt, intimate)
- Strings (chamber, not epic trailer)
- Soft synth pads (analog warmth)
- Subtle electronic percussion (lo-fi hop tempo 70–90 BPM for menus)
- Light brass for business milestones only

**Avoid:** EDM drops, 8-bit chiptune (except optional retro phone mini-game), comedic cartoon stings.

## 4.2 Music Zones

| Zone | Track Behaviour | Reference Mood |
|---|---|---|
| **Main Menu** | Full theme, 2–3 min loop, skyline-synced stems | Ambitious, calm, forward-looking |
| **Home Screen** | Minimal stem; dynamic based on stress/financial health | Personal, domestic undertone |
| **Banking Dashboard** | Near-silent music; ambient finance office | Trust, focus |
| **Company Dashboard** | Low pulse; adds layer as company grows | Momentum, operator mode |
| **Stock Market** | Tension stem during volatility; stillness during flat market | Focus, risk |
| **City Map** | District-themed ambient music optional toggle | Urban life |
| **Family Screen** | Warm acoustic; softer dynamics | Intimacy |
| **Education** | Light, curious motifs | Growth, youth |
| **Timeline / Legacy** | Piano-led reflective | Memory, consequence |

## 4.3 Adaptive Music System

**Layers (stems):**

1. Base pad (always)
2. Rhythm (unlocked at company ownership)
3. Strings (unlocked at $1M net worth milestone—configurable)
4. Tension (economy recession or personal crisis)
5. Triumph (short stinger, not loop)

Crossfade duration: **2–4 seconds**. No hard cuts except stingers.

## 4.4 Licensed vs Original

- **Ship:** 100% original or properly licensed stems
- **Streaming / content creators:** Provide "Safe Mode" music pack (no DMCA risk) in settings

---

# 5. Ambient & Environmental Audio

## 5.1 Layer Model

Ambient tracks stack:

```
District Bed + Time-of-Day + Weather + Density + Interior Reverb
```

## 5.2 Location Ambient Beds

| Location | Day | Night |
|---|---|---|
| **Downtown** | Traffic, horns (distant), construction | Reduced traffic, HVAC, faint nightlife |
| **Residential** | Birds, lawn mowers, children (sparse) | Crickets, distant sirens |
| **Industrial** | Machinery hum, loading docks | Reduced activity |
| **University** | Chatter, bells | Quiet courtyard |
| **Bank Interior** | HVAC, muted footsteps, printer | Same (24h branches rare) |
| **Office** | Keyboard, coffee machine, HVAC | Empty office hum |

## 5.3 Interior Reverb Presets

| Space | RT60 | Notes |
|---|---|---|
| Small room | 0.3s | Apartment |
| Office open plan | 0.6s | Company screens |
| Bank lobby | 0.8s | Banking dashboard diegetic |
| Auditorium | 1.2s | Graduation events |

---

# 6. Menu & UI Sound Design

## 6.1 UI Sonic Principles

- **Short:** 50–300ms for clicks; no long whooshes
- **Soft transients:** No piercing highs
- **Consistent family:** Same material metaphor (glass + wood hybrid)

## 6.2 UI Sound Catalog

| Action | Sound Character | Duration |
|---|---|---|
| Button hover | None (visual only) | — |
| Button click | Soft glass tap | 80ms |
| Tab switch | Light slide + click | 120ms |
| Toggle on | Positive chimed lock | 150ms |
| Toggle off | Muted thunk | 100ms |
| Modal open | Air swell up | 200ms |
| Modal close | Air swell down | 180ms |
| Back navigation | Reverse click | 100ms |
| Scroll (optional) | None | — |
| Form submit success | Emerald chime (2 notes) | 250ms |
| Form error | Low muted buzz | 200ms |
| Chart load | Subtle data sweep | 300ms |

## 6.3 Main Menu Specifics

- Ticker **does not** tick audibly by default (visual only); optional toggle
- "New Life" — hopeful major chord
- "Continue" — single warm note
- Skyline ambient at **-24 LUFS** relative to master

---

# 7. Business & Finance Sounds

## 7.1 Banking Dashboard

| Event | Sound |
|---|---|
| Salary deposit | Soft coin cascade (3 layers max) |
| Payment sent | Single debit tone |
| Loan approved | Formal stamp + chime |
| Loan denied | Muted negative tone (not punitive) |
| Credit score change | Up/down gliss (±50ms) |

## 7.2 Company Dashboard

| Event | Sound |
|---|---|
| Revenue milestone | Brief triumph stinger |
| Employee hired | Office door + handshake texture |
| Employee quit | Chair roll, door close (subtle) |
| Product launch | Startup ping + crowd murmur (diegetic) |
| Bankruptcy warning | Low pulse under ambient (tension stem) |
| IPO | Market bell variant (legally distinct from NYSE recording) |

## 7.3 Stock Market

| Event | Sound |
|---|---|
| Order executed | Terminal confirm beep |
| Price alert triggered | Double beep |
| Margin call | Urgent but not panic alarm |
| Dividend received | Cash register subtle |

## 7.4 Real Estate & Vehicles

| Event | Sound |
|---|---|
| Property purchased | Key handoff + door unlock |
| Mortgage signed | Pen on paper |
| Vehicle purchased | Engine start (interior), door close |
| Vehicle sold | Cash tone + drive-away fade |

---

# 8. City & World Sounds

## 8.1 City Map (Phaser)

- **Zoom level** controls ambient density
- **Selected building** plays interior one-shot sample
- **Traffic** as looped bed; spike during rush hour (Time Engine)

## 8.2 Smartphone Diegetic Apps

Phone screen (`/phone`) treats apps as **in-world**:

| App | Audio |
|---|---|
| Messages | iOS-style but legally distinct notification |
| News | Optional auto-read TTS (accessibility) |
| Banking app | Same as dashboard, quieter |
| Social | Like/follow micro-sounds |

## 8.3 Distance & Occlusion

- Sounds attenuate with map zoom
- Interior screens duck city ambient by **-6 dB**

---

# 9. Notification & Alert Audio

## 9.1 Priority Tiers

| Tier | Visual + Audio | Example |
|---|---|---|
| **P0 Critical** | Red badge + 2-tone alert | Bankruptcy filing, health emergency |
| **P1 Important** | Gold badge + single chime | Board meeting, loan due |
| **P2 Informational** | Emerald dot + soft ping | Dividend, news about player |
| **P3 Ambient** | No sound | World news, background events |

Home Screen bell icon (`Bell`) aggregates P0–P2.

## 9.2 Notification Fatigue Rules

- Max **3 sounds per real-time minute** during fast-forward
- Duplicate notifications within 30s: visual only
- Player can disable categories in Settings

## 9.3 News Feed Audio

`NewsFeed` screen: optional newspaper rustle on open; **no** voiceover by default. Breaking news uses Media Engine priority for stinger eligibility.

---

# 10. Character & Life Event Audio

## 10.1 Life Stages

| Event | Musical Treatment |
|---|---|
| Birth (as parent) | Gentle lullaby fragment |
| Graduation | Processional short form |
| Wedding | String quartet 30s |
| Divorce | Piano minor resolve |
| Promotion | Corporate stinger |
| Illness | Ambient dampening, heartbeat subtle (tasteful) |
| Death | Music fade out 3s → silence 2s → phoenix motif |
| Heir succession | Motif major resolution |

## 10.2 Five Capitals Audio Identity

Optional subtle motifs when viewing capital-specific screens:

| Capital | Instrument |
|---|---|
| Financial | Clean marimba |
| Human | Solo piano |
| Social | Warm guitar |
| Business | Soft brass |
| Legacy | Full strings |

---

# 11. Mixing, Loudness & Platform Standards

## 11.1 Loudness Targets

| Platform | Integrated Loudness | True Peak |
|---|---|---|
| PC/Mac | -16 LUFS (music), -20 LUFS (ambient) | -1 dBTP |
| Mobile | -18 LUFS | -1 dBTP |
| Console (future) | Platform-specific (TRC) | -1 dBTP |

## 11.2 Mix Priorities (ducking order)

1. Critical alerts
2. UI confirmations
3. Voice / TTS
4. Gameplay SFX
5. Music
6. Ambient

Sidechain: Music **-3 dB** when UI confirm plays; **-6 dB** during critical alert.

## 11.3 Format Specs

| Type | Format | Sample Rate | Channels |
|---|---|---|---|
| Music | OGG Vorbis + AAC fallback | 48 kHz | Stereo |
| SFX | OGG / WAV source | 48 kHz | Mono/Stereo |
| Ambient beds | OGG loop | 48 kHz | Stereo |
| Voice (future) | AAC | 48 kHz | Mono |

---

# 12. Accessibility & Player Controls

Settings (`Settings.tsx`) must implement:

| Control | Range | Default |
|---|---|---|
| Master Volume | 0–100% | 80% |
| Music Volume | 0–100% | 70% |
| Effects Volume | 0–100% | 80% |
| UI Sounds Only mode | On/Off | Off |
| Screen Reader Mode | Disables non-essential SFX | Off |
| Subtitles + Captions (future) | On/Off | On |

**Requirements:**

- All gameplay-critical info **never audio-only**
- Visual waveform optional for deaf/HoH players (future)
- Mono mix option for single-speaker devices

---

# 13. Production Pipeline & Asset Specs

## 13.1 Workflow

```
Brief → Compose/Design → Review → Implement → Mix → QA (LUFS + fatigue) → Ship
```

## 13.2 Naming Convention

```
{category}_{context}_{descriptor}_{variant}.{ext}
```

Examples: `ui_confirm_button_primary.ogg`, `ambient_city_downtown_day_loop.ogg`, `music_menu_main_v2.ogg`

## 13.3 Middleware

Recommended: **FMOD** or **Wwise** for adaptive music; Web Audio API fallback for lightweight web prototype.

Integration point: Client tier per TDD §1.2.1; no audio logic in simulation engines.

## 13.4 Version Control

- Source projects in `/audio-src/`
- Runtime assets in `/public/audio/` or CDN
- Manifest JSON with hash, duration, bus routing, loop points

---

# 14. Governance & Review Checklist

| # | Question |
|---|---|
| 1 | Does audio support **premium professional** tone? |
| 2 | Is routine browsing **quiet** (intensity 0–3)? |
| 3 | Are critical events **never audio-only**? |
| 4 | Does phoenix motif appear only at **appropriate milestones**? |
| 5 | Are sounds **fatigue-tested** at 2× game speed? |
| 6 | Do LUFS targets **pass** on PC and mobile? |
| 7 | Are diegetic vs non-diegetic sources **clear**? |
| 8 | Does simulation state **drive** ambient/music layers? |
| 9 | Are Settings controls **complete** for category muting? |
| 10 | Is there a **rights clearance** record for all assets? |

---

*End of Audio Direction Document*
