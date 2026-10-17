# Royal Races · Carousel interface

The racecourse is the main scene. A compact horizontal paddock above it shows six horse cards on wide desktops, five on medium screens, and four on phones. All 25 horses remain independent and retain their original fixed hidden speeds.

## Interactions

- Browse with arrows, horizontal touch/trackpad swipes, or a mouse wheel over the rail. The wheel scrolls the page normally at either rail edge.
- Filter All / Unraced / Raced. Race status comes only from recorded races. Filtering never clears the current lineup or selected horse.
- Find a number (1–25) using the search field. Clear it to return to the whole paddock.
- Click/tap a card, then a lane. Keyboard users can select a card with Enter/Space and place it on a focused lane with Enter/Space; arrow keys and Home/End navigate cards.
- Drag directly from a card to a lane; move a runner between lanes, or drag it back into the paddock. The original lane-assignment engine prevents duplicates. Replacing an occupied lane sends its old horse back to the paddock.
- On touchscreens, an ordinary horizontal gesture scrolls the carousel; vertical movement drags toward the track. Holding a horse also starts dragging. Tap assignment is always available.

## Compact scene

The five-lane course includes start/finish markings and the existing order-based animation. It does not encode hidden speed or comparable finish times. Start Race stays prominent below the track. The most recent finish order remains visible.

Race Journal folds away Race History, layered Hints, and evidence-only Deductions. Opening, closing, or changing journal tabs retains the selected horse, lineup, races, and revealed hints. The final ordered podium opens separately when the player is ready. New Field still requires confirmation and resets the game, carousel filters, and journal.

## Modules

- `components/horses/HorseCarousel.tsx`: display, filters, search, scrolling, keyboard navigation.
- `components/horses/RaceCourse.tsx`: lane targets, runners, race feedback, and controls.
- `components/horses/RaceJournal.tsx`: persistent scene-state presentation in three collapsible journal sections.
- `hooks/useHorseDrag.ts`: pointer gestures, touch swipe/drag distinction, drag ghost lifecycle.
- `pages/HorseTeaser.tsx`: existing race/session state and callbacks.

No dependencies or games were added. `games/horseTeaser/engine.ts` is unchanged.

## Verification

19 unit tests and the production build pass. Chrome checks cover the six-card desktop rail, arrows, number lookup, all filters, actual pointer dragging and lane movement, full seven-race solution and evidence validation, retained lineup across journal tabs, history, hints, deductions, and mobile layout. A separate touch-enabled Chrome context uses actual touch input to verify horizontal swiping without selection, tapping, vertical dragging, mobile racing, and journal hints.
