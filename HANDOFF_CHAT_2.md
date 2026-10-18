# Mindplay — Conversation 2 Handoff

Prepared October 17, 2026, America/Los_Angeles.

## Scope and evidence

This handoff combines the accessible conversation with a read-only inspection of the current Mindplay repository. It covers the broader product direction, the fantasy world redesign, Dice Duel progression, and especially Brain Teaser Island / The Royal Races. It distinguishes current source from earlier iterations, future ideas, and historical verification.

- **Repository:** `/Users/skylarzhang/Desktop/DubHacks/mindplay`
- **Inspected branch / HEAD:** `main`, `0aee889d37a20ba5cc9ae24dcfc744dd1c18c019` (`added brainteaser stage`). Despite its title, this latest commit changes Dice Duel UI and persistence; the horse story/layout changes are in its predecessor.
- **GitHub:** private repository, `https://github.com/skylarzhj/mindplay`; remote name is `github`, not `origin`. At inspection, `main` tracked `github/main` without an ahead/behind marker.
- **Companion handoff:** [HANDOFF_CHAT_1.md](HANDOFF_CHAT_1.md), present as an untracked document during this review, provides the other session's detailed Dice Duel UI history. Its historical reports are supplementary evidence, not new tests performed here. It was not changed.
- **This task:** documentation only. No existing application code was modified, and no install, build, test run, commit, push, or deployment was performed to prepare this handoff.

Status terminology:

| Status | Meaning |
| --- | --- |
| Implemented | Present in the inspected source; not necessarily confirmed on the hosted site. |
| Historically verified | Tests/build/browser checks reported during earlier implementation; not rerun for this document. |
| Discussed | Conversation idea or request, without a complete matching current implementation. |
| Superseded | Earlier implementation or preference replaced by a later decision. |
| Review finding | Limitation confirmed or inferred by reading source, not a newly reproduced browser failure. |
| Recommended | Proposed follow-up; not a new user-approved feature commitment. |

Earlier source inputs included the Mindplay Word proposal, a proposal PDF, pasted Dice Duel/build instructions, a fantasy map reference image, and pasted Royal Races redesign instructions. The PDF was not fully extracted in the accessible work; do not attribute unverified details to it. Current source and the latest explicit user direction take precedence over older documentation.

## 1. Project vision and educational philosophy

Mindplay is a DubHacks 2026 interactive mathematical discovery game. It should feel like entering a whimsical fantasy adventure, with mathematical ideas discovered through play. The user explicitly rejected the feel of a traditional educational platform, worksheet, or SaaS dashboard.

The central promise is **“Play first. Get curious. Discover why.”** Supporting language includes **“You don’t have to be a genius. Just be curious.”** and **“Roll the dice. Trust your instincts. Discover the logic.”**

The intended learning progression is:

**Intuition → play → surprise/question → hypothesis → experiment → discovery → strategy → optional mathematical explanation.**

Key principles:

1. Start with an approachable action rather than formulas or prerequisite knowledge.
2. Make users want to investigate. A plain “choose dice → roll → see who wins” loop is insufficient.
3. Allow incorrect predictions without punishment; reward questioning and reasoning as well as winning.
4. Keep mathematics honest. Use actual random trials, exact outcome enumeration, and evidence-based deductions. Never fake a graph, force a loss, or equate a probability advantage with a guaranteed win.
5. Reveal deeper ideas progressively. Play, Explore, and Quant are chapters of one adventure rather than three equally prominent choices on arrival.
6. Keep the next action clear. The user explicitly said the experience felt confusing and insufficiently interesting; later feedback favors fewer simultaneous choices and less scrolling.
7. Let advanced users go deeper without making casual players read a research paper to begin.

Long-term subjects include probability, logic, risk, optimal stopping, Bayesian reasoning, game theory, and optimization. These are product directions, not a claim that all corresponding games exist.

## 2. Current product and game mechanics

### 2.1 Discovery map — implemented

The reference originally requested four floating islands. Adding a proper Brain Teaser stage expanded the map to five and renumbered later stages.

| Stage | World | Current behavior |
| --- | --- | --- |
| 01 | The Curious Island — Luck, Logic & Intuition | Playable; opens Dice Duel. |
| 02 | Brain Teaser Island — The Royal Races · Logic & Deduction | Playable; opens The Royal Races. |
| 03 | The Strategy Forest — Choices, Risks & Rewards | Locked / Coming Soon. |
| 04 | The Probability Labyrinth — Patterns, Uncertainty & Discovery | Locked / Coming Soon. |
| 05 | The Quant Arena — Optimization & Beyond | Locked / Coming Soon. |

