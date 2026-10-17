import {describe,it,expect} from 'vitest';
import {parseSavedJourney} from './useJourney';
import {initialJourney,canEnterMode} from '../games/diceDuel/progression';
import {DICE} from '../games/diceDuel/diceConfig';
import {simulateMatches} from '../games/diceDuel/simulation';
describe('Dice Duel saved adventures',()=>{
 it('safely starts over for absent, malformed, and invalid saves',()=>{
  for(const raw of [null,'{','null','{}',JSON.stringify({...initialJourney,rounds:-1}),JSON.stringify({...initialJourney,wins:5}),JSON.stringify({...initialJourney,rounds:1,experiments:[{hypothesis:'ruby',result:{}}]})])expect(parseSavedJourney(raw)).toEqual(initialJourney);
 });
 it('restores genuine experiments and their unlocks',()=>{
  const journey={...initialJourney,firstDie:'ruby',rounds:1,hypothesis:'none',experiments:DICE.map((a,i)=>({hypothesis:'none',result:simulateMatches(a,DICE[(i+1)%3],10,()=>.1)}))};
  const restored=parseSavedJourney(JSON.stringify(journey));expect(restored).toEqual(journey);expect(canEnterMode('quant',restored)).toBe(true);
 });
 it('rejects corrupted simulation totals and chart points',()=>{
  const result=simulateMatches(DICE[0],DICE[1],10);
  for(const corrupted of [{...result,wins:100},{...result,points:[{round:1,rate:101}]},{...result,a:'unknown'}])expect(parseSavedJourney(JSON.stringify({...initialJourney,rounds:1,experiments:[{hypothesis:'ruby',result:corrupted}]}))).toEqual(initialJourney);
 });
});
