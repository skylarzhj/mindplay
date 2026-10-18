# Mindplay — Project Master Context

Consolidated October 17, 2026 (America/Los_Angeles).

## 1. Purpose, sources, and evidence boundaries

This document merges [HANDOFF_CHAT_1.md](HANDOFF_CHAT_1.md) (Dice Duel UI/UX) and [HANDOFF_CHAT_2.md](HANDOFF_CHAT_2.md) (broader product, world map, and Royal Races), checked against the current repository. Repeated facts are consolidated below. Historical requests are retained where they explain the current design, but are not treated as current requirements when later decisions supersede them.

Evidence precedence: current source establishes implemented behavior; the latest explicit user decisions recorded in the handoffs establish intended direction; older documents describe historical intent. When implementation and intent differ, both are recorded rather than silently declaring the gap resolved. The original complete conversations are not available beyond the handoffs. The proposal PDF and Word file exist in the parent workspace; they were not independently extracted for this consolidation. Missing proposal details, generation prompts, release status, and user acceptance are not reconstructed.

**Repository snapshot:** `/Users/skylarzhang/Desktop/DubHacks/mindplay`, branch `main`, HEAD `0aee889d37a20ba5cc9ae24dcfc744dd1c18c019` (`added brainteaser stage`). This is a nested Git repository: the parent DubHacks repository has a different history. At the start of this task, the two handoff files were untracked and tracked Mindplay files had no changes. Remote `github` points to `https://github.com/skylarzhj/mindplay.git`; no remote fetch or account/visibility check was performed.

Status language used here:

- **Implemented / source-confirmed:** present in this snapshot, without implying current hosted or browser verification.
- **Historical verification:** an earlier test/build/browser result reported in a handoff, not rerun here.
- **Superseded:** an earlier decision or implementation replaced by a later one.
- **Review finding:** a source-derived limitation or concern; not necessarily a reproduced failure.
- **Discussed / recommended:** future possibility or follow-up, not an approved implementation commitment.

This consolidation changes documentation only. No application code, dependencies, existing documents, deployment, repository settings, or publication state are changed. No build, tests, browser QA, commit, or push was performed for it.

## 2. Product vision and durable decisions

Mindplay is a DubHacks 2026 browser-based mathematical discovery prototype. Its promise is **“Play first. Get curious. Discover why.”** Supporting language includes “You don’t have to be a genius. Just be curious” and “Roll the dice. Trust your instincts. Discover the logic.”

The desired experience is a whimsical fantasy adventure. The user rejected the feel of a worksheet, conventional educational platform, or SaaS dashboard. The learning arc combines both histories:

**Intuition / experience → play → surprise and question → predict → experiment → discover → apply strategy → optional mathematical understanding.**

Preserve these decisions:

1. Begin with an approachable action, without formulas or prerequisites. Let surprising real outcomes motivate investigation.
2. Permit incorrect hypotheses without punishment. Reward curiosity and evidence-based reasoning, not only winning.
3. Keep probability honest: independently sampled rolls, real simulations, exact enumeration, and observed-only horse deductions. Never fake convergence, force a loss, or promise a win from a probability advantage.
4. Reveal deeper material progressively. Play, Explore, and Quant are chapters of one journey; advanced explanation remains optional.
5. **Latest Dice UX priority: fewer competing choices on screen.** The user found the expanded presentation more confusing. Smooth progression and one dominant task take precedence over adding panels, buttons, or animation.
6. Preserve a polished storybook identity: pastel skies, floating islands, parchment, magical lighting, serif headings, ivory/gem-colored dice, and animated stage characters.
7. Keep readable labels and controls as live HTML separate from painted scenery. A reference screenshot with baked-in interface text is unsuitable as the complete app background.
8. Keep the MVP self-contained in the browser. Accounts, servers, and AI infrastructure are not needed by the current implementation.

Long-term subject areas include probability, logic, risk, optimal stopping, Bayesian reasoning, game theory, and optimization. These are directions, not delivered curriculum or games. Neither the newest Dice simplification nor the latest all-25 horse layout has documented final user acceptance or a fresh novice playtest.

## 3. Current application and discovery map

`src/main.tsx` switches in memory among `home`, `duel`, and `horses`, with Framer Motion transitions, shared Header, and How It Works/About dialogs. There is no URL router, game deep link, or browser-history encoding of chapter navigation. Start Exploring opens Dice Duel.