The map has animated island hover states, real selection controls, Start Exploring / Play Now actions, scene transitions, navigation, How It Works/About dialogs, and a lucky-die interaction. Start Exploring opens Dice Duel. The lucky die genuinely samples 1–6: 1–3 offers Curious Island, 4–6 offers Brain Teaser Island. Each open world therefore has equal selection probability.

The first-visit map guide explains islands, stage identities, and the lucky die. It is skippable and replayable. The map is interactive HTML/CSS/React, not a screenshot with inert controls.

### 2.2 Dice Duel mathematics — implemented

| Die | Six equally likely face values | Expected value |
| --- | --- | --- |
| Ruby | 2, 2, 4, 4, 9, 9 | 5 |
| Sapphire | 1, 1, 6, 6, 8, 8 | 5 |
| Emerald | 3, 3, 5, 5, 7, 7 | 5 |

Higher roll wins. Duplicate values remain separate equally likely faces. Both dice are sampled independently.

The verified nontransitive cycle is **Ruby beats Sapphire, Sapphire beats Emerald, Emerald beats Ruby**, each with **20/36 = 5/9 ≈ 55.56%** strict win probability. Reverse matchups win 16/36. Distinct dice in this construction never tie. A die against itself has 12 wins, 12 losses, and 12 ties out of 36; diagonal strict win probability is **33.33%, not 50%**.

All three expectations equal 5. This illustrates that average score does not determine head-to-head strength and that there is no universally strongest die.

Mathematical functions are separate from React: face sampling, match resolution, exact outcome counts, expected value, best response, Monte Carlo simulation, choice-order policy, and chapter progression.

### 2.3 Dice Duel journey — implemented, with important current-source nuances

**Play:** Orin chooses the mathematically strongest counter after the player chooses. Results are real independent rolls; the game does not force losses. Local matchup wins/losses/ties and win rate are available through secondary controls.

Current selection shows **one die at a time**, browsed with previous/next arrows. Each begins sealed, can be revealed, and has a CSS 3D cube showing its actual six faces. Hover, click, horizontal pointer gestures, and keyboard arrows step through faces. This is discrete face inspection, not continuous physics-based rotation.

**Progression gates:** `REQUIRED_PLAY_ROUNDS = 1`. One completed duel unlocks Explore. Quant requires that Play prerequisite plus experiments on all three distinct unordered cross-die pairs. Reversing a pair does not add a clue; self-comparisons do not count as a required pairing. There is no mandatory 1,000-trial experiment.

**Presentation versus gate:** the latest source also displays a prominent curiosity invitation after at least three cumulative Play rounds. That is a narrative trigger, not a three-round unlock requirement. After one result, investigation remains available through secondary actions or the Adventure menu. This distinction matters when debugging the user's complaint about not knowing where to click.

**Explore:** choose a hypothesis—Ruby strongest, Sapphire strongest, Emerald strongest, or strength depends on the opponent. Run actual Monte Carlo experiments, inspect wins/losses/ties and a convergence chart, then try another pairing. The current default is 100 trials; settings offer 10, 100, 1,000, and 10,000. Any positive valid experiment can count toward discovery; no fixed large sample is required.

Simulation computes real trial results synchronously and reveals sampled chart points over roughly one second. The curve is not fabricated or forced toward theory. The chart distinguishes observed win rate from exact probability. Roughly 150 chart points are retained while every trial is counted.

**Discovery:** after all three pairs, reveal “There Is No Strongest Die,” the exact cycle, and optional full probability matrix. Short experiments can disagree with the exact direction; the explanatory copy explicitly distinguishes sampling from proof.

**Quant / Strategy Challenge:** computer-first is the default. The computer commits to a random die before the player chooses and cannot switch afterward. Its die is unavailable to the player. Player-first lets the computer counter optimally. Both orders have actual separate empirical records, a best-response hint, new-matchup controls, and reset. Choosing second helps only if the player selects the right counter; individual wins remain uncertain.

**Quant / Research Notes:** interactive 6×6 outcome grid, exact fractions/probabilities, expected-value comparison, best-response lookup, and law-of-large-numbers explanation. More samples do not guarantee a monotonic approach to theory; previous losses do not make a win due. A narrative invitation to research appears after three local strategy rounds, but section switching is separately available.

**Navigation and persistence:** the latest Dice Duel shell puts progression, journal, map return, rules replay, save status, and confirmed adventure reset inside an Adventure menu. Unlocked chapter components remain mounted while changing chapters, retaining local state during that visit. Journey totals, first die, hypothesis, completed experiments, and strategy-round count persist in localStorage. The exact selected die, active screen, local battle history, and per-order strategy records do not persist across remount/reload.

