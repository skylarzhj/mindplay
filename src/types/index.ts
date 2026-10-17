export type DieId = 'ruby' | 'sapphire' | 'emerald';
export interface Die { id: DieId; name: string; faces: readonly number[]; color: string; }
export type Mode = 'play' | 'explore' | 'quant';
export interface MatchResult { player: number; opponent: number; outcome: 'win'|'loss'|'tie'; }
export interface SimulationResult { trials:number; wins:number; losses:number; ties:number; a:DieId; b:DieId; points:{round:number;rate:number}[]; }
