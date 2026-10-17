import {useReducer} from 'react';
import type {DieId,SimulationResult,MatchResult} from '../types';
import {initialJourney,type Hypothesis,type JourneyState} from '../games/diceDuel/progression';
type Action={type:'choose';die:DieId}|{type:'round';result:MatchResult}|{type:'hypothesis';hypothesis:Hypothesis}|{type:'experiment';result:SimulationResult;hypothesis:Hypothesis}|{type:'strategy'};
function reducer(s:JourneyState,a:Action):JourneyState{switch(a.type){case 'choose':return {...s,firstDie:s.firstDie??a.die};case 'round':return {...s,rounds:s.rounds+1,wins:s.wins+(a.result.outcome==='win'?1:0)};case 'hypothesis':return {...s,hypothesis:a.hypothesis};case 'experiment':return {...s,experiments:[...s.experiments,{result:a.result,hypothesis:a.hypothesis}]};case 'strategy':return {...s,strategyRounds:s.strategyRounds+1};}}
export function useJourney(){const [journey,dispatch]=useReducer(reducer,initialJourney);return {journey,dispatch};}