### 2.4 Brain Teaser / The Royal Races — implemented

The user initially referred to “15 horses” and “five fastest,” then clarified the **classic puzzle**. The implemented contract is **25 horses, at most five per race, find the fastest three in order, using as few races as possible**. Do not silently switch back to the initial numbers.

Rules and evidence:

- Each field has 25 distinct, fixed hidden ranks; smaller internal rank means faster. IDs displayed to players are 01–25.
- Races accept 2–5 unique horses and return a deterministic finishing order. No ties, displayed speeds, or stopwatch times.
- Animation communicates order within that race; it must not encode comparable finish times across races.
- Five coat colors are balanced at five horses each and shuffled separately from ranks. Coats are mixed across IDs and remain stable for the current field; color is not a clue to speed.
- Drag paddock → lane, lane → lane, or lane → paddock. Replacing an occupied lane returns its former occupant to the paddock; duplicate assignment is prevented.
- Tap/click horse then lane, or keyboard selection/placement, provides alternatives to dragging. Race controls lock while running. Pointer/touch drag includes a ghost and edge scrolling.
- Every result is recorded. Previous lineups can be reused, and horse IDs can be selected from history.
- Deductions use transitive closure of **observed** faster-than relations, never hidden ranks. Any horse with at least three known faster predecessors cannot be in the top three.
- Optional requested hints progress from conceptual nudges and unseen-horse advice to comparing winners and, at the final level, the seven-race construction.
- The podium requires ordered first/second/third. Actual correctness and sufficient evidence are separate. A lucky correct guess is acknowledged but not certified as a proof.
- New Field asks for confirmation, then resets ranks, coats, lineups, races, hints, deductions, and podium state. Horse gameplay is not saved across leaving/remounting the stage or refreshing.

The proof validator requires observed relations establishing first > second > third and third > every excluded horse. It does not award proof just because the selected IDs match hidden ranks.

**Classic seven-race construction:** race five disjoint groups of five, then their five winners. Rename groups A–E in winner order. A1 is fastest overall. Only A2, A3, B1, B2, and C1 can still occupy second/third; race those five and append their top two behind A1. The unit suite exercises this construction across 30 deterministic shuffled fields. This verifies the construction; the tests are not a formal lower-bound proof that fewer races are impossible.

### 2.5 Latest horse story and compact interface — implemented

The latest explicit user request was: explain why the horses race, offer opening hints describing controls, show all 25 horses directly, put the track at right, show “Here’s your race journey” after racing, reduce scrolling, bounce the races-used count when updated, and mix horse colors.

Current behavior follows that direction:

- **Story:** the island lantern festival needs its three fastest messenger horses to carry invitations. Records are missing and the enchanted stopwatch is broken. Captain Rowan asks for help. A two-part first-visit story is skippable, Escape-dismissible, and replayable through “Why are we racing?”
- **Course tour:** after story dismissal, an optional four-step guide highlights paddock, track, journey, and podium. “Show me around” replays it. It scrolls mobile targets into view when needed.
- **Desktop layout:** compact 5×5 paddock on the left and five-lane track on the right. All 25 numbered horses are directly available, with ready/raced/assigned feedback.
- **Phone layout:** paddock and track stack; all 25 remain visible in the paddock. Reduced scrolling is a design goal, not a promise that the complete phone page fits in one viewport.
- **Race journey:** a compact latest-first horizontal result strip updates after every completed race, animates the new entry, returns the strip to its latest entry, and offers lineup reuse. It does not force a popup or page jump. A placeholder exists before race one.
- **Races used:** the number remounts on count changes and springs once; unrelated selection does not trigger a bounce. Reduced-motion preference suppresses this effect.
- **Optional depth:** Race Journal folds away full history, hints, and deductions. Podium submission is a separate disclosure. These preserve focus on planning the next race.

### 2.6 Distinct animated stage characters — implemented

The user explicitly wanted different stage keepers, not the same static character everywhere.

- **Orin:** purple star-robed sage with beard, hat, crystal staff; lilac/ivory Dice Duel setting.
- **Captain Rowan:** green-coated race marshal with feathered cap, sash, pennant; sage-green/gold racecourse setting.
- Shared `Keeper` component accepts a variant and typed mood: idle, thinking, anticipating, celebrating, teasing.
- SVG parts animate independently: blinking, speaking-mouth movement, bobbing, state-driven gestures, celebration, and a click-triggered wave.
- Reduced-motion preferences disable repeated ambient gestures.

