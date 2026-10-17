# Playtest and demo guide

## Test with 3–5 new players

Human playtests have not yet been run. Share the app with people who have not seen the proposal. Say only: “Pick the die you would trust.” Do not explain the cycle.

Observe without coaching: Can they select a die and play three rounds? Do they notice Explore unlocking? Can they make a prediction and test all three matchups? Can they explain the cycle after the reveal? In Quant, can they use choosing second to find a counter?

Record the first hesitation, any misunderstood label, and their own explanation of the result. Ask: “What surprised you?” and “What would you try next?” Avoid teaching the answer during the test. Prioritize problems repeated by several players.

## Three-minute demo

- 0:00–0:30: Show Curious Island and ask the audience to choose a die. The opening title does not disclose the answer.
- 0:30–1:00: Play three quick rounds. Explain that the result of one round is not a proof. Open the newly unlocked workshop.
- 1:00–1:45: Choose a hypothesis. Run simulations for Ruby–Sapphire, Sapphire–Emerald, and Emerald–Ruby using the next-matchup suggestions. Point to convergence and the updated field journal.
- 1:45–2:15: Reveal the cycle and enter the newly unlocked research room. Show the 36-cell exact probability calculation.
- 2:15–2:50: Scroll to the strategy experiment. Let the computer choose first, select its counter, and roll. Compare with choosing first. Explain that the probability advantage does not guarantee a win.
- 2:50–3:00: “Play first. Get curious. Discover why.”

## Team handoff

Math owner: progression and strategy invariants, exact probabilities, Monte Carlo. UI owner: scene, readability, locked chapter affordances, mobile. Integration owner: complete new-session journey, tab state retention, timer cancellation, deployment.

All progress is session state. Changing a die or resetting its local battle keeps chapter unlocks; returning to the world map begins a fresh adventure. No database, analytics, or personal data collection is added.
