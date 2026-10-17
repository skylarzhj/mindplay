# Mindplay · Dice Duel

An interactive mathematical discovery prototype for DubHacks 2026.

**Play first. Get curious. Discover why.**

## Run locally

Requirements: Node.js 22.12+ and npm.

```bash
cd mindplay
npm install
npm run dev
```

Open the Local URL printed by Vite (normally http://127.0.0.1:5173).

```bash
npm test       # deterministic mathematical engine tests
npm run build # TypeScript checks and production build into dist/
npm run preview # serve the production build locally
```

## What works

- A responsive discovery map with four worlds; Curious Island opens Dice Duel. Future worlds are visibly disabled.
- Play: select a die, animated independent rolls, round results, wins/losses/ties, win rate, change die, reset, and an investigation prompt after three rounds.
- Explore: record a hypothesis, compare any dice, simulate 10–10,000 rounds, inspect real counts and a Recharts convergence graph, then reveal the exact pairwise matrix and nontransitive cycle.
- Quant: interactive 36-outcome grid, exact win probability, expected values, best-response strategy, and an accessible explanation of the law of large numbers.
- Mode state stays intact while switching tabs. Returning to the world map starts a fresh game. There is no account, database, AI, or backend. All computation happens in the browser.

## Modules and team boundaries

```text
src/
  pages/                  Home and DiceDuel journey shell
  components/
    layout/               Navigation
    dice/                 Dice visuals and three mode interfaces
    charts/               Recharts convergence visualization
    ui/                   Shared icon exports
  games/diceDuel/
    diceConfig.ts         Typed face distributions
    diceEngine.ts         Independent face sampling and match results
    probability.ts        Exact enumeration, expectation, best response
    simulation.ts         Monte Carlo counts and convergence samples
    engine.test.ts        Mathematical invariants and deterministic simulations
  hooks/useDuel.ts         Game lifecycle and animation timer cleanup
  types/                  Shared contracts
  styles/                 Tailwind import and responsive visual styling
```

Suggested ownership: one developer extends `games/` and tests; another owns visuals and styles; a third owns journey state and game mechanics. The mathematical engine has no React dependency.

## Verified construction

Ruby: `[2, 2, 4, 4, 9, 9]`; Sapphire: `[1, 1, 6, 6, 8, 8]`; Emerald: `[3, 3, 5, 5, 7, 7]`.

The engine enumerates every equally likely pair of face indices, including duplicate values. Tests verify Ruby beats Sapphire, Sapphire beats Emerald, and Emerald beats Ruby, each with 20 winning combinations out of 36. All displayed probabilities come from enumeration, not constants. Same-die comparisons can tie; diagonal matrix entries are strict win probability, not 50%.

All three dice have expected value 5. This deliberately illustrates that equal expectation does not imply equal matchup performance. In Play, the computer chooses the mathematically strongest counter after the player picks. Quant explains this policy.

Simulation uses independent `Math.random()` samples for both dice and stores at most roughly 150 chart samples while counting every trial. The convergence line is not fabricated or forced toward theory. Randomness is suitable for this educational prototype, not competitive wagering. Engine tests inject deterministic randomness to verify exact sampling and counts without flaky statistical assertions.

## Design

Midnight colors, original CSS floating-island art, softly glowing dice, responsive cards and accessible native controls. Framer Motion respects reduced-motion preferences; CSS ambient animation is disabled for reduced motion. No external images or font services are required.