These are scripted state-driven characters. There is no voice, generative dialogue, AI agent, or conversational backend.

## 3. Major design decisions and reasoning

| Decision | Reason and current implication |
| --- | --- |
| Fantasy world instead of dashboard | The user wants a magical adventure whose interactions invite mathematical curiosity. |
| Closely follow the supplied painted reference | Floating islands, pastel sky, clouds, magical lighting, serif/storybook headings, parchment labels, playful dice, and polished indie-game atmosphere establish the desired identity. |
| Separate environment artwork from UI | The reference already contains labels/buttons. Reusing it as a full background and overlaying duplicates would hurt clarity and responsiveness. Bundled artwork contains environments; readable labels and controls are live HTML. |
| Keep real functionality during redesign | Visual fidelity must not replace functioning simulation, strategy, calculations, navigation, or dragging with mockups. |
| Sequential Play → Explore → Quant | Prevent users from arriving at three unexplained equal choices; learning follows experience and discovery. Previously unlocked chapters remain accessible. |
| No forced 1,000 trials or repeated-round quota | The user questioned “make them compete 1,000 times.” Curiosity should motivate experiments; sample size belongs in optional settings. The current three-round invitation is presentation, distinct from the one-round gate. |
| Keeper-led narrative and one dominant task | Direct response to “users don’t know what to click” and “not interesting enough.” Latest Dice simplification puts secondary tools in disclosures/menu. |
| Horse puzzle gets its own island | The user rejected treating Brain Teaser as a detached extra card. It should feel like a peer stage with its own world and character. |
| Stage-specific animated characters | Repeated identical keepers weaken the sense of discovering different worlds. Reuse animation mechanics while preserving distinct art/personality. |
| Latest all-horse grid replaces carousel | The user most recently prioritized seeing all 25 and reducing scrolling. The earlier carousel is historical, not the current requirement. |
| Inline race journey instead of forced result modal | Preserve a readable record and immediate feedback without interrupting the next planning action or making the page jump. |
| Proof separate from lucky answer | Educational success should demonstrate deductions from available information, not merely identify hidden ranks by guessing. |
| Browser-only MVP | Keep the prototype self-contained and interactive without requiring accounts, servers, or AI infrastructure. |

Visual evolution matters: an earlier midnight/navy/purple presentation was superseded by the reference-led pastel storybook direction. Some legacy CSS remains, but it is not the intended product identity.

## 4. Rejected, superseded, postponed, and discussed-only ideas

| Idea | Status / reason |
| --- | --- |
| Simple choose/roll/win Dice Duel | Explicitly insufficient. Expanded into prediction, experiments, cycle discovery, strategy, and optional explanation. |
| Three freely available modes from the start | Superseded by gated chapter progression to establish a clear first action. |
| Mandatory three Play rounds to unlock Explore | Earlier iteration; current gate is one completed duel. Do not confuse the later three-round invitation with the gate. |
| Mandatory “race the dice 1,000 times” | Rejected as a required action. Multiple sample counts remain optional. |
| Force a surprising loss to teach the concept | Not implemented. The computer counters probabilistically; random outcomes remain genuine. |
| Use reference screenshot as the entire interface | Explicitly unsuitable if it duplicates baked-in labels/buttons. Environment assets and live controls are separated. |
| Brain Teaser as a detached homepage card | Superseded by a proper Stage 02 floating island. |
| 15 horses / fastest five | Initial imprecise reference; clarified to classic 25 / fastest three. |
| Horse carousel with 4–6 visible cards, filters, number search | Implemented in an earlier iteration, then superseded by the latest all-25 layout. `HorseCarousel.tsx` remains in source but is not rendered by the current stage. Its filters/search are not current paddock features. |
| Always-visible Dice progression, expanded journal, many panels | Earlier redesign simplified after feedback. Current menu/disclosure approach reduces competing choices. Detailed other-session history is in `HANDOFF_CHAT_1.md`. |
| Continuous free 3D die rotation / physics | Not implemented; current inspection snaps among six real faces. |
| Forced automatic chapter navigation | Not implemented. Narrative invitations offer continuation or more play. |
| Horse journey as a required popup after every race | Not the current implementation. A live inline strip satisfies the requested journey feedback with fewer interruptions. |
| AI Socratic/research companion | Discussed as a future possibility, not implemented. Future explanations must use the real engine rather than invent probabilities. |
| Treasure Hunt / optimal stopping, Mystery Boxes / Bayesian reasoning, Pirates’ Council / backward induction, Random Walker, Market Maker | Long-term concepts only; no playable implementations in this repository. |
| Remaining three worlds | Map placeholders only. Do not confuse Dice Duel's implemented Quant chapter with a playable standalone Quant Arena world. |
| Accounts, backend/database, multiplayer, leaderboard | Outside the completed MVP; not implemented. |
| 3–5-person human playtest and rehearsed demo | Planned, not documented as completed. Existing guide is preparation, not evidence of a study. |

