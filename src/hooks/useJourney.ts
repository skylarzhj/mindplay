import {useEffect,useReducer,useState} from 'react';
import type {DieId,SimulationResult,MatchResult} from '../types';
import {initialJourney,type Hypothesis,type JourneyState} from '../games/diceDuel/progression';
export const JOURNEY_STORAGE_KEY='mindplay.dice-duel.journey.v1';
const ids=['ruby','sapphire','emerald'];
const integer=(n:unknown):n is number=>Number.isSafeInteger(n)&&Number(n)>=0;
const hypothesis=(h:unknown)=>h==='none'||ids.includes(h as string);
export function parseSavedJourney(raw:string|null):JourneyState{
 try{
  if(!raw)return initialJourney;
  const s=JSON.parse(raw);
  if(!s||!(s.firstDie===null||ids.includes(s.firstDie))||!(s.hypothesis===null||hypothesis(s.hypothesis))||!integer(s.rounds)||!integer(s.wins)||s.wins>s.rounds||!integer(s.strategyRounds)||!Array.isArray(s.experiments))return initialJourney;
  for(const e of s.experiments){const r=e?.result;if(!hypothesis(e?.hypothesis)||!r||!ids.includes(r.a)||!ids.includes(r.b)||!integer(r.trials)||r.trials<1||r.trials>1000000||![r.wins,r.losses,r.ties].every(integer)||r.wins+r.losses+r.ties!==r.trials||!Array.isArray(r.points)||r.points.some((p: {round:number;rate:number})=>!p||!integer(p.round)||p.round<1||p.round>r.trials||!Number.isFinite(p.rate)||p.rate<0||p.rate>100))return initialJourney;}
  if(s.rounds===0&&(s.experiments.length||s.strategyRounds))return initialJourney;
  return {firstDie:s.firstDie,rounds:s.rounds,wins:s.wins,hypothesis:s.hypothesis,experiments:s.experiments,strategyRounds:s.strategyRounds};
 }catch{return initialJourney;}
}
type Action={type:'reset'}|{type:'choose';die:DieId}|{type:'round';result:MatchResult}|{type:'hypothesis';hypothesis:Hypothesis}|{type:'experiment';result:SimulationResult;hypothesis:Hypothesis}|{type:'strategy'};
function reducer(s:JourneyState,a:Action):JourneyState{switch(a.type){case 'reset':return initialJourney;case 'choose':return {...s,firstDie:s.firstDie??a.die};case 'round':return {...s,rounds:s.rounds+1,wins:s.wins+(a.result.outcome==='win'?1:0)};case 'hypothesis':return {...s,hypothesis:a.hypothesis};case 'experiment':return {...s,experiments:[...s.experiments,{result:a.result,hypothesis:a.hypothesis}]};case 'strategy':return {...s,strategyRounds:s.strategyRounds+1};}}
export function useJourney(){
 const [storageAvailable,setStorageAvailable]=useState(true);
 const [journey,dispatch]=useReducer(reducer,initialJourney,()=>{try{return parseSavedJourney(localStorage.getItem(JOURNEY_STORAGE_KEY));}catch{return initialJourney;}});
 useEffect(()=>{try{localStorage.setItem(JOURNEY_STORAGE_KEY,JSON.stringify(journey));setStorageAvailable(true);}catch{setStorageAvailable(false);}},[journey]);
 return {journey,dispatch,storageAvailable};
}
