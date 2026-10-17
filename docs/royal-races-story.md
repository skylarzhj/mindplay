# Royal Races · Story and compact board

## Why the race exists

The island lantern festival needs three fast messenger horses to carry invitations between floating islands. Twenty-five horses arrive without speed records; the enchanted stopwatch is broken, and the course has only five lanes. Captain Rowan asks the player to choose the fastest three using as few comparisons as possible.

This fictional setup appears as a two-part skippable story on the first racecourse visit. “Why are we racing?” reopens it. Only onboarding dismissal preferences are stored locally; gameplay state retains the existing current-field behavior.

## Guidance

A first-visit map guide explains islands, different stage characters, and the lucky die without blocking map interaction. It can be dismissed or replayed. After the race story, a four-step skippable course guide highlights the paddock, track, journey, and podium. “Show me around” replays it. Escape dismisses either guide.

## Layout and feedback

Desktop: a compact 5×5 paddock keeps all 25 horses visible at left; the five-lane course sits directly at right. The phone layout stacks them while preserving all horses and tap/drag assignment. The existing carousel component remains reusable, but this stage now uses `HorsePaddock`.

Every completed race updates a horizontally compact “Here’s your race journey” strip, with the latest result first, automatic positioning back to the latest entry, and one-click lineup reuse. It does not scroll the page or interrupt the next race with a forced dialog. The Race Journal still contains complete history, hints, and evidence-only deductions.

The races-used count springs once when the number changes, not on selection or unrelated rerenders. Reduced-motion preferences disable the bounce and entry animation.

## Coats and mathematical correctness

Horse ranks and coats are shuffled separately. Each field still has five horses of each of five coat colors, now mixed among numbers. Colors stay fixed through that field's races and never determine or expose speed. Finishing order, race capacity, transitive deductions, and podium proof are unchanged.

## Verification

20 unit tests pass, including an added coat-shuffle invariant and the classic seven-race solution across 30 deterministic fields. Chrome checks verify initial/replayable/skippable guides and story, all horses visible beside the track, counter replacement animation, automatic journey, lineup reuse, hints, reset, and the full seven-race proof. A touch-enabled phone context verifies actual touch dragging and tap assignment, journey creation, count updates, guide replay, and no horizontal overflow. The desktop Start Race control is within the initial viewport.