## 5. Implementation inventory and important files

All paths below are relative to the repository root. This is an implementation/ownership map across the accessible work, **not a claim that every file is currently modified or was authored by this single session**.

| Area | Files | Role / changes |
| --- | --- | --- |
| App navigation | `src/main.tsx` | Home/Dice/Horses scene state, transitions, shared header/dialog integration. No URL router. |
| Home/world map | `src/pages/Home.tsx`; `src/components/worlds/WorldIsland.tsx`, `LuckyDice.tsx` | Five islands, two playable routes, locked worlds, live plaques, lucky selection. |
| Shared navigation | `src/components/layout/Header.tsx`, `InfoDialog.tsx` | Functional navigation and modal field guides. |
| Map onboarding | `src/components/onboarding/WelcomeHints.tsx` | Skippable, replayable initial map hints. |
| World art | `public/art/world-islands.png`, `brain-teaser-island.png` | Local generated painted environment atlas and separate racing island. Approx. 2.4 MB and 2.6 MB respectively. No baked UI text. |
| Shared presentation | `src/styles/index.css`, `fantasy.css` | Tailwind import, legacy/shared rules, pastel world styling, responsive layouts, horse UI, character animation. |
| Dice shell | `src/pages/DiceDuel.tsx` | Gates, Adventure menu, chapters, research switch, reset, intro, save status. |
| Dice scenes | `src/components/dice/PlayMode.tsx`, `ExploreMode.tsx`, `QuantMode.tsx`, `StrategyExperiment.tsx` | Real play, hypothesis/simulation, exact research, choice-order experiment. |
| Latest Dice presentation | `src/components/dice/AdventureIntro.tsx`, `InspectDie.tsx`, `dice-duel.css` | First-visit guide, sealed face-inspection cube, focused layout; latest separate-session source changes. |
| Dice shared UI | `src/components/dice/DieCard.tsx`, `PairControls.tsx`, `DiscoveryJournal.tsx`, `Keeper.tsx`; `src/components/charts/ConvergenceChart.tsx` | Dice visuals, pair selectors, recorded discoveries, both stage characters, actual simulation chart. `DieVisual` and `Keeper` are used beyond Dice Duel. |
| Dice state | `src/hooks/useDuel.ts`, `useJourney.ts` | Match lifecycle/timer cleanup; journey reducer and validated localStorage. |
| Dice engine | `src/games/diceDuel/diceConfig.ts`, `diceEngine.ts`, `probability.ts`, `simulation.ts`, `strategy.ts`, `progression.ts` | Distributions, sampling, exact math, Monte Carlo, commitment policy, unlock rules. |
| Horse scene | `src/pages/HorseTeaser.tsx` | Field/lineup/race/hint/podium state, counter animation, story/tour/journey composition, reset. |
| Current horse board | `src/components/horses/HorsePaddock.tsx`, `RaceCourse.tsx`, `HorseGlyph.tsx` | All-25 board, five-lane arena/controls, numbered SVG horses and animation. |
| Horse narrative | `src/components/horses/RaceStory.tsx`, `RaceGuide.tsx`, `RaceJourney.tsx` | Why-race story, anchored four-part tour, latest-first reusable result strip. |
| Horse reasoning UI | `src/components/horses/RaceJournal.tsx` | Collapsible history, progressive hints, observed-relation deductions. |
| Superseded horse UI | `src/components/horses/HorseCarousel.tsx` | Previous searchable/filterable/swipeable rail retained in source; not current scene. |
| Horse input | `src/hooks/useHorseDrag.ts` | Mouse/touch gestures, legacy carousel swipe distinction, drag ghost, placement/removal, edge scroll. |
| Horse engine | `src/games/horseTeaser/engine.ts` | Independent rank/coat shuffles, deterministic races, lane uniqueness, transitive relations, hints, correctness/proof split. |
| Tests | `src/games/diceDuel/engine.test.ts`, `progression.test.ts`; `src/games/horseTeaser/engine.test.ts`; `src/hooks/useJourney.test.ts` | Mathematical/progression/horse-proof/persistence validation. Current source defines 23 tests across four files. |
| Build/config | `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `index.html` | React/TS/Vite/Tailwind dependencies and scripts, chunking and build setup. Vitest was upgraded during prior dependency remediation. |
| Hosting metadata | `.openai/hosting.json` | Sites project `appgprj_6ad3bb6e0710819184b3b0d45f9d4762`, static output `dist`. |

Documentation already present:

- `README.md`: setup and high-level overview; contains older behavior claims that need revision.
- `docs/art-direction.md`: art direction, asset provenance/generation prompts.
- `docs/stage-characters.md`: independent islands and character identities.
- `docs/royal-races.md`: puzzle contract, evidence validation, seven-race construction.
- `docs/horse-carousel.md`: **historical UI**, superseded by the all-25 board.
- `docs/royal-races-story.md`: latest horse story, compact board, journey, coat shuffle, historical QA.
- `docs/playtest-and-demo.md`: proposed playtest/demo; some Dice presentation/persistence guidance is stale.
- `HANDOFF_CHAT_1.md`: companion Dice Duel handoff, with detailed latest simplification and review findings.

Recent implementation milestones:

| Commit | Meaning |
| --- | --- |
| `6f4829d` | Compact carousel/course iteration; later superseded in the visible paddock. |
| `c42a3d7` | Latest horse story, onboarding, all-25 board, race journey, counter bounce, independent coat shuffle. |
| `0aee889` | Latest current HEAD: Dice Duel focused presentation, die inspection/intro, local journey persistence and tests. Commit title is broader than its actual diff. |

### Runtime and local development

React 19, TypeScript ~5.7, Vite ^6.1, Tailwind ^4, Framer Motion ^12, Recharts ^3, lucide-react, and Vitest ^5.0.5. These are package ranges, not exact lockfile resolutions. Node **22.12+** is required.

```sh
cd /Users/skylarzhang/Desktop/DubHacks/mindplay
npm install
npm run dev
npm test
npm run build
npm run preview
```

Use Vite's printed URL; default is usually `http://127.0.0.1:5173`, but another server may occupy that port. Build performs TypeScript checks and produces `dist/`. Vite separates chart, motion, and other vendor chunks. No backend environment variables, database, or auth service are required. Images/fonts do not depend on external runtime services.

