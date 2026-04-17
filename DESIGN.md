# Design System — Vibe Rock Band

## Product Context
- **What this is:** A cinematic web app where the user directs a virtual AI rock band and the band responds visually and musically in a staged concert setting.
- **Who it's for:** Portfolio viewers, technically curious product people, and anyone evaluating the builder's product taste, interaction design, and front-end craft.
- **Space/industry:** Creative AI, interactive music, experimental web products.
- **Project type:** Consumer-facing web app and portfolio artifact.

## Aesthetic Direction
- **Direction:** Cinematic analog spectacle.
- **Decoration level:** Intentional to expressive.
- **Mood:** The app should feel like stepping into a live venue, not opening a software dashboard. Warm spotlight, smoke, deep shadow, metallic accents, poster-like framing, and a sense that every state is part of the show.
- **Reference posture:** Use the approved design and product plan as the source of truth. Do not drift toward generic AI-app neon or SaaS dashboard language.

## Core Visual Principles
- The stage is the star. UI exists to support the performance, not compete with it.
- Atmosphere beats novelty. Use lighting, texture, framing, and typography to create presence.
- Warm cinematic color wins over synthetic futurism. Avoid purple-first AI visuals.
- High contrast, high legibility. Drama is not an excuse for muddy copy or inaccessible controls.
- Themed moments should feel editorial. Theme picker and recap card can take bigger visual swings than the main control surfaces.

## Typography
- **Display/Hero:** `Bricolage Grotesque` — the primary display face. Use for hero headlines, major section titles, theme names, and bold stage copy. It has enough bite to feel authored without tipping into costume.
- **Accent Display:** `Fraunces` — use sparingly for recap-card headlines, pull quotes, and special editorial moments where a more dramatic, poster-like tone helps.
- **Body:** `Instrument Sans` — use for prompts, labels, controls, supporting copy, and long-form UI text. This keeps the system readable under the theatrical layer.
- **UI/Labels:** `Instrument Sans` — same as body, typically medium or semibold.
- **Data/Tables:** `Instrument Sans` with tabular numbers when possible, or `IBM Plex Mono` for more technical surfaces.
- **Code / Trace / Dev Panel:** `IBM Plex Mono`.
- **Loading:** Google Fonts is acceptable for the prototype phase. Self-host later if needed.

### Type Scale
- `hero-xl`: 80-96px
- `hero-lg`: 56-72px
- `display`: 36-48px
- `section`: 24-32px
- `body-lg`: 18-20px
- `body`: 16px
- `body-sm`: 14px
- `meta`: 11-12px uppercase tracking

### Typography Rules
- Do not use more than two expressive type moments on a screen.
- Use `Fraunces` as an accent, not the default display system.
- Keep controls in `Instrument Sans`, never decorative faces.
- Uppercase meta labels are allowed, but keep them sparse and intentional.

## Color
- **Approach:** Restrained cinematic palette.

### Core Palette
- **Obsidian Black:** `#0B0A0A`
- **Stage Brown-Black:** `#171312`
- **Smoked Umber:** `#2A1E1B`
- **Brass Parchment:** `#CBB89D`
- **Warm Spotlight:** `#F4E7D3`
- **Ember Red:** `#A23621`
- **Steel Haze:** `#6E7C86`
- **Oxidized Teal:** `#2F5D50`

### Usage
- **Primary surfaces:** `#0B0A0A`, `#171312`, `#2A1E1B`
- **Primary text on dark surfaces:** `#F4E7D3`
- **Secondary text:** lowered-opacity spotlight text or `#CBB89D`
- **Primary accent:** `#A23621`
- **Secondary accent:** `#2F5D50`, rare and controlled
- **Cool neutral support:** `#6E7C86`

### Semantic Colors
- **Success:** `#2F5D50`
- **Warning:** `#C27A2C`
- **Error:** `#A23621`
- **Info:** `#6E7C86`

### Color Rules
- Do not default to blue, violet, or rainbow gradients.
- Light should feel emitted or reflected, not sprayed across the interface.
- Red is for intensity and emphasis, not for everything clickable.
- Teal is a release valve, not a co-star.

### Dark and Light Mode
- **Dark mode:** This is the primary mode and the default design target.
- **Light mode:** Use parchment and warm paper-like surfaces, not stark white. Keep the same cinematic identity with reduced shadow density and preserved warmth.
- **Rule:** Dark mode gets the first design pass. Light mode is a translation, not a separate personality.