| Stage | World | Implemented availability |
| --- | --- | --- |
| 01 | The Curious Island — Luck, Logic & Intuition | Dice Duel |
| 02 | Brain Teaser Island — The Royal Races · Logic & Deduction | Royal Races |
| 03 | The Strategy Forest — Choices, Risks & Rewards | Coming Soon |
| 04 | The Probability Labyrinth — Patterns, Uncertainty & Discovery | Coming Soon |
| 05 | The Quant Arena — Optimization & Beyond | Coming Soon |

The map has interactive islands, hover effects, live plaques and entry controls, and a skippable/replayable first-visit guide. LuckyDice samples a fair six-sided die: 1–3 offers Curious Island and 4–6 offers Brain Teaser Island, giving each open world equal selection probability. It does not alter game dice distributions. The implemented Quant chapter inside Dice Duel is distinct from the locked Quant Arena world.

Characters use native SVG artwork in shared `Keeper.tsx`, with typed moods `idle`, `thinking`, `anticipating`, `celebrating`, and `teasing`:

- **Orin:** purple star-robed sage, beard, hat, crystal staff; lilac/ivory Dice environment.
- **Captain Rowan:** green-coated marshal, feathered cap, sash, pennant; sage/gold racing environment.

Blinking, mouth movement, bobbing, gestures, celebration, and a click-triggered wave are scripted/state-driven. Reduced-motion alternatives exist. There is no voice, generative dialogue, AI agent, or conversational backend.

## 4. Dice Duel: current mechanics and experience

### Mathematical contract

| Die | Six equally likely faces | Expected value |
| --- | --- | --- |
| Ruby | 2, 2, 4, 4, 9, 9 | 5 |
| Sapphire | 1, 1, 6, 6, 8, 8 | 5 |
| Emerald | 3, 3, 5, 5, 7, 7 | 5 |

Higher roll wins; equal rolls tie. Duplicate values are separate equally likely face indices, sampled independently for both dice. The exact cycle is **Ruby beats Sapphire, Sapphire beats Emerald, Emerald beats Ruby**, each with 20/36 = 5/9 ≈ 55.56% strict win probability. Reverse matchups win 16/36 ≈ 44.44%. Distinct dice never tie in this construction. Self-comparison has 12 wins, 12 losses, and 12 ties: diagonal strict win probability is 1/3, not 1/2. Equal expected value does not imply equal head-to-head strength.

`probability.ts` enumerates outcomes and derives displayed probabilities, expectation, and best responses. `diceEngine.ts` samples faces and resolves real matches. These modules have no React dependency.

### Shell and progression

A current chapter/scene title remains visible. The **Adventure menu** contains chapter navigation with locked/current/completed states, field journal, map return, How to Play replay, save status, and confirmed Reset Adventure. Unlocked chapter components stay mounted while switching chapters, retaining local state during that visit.

- `REQUIRED_PLAY_ROUNDS = 1`: one completed Play duel unlocks Explore.
- Quant requires that Play prerequisite and positive-trial experiments for all three distinct unordered cross-die pairs.
- Reversing a pair adds no new required clue; self-comparison does not count.
- No minimum 1,000-trial quota exists. Any positive valid experiment can count.
- The prominent invitation after three Play rounds is presentation, not an unlock gate.

### Play

Selection shows one die at a time, with previous/next arrows. Each starts sealed; unsealing reveals its identity and actual six-face CSS cube. Hover entry, click, horizontal pointer gestures, and arrow keys step among discrete face views. This is not continuous trackball rotation or physics. The visible face-number readout is noninteractive.

The player chooses first; Orin takes the mathematically best counter. Rolls are genuinely random with roughly 800 ms presentation delay. The battle emphasizes Begin the Duel / Roll Again. Secondary disclosures expose investigation, change die, wins/losses/ties, win rate, and matchup reset. Changing die or resetting the matchup clears local history, while cumulative journey totals remain separate.

After at least three cumulative Play rounds, a curiosity invitation offers Follow the Clue or continued rolling. It does not force a chapter change, but currently replaces the battle display when shown.

### Explore and discovery

The user predicts Ruby/Sapphire/Emerald strongest or “depends on the opponent.” The initial matchup uses the first chosen die and its best-response rival; default sample size is 100. Settings allow either die, including self-comparisons, and 10, 100, 1,000, or 10,000 trials. The simulation engine permits integers from 1 through 1,000,000.

