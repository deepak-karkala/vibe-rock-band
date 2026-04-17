# Vibe Rock Band — Product and Technical Decision Record

This document captures the major decisions made before implementation for `vibe-rock-band`.

Its job is simple:
- preserve the reasoning behind product and engineering choices
- make implementation more consistent
- give you a clean source for explaining the project in your portfolio website, README, demo video, or interviews

## Source Documents

Primary planning sources used to assemble this record:

- Design doc:
  - `/Users/deepakkarkala/.gstack/projects/vibe-rock-band/deepakkarkala-unknown-design-20260413-222310.md`
- CEO plan:
  - `/Users/deepakkarkala/.gstack/projects/vibe-rock-band/ceo-plans/2026-04-13-vibe-rock-band-expansion.md`
- Eng review test plan:
  - `/Users/deepakkarkala/.gstack/projects/vibe-rock-band/deepakkarkala-unknown-eng-review-test-plan-20260414-174500.md`
- Final design system:
  - [DESIGN.md](./DESIGN.md)
- Local TODOs:
  - [TODOS.md](./TODOS.md)
- Original project brief:
  - [prompts.md](./prompts.md)

## Project Intent

### What this project is

`Vibe Rock Band` is a portfolio project, not a startup.

The goal is to demonstrate:
- product thinking around a weird, memorable user experience
- AI orchestration across LLMs + music generation + front-end interaction
- thoughtful engineering tradeoffs under real constraints
- the ability to turn multiple emerging primitives into a cohesive product

### Core product idea

A user directs a virtual AI rock band. They type instructions like "make it darker and slower", and the band responds both visually and musically. The product should feel like directing a live show, not operating a waveform demo.

## Executive Summary of Decisions

### Product strategy

- Build the product as a **relational band experience**, not just a music generator with a skin.
- Preserve a strong first "whoa" moment: the first user direction should visibly and audibly transform the band.
- Keep **Layer 1** small and shippable. Typed prompt loop first. Voice input and architecture overlay deferred.

### Technical strategy

- Use **Lyria 3 Clip** first for a stable MP3-based path.
- Defer **Lyria RealTime** to Layer 2 after the core loop works.
- Keep Layer 1 explicit and boring:
  - no early `MusicProvider` abstraction
  - one thin client flow owner
  - audio element is the source of truth
  - latest-request-wins concurrency
  - schema-first server normalization for LLM output

### UX strategy

- Desktop uses a **balanced split layout**:
  - stage is the emotional anchor
  - control rail stays visible but secondary
- Mobile stays **stage-first**, not a stacked settings page.
- Waiting must feel like part of the show, not like the app is broken.

## 1. Product Feature Decisions

### 1.1 Product framing

| Topic | Options considered | Final decision | Why this won | Tradeoff |
|---|---|---|---|---|
| What the product fundamentally is | AI music generator, reactive concert visualizer, relational band experience | Relational band experience | Stronger product identity and better portfolio story | More product logic than a simple visualizer |
| Primary delight | Static output, generic visualizer, live-feeling band reaction | User directs a band and sees/hears the band respond | More memorable and emotionally legible | Harder UX and animation design |
| Project type | Startup candidate, internal toy, portfolio artifact | Portfolio artifact with viral potential | Keeps scope and evaluation grounded | Less pressure to build account systems / monetization |

### 1.2 Product scope by layer

| Layer | Final scope | Why | Deferred items |
|---|---|---|---|
| Layer 1 | Theme picker, typed prompt input, presets, stage reactivity, speech bubbles, recap-card share, LLM director, Lyria 3 Clip | Smallest real demo with clear wow factor | Voice input, architecture overlay UI, session memory, hosted share URL |
| Layer 2 | Lyria RealTime streaming, better stage polish, overlay UI, more advanced motion | Adds technical depth after core loop is proven | Full memory evolution, media recorder |
| Layer 3 | Sliders, prompt expansion, richer capture/share, session memory | Enhances depth and polish after base system works | Anything not core to demoability |

