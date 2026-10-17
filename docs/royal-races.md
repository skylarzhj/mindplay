# Brain Teaser · The Royal Races

Open Stage 02, Brain Teaser Island, directly on the floating world map. Captain Rowan is the stage-specific animated race marshal.

## Rules and interactions

25 horses have distinct fixed speeds for the current field. Each race accepts 2–5 unique horses. Finishing order is deterministic; neither speeds nor stopwatch times are shown. The animation illustrates only the current race order and does not encode comparable race times.

Drag horses from the paddock onto one of five lanes. Drag onto another lane to move a horse; replacing an occupied lane sends the previous horse back to the paddock. Drag a horse back to the paddock to remove it. Alternatively tap/click a horse then a lane, or focus the horse and press Enter, then focus the lane and press Enter. Race controls lock while a race is running.

The notebook stores every observed finishing order and can reload a lineup. Optional deductions use transitive closure of observed faster-than relationships; a horse with three or more known predecessors is ruled out of the top three. Hidden ranks are never used to generate those deductions.

Hints are requested, not automatic: a conceptual nudge, progress-aware advice, a winners/comparison prompt, and the full seven-race route. A fresh field clears all progress after explicit confirmation.

## Answer verification

The podium is ordered first–second–third. Actual correctness and evidence sufficiency are separate. A lucky correct guess is not a proven solution. To certify an answer, observed comparisons must imply first > second > third and third > every excluded horse. No oracle ranking is exposed.

## Seven-race construction

Race five disjoint groups of five. Race the five winners and call their groups A through E in that order. A1 is the overall fastest. Fourth/fifth finishers in any initial group already have three predecessors; groups D/E have three faster group winners. B3 has A1, B1 and B2 ahead; C2 has A1, B1 and C1 ahead. Only A2, A3, B1, B2 and C1 remain for second/third. Race those five; their top two join A1.

`games/horseTeaser/engine.test.ts` verifies this construction across 30 deterministic shuffled fields, along with race capacity, speed consistency, lane uniqueness, deductions, and unproven guesses. Browser QA exercises actual pointer dragging, keyboard assignment, the complete seven-race solution, hints, reset, and mobile layout.
