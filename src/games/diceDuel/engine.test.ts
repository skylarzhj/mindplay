import { describe,it,expect } from 'vitest';
import {DICE} from './diceConfig';
import {calculateWinProbability,calculateExpectedValue,findBestResponse,countOutcomes} from './probability';
import {rollDie,playMatch} from './diceEngine';
import {simulateMatches} from './simulation';
describe('exact nontransitive dice engine',()=>{
 it('verifies the Ruby → Sapphire → Emerald → Ruby cycle by enumeration',()=>{for(let i=0;i<3;i++){const a=DICE[i],b=DICE[(i+1)%3];expect(calculateWinProbability(a,b)).toBeGreaterThan(.5);expect(countOutcomes(a,b).wins).toBe(20);expect(calculateWinProbability(a,b)+calculateWinProbability(b,a)).toBe(1);}});
 it('counts all outcomes including duplicate faces and ties',()=>{expect(countOutcomes(DICE[0],DICE[0])).toEqual({wins:12,losses:12,ties:12,total:36});});
 it('calculates expected values and best responses',()=>{DICE.forEach((d,i)=>{expect(calculateExpectedValue(d)).toBe(5);expect(findBestResponse(d).id).toBe(DICE[(i+2)%3].id);});});
 it('samples actual faces including interval boundaries',()=>{for(const d of DICE){expect(rollDie(d,()=>0)).toBe(d.faces[0]);expect(rollDie(d,()=>.999999)).toBe(d.faces[5]);}expect(playMatch(DICE[0],DICE[1],()=>0).outcome).toBe('win');});
 it('simulates all face pairs without fabricating results',()=>{let n=0;const rng=()=>{const pair=Math.floor(n/2)%36;return ((n++%2===0?Math.floor(pair/6):pair%6)+.5)/6;};const r=simulateMatches(DICE[0],DICE[1],3600,rng);expect(r.wins).toBe(2000);expect(r.losses).toBe(1600);expect(r.ties).toBe(0);expect(r.points.at(-1)?.rate).toBeCloseTo(100*20/36);});
 it('rejects invalid trial counts',()=>{expect(()=>simulateMatches(DICE[0],DICE[1],0)).toThrow();});
});