### 1.3 Features accepted

These were explicitly accepted into the product shape:

- LLM music director
- Band member personalities
- Pre-generated band themes
- Shareable concert recap card
- Architecture showcase mode, but moved to Layer 2 UI
- Voice input originally accepted by CEO review, later deferred out of Layer 1 by eng review

### 1.4 Features deferred

| Deferred feature | Why deferred | Implication |
|---|---|---|
| Session memory + setlist evolution | Great idea, but not critical for first ship | Product remains coherent but less narratively deep in Layer 1 |
| Voice input in Layer 1 | Browser support and fallback complexity are not free | First ship is desktop-demo oriented and typed-input first |
| Architecture overlay UI in Layer 1 | Valuable for portfolio, not required for core user proof | Add later once core flow is stable |
| Hosted share URL | Downloadable PNG is enough for first pass | Viral sharing mechanics wait for Layer 2 |
| MediaRecorder clip capture | Higher complexity than recap card | Keep first social artifact simple |

### 1.5 Why band personalities were chosen

**Options considered**
- Plain prompt -> music change with no speaking band
- Generic app messages
- Named band members with personality and speech bubbles

**Final choice**
- Named band members with personality and stage-anchored speech bubbles

**Why**
- Converts the product from "tool" to "cast"
- Creates a shareable, human-readable moment
- Supports the "directing artists" fantasy from the CEO plan

**Tradeoff**
- Requires stronger consistency in LLM output and UI fallback behavior

## 2. UX / Interaction Design Decisions

### 2.1 Layout model

| Decision | Options considered | Final choice | Why |
|---|---|---|---|
| Desktop shell | Full-screen stage poster, balanced split layout, control-first layout | Balanced split layout | Keeps the stage dominant while preserving control |
| Opening flow | Full-screen picker, modal picker, inline control-rail picker | Full-screen band-theme selection scene | Gives the product a stronger first impression |
| Speech bubble placement | On-stage, control rail, both equally prominent | On-stage anchored | Feels like part of the performance |
| Desktop control rail | Always open, persistent but collapsible, mostly hidden | Persistent but collapsible | Preserves authorship without stealing too much screen space |

### 2.2 Emotional arc

The strongest product moment is **not** theme selection.

The strongest moment is:
- user gives the first direction
- band visibly enters transition
- music and stage change together

That is the main "whoa" event.

### 2.3 Empty and loading states

| State | Decision | Why |
|---|---|---|
| Pre-show empty state | Show a charged pre-show state with band already on stage, low-intensity atmosphere, invitation line, and suggested first prompts | Avoids dead-air feeling |
| Prompt change loading | Use a performance-transition state, not a spinner | Turns latency into part of the product fantasy |
| Share before value exists | Keep share visible but disabled with explanation | Makes the feature discoverable without causing confusion |

### 2.4 Suggested first directions

**Decision**
- Do not make first-time users face a blank input only
- Show 3-4 suggested first directions tailored to the chosen theme

**Why**
- Protects the first payoff moment
- Reduces blank-page anxiety
- Still preserves user agency because typed input stays primary

## 3. Visual Direction Decisions

### 3.1 Visual thesis

**Final direction**
- Moody analog venue, not neon generic AI music app

### 3.2 Alternatives considered

| Option | Outcome | Why not chosen |
|---|---|---|
| Neon synth interface | Rejected | Too generic, too easy to look like AI-slop SaaS concert UI |
| Playful cartoon energy | Rejected | Fun, but weaker for portfolio credibility |
| Moody analog venue | Chosen | Stronger taste, less templated, better emotional fit |

### 3.3 Core visual rules

- Stage is the spectacle
- Director rail is calm and utility-first
- Avoid purple/indigo gradient defaults
- Avoid bubbly rounded panels everywhere
- Avoid dashboard-card mosaics
- Typography should feel editorial/performance-oriented

