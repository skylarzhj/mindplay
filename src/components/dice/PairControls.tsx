import type {Die} from '../../types';
import {DICE} from '../../games/diceDuel/diceConfig';
export function PairControls({a,b,onA,onB}:{a:Die;b:Die;onA:(d:Die)=>void;onB:(d:Die)=>void}){return <div className="pair-controls"><label>Your die<select value={a.id} onChange={e=>onA(DICE.find(d=>d.id===e.target.value)!)}>{DICE.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label><span>vs.</span><label>Opponent die<select value={b.id} onChange={e=>onB(DICE.find(d=>d.id===e.target.value)!)}>{DICE.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label></div>}
