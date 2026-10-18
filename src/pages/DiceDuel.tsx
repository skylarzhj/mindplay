import {useState,useRef,useEffect} from 'react';
import {MotionConfig} from 'framer-motion';
import type {Mode} from '../types';
import {PlayMode} from '../components/dice/PlayMode';
import {ExploreMode} from '../components/dice/ExploreMode';
import {QuantMode} from '../components/dice/QuantMode';
import {StrategyExperiment} from '../components/dice/StrategyExperiment';
import {DiscoveryJournal} from '../components/dice/DiscoveryJournal';
import {useJourney} from '../hooks/useJourney';
import {canEnterMode,testedPairs} from '../games/diceDuel/progression';
import {ArrowLeft,LockKeyhole,Check} from '../components/ui/Icons';
export function DiceDuel({onHome,onGuide}:{onHome:()=>void;onGuide:()=>void}){
 const stage=useRef<HTMLDivElement>(null);const menu=useRef<HTMLDetailsElement>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  function closeMenu(event:PointerEvent){if(menu.current&&!menu.current.contains(event.target as Node))menu.current.open=false;}
  function escape(event:KeyboardEvent){if(event.key==='Escape'&&menu.current?.open){menu.current.open=false;menu.current.querySelector('summary')?.focus();}}
  document.addEventListener('pointerdown',closeMenu);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',closeMenu);document.removeEventListener('keydown',escape);};
 },[]);
 const [mode,setMode]=useState<Mode>('play');
 const [research,setResearch]=useState(false),[confirmReset,setConfirmReset]=useState(false),[adventure,setAdventure]=useState(0);
 const {journey,dispatch,storageAvailable}=useJourney();
 const exploreReady=canEnterMode('explore',journey),quantReady=canEnterMode('quant',journey),pairs=testedPairs(journey.experiments).size;
 function focusScene(){requestAnimationFrame(()=>{heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});}
 function enter(next:Mode){if(canEnterMode(next,journey)){setMode(next);if(menu.current)menu.current.open=false;focusScene();}}
 function reset(){dispatch({type:'reset'});setMode('play');setResearch(false);setConfirmReset(false);setAdventure(n=>n+1);if(menu.current)menu.current.open=false;focusScene();}
 return <MotionConfig reducedMotion="user"><main className="game-page dice-duel">
 <div className="game-breadcrumb"><button onClick={mode==='quant'&&research?()=>{setResearch(false);focusScene();}:onHome}><ArrowLeft size={14}/>{mode==='quant'&&research?"Back to previous page":"Back to world map"}</button>{mode==='quant'&&research&&<button onClick={onHome}>World map</button>}</div>
 <div className="dd-focus-header"><div><span className="eyebrow">Curious Island · Dice Duel</span><h1 ref={heading} tabIndex={-1}>{mode==='play'?'The Keeper’s table':mode==='explore'?'Follow the clues':research?'Behind the magic':'Turn the tables'}</h1></div><details className="dd-adventure-menu" ref={menu}><summary>Adventure menu</summary><div className="dd-menu-content"><button className="text-button" onClick={onHome}><ArrowLeft size={16}/> Back to world map</button>
 <nav className="dd-progression" aria-label="Adventure stages">{([{id:'play',name:'Play',detail:'The dice table'},{id:'explore',name:'Explore',detail:'The workshop'},{id:'quant',name:'Quant',detail:'Strategy & research'}] as const).map((m,i)=>{const locked=!canEnterMode(m.id,journey),complete=m.id==='play'?exploreReady:m.id==='explore'?quantReady:journey.strategyRounds>0;return <button key={m.id} aria-current={mode===m.id?'step':undefined} disabled={locked} onClick={()=>enter(m.id)} aria-controls={`panel-${m.id}`}><span className="dd-step">{locked?<LockKeyhole size={18}/>:complete?<Check size={19}/>:i+1}</span><span><b>{m.name}</b><small>{m.detail}</small></span><span className="dd-stage-status">{locked?'Locked':mode===m.id?'Current':complete?'Complete':'Open'}</span></button>;})}</nav>
 <details className="quiet-details journey-tools"><summary>Your field journal · {pairs} / 3 clues</summary><DiscoveryJournal journey={journey}/></details><button className="text-button" onClick={()=>{if(menu.current)menu.current.open=false;onGuide();}}>Replay Guide</button>
 <div className="dd-save-tools"><span>{storageAvailable?'Clues & chapter unlocks saved on this device.':'Progress lasts for this visit.'}</span>{!confirmReset?<button className="text-button" onClick={()=>setConfirmReset(true)}>Reset Adventure</button>:<div className="dd-reset-confirm"><span>Erase saved progress?</span><button className="secondary" onClick={reset}>Reset adventure</button><button className="text-button" onClick={()=>setConfirmReset(false)}>Keep exploring</button></div>}</div></div></details></div>
 <ol className="dd-chapter-trail" aria-label="Your adventure"><li aria-current={mode==='play'?'step':undefined}>01 · Play</li><li aria-current={mode==='explore'?'step':undefined}>02 · Investigate</li><li aria-current={mode==='quant'?'step':undefined}>03 · Discover</li></ol>
 <div key={adventure} ref={stage} className="dd-stage">{(['play','explore','quant'] as const).map(m=>canEnterMode(m,journey)&&<section key={m} id={`panel-${m}`} aria-label={`${m} stage`} hidden={mode!==m}>
 {m==='play'?<PlayMode onChoice={die=>dispatch({type:'choose',die})} onRound={result=>dispatch({type:'round',result})} onInvestigate={()=>enter('explore')}/>:m==='explore'?<ExploreMode journey={journey} onHypothesis={hypothesis=>dispatch({type:'hypothesis',hypothesis})} onExperiment={(result,hypothesis)=>dispatch({type:'experiment',result,hypothesis})} onQuant={()=>enter('quant')}/>:<><details className="dd-section-switch"><summary>{research?'Research Notes':'Strategy Challenge'} · Change section</summary><div className="dd-research-nav" aria-label="Quant sections"><button aria-pressed={!research} onClick={event=>{setResearch(false);event.currentTarget.closest('details')!.open=false;focusScene();}}>✧ Strategy Challenge</button><button aria-pressed={research} onClick={event=>{setResearch(true);event.currentTarget.closest('details')!.open=false;focusScene();}}>✎ Research Notes</button></div></details><div hidden={research}><StrategyExperiment onRound={()=>dispatch({type:'strategy'})} onResearch={()=>{setResearch(true);focusScene();}}/></div><div hidden={!research}><QuantMode onStrategy={()=>{setResearch(false);focusScene();}}/></div></>}
 </section>)}</div>

</main></MotionConfig>;
}
