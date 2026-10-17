import type { Die, MatchResult } from '../../types';
export function rollDie(die:Die,random:()=>number=Math.random){return die.faces[Math.floor(random()*die.faces.length)];}
export function playMatch(a:Die,b:Die,random:()=>number=Math.random):MatchResult{const player=rollDie(a,random),opponent=rollDie(b,random);return {player,opponent,outcome:player>opponent?'win':player<opponent?'loss':'tie'};}
