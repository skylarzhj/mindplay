import type {Die} from '../../types';
import {DICE} from './diceConfig';
import {findBestResponse} from './probability';
export type ChoiceOrder='player-first'|'computer-first';
export function commitOpponent(random:()=>number=Math.random){return DICE[Math.floor(random()*DICE.length)];}
export function makeMatchup(player:Die,order:ChoiceOrder,committed:Die){
 if(order==='computer-first'&&player.id===committed.id)throw new Error('Choose a different die from the committed opponent.');
 return {player,opponent:order==='player-first'?findBestResponse(player):committed};
}