### 3.4 Design token decisions

Defined early to avoid drift:

- near-black / graphite base surfaces
- warm off-white text
- deep red and tungsten amber accents
- maximum two font families
- moderate radii
- motion used for hierarchy and atmosphere, not decoration

### 3.5 Final design-system decisions

These decisions were locked after the design consultation pass and now govern implementation.

| Topic | Options considered | Final decision | Why this won | Tradeoff |
|---|---|---|---|---|
| Overall aesthetic | Moody analog venue, neon AI music interface, playful/cartoon energy | Cinematic analog spectacle | Strongest portfolio identity, fits the "direct a live band" fantasy, avoids generic AI styling | Requires more taste discipline than a safer app UI |
| Decoration level | Minimal, intentional, expressive | Intentional to expressive | Keeps atmosphere visible without turning the product into noise | More room for over-design if not controlled |
| Layout system | Pure app dashboard, pure poster/editorial, hybrid | Hybrid | Lets the main shell stay usable while theme-picker and recap moments get more theatrical | Requires more consistency work across screens |
| Color strategy | Neon digital palette, monochrome minimalism, warm cinematic palette | Warm restrained cinematic palette | Feels physical, venue-like, and more memorable than blue-purple AI defaults | Less immediate "tech product" signaling |
| Motion style | Functional only, generic micro-interactions, atmospheric stage-cue motion | Intentional atmospheric motion | Makes waiting and transitions feel like part of the show | Harder to tune without feeling slow |

### 3.6 Typography decisions

**Options considered**
- Safe grotesk everywhere
- One dramatic display face plus one clean UI face
- Decorative or retro type system across the full product

**Final choice**
- `Bricolage Grotesque` as the primary display face
- `Fraunces` as a secondary accent display face for recap/poster moments
- `Instrument Sans` for body and UI text
- `IBM Plex Mono` for technical traces and later dev-facing UI

**Why**
- Gives the product a distinct authored tone without sacrificing readability
- Preserves drama for the moments that need it instead of making the whole app feel costumed
- Supports both the concert fantasy and the later architecture/demo storytelling

**Tradeoff**
- Requires restraint. `Fraunces` must stay an accent, not become the default display language everywhere.

### 3.7 Color palette decisions

**Final palette**
- `#0B0A0A` Obsidian Black
- `#171312` Stage Brown-Black
- `#2A1E1B` Smoked Umber
- `#CBB89D` Brass Parchment
- `#F4E7D3` Warm Spotlight
- `#A23621` Ember Red
- `#6E7C86` Steel Haze
- `#2F5D50` Oxidized Teal

**Why**
- Warm light and ember accents make the app feel like a venue, not a synthetic AI dashboard
- The palette supports cinematic contrast and keeps the UI grounded
- The teal gives the system a secondary release valve without becoming the main color story

**Rules chosen**
- dark mode is the primary design target
- light mode should feel like warm paper/parchment, not stark white
- no purple-first AI gradients
- red is for intensity and emphasis, not every action

### 3.8 Component-level visual decisions

These were made to keep the major screens visually coherent:

- Theme picker should feel editorial and immersive, almost like choosing a venue or poster
- Main concert shell should be stage-first, with the control rail supporting rather than flattening the experience
- Speech bubbles should feel in-world, not like default app toasts
- Recap/share card should read like a collectible poster artifact, not an export receipt
- Prompt rail should feel low-admin and ceremonial, not like a settings form

### 3.9 Spacing, radius, and texture decisions

**Final rules**
- `8px` base spacing system
- spacious framing at the page/screen level
- tighter spacing inside controls and prompt tools
- restrained radius scale:
  - small `10px`
  - medium `16px-18px`
  - large `24px-32px`
- subtle grain, haze, blur, and stage-light texture are allowed
- texture must never compromise text contrast