### Storage boundaries

| State | Current storage |
| --- | --- |
| Dice journey totals/hypothesis/experiments/unlocks | `mindplay.dice-duel.journey.v1` localStorage; validated on load; fallback to current visit if writing fails. |
| Dice intro dismissal | `mindplay.dice-duel.intro.v1`. |
| Map guide dismissal | `mindplay-map-guide-v1`. |
| Horse story dismissal | `mindplay-royal-races-intro-v1`. |
| Exact Dice screen, selected die, active rolls/local records | Component memory, not full reload restoration. |
| Horse field, ranks, races, lineup, hints, podium | Component memory; leaving/remounting or reloading starts a new field. |

### Hosting and collaboration continuity

The last confirmed hosted URL in this conversation is **https://mindplay-curious-dice.softmacaw131.chatgpt.site**, with private/owner-only access at the last known deployment. The last deployment confirmed here corresponded to `c42a3d7`; this review did not verify whether the later `0aee889` changes are deployed. Do not assume source HEAD and hosted behavior match.

GitHub and Sites are separate publication paths. The GitHub remote is `github`; avoid blindly following commands that assume `origin`. To let friends edit a private repository, the owner must invite their GitHub accounts as collaborators. A private hosted preview is not automatically accessible to those collaborators. Feature branches and pull requests are the recommended collaboration workflow; no invitation, visibility change, push, or deployment was made for this handoff.

Earlier work used temporary isolated QA/release directories, including `/private/tmp/mindplay-carousel-qa`, `/private/tmp/mindplay-carousel-release`, `/private/tmp/mindplay-story-qa`, and `/private/tmp/mindplay-story-release`. Linked worktree branches `codex/royal-races-carousel` and `codex/royal-races-story` existed at inspection. Do not delete/reset them or overwrite another session's QA scripts without checking ownership. Temporary files are not durable project deliverables.

## 6. Verification, known issues, and unfinished work

### Historical verification, not new results from this task

