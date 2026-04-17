# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0.0] - 2026-04-17

### Added
- Launched the first playable Vibe Rock Band experience with a stage-first concert UI, theme picker, live direction rail, recap export, and five distinct band worlds.
- Added two app routes for music direction and clip generation, including request validation and per-IP rate limiting.
- Added a Vitest suite covering music helpers, API route behavior, PromptRail interactions, and the first playback regression path.

### Changed
- Wired the band session flow so theme selection, prompt submission, stage state, and playback metrics stay in sync through Zustand session state.

### Fixed
- Fixed the first playback loop so recap sharing unlocks as soon as audio actually starts playing.