**Why**
- This keeps the app cinematic without falling into bubbly consumer-app styling or flat dashboard minimalism

### 3.10 Architecture overlay styling

**Decision**
- Overlay should feel like backstage technical UI from the same product world

**Why**
- Useful for portfolio storytelling
- Should not look like an unrelated admin/debug panel

## 4. Technical Architecture Decisions

### 4.1 Audio generation strategy

| Decision | Options considered | Final choice | Why | Tradeoff |
|---|---|---|---|---|
| Layer 1 audio engine | Lyria RealTime immediately, Lyria 3 Clip first, static track system | Lyria 3 Clip first | Stable and simple enough to ship quickly | Not truly real-time |
| Long-term audio engine | Stay on clip model, upgrade to streaming | Upgrade to Lyria RealTime in Layer 2 | Stronger technical story and smoother transitions | Requires more infra and playback complexity |

### 4.2 Why Lyria 3 Clip first

**Implications**
- MP3 output works with `<audio>`
- Lower implementation risk
- Lets the product prove demand/experience before solving streaming complexity

**Tradeoff**
- Prompt changes are asynchronous and can feel delayed
- Crossfade and loading-state design become important

### 4.3 Client/server split

**Layer 1 path**

```text
UI input
  -> /api/music/direct
  -> /api/music/generate
  -> MP3 response
  -> HTMLAudioElement playback
  -> AnalyserNode for stage reactivity
```

**Why this path was chosen**
- Explicit
- Small
- Testable
- No premature abstraction

### 4.4 Abstraction policy

**Decision**
- Do not introduce a generic `MusicProvider` abstraction in Layer 1

**Options considered**
- Generic provider abstraction now
- Tiny wrapper now
- Concrete direct clip-generation path now

**Final choice**
- Concrete direct path now

**Why**
- Only one real provider exists in Layer 1
- Avoids guessing an abstraction before the second provider exists
- Fits "minimal diff" and "explicit > clever"

### 4.5 Playback ownership

**Decision**
- `HTMLAudioElement` is the source of truth for playback state
- Zustand only mirrors derived UI state

**Why**
- Prevents store/UI from claiming the app is "playing" when the browser audio element disagrees
- Reduces race conditions

### 4.6 Client orchestration boundary

**Decision**
- Use one thin client flow owner, controller module or hook

**Responsibilities**
- theme selection completion
- direction submission
- request id assignment
- `/api/music/direct` then `/api/music/generate`
- pending / success / failure state
- share unlock logic

**Non-responsibilities**
- rendering stage UI
- rendering control rail
- hiding audio element truth

**Why**
- Avoids logic smear across components and store
- Easier to test

### 4.7 LLM boundary

**Decision**
- Treat `/api/music/direct` as a typed server contract, not raw model output

**Server response**

```ts
type MusicDirectionResponse = {
  prompts: Array<{ text: string; weight: number }>;
  bpm: number;
  temperature: number;
  announcement: {
    character: "Zara" | "Miles" | "Rex" | "Luna" | "Kai";
    text: string;
  };
};
```

**Normalization rules**
- announcement always present
- unknown character -> `Kai`
- empty announcement text -> fallback line
- prompt weights clamped
- empty prompt list -> fallback to raw user text
- bpm / temperature clamped

**Why**
- UI depends on stable output
- Prevents malformed or partial model output from reaching the client

### 4.8 Concurrency model

**Decision**
- Layer 1 uses latest-request-wins

**Why**
- Users will submit rapid prompt changes
- Prevents stale audio / stale speech bubble / stale crossfade from landing

**Rules**
- assign request ids
- stale results discarded
- only newest active request can complete successfully into UI/audio

### 4.9 Submission policy

**Decision**
- Explicit submit only in Layer 1, not generate-on-type

**Why**
- Avoids unnecessary LLM and Lyria requests
- Reduces latency noise and quota waste
- Keeps Layer 1 from pretending to be live composition before streaming exists

