import {useState,useRef,type CSSProperties} from 'react';
import type {Die} from '../../types';
const poses=[[0,0],[0,-90],[0,-180],[0,-270],[-90,0],[90,0]];
export function InspectDie({die,onChoose}:{die:Die;onChoose:()=>void}){
 const [revealed,setRevealed]=useState(false),[face,setFace]=useState(0);
 const start=useRef<number|null>(null);const dragged=useRef(false);
 return <div className={`dd-inspect ${revealed?'is-revealed':''}`} style={{'--die':die.color} as CSSProperties}>
 {!revealed?<button data-guide="unseal" className="dd-mystery" onClick={()=>setRevealed(true)} aria-label={`Unseal mysterious die`}><span aria-hidden="true">✧</span><b>Sealed die</b><small>Tap to reveal</small></button>:<>
 <div className="dd-cube-controls"><button className="dd-cube-view" onPointerDown={e=>{start.current=e.clientX;dragged.current=false;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerUp={e=>{if(start.current!==null&&Math.abs(e.clientX-start.current)>18){dragged.current=true;const direction=e.clientX<start.current?1:5;setFace(f=>(f+direction)%6);}start.current=null;}} onPointerCancel={()=>{start.current=null;}} aria-label={`${die.name}: face ${face+1} of 6, value ${die.faces[face]}. Click to rotate; use arrow keys to inspect.`} onMouseEnter={()=>setFace(f=>(f+1)%6)} onClick={()=>{if(!dragged.current)setFace(f=>(f+1)%6);dragged.current=false;}} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setFace(f=>(f+(e.key==='ArrowRight'?1:5))%6);}}}>
 <span className="dd-cube" style={{transform:`rotateX(${poses[face][0]}deg) rotateY(${poses[face][1]}deg)`}}>{die.faces.map((n,i)=><span key={i} className={`dd-cube-face face-${i}`} aria-hidden="true">{n}</span>)}</span>
 </button></div><h3 style={{color:die.color}}>{die.name}</h3><p className="dd-face-readout" aria-live="polite">Face {face+1} / 6 · {die.faces.join(' · ')}</p><small>Hover, swipe or tap to turn</small><button data-guide="choose" className="primary dd-choose" onClick={onChoose}>Choose {die.name} →</button></>}
 </div>;
}
