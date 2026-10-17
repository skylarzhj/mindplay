import type { Die, SimulationResult } from '../../types';
import { playMatch } from './diceEngine';
export function simulateMatches(a:Die,b:Die,trials:number,random:()=>number=Math.random):SimulationResult{
 if(!Number.isInteger(trials)||trials<1||trials>1000000)throw new Error('Trials must be an integer between 1 and 1,000,000');
 const result:SimulationResult={trials,wins:0,losses:0,ties:0,a:a.id,b:b.id,points:[]};const interval=Math.max(1,Math.floor(trials/150));
 for(let i=1;i<=trials;i++){const {outcome}=playMatch(a,b,random);if(outcome==='win')result.wins++;else if(outcome==='loss')result.losses++;else result.ties++;if(i===1||i%interval===0||i===trials)result.points.push({round:i,rate:result.wins/i*100});}return result;
}
