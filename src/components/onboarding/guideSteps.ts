export type GuidePage='home'|'duel'|'horses';
export const guideKey=(page:GuidePage)=>`mindplay.guide.${page}.v2`;
export const guideSteps={
 home:[
  {target:'.playable-worlds',title:'Choose your island',body:'Curious Island opens Dice Duel. Brain Teaser Island opens The Royal Races. Choose either island when you are ready to play.'},
  {target:'.future-worlds',title:'More worlds on the horizon',body:'The three islands marked Coming Soon are still being created. The two open islands above are ready to explore.'},
  {target:'.lucky-dock',title:'Let Lucky Dice inspire you',body:'Roll Lucky Dice for a random suggestion between the two open islands. You can reroll or choose Begin Adventure yourself. Finishing this guide keeps you on the map.'},
 ],
 duel:[
  {target:'.dd-stage',title:'Meet the Keeper',body:'Inspect the mysterious dice at your own pace. Unseal a die to see its faces, browse the choices, and choose a companion when you are ready.'},
  {target:'.dd-stage',title:'Play a duel',body:'After choosing a die, Begin the Duel rolls against the Keeper. The higher roll wins. You can replay a matchup or choose a different die. This guide leaves your table untouched.'},
  {target:'.dd-chapter-trail',title:'Follow the evidence',body:'Playing opens the investigation. There you can make a prediction and run experiments. Later chapters open through your discoveries; the guide does not unlock them or reveal the answer.'},
  {target:'.dd-adventure-menu',title:'Your adventure, your pace',body:'The Adventure menu holds available chapters, your field journal, and a confirmed Reset Adventure. Use Back to world map to visit another island; returning keeps this session’s table, experiments, and progress.'},
 ],
 horses:[
  {target:'.race-scene-header',title:'Rowan’s royal mission',body:'The lantern festival needs three swift messengers. Help Captain Rowan find the fastest three of 25 horses. Speeds stay fixed, there are no ties, and the five-lane track has no stopwatch.'},
  {target:'[data-tour="paddock"]',title:'Meet your contenders',body:'Choose a horse in the Royal Paddock, then tap an empty lane, or drag it onto the course. Coat colors do not tell you who is faster.'},
  {target:'[data-tour="track"]',title:'Plan your comparisons',body:'Place two to five different horses and press Start Race when ready. Only finishing order is evidence. Next and Back in this guide never place horses or run races.'},
  {target:'.race-stage-tools',title:'Keep your evidence',body:'After a race, the journey and Race Journal collect your results. Use them for comparisons and optional hints. When you have enough evidence, open Claim the podium and make your case.'},
  {target:'.game-breadcrumb',title:'Return whenever you like',body:'Back to world map keeps the same horses, races, clues, and lineup for this session. Only a confirmed New field replaces the horses and clears the evidence. Reopen the story with Why are we racing? whenever you like.'},
 ],
} as const;