Simulation calculates every actual match synchronously, then reveals real sampled chart points over about one second with animation frames. Observed win rate and exact probability are separately labeled. The interval is `max(1, floor(trials / 150))`, with first/final points also included: **roughly 150 points, not a hard maximum of 150**. More trials need not move the observed curve closer at every step.

The interface recommends an untested pairing. Prediction, settings, and collected clues use disclosures. On collecting all three required pairs, **“There Is No Strongest Die”** and the exact cycle replace the workshop; an optional probability matrix and Strategy Challenge continuation remain. Short-run disagreement is acknowledged; exact outcome counting establishes the cycle.

Current limitation: the discovered state hides experiment controls with no reopen action. Returning to Explore cannot rerun simulations, even though Research recommends comparing sample sizes.

### Quant: Strategy Challenge, then Research Notes

Strategy is the default Quant section. Computer-first commits to a random die before the player chooses; the computer cannot switch and its die is unavailable to the player. Player-first permits optimal computer countering. Choosing second helps only when the player selects the right response; no individual win is guaranteed.

Real records are separate by choice order. Choice-order switching, hint, results, new matchup, and reset are secondary controls. Choices collapse after player selection. Rolls have roughly 750 ms delay; after three local strategy rounds a research invitation appears. The section switch also provides independent access to Research Notes. Local strategy reset currently restarts player-first, although initial entry defaults computer-first.

Research preserves the interactive 6×6 outcome grid (all 36 face combinations), exact fractions/probabilities, expected-value comparison, best-response lookup, and law of large numbers. It explicitly rejects the idea that past losses make a win “due.” Its strategy action changes sections through a callback rather than scrolling toward hidden content. Several panels and controls remain simultaneously visible; complete one-topic-at-a-time research has not been implemented.

## 5. Royal Races: current mechanics and experience

### Puzzle and evidence contract

The initial “15 horses / fastest five” reference was clarified to the classic puzzle: **25 horses, five lanes, find the fastest three in order using as few races as possible.** Each field has fixed distinct hidden ranks; smaller internal rank is faster. Player-visible IDs are 01–25, while engine IDs are 0–24.

- A race accepts 2–5 unique horses and deterministically returns finishing order. There are no ties, displayed speeds, or stopwatch times.
- Animation represents order within the current race and must not communicate comparable timing across races.
- Five coat colors occur five times each and are shuffled separately from ranks. Color is stable within a field and is not speed evidence.
- Drag paddock → lane, lane → lane, or lane → paddock. Occupied-lane replacement returns the old occupant to the paddock; duplicate assignment is prevented.
- Tap/click horse then lane and keyboard selection/placement provide alternatives. Controls lock during racing. Pointer/touch input includes a drag ghost and edge scrolling.
- Race results are recorded and lineups reusable. Horse IDs can be selected from history.
- Deductions use transitive closure of observed faster-than relations, never hidden ranks. Three known faster predecessors exclude a horse from the top three.
- Requested progressive hints move from conceptual nudges/unseen-horse advice to winners comparison and the complete seven-race route. They are not a general optimal planner for arbitrary race sequences.
- Ordered podium checking distinguishes actual correctness from sufficient proof. A lucky correct answer is acknowledged but not certified.
- Proof requires observed first > second > third and third > every excluded horse, as well as actual correctness.
- Confirmed New Field resets ranks, coats, lineup, results, hints, deductions, selection, and podium. Gameplay is component memory, lost on reload or leaving/remounting the stage.

The classic construction uses five disjoint races of five, then a race of their winners. Rename groups A–E in winner order: A1 is fastest. Race A2, A3, B1, B2, C1; its first two join A1. The unit suite checks this seven-race construction across 30 deterministic fields. That is verification of a construction, not a formal lower-bound proof that fewer races are impossible.

### Story, compact board, and feedback

Captain Rowan needs three fast messenger horses for the island lantern festival. Speed records are missing and the enchanted stopwatch is broken. A two-part first-visit story explains this purpose; it is skippable, Escape-dismissible, and replayable through “Why are we racing?” Story dismissal opens the course guide. The optional four-step anchored guide covers paddock, track, journey, and podium; “Show me around” replays it and mobile targets scroll into view.

The current desktop board is a compact **5×5 paddock at left, five-lane course at right**. All 25 numbered horses are directly available with ready/raced/assigned states. Phone layout stacks paddock and track; all horses remain available. Reduced scrolling is a goal, not a claim the entire phone scene fits in one viewport.

