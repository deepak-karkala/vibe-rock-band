# TODOS

## P2: Session Memory + Setlist Evolution

**What:** The LLM music director maintains a ~500-token rolling summary of the session's musical arc. Each `/api/music/direct` call includes this summary in the context window.

**Why:** Turns the experience from a series of disconnected style changes into a coherent narrative. Enables:
- Character callbacks ("Remember that Pink Floyd vibe from earlier? Miles wants to bring it back.")
- Narrative transitions ("Zara cranks up the distortion...the set is shifting")
- Session recap: a shareable "Tonight's setlist" summary with timestamps

**How:** Rolling summary rebuilt on each LLM call. No database required — summary lives in shared client state and is passed to `/api/music/direct` as part of the request body. Backend appends new style change to summary, trims to last ~500 tokens, returns updated summary with the music direction response.

**Effort:** S (human: ~1 day / CC: ~20 min)

**Blocked by:** LLM Music Director (Proposal 1) must ship first.

**Where to start:** Add `sessionContext: string` to the `/api/music/direct` request body. Update the LLM system prompt to incorporate it. Add `updatedContext: string` to the response. Store the rolling summary in Zustand state.

---
