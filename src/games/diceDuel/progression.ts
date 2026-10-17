import type {DieId,Mode,SimulationResult} from '../../types';
export const REQUIRED_PLAY_ROUNDS=1;
export type Hypothesis=DieId|'none';
export interface Experiment {result:SimulationResult;hypothesis:Hypothesis;}
export interface JourneyState {firstDie:DieId|null;rounds:number;wins:number;hypothesis:Hypothesis|null;experiments:Experiment[];strategyRounds:number;}
export const initialJourney:JourneyState={firstDie:null,rounds:0,wins:0,hypothesis:null,experiments:[],strategyRounds:0};
export function pairKey(a:DieId,b:DieId){return [a,b].sort().join(':');}
export function testedPairs(experiments:Experiment[]){return new Set(experiments.filter(e=>e.result.a!==e.result.b&&e.result.trials>0).map(e=>pairKey(e.result.a,e.result.b)));}
export function canEnterMode(mode:Mode,journey:JourneyState){if(mode==='play')return true;if(journey.rounds<REQUIRED_PLAY_ROUNDS)return false;return mode==='explore'||testedPairs(journey.experiments).size===3;}