“Here’s your race journey” is an inline latest-first horizontal result strip with a pre-race placeholder, animated new entries, repositioning to the latest result, and lineup reuse. It does not force a result popup or page jump. The races-used number springs once when its count changes; unrelated selection does not trigger it, and reduced motion suppresses it. Full history, hints, and deductions fold into Race Journal; podium submission is a separate disclosure.

`HorseCarousel.tsx` remains in source but is not rendered by the current stage. Its filters, number search, and rail navigation are historical features, not features of the all-25 paddock.

## 6. Reconciled decisions and development history

| Earlier claim, request, or implementation | Resolution at current HEAD |
| --- | --- |
| Midnight/navy/purple visual direction | Superseded by reference-led pastel storybook direction; legacy CSS remains. |
| Four floating islands, one playable world | Expanded to five islands with two playable worlds; old art notes still describe the earlier map. |
| Brain Teaser as a detached home card | Replaced by peer Stage 02 island with separate artwork and Rowan. |
| Three equally available Dice modes on entry | Gated sequential chapters; previously unlocked chapters stay accessible. |
| Three duels required for Explore | Superseded: one duel unlocks; three rounds trigger the current prominent invitation. |
| Required 1,000 dice trials | Rejected as a quota; sample counts are optional settings. |
| Always-visible Dice stage bar, high/expanded journal, workshop stepper | Implemented earlier, then reduced after confusion feedback. Navigation/journal moved into Adventure menu; stepper removed. |
| Three simultaneously selectable dice and per-face controls | Replaced by one-die browser and noninteractive number readout. |
| Workshop, clues, and reveal all visible | Replaced by discovery taking over the scene; this leaves the replay gap. |
| Dice onboarding should point to live controls | Discussed; current Dice guide is a three-step overview dialog. Horse guide does anchor to controls. |
| Automatically leave play after several rolls | Not implemented as forced navigation; invitations offer continuation or more play. |
| Continuous 3D die rotation | Not implemented; discrete six-face inspection only. |
| 15 horses / fastest five | Clarified to 25 horses / fastest three in order. |
| Compact horse carousel with filters/search | Earlier implementation superseded by all-25 board; retained component is unused by current page. |
| Journey shown as popup after each horse race | Current interpretation is inline reusable strip to preserve planning focus. |
| All progress is session-only; map return starts fresh | Outdated for Dice journey, still true for Horse gameplay and Dice local match state. |
| Conversation 1 had no established deployment | Limited to that session's evidence. Conversation 2 records an earlier private deployment; current freshness/access remain unknown. |
| Latest commit title implies horse work | `0aee889` contains focused Dice presentation/persistence; horse story/board milestone is `c42a3d7`. |
| At most 150 simulation points | README overstates the bound; code samples roughly 150 using a floored interval. |

Source history milestones: `6f4829d` compact horse carousel/course; `c42a3d7` horse story, guided all-25 board, race journey, counter feedback, independent coat shuffle; `0aee889` focused Dice flow, intro/inspection, validated persistence and tests. These are implementation milestones, not proof of deployment or authorship of every current file.

Historical Dice fixes recorded in handoff 1 include capturing drag direction before clearing its ref, suppressing click after drag, preventing cube artwork from intercepting Choose, correcting TypeScript narrowing, overriding tiny inherited labels, and clearing the Play invitation before navigating. Treat these as fixed history, not current open bugs without reproduction.

## 7. Architecture, state, and file map

React 19 + TypeScript (~5.7) + Vite (^6.1), Tailwind (^4), Framer Motion (^12), Recharts (^3), lucide-react, Vitest (^5.0.5). These are package ranges, not exact lockfile resolutions. Node >=22.12.0 is required. No backend environment variables, database, auth service, or external image/font service are required.