### 4.10 Share recap pipeline

**Decision**
- Keep Layer 1 recap as a single client-side pipeline

**Flow**

```text
user clicks Share
  -> verify unlock
  -> capture stage image
  -> assemble recap text from available session state
  -> render 1200x630 card locally
  -> trigger PNG download
```

**Why**
- One success/failure boundary
- No extra mandatory server round-trip
- Smaller first implementation

### 4.11 Hosting strategy

| Layer | Hosting decision | Why |
|---|---|---|
| Layer 1 | Vercel | Good fit for Next.js + serverless MP3 generation path |
| Layer 2 | Revisit hosting before streaming | Persistent WebSocket does not fit simple Vercel serverless assumptions |

### 4.12 State management choice

**Decision**
- Zustand for shared app state

**Why**
- Light enough for first ship
- Good fit for cross-component status
- Easy to read from render loops without forcing React rerenders everywhere

## 5. Security, Reliability, and Error Handling Decisions

### 5.1 Secrets

**Decision**
- Keep `GEMINI_API_KEY` and LLM API keys server-side only

**Why**
- Prevent secret exposure in browser bundle

### 5.2 Rate limiting

**Decision**
- Add basic IP rate limiting to `/api/music/direct` and `/api/music/generate`

**Why**
- Public demo links can burn API spend quickly

### 5.3 Primary user-facing failure states

| Failure | Planned handling |
|---|---|
| Lyria timeout/failure | Visible error, retry once |
| LLM failure | Fall back to raw user text, skip speech bubble |
| Invalid prompt | Inline validation |
| Share capture failure | Clear failure state, no partial artifact |
| Missing audio part in response | Clear error path |
| WebSocket drop in Layer 2 | Reconnect / keep last valid clip |

## 6. Testing Strategy Decisions

### 6.1 Testing philosophy

- Tests are not optional follow-up work
- Coverage is part of the design
- Regressions get explicit tests, not vague mentions

### 6.2 Main test areas

#### API tests

`__tests__/api/music-direct.test.ts`
- request validation
- fenced JSON parsing
- missing announcement normalization
- unknown character -> `Kai`
- empty prompts -> raw text fallback
- bpm / temperature / weight clamping

`__tests__/api/music-generate.test.ts`
- happy-path MP3 extraction
- parts iteration to find `audio/mpeg`
- missing audio part -> error
- timeout / retry behavior

#### Client flow tests

`__tests__/session/useBandSession.test.ts`
- request id assignment
- latest-request-wins behavior
- pending state for newest request only
- share unlock after first meaningful moment
- critical regression: stale response must never overwrite newest session state

#### Component tests

`__tests__/components/ShareButton.test.tsx`
- locked before first moment
- unlocked after playback + visible response
- failure state on recap export failure

`__tests__/components/SpeechBubble.test.tsx`
- announcement render
- fallback announcement render
- stale announcement not shown

#### E2E tests

`e2e/happy-path.spec.ts`
- theme pick -> first typed direction -> music starts -> speech bubble visible

`e2e/rapid-direction-change.spec.ts`
- second direction overtakes first
- critical regression: stale speech bubble, stale crossfade, stale audio must never win

`e2e/share-recap.spec.ts`
- share disabled early
- share unlocks later
- non-blank PNG export

#### Eval tests

`evals/llm-director.eval.ts`
- representative prompts yield:
  - valid character
  - music-language prompt text
  - stable normalized structure

### 6.3 Concrete edge cases chosen for testing

- LLM returns fenced JSON
- LLM returns partial JSON
- LLM returns unknown character
- LLM returns no prompts
- Lyria response contains text parts before audio
- Lyria response contains no audio part
- AudioContext is created before user gesture
- Rapid prompt changes create out-of-order returns
- Recap capture fails after unlock

## 7. Critical Engineering Gaps Identified Before Implementation