- Horse story/all-25 release: 20 tests in three files and production build passed before the later Dice persistence tests were added.
- Horse engine coverage includes 25 unique fixed ranks, independent balanced coat shuffle, capacity/duplicate rejection, lane uniqueness, observed-only transitive deductions, lucky-but-unproven answers, and full seven-race proof across 30 fields.
- Earlier desktop Chrome QA covered actual dragging, lane movement, history/reuse, hints, deductions, reset, first-visit/replayed/skipped story and guides, race journey updates, and the complete seven-race solution.
- Touch-enabled Chrome QA used touch input to verify tap/drag assignment, racing, count/journey updates, guide replay, and absence of horizontal overflow. This is not real-device iOS/Safari certification.
- A historical 1440×1050 desktop check found all 25 horses beside the track and Start Race within the first viewport. This does not certify all screen sizes.
- The companion Dice handoff reports 23 tests in four files, successful production builds, and focused-flow/browser/persistence/mobile checks. Current source contains those four test files and 23 cases; they were not rerun here.
- Prior dependency remediation reported a clean audit at that time. No fresh dependency/security audit was performed for this document.

Browser QA scripts/screenshots were temporary files under `/private/tmp/mindplay-browser-qa/` and related directories, not committed end-to-end regression tests. Unit tests do not replace a novice-user playtest or an accessibility audit.

### Current source-confirmed limitations and review findings

1. **Explore cannot rerun experiments after discovery.** `ExploreMode` hides the workshop/settings once `discovered` is true, with no reopen control. Returning to Explore shows the reveal. Research still recommends comparing sample sizes, so this is a functional flow gap to fix.
2. **Curiosity prompts can repeat.** Play checks cumulative rounds ≥3 after every subsequent result; Strategy checks local total rounds ≥3. Dismissal is not remembered as consumed. Repeated invitations can interrupt continued play.
3. **An invitation may obscure the triggering result.** The Play curiosity view hides the battle at roll completion; Strategy similarly replaces its battle. Letting the result remain visible first is a recommended refinement.
4. **One-round unlock is less prominent than the three-round prompt.** Explore is available after one duel, but the most prominent current Play action remains Roll Again; investigation is secondary until the narrative prompt. This is a discoverability concern, not a broken gate.
5. **Persistence is partial and inconsistent across games.** Dice journal/unlocks persist, exact screen/local records do not; Horse gameplay does not persist. “Saved on this device” should not be interpreted as complete resume. Returning to the map no longer universally resets Dice journey progress, despite older README claims.
6. **Stored Dice experiment history is unbounded.** The entire journey is serialized on changes. Quota failures are caught and shown as visit-only progress, but there is no pruning. Validation checks structure and totals, not full chronology or tamper resistance.
7. **Research still has substantial simultaneous content.** Multiple panels, selects, formulas, and the grid remain. Latest simplification reduces clutter but does not fully implement one-topic-at-a-time research.
8. **Onboarding varies by stage.** Horse has anchored highlights; Dice has an overview dialog. Some guide copy also says “a few duels” although Explore unlocks after one. No user playtest confirms the final onboarding balance.
9. **Horse hints are progressive but not a general optimal planner.** They use request level and recorded progress; unusual race sequences do not receive a fully bespoke minimal-race strategy. This is a scope limit, not evidence of incorrect deductions.
10. **No URL routing/deep links.** `src/main.tsx` uses component state. Browser history does not encode game/chapter navigation; there is no implemented `/dice-duel` or `/royal-races` route.
11. **Accessibility and device coverage are incomplete.** Keyboard alternatives, native dialogs, labels, live regions, and reduced-motion handling exist. There has been no full screen-reader/contrast/focus audit. Adventure-menu Escape/outside-click handling and explicit focus after chapter transitions remain limited. Mobile all-horse dragging and ordinary page scrolling need real-device testing.
12. **Reduced-motion implementation should be checked end to end.** Most animation components respect it, but the app-level navigation helper still requests smooth scrolling directly. Do not claim every motion path has been audited.
13. **CSS/maintenance debt.** Shared fantasy styles and scoped Dice CSS contain successive overrides and styles for superseded layouts. Dense JSX makes change review harder. Old carousel code remains; avoid removing it casually while another task may rely on it.
14. **Artwork delivery/performance is unprofiled.** The two raster assets total roughly 5 MB. No formal slow-network, low-end-device, or rendering-performance review is recorded.
15. **Documentation drift.** README and playtest guide retain older three-round, tab, fresh-map-session, and layout descriptions. `docs/horse-carousel.md` describes a real earlier implementation, not the active interface. This handoff documents current behavior without editing those files.
16. **Deployment freshness/access is unverified.** The last confirmed private deployment predates current HEAD. Friends' ability to open it has not been established by this review.

No unresolved mathematical-engine failure was observed in the accessible implementation history or this source review. That is not a claim that every possible interaction is bug-free. Historical fixed gesture/typing/layout issues should not be reported as current failures without reproduction.