| Responsibility | Source of truth |
| --- | --- |
| Page state, transitions, shared header/dialogs | `src/main.tsx`, `src/components/layout/` |
| World map and random adventure selection | `src/pages/Home.tsx`, `src/components/worlds/`, `src/components/onboarding/WelcomeHints.tsx` |
| Dice chapter gates and journey contract | `src/games/diceDuel/progression.ts` |
| Dice distributions, random matches, enumeration, simulations, commitment | `src/games/diceDuel/{diceConfig,diceEngine,probability,simulation,strategy}.ts` |
| Dice shell/menu/reset and section orchestration | `src/pages/DiceDuel.tsx` |
| Dice scenes, intro, inspection, journal | `src/components/dice/` |
| Dice battle lifecycle and journey reducer/storage | `src/hooks/useDuel.ts`, `src/hooks/useJourney.ts` |
| Actual simulation chart | `src/components/charts/ConvergenceChart.tsx` |
| Horse field/race/proof/hint engine | `src/games/horseTeaser/engine.ts` |
| Horse scene state and orchestration | `src/pages/HorseTeaser.tsx` |
| All-25 board, lanes, art, story, anchored tour, journey, journal | `src/components/horses/{HorsePaddock,RaceCourse,HorseGlyph,RaceStory,RaceGuide,RaceJourney,RaceJournal}.tsx` |
| Horse mouse/touch gestures | `src/hooks/useHorseDrag.ts` |
| Superseded horse rail | `src/components/horses/HorseCarousel.tsx` |
| Shared styles and latest scoped Dice presentation | `src/styles/{index,fantasy}.css`, `src/components/dice/dice-duel.css` |
| Shared data contracts | `src/types/index.ts` |
| Engine/progression/persistence tests | `src/games/diceDuel/{engine,progression}.test.ts`, `src/games/horseTeaser/engine.test.ts`, `src/hooks/useJourney.test.ts` |
| Build and hosting configuration | `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `.openai/hosting.json` |

`DieCard.tsx` exports `DieVisual`, also used on the map. `Keeper.tsx` serves both games. Global styles, entry points, shared icons/components, and packages cross ownership boundaries. Earlier Dice work deliberately used scoped `.dice-duel` styling and avoided Horse/shared edits while another session worked concurrently. That was a session-specific ownership constraint; future work should coordinate shared changes rather than assume a whole-project prohibition or overwrite unrelated work.

### Persistence and reset boundaries

| State | Storage / lifetime |
| --- | --- |
| First Dice choice, cumulative Play rounds/wins, hypothesis, experiment results and points, cumulative strategy rounds | `mindplay.dice-duel.journey.v1` localStorage |
| Dice guide dismissed | `mindplay.dice-duel.intro.v1` |
| Map guide dismissed | `mindplay-map-guide-v1` |
| Horse story dismissed | `mindplay-royal-races-intro-v1` |
| Dice current chapter/research section, selected die, inspection state, active roll/result/local history, per-order strategy records | Component memory; retained across hidden chapter switches, lost on remount/reload |
| Horse field/ranks/coats/lineups/races/hints/podium | Component memory; leaving/reloading creates a new field |

Journey parsing rejects malformed JSON, invalid IDs/hypotheses, invalid counters, wins exceeding rounds, invalid simulation totals/trial ranges, and invalid chart ranges; missing/invalid saves fall back to initial state. Storage exceptions do not block play. Write failure produces visit-only status. Validation is structural, not full chronology/progression integrity or tamper resistance. The history is unbounded and the whole journey serializes on updates; no pruning exists.

Dice Reset Adventure requires inline confirmation, resets journey and remounts chapter components; it does not clear the intro-seen key. “Saved on this device” is partial journey preservation, not complete resume or a cloud/account save. Storage is origin-specific: host name and port differences create separate saves.

### Local development and assets

From the Mindplay directory:

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Dev and preview bind to `127.0.0.1`. Use Vite's printed URL; 5173 is typical and 5174 was used historically when occupied. Old local processes/URLs are not guaranteed to exist. Build runs `tsc -b && vite build`, outputs `dist`, and separates chart, motion, and other vendor chunks.

`public/art/world-islands.png` is a generated transparent four-island atlas; CSS selects quadrants. `public/art/brain-teaser-island.png` is a separately generated racing island. Together they are roughly 5 MB. Text and controls are live HTML. Artwork provenance is recorded in `docs/art-direction.md` and `docs/stage-characters.md`; the former contains literal `undefined` generation-prompt fields, so the missing prompts are unknown. The stage-character document does preserve the racing-island prompt. Original generation artifacts are reported to remain in the generation library; they were not independently accessed here.

## 8. Verification and known limitations

### What earlier work verified

Both handoffs report successful TypeScript/production builds. The latest reported suite has **23 tests across four files**: six Dice math tests, seven progression/strategy tests, seven Horse tests, and three journey-parser tests. Current source defines that inventory; it was not executed for this consolidation. Earlier counts of 19 or 20 reflect earlier milestones, not contradictory current totals.

Reported Dice browser checks cover unlocks, a duel, all three experiments, discovery, all 36 research cells, section switching, persistence/reset, guide skip/replay/Escape, face inspection/keyboard/drag, invitations, and the latest focused flow with no page errors or mobile horizontal overflow (including a 390px check).

Reported Horse Chrome checks cover dragging/lane movement, keyboard assignment, history/reuse, hints/deductions/reset, story/tour, journey/count feedback, and complete seven-race proof. A historical 1440×1050 check placed all 25 horses, track, and Start Race in the first viewport. Touch-enabled Chrome verified touch input and narrow layout; this is not physical iOS/Safari certification. Horse engine tests exercise seven-race proof across 30 fields and lucky-but-unproven answers.

Historical dependency remediation reported a clean audit. No current audit was performed. Browser scripts/screenshots lived under temporary directories such as `/private/tmp/mindplay-browser-qa/` and were not committed end-to-end regression tests. Passing unit tests do not establish novice clarity or full accessibility.

### Open findings, with no fixes made here

1. **Experiment replay gap:** discovery hides Explore controls permanently for that journey; Research still tells players to return and compare samples.
2. **Repeated invitations:** Play checks cumulative rounds >=3 after later rolls, Strategy checks local totals >=3. Dismissal has no consumed flag, so prompts can recur.
3. **Triggering result hidden:** invitation rendering can obscure the just-completed Play/Strategy battle. A result-first transition is recommended, not implemented.
4. **Unlock discoverability:** Explore opens after one duel, but the dominant action remains Roll Again and investigation is secondary until the three-round invitation. This is a UX concern, not a broken gate.
5. **Partial/inconsistent resume:** Dice journey persists but local match state does not; Horse gameplay does not persist. Copy and older docs can imply more complete saving/resetting than exists.
6. **Storage growth:** unbounded experiments can reach quota; errors are caught but data is not pruned. Save validation is not exhaustive progression validation.
7. **Remaining information density:** Research still exposes many panels and inputs, and hypothesis selection shows four choices. The latest simplification is not strict one-control-at-a-time everywhere.
8. **Onboarding differences:** Dice overview is not anchored; Horse tour is. Dice “a few duels” copy describes invitation timing rather than the exact one-round gate. No fresh human study validates the balance.
9. **Horse hint scope:** progressive hints do not compute a bespoke optimal plan for every unusual history. No unresolved math-engine failure was reported or established by this review.
10. **Navigation/accessibility:** no deep links; chapter scrolls do not explicitly focus a new heading. Adventure menu lacks dedicated outside-click/Escape-close logic. Some secondary controls may be small touch targets. Screen-reader, contrast, focus, and real-device coverage remain incomplete.
11. **Motion:** many components respect reduced motion, but app-level navigation directly requests smooth scrolling. Do not claim every motion path has been audited.
12. **Maintenance/performance:** successive CSS overrides, legacy layouts, dense JSX, and unused carousel code remain. Artwork/network/low-end rendering performance is unprofiled. Consolidation or deletion needs ownership awareness and visual validation.
13. **Documentation drift:** README, art-direction, playtest/demo, and carousel notes retain historical behavior. This master context identifies the differences without modifying those files.
14. **Hosting freshness/access:** no current deployment or external user access was checked.

## 9. Unfinished work and scope of future plans

The accepted direction is refinement of the existing adventure: clear discovery progression, fewer competing choices, distinct stage identities, and compact story-driven racing. The following ordering consolidates recommendations from both histories; it is not new authorization to implement them.

1. **Validate current UX with the user and 3–5 first-time players.** Can they identify the first action, find Explore after one duel, distinguish evidence from exact probability, use choosing second, explain why the horses race, assign horses, read/reuse results, and locate hints/podium? Observe hesitation before adding controls. Acceptance target: a newcomer can state the current goal and next action without reading every panel or developer coaching. No completed human playtest is documented.
2. **Repair existing flow gaps:** secondary experiment replay after discovery; invitations that stay dismissed or are explicitly repeatable; show triggering results before invitations; reconcile unlock copy and prominent actions; clarify saving/resetting and decide whether Horse resume is wanted. Preserve one dominant task instead of restoring many expanded panels.
3. **Harden actual interactions:** physical touch/Safari, drag versus scrolling, keyboard placement, focus transitions, menu/dialog behavior, small-height layouts, screen readers/contrast, reduced motion, and blocked/corrupt storage. Add meaningful durable behavioral regression coverage for repaired paths. Rerun relevant tests/build/browser paths after code changes.
4. **Improve handoff/demo readiness:** reconcile older documents, format/consolidate code with visual checks, profile assets if warranted, verify hosted revision/access, and rehearse the current flow. A suitable sequence is duel → hypothesis/experiments → cycle → strategy → optional exact math, with Royal Races as a distinct deduction adventure. The older demo guide enters research before strategy and needs adaptation.

Discussed or optional extensions, **not complete and not a committed roadmap**:

- Anchored Dice onboarding; true continuous die rotation; one-topic-at-a-time Research Notes.
- Full scene/reload resume, Horse persistence, URL routing/deep links.
- Remaining playable worlds; Treasure Hunt/optimal stopping, Mystery Boxes/Bayesian reasoning, Pirates’ Council/backward induction, Random Walker, Market Maker.
- Richer adaptive hints, audio/expanded character interaction, AI Socratic or research companion. Any future explanation must use actual engine facts.
- Accounts, database/backend, multiplayer, leaderboard, or analytics infrastructure.
- Public release/access changes and current-source deployment.

## 10. Hosting, collaboration, and continuity

`.openai/hosting.json` records Sites project `appgprj_6ad3bb6e0710819184b3b0d45f9d4762`, static directory `dist`. Handoff 2 records the last confirmed hosted address as `https://mindplay-curious-dice.softmacaw131.chatgpt.site`, private/owner-only at that time, with the last confirmed deployment corresponding to `c42a3d7`. This task did not contact it or verify whether `0aee889` is deployed. Handoff 1's lack of deployment evidence is a session boundary, not proof that no hosting exists. Local Chrome opening is not a public URL or Google indexing.

