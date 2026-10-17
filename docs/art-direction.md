# Storybook art direction

The user-supplied fantasy world-map image is the primary visual reference. The reference itself is not embedded in the app. Labels, navigation, and controls are live HTML, separate from painted scenery.

## Production asset

- `public/art/world-islands.png`: transparent four-island sprite atlas, made with the built-in image generation tool. CSS selects each quadrant independently for hover and floating animations. Original generation outputs remain in the image generation library.
- `src/styles/fantasy.css`: pastel sky, soft cloud layers, parchment plaques, stone tabletop, ivory dice, responsive map composition, reduced-motion support.
- `src/components/worlds/`: world configuration, interactive island components, and actual randomly rolled lucky die.

## Generation prompt

undefined

## Final layout revision prompt

undefined

## Interaction notes

The Curious Island is open. The other three islands expose their locked status and animate on hover without pretending to be playable. The lucky die samples a fair six-sided die; because only one world is available, every roll offers the Curious Island adventure. The lucky die does not change Dice Duel's mathematical distributions.

Existing exact enumeration, simulation, and best-response logic remain intact. Only the three dice's display colors changed to improve contrast on parchment. The field guide uses a native modal dialog, with Escape and backdrop close behavior. Mode state survives tab switches, and scene changes use Framer Motion with reduced-motion support.