### Work not yet demonstrated complete

- Human playtest with 3–5 first-time users; clarity/interest improvements are not yet measured.
- User acceptance of the newest Dice simplification and newest all-25 horse layout.
- Durable committed browser regression coverage.
- Full mobile Safari/real-device, keyboard/screen-reader, small-height, and reduced-motion review.
- A rehearsed demo reflecting the current strategy-first Quant layout and horse stage.
- Full reload resume, URL routing, additional playable worlds, and AI features.

## 7. Planned features and recommended next steps

The approved product direction is to refine the existing interactive adventure: clear sequential discovery, fewer competing choices, distinct animated stage identities, and a story-driven compact horse stage. The user has not approved an unlimited new-feature roadmap. The ordering below is a recommendation based on observed gaps.

### Priority 1 — validate the current experience with fresh users

Use `docs/playtest-and-demo.md` as a starting point, updating the spoken walkthrough to match current source. Observe without teaching the cycle or horse solution.

- Can someone identify the first action and complete a duel without coaching?
- Do they find Explore after one duel, or assume they must keep rolling?
- Do they understand sample evidence versus exact probability and use choosing second strategically?
- In Royal Races, can they explain why they are racing, place horses, run a race, read/reuse its result, request a hint, and locate the podium?
- Does showing all 25 help planning? Are the story/tour and race journey helpful or obstructive on a phone?

Acceptance target: a new user can state their current goal and identify the next action without reading every panel or asking the developer what to click. Record observed hesitation before adding new controls.

### Priority 2 — repair existing flow gaps

Recommended implementation follow-ups, not changes made here:

1. Restore an optional experiment replay path after discovery.
2. Make curiosity invitations once-per-journey or explicitly repeatable, rather than returning after every roll.
3. Show the triggering roll's result before replacing the battle with an invitation.
4. Reconcile one-round eligibility, prominent action placement, and onboarding copy.
5. Clarify what saves and what resets; decide whether horse progress needs local resume.

Keep one visually dominant task per scene while fixing these issues. Avoid returning to multiple always-expanded panels as the default solution.

### Priority 3 — harden the existing interactions

- Test real touch devices, drag versus scrolling, keyboard-only placement, focus transitions, dialogs/menu, reduced motion, blocked/corrupt localStorage, and narrow/short viewports.
- Preserve race order without leaking comparable times or hidden ranks.
- Add targeted durable regression tests for the actual flow bugs and crucial drag/proof paths after changes; avoid tests that merely mirror styling.
- Re-run unit tests, TypeScript/production build, and relevant browser paths after implementation work. A past passing report is not a substitute for checking a new diff.

### Priority 4 — make the project easier to hand off and demo

- Reconcile README/playtest/carousel documentation with current source.
- Format dense components and consolidate old CSS only with visual checks and awareness of shared ownership.
- Review image delivery if performance measurements justify optimization.
- Confirm current hosted revision and preview access separately from GitHub collaborator permissions.
- Rehearse a short demo: intuitive duel → hypothesis/experiments → cycle → use choosing second → optional exact math; show Horse stage as a distinct deduction adventure without revealing its full solution immediately.

### Later, only with explicit product scope

New games in the locked worlds, richer adaptive hints, full resume/deep links, audio/expanded character interaction, and an AI research companion are possible extensions. Finish and validate the current learning loops first. They remain discussed ideas, not delivered features.

### Invariants to preserve in any future work

- Keep the exact dice faces, equal expected values, 20/36 cycle, proper tie handling, and genuine simulations.
- Keep Play → Explore → Quant gates; one completed Play round, then three distinct unordered experiment pairs. Do not introduce a mandatory 1,000-roll quota.
- Preserve commitment in computer-first strategy and optimal countering in player-first strategy.
- Keep 25 horses, five lanes, fixed distinct speeds, top-three ordered proof, observed-only deductions, and independent coat colors.
- Keep latest all-25 desktop-left/course-right direction unless the user changes it again; the carousel is superseded.
- Preserve distinct Orin/Rowan identities, skippable/replayable guidance, readable live UI, responsive layout, and reduced-motion alternatives.
- Check current ownership/status before editing shared globals or another session's files. Do not revert unrelated work.
- Treat commits, pushes, collaborator changes, publication, and visibility changes as separate actions from this documentation task.

## Handoff completion note

This document records the inspected source and accessible history; it does not certify a new build or deployment. The only file created by this task is `HANDOFF_CHAT_2.md`. Existing application files and the companion handoff were left untouched, and nothing was committed or pushed.
