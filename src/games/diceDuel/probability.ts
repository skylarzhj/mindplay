import type { Die } from '../../types';
import { DICE } from './diceConfig';
export function countOutcomes(a:Die,b:Die) {let wins=0,losses=0,ties=0;for(const x of a.faces)for(const y of b.faces){if(x>y)wins++;else if(x<y)losses++;else ties++;}return {wins,losses,ties,total:a.faces.length*b.faces.length};}
export function calculateWinProbability(a:Die,b:Die){const r=countOutcomes(a,b);return r.wins/r.total;}
export function calculateExpectedValue(die:Die){return die.faces.reduce((a,b)=>a+b,0)/die.faces.length;}
export function findBestResponse(opponent:Die,choices:readonly Die[]=DICE){return choices.filter(d=>d.id!==opponent.id).reduce((best,d)=>calculateWinProbability(d,opponent)>calculateWinProbability(best,opponent)?d:best);}