The handoff describes the GitHub repository as private; current account visibility and collaborator access were not checked. GitHub access and Sites preview access are separate. Inviting collaborators, changing visibility, pushing, and deploying are separate operations from editing documentation. Use remote `github`, not an assumed `origin`.

Current linked release worktrees were observed at `/private/tmp/mindplay-carousel-release` (`codex/royal-races-carousel`, `6f4829d`) and `/private/tmp/mindplay-story-release` (`codex/royal-races-story`, `c42a3d7`). Earlier QA directories included corresponding `*-qa` paths and `/private/tmp/mindplay-browser-qa/`; Dice scripts included `dice-focus.mjs` and `dice-flow.mjs`. Handoff 1 identifies browser QA `check.mjs` as Horse-session-owned. Temporary artifacts are not durable deliverables. Do not delete/reset linked worktrees or overwrite another session's scripts without checking ownership.

For future implementation, preserve exact dice faces/cycle/ties/expectations, real simulations, the one-duel and three-pair gates, computer-first commitment, player-first countering, all research calculations, 25 horses/five lanes, fixed distinct ranks, independent coats, observed-only deductions, and correctness-versus-proof separation. Preserve the latest fewer-choice Dice direction and all-25 horse board unless the user changes them. Coordinate shared files and leave unrelated work intact.