These came from eng review and should be understood before building.

### Gap 1: Lyria Clip response parsing

**Problem**
- Audio is not at `parts[0]`

**Implication**
- Naive parsing silently fails

**Fix**
- Iterate response parts and find `mimeType === 'audio/mpeg'`

### Gap 2: Blank recap screenshot risk

**Problem**
- `canvas.toDataURL()` returns blank image if `preserveDrawingBuffer` is not enabled

**Fix**
- Set `preserveDrawingBuffer: true` on `THREE.WebGLRenderer`

### Gap 3: Lyria RealTime weighted prompts wrapper

**Problem**
- Layer 2 will silently fail if `setWeightedPrompts` is called with a bare array

**Fix**
- Use `{ weightedPrompts: [...] }`

### Gap 4: Claude fenced JSON

**Problem**
- `JSON.parse()` can fail if the model wraps output in code fences

**Fix**
- Strip fences or use structured tool calls

### Gap 5: Browser autoplay policy

**Problem**
- AudioContext created outside user gesture can suspend silently

**Fix**
- Create/resume it inside a click/gesture path

## 8. Decisions Not in Scope

These were considered and explicitly deferred.

- Hosted social share URL in Layer 1
- Pixel-art or full 3D character exploration
- MediaRecorder capture in Layer 1
- Voice input in Layer 1
- Architecture overlay UI in Layer 1
- Session memory / setlist evolution in first ship

## 9. Remaining Open Decisions

These are not blocking for writing code, but they are still not fully locked.

- Exact collapsed width of the desktop control rail
- Exact timing values for motion and prompt-change transitions
- Whether Claude Haiku or GPT-4o-mini should be used for the final LLM director implementation
- Whether each band theme should share one visual style or have distinct visual languages

## 10. Portfolio Storytelling Angles

Use these when you explain the project publicly.

### Product skill angles

- You did not build "AI music app #57"
- You reframed it as a **relational band experience**
- You protected the first magical moment and designed around emotional payoff, not just features
- You intentionally deferred seductive scope, voice in Layer 1, overlay UI, session memory, to keep first ship real

### Technical skill angles

- You chose a layered architecture:
  - simple and shippable first
  - ambitious streaming second
- You explicitly rejected premature abstraction
- You defined clear ownership boundaries:
  - audio element owns playback truth
  - one client flow owner handles orchestration
  - server normalizes LLM output before the client sees it
- You designed for real edge cases before writing code:
  - stale request races
  - fenced JSON
  - MP3 hidden in non-first response parts
  - autoplay-policy failures
  - blank share-card screenshots

### Good one-sentence explanation

> "Vibe Rock Band is a portfolio project where I combined LLM orchestration, AI music generation, Web Audio, and a Three.js concert UI into a product that feels less like prompting a model and more like directing a live band."

### Good architecture explanation

> "I deliberately shipped the MP3 clip path first instead of jumping straight to real-time streaming, because the product needed a stable core loop before it needed an impressive but more fragile streaming architecture."

### Good product tradeoff explanation

> "We deferred voice input and the architecture overlay from Layer 1 even though they sounded exciting, because the typed-direction loop was the real proof of product value. If that loop did not feel magical, the rest was decoration."

## 11. Recommended Next Documents

Before implementation, the most useful follow-up docs are:

1. `README.md`
   - short product summary
   - architecture overview
   - demo goals
2. implementation checklist
   - based directly on Layer 1 decisions
3. future ADRs if the project evolves
   - especially when moving from Lyria 3 Clip to Lyria RealTime

## 12. Short Version

If you only remember a few things, remember these:

- Build the typed prompt loop first
- Keep Layer 1 explicit and concrete
- Normalize LLM output on the server
- Let the browser audio element tell the truth
- Discard stale prompt results aggressively
- Treat waiting as part of the show
- Use the share recap as the first social artifact
- Save streaming complexity for Layer 2