## Spacing
- **Base unit:** `8px`
- **Density:** Spacious in framing, taut in controls.
- **Scale:** `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80`

### Spacing Rules
- Give the stage room to breathe.
- Use larger vertical gaps between major regions than inside control groups.
- Avoid evenly spaced everything. Hero sections and recap moments should have more dramatic spacing.

## Layout
- **Approach:** Hybrid.
- **Main shell:** Stage-first layout on desktop, with the performance area owning the visual center of gravity.
- **Supporting UI:** Prompt rail, director controls, and state messaging should frame the performance without flattening it into a dashboard.
- **Mobile:** Stage-first with a bottom sheet for control surfaces.
- **Max content width:** `1200px-1280px` for desktop shell.
- **Grid:** Flexible split layout on desktop, single-column stacked layout on mobile.

### Layout Rules
- Theme picker should feel editorial, almost like choosing the night's poster or venue.
- Main concert view should prioritize emotional readability over data density.
- Recap/export surfaces should feel collectible and poster-like.
- Avoid three-column marketing-grid energy.

## Border Radius
- **Small:** `10px`
- **Medium:** `16px-18px`
- **Large:** `24px-32px`
- **Full:** `9999px`

### Radius Rules
- Use rounded corners with restraint.
- Large hero containers can be soft and cinematic.
- Avoid bubbly, toy-like rounding across every component.

## Surfaces and Texture
- Use layered dark surfaces with translucent panels and soft blur when appropriate.
- Add subtle grain, light falloff, or stage-like glow where it improves atmosphere.
- Surfaces should feel tactile, smoky, and slightly weathered, not pristine.
- Decorative texture must stay subtle enough that text contrast survives.

## Motion
- **Approach:** Intentional and atmospheric.
- **Easing:** `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for state motion.
- **Duration bands:**
  - micro: `80-120ms`
  - short: `160-240ms`
  - medium: `260-420ms`
  - long: `450-700ms`

### Motion Rules
- Motion should feel like stage cues, not generic product polish.
- Use fades, lighting shifts, pulsing intensity, staggered reveals, and state transitions that feel deliberate.
- Waiting states must feel alive. Prompt transitions are part of the show.
- Avoid bounce, overshoot, or playful UI motion that breaks the tone.

## Component Guidance

### Theme Picker
- Full-screen, immersive, editorial.
- Should feel like choosing a venue, era, or set mood.
- Use oversized type, dramatic framing, and high-contrast art treatment.

### Concert Shell
- The stage dominates.
- Prompt input and status controls live in a supporting panel or rail.
- Speech bubble should feel in-world, not like a notification toast.

### Prompt Rail
- Minimal admin energy.
- Clear input hierarchy, but avoid productivity-tool styling.
- Buttons should feel decisive and ceremonial, not hyper-glossy.

### Share / Recap Card
- Treat this as a poster artifact.
- Strong crop, strong type, compact metadata.
- It should look worth exporting even as a static image.

## Accessibility
- Preserve readable contrast in both dark and light modes.
- Never let decorative texture compromise legibility.
- Motion must degrade cleanly for reduced-motion users.
- Theatrical design does not excuse ambiguous controls or hidden state.

## Anti-Patterns
- No purple-first AI gradients.
- No generic SaaS card grid homepages.
- No centered-everything startup template energy.
- No bubbly, toy-like UI rounding everywhere.
- No over-glossed glassmorphism without contrast discipline.
- No sterile monochrome minimalism that kills the concert fantasy.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-15 | Chose cinematic analog spectacle as the core direction | Fits the concert fantasy and gives the project a stronger portfolio identity than generic AI-app styling |
| 2026-04-15 | Chose `Bricolage Grotesque` as the primary display face | Gives the product posture and memorability without breaking usability |
| 2026-04-15 | Kept `Fraunces` as an accent, not the default | Preserves drama for recap and poster moments without over-costuming the full UI |
| 2026-04-15 | Chose a warm, restrained cinematic palette | Avoids AI-slop neon and makes the app feel more human, physical, and venue-like |
| 2026-04-15 | Made dark mode the primary design target | Aligns with the stage-first concert experience and the product’s emotional tone |