## 11. Documentation index

| Document | How to use it now |
| --- | --- |
| `PROJECT_MASTER_CONTEXT.md` | Consolidated context for this source snapshot; current behavior and unresolved gaps are explicit. |
| `HANDOFF_CHAT_1.md` | Detailed Dice history, session ownership, historical fixes/QA, latest simplification rationale. |
| `HANDOFF_CHAT_2.md` | Broader world-map/Horse history, product direction, hosting and collaboration evidence. |
| `README.md` | Local setup and high-level engine overview; fresh-map-session and single-open-world statements are stale. |
| `docs/royal-races.md` | Puzzle contract, evidence validation, seven-race construction; QA claims are historical. |
| `docs/royal-races-story.md` | Current Horse story/grid/journey rationale; 20-test report belongs to that milestone. |
| `docs/horse-carousel.md` | Historical superseded layout; do not treat filters/search as current paddock features. |
| `docs/stage-characters.md` | Distinct identities and racing art provenance/prompt. |
| `docs/art-direction.md` | Original visual direction/atlas provenance; four-world/one-open-world behavior is stale and prompt fields are missing (`undefined`). |
| `docs/playtest-and-demo.md` | Proposed study/demo, not evidence of completion; adapt session-only persistence and research-before-strategy walkthrough to current behavior. |

Only this master-context file was created during consolidation. The handoffs and application source remain unchanged.
