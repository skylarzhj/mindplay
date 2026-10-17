import {describe,it,expect} from 'vitest';
import {DICE} from './diceConfig';
import {initialJourney,canEnterMode,testedPairs,type Experiment} from './progression';
import {simulateMatches} from './simulation';
import {commitOpponent,makeMatchup} from './strategy';
import {calculateWinProbability} from './probability';
const experiment=(a:number,b:number):Experiment=>({hypothesis:'ruby',result:simulateMatches(DICE[a],DICE[b],10,()=>.1)});
describe('ordered discovery progression',()=>{
 it('starts with only Play accessible',()=>{expect(canEnterMode('play',initialJourney)).toBe(true);expect(canEnterMode('explore',initialJourney)).toBe(false);expect(canEnterMode('quant',initialJourney)).toBe(false);});
 it('requires three completed rounds to unlock Explore',()=>{expect(canEnterMode('explore',{...initialJourney,rounds:2})).toBe(false);expect(canEnterMode('explore',{...initialJourney,rounds:3})).toBe(true);});
 it('does not count reversed pairs or self-comparisons as new evidence',()=>{expect(testedPairs([experiment(0,1),experiment(1,0),experiment(0,0)]).size).toBe(1);expect(canEnterMode('quant',{...initialJourney,rounds:3,experiments:[experiment(0,1)]})).toBe(false);});
 it('unlocks Quant only after Play and all three distinct matchups',()=>{const experiments=[experiment(0,1),experiment(1,2),experiment(2,0)];expect(canEnterMode('quant',{...initialJourney,experiments})).toBe(false);expect(canEnterMode('quant',{...initialJourney,rounds:3,experiments})).toBe(true);});
});
describe('choice-order strategy',()=>{
 it('commits a valid opponent before the player picks',()=>{expect(commitOpponent(()=>0)).toBe(DICE[0]);expect(commitOpponent(()=>.999)).toBe(DICE[2]);});
 it('counters every first choice, but preserves the committed die when the computer chooses first',()=>{for(const p of DICE){const first=makeMatchup(p,'player-first',DICE[0]);expect(calculateWinProbability(p,first.opponent)).toBeLessThan(.5);for(const c of DICE.filter(d=>d.id!==p.id)){expect(makeMatchup(p,'computer-first',c).opponent).toBe(c);}}});
 it('allows a winning counter for every committed die and rejects taking its die',()=>{for(const c of DICE){expect(()=>makeMatchup(c,'computer-first',c)).toThrow();expect(DICE.filter(d=>d.id!==c.id).some(d=>calculateWinProbability(makeMatchup(d,'computer-first',c).player,c)>.5)).toBe(true);}});
});
