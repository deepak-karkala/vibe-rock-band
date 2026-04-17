# Vibe Rock Band

An experimental web app where the user directs a virtual AI rock band and the band responds both visually and musically.

![Status](https://img.shields.io/badge/status-implemented-green)
![Phase](https://img.shields.io/badge/layer-1%20playable-brightgreen)
![Type](https://img.shields.io/badge/type-portfolio%20project-purple)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-black)
![3D](https://img.shields.io/badge/3D-Three.js-111827)
![State](https://img.shields.io/badge/state-Zustand-4b5563)
![Audio](https://img.shields.io/badge/audio-Web%20Audio%20API-0f766e)
![AI](https://img.shields.io/badge/AI-Lyria%20%2B%20LLM-7c3aed)

The point of this project is not just to generate music. It is to create a live-feeling concert experience that showcases:
- product thinking
- AI orchestration
- real-time-ish interaction design
- front-end audio reactivity
- thoughtful engineering tradeoffs

## Status

Current status:
- `Layer 1` is implemented as a playable local app
- The full core loop works: theme selection, typed direction, AI-directed clip generation, stage reaction, and recap export
- API routes, rate limiting, and a regression-tested first playback payoff are in place

Current Layer 1 target:
- full-screen band theme picker
- typed prompt input
- LLM music director
- Lyria 3 Clip audio generation
- stage reactivity
- speech bubbles
- client-side recap card export

Explicitly deferred from Layer 1:
- voice input
- architecture overlay UI
- hosted share URLs
- session memory
- media capture

## Planned Stack

- **Frontend:** Next.js 14+, TypeScript, Tailwind
- **3D / Visuals:** Three.js
- **State management:** Zustand
- **Audio:** HTMLAudioElement + Web Audio API `AnalyserNode`
- **Music generation:** Google Gemini Lyria 3 Clip first, Lyria RealTime later
- **LLM orchestration:** Claude Haiku or GPT-4o-mini, finalized during implementation
- **Deployment:** Vercel for Layer 1

## Demo

Demo status:
- playable locally via `npm run dev`
- not deployed yet

Current local flow:
- choose a band theme
- send a typed direction
- wait for `/api/music/direct` and `/api/music/generate`
- hear the generated clip and watch the stage react
- export a recap card once playback starts

## Product Summary

The core loop is:

```text
pick a band theme
  -> type a music direction
  -> band reacts on stage
  -> music changes
  -> share a recap card
```

The intended feeling is "I am directing a live band", not "I am filling in a prompt box for a music model."

## Why This Project Exists

This is a portfolio project.

It is designed to show:
- how I think about product framing and scope
- how I choose between fast shipping and ambitious architecture
- how I make AI-heavy systems feel like products instead of demos
- how I reason about failure modes, tests, and edge cases before implementation

## Core Decisions

### Product decisions

- The product is framed as a **relational band experience**, not a generic AI music generator.
- The strongest user moment is the **first direction payoff**:
  - user types a direction
  - band visibly enters transition
  - music and stage change together
- Band personalities were added because they make the experience feel like directing artists, not operating a tool.
- Shareable recap cards were prioritized over video capture because they are a simpler first social artifact.

### UX decisions

- Desktop uses a **balanced split layout**:
  - stage is the emotional anchor
  - control rail stays visible but secondary
- The app opens with a **full-screen theme picker**
- Speech bubbles are **stage-anchored**, not control-rail messages
- Loading is treated as part of the show:
  - no generic spinners
  - prompt changes trigger a visible "band adjusting" transition state
- Share is visible early, but only unlocks after a meaningful musical moment

### Technical decisions

- **Layer 1 uses Lyria 3 Clip**, not Lyria RealTime
  - simpler
  - more stable
  - faster to ship
- **Layer 2 upgrades to Lyria RealTime**
  - better transitions
  - more impressive technical architecture
  - higher infra and playback complexity
- Layer 1 intentionally avoids premature abstraction:
  - no generic `MusicProvider`
  - one thin client flow owner
  - `HTMLAudioElement` is the playback source of truth
  - latest-request-wins concurrency
  - schema-first normalization for LLM output

## Roadmap

### Layer 1: Shippable Core Loop

- [x] Build full-screen theme picker
- [x] Build typed prompt flow
- [x] Implement `/api/music/direct`
- [x] Implement `/api/music/generate`
- [x] Play MP3 via `<audio>`
- [x] Drive stage reactivity with `AnalyserNode`
- [x] Add stage-anchored speech bubbles
- [x] Add recap card generation and PNG export
- [x] Add rate limiting and failure handling
- [ ] Deploy Layer 1 demo

### Layer 2: Real-Time Streaming and Polish

- [ ] Upgrade to Lyria RealTime
- [ ] Add PCM streaming playback pipeline
- [ ] Add richer stage lighting / fog / motion
- [ ] Add architecture showcase overlay
- [ ] Improve character pose / performance animation
- [ ] Revisit hosting for persistent streaming connection

### Layer 3: Depth and Portfolio Polish

- [ ] Add sliders for energy / darkness / tempo
- [ ] Add LLM prompt expansion
- [ ] Add session memory / setlist evolution
- [ ] Add richer capture / sharing
- [ ] Add deeper instrumentation for portfolio storytelling

## Architecture

### Layer 1 flow

```text
UI input
  -> /api/music/direct
  -> /api/music/generate
  -> MP3 response
  -> HTMLAudioElement playback
  -> AnalyserNode for stage reactivity
```

### Layer 1 state ownership

```text
HTMLAudioElement events
  -> update Zustand UI state
  -> drive stage status and rail status
  -> feed AnalyserNode for visual reactivity
```

### LLM contract

The server normalizes LLM output before the client sees it.

Expected response shape:

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

Normalization rules:
- `announcement` always exists
- unknown characters fall back to `Kai`
- empty prompt lists fall back to raw user text
- bpm / temperature / prompt weights are clamped

## Key Engineering Tradeoffs

| Decision | Why it was chosen | Tradeoff |
|---|---|---|
| Lyria 3 Clip first | stable and simple enough to ship quickly | not truly real-time |
| No `MusicProvider` abstraction in Layer 1 | avoids premature generalization | Layer 2 extraction still needed later |
| Explicit submit, no generate-on-type | reduces unnecessary API spend and UI noise | less "live" feeling in Layer 1 |
| Latest-request-wins | prevents stale audio and stale speech bubbles | requires request id coordination |
| Client-side recap pipeline | one clear success/failure boundary | less flexible than server rendering later |

## Known Critical Risks

These were identified before implementation:

1. Lyria Clip audio is not guaranteed to be at `parts[0]`
2. `canvas.toDataURL()` can return a blank image unless `preserveDrawingBuffer` is enabled
3. LLM JSON may be fenced or partial
4. AudioContext can silently suspend if created outside a user gesture
5. Rapid prompt changes can create stale-response races if request lifecycle is not explicit

## Test Strategy

Planned coverage includes:

- API route tests for `/api/music/direct`
- API route tests for `/api/music/generate`
- client flow-owner tests for latest-request-wins and share unlock logic
- component tests for `ShareButton` and `SpeechBubble`
- E2E tests for:
  - first-run happy path
  - rapid direction changes
  - share recap export
- eval test for LLM director output quality and normalization stability

Detailed test artifact:
- [PROJECT_DECISIONS.md](./PROJECT_DECISIONS.md)
- the latest eng-review test plan artifact in the local gstack project workspace

## Repo Documents

- [DESIGN.md](./DESIGN.md) — the visual source of truth for typography, color, spacing, motion, and component tone
- [PROJECT_DECISIONS.md](./PROJECT_DECISIONS.md) — full decision log with product and technical rationale
- [CLAUDE.md](./CLAUDE.md) — repo-level implementation guardrails
- [TODOS.md](./TODOS.md) — deferred work such as session memory
- [prompts.md](./prompts.md) — original project brief

## What This Project Demonstrates

### Product skill

- taking a weird idea and finding the real product inside it
- choosing the right first magical moment
- cutting seductive but non-essential scope from the first release

### Technical skill

- staging architecture in layers instead of overbuilding on day one
- designing clear ownership boundaries between server, client flow, and rendering
- identifying silent-failure risks before implementation
- designing tests around behavior and regression risk, not just happy paths

## Short Pitch

> Vibe Rock Band is an experimental AI concert app where the user directs a virtual band in real time. I designed it to feel less like prompting a model and more like directing live artists, while making deliberate tradeoffs between fast shipping, strong product moments, and a more ambitious streaming architecture later.
