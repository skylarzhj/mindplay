import {useState,useRef} from 'react';
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
import '../components/dice/dice-duel.css';
export function DiceDuel({onHome,onGuide}:{onHome:()=>void;onGuide:()=>void}){
 const stage=useRef<HTMLDivElement>(null);const menu=useRef<HTMLDetailsElement>(null);
 const [mode,setMode]=useState<Mode>('play');
 const [research,setResearch]=useState(false),[confirmReset,setConfirmReset]=useState(false),[adventure,setAdventure]=useState(0);
 const {journey,dispatch,storageAvailable}=useJourney();
 const exploreReady=canEnterMode('explore',journey),quantReady=canEnterMode('quant',journey),pairs=testedPairs(journey.experiments).size;
 function enter(next:Mode){if(canEnterMode(next,journey)){setMode(next);if(menu.current)menu.current.open=false;requestAnimationFrame(()=>stage.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));}}
 function reset(){dispatch({type:'reset'});setMode('play');setResearch(false);setConfirmReset(false);setAdventure(n=>n+1);}
 return <MotionConfig reducedMotion="user"><main className="game-page dice-duel">
 <div className="dd-focus-header"><div><span className="eyebrow">Dice Duel</span><h1>{mode==='play'?'The Keeper’s table':mode==='explore'?'Follow the clues':research?'Behind the magic':'Turn the tables'}</h1></div><details className="dd-adventure-menu" ref={menu}><summary>Adventure menu</summary><div className="dd-menu-content"><button className="text-button" onClick={onHome}><ArrowLeft size={16}/> Discovery map</button>
 <nav className="dd-progression" aria-label="Adventure stages">{([{id:'play',name:'Play',detail:'The dice table'},{id:'explore',name:'Explore',detail:'The workshop'},{id:'quant',name:'Quant',detail:'Strategy & research'}] as const).map((m,i)=>{const locked=!canEnterMode(m.id,journey),complete=m.id==='play'?exploreReady:m.id==='explore'?quantReady:journey.strategyRounds>0;return <button key={m.id} aria-current={mode===m.id?'step':undefined} disabled={locked} onClick={()=>enter(m.id)} aria-controls={`panel-${m.id}`}><span className="dd-step">{locked?<LockKeyhole size={18}/>:complete?<Check size={19}/>:i+1}</span><span><b>{m.name}</b><small>{m.detail}</small></span><span className="dd-stage-status">{locked?'Locked':mode===m.id?'Current':complete?'Complete':'Open'}</span></button>;})}</nav>
 <details className="quiet-details journey-tools"><summary>Your field journal · {pairs} / 3 clues</summary><DiscoveryJournal journey={journey}/></details><button className="text-button" onClick={()=>{if(menu.current)menu.current.open=false;onGuide();}}>Replay Guide</button>
 <div className="dd-save-tools"><span>{storageAvailable?'Saved on this device.':'Progress lasts for this visit.'}</span>{!confirmReset?<button className="text-button" onClick={()=>setConfirmReset(true)}>Reset Adventure</button>:<div className="dd-reset-confirm"><span>Erase saved progress?</span><button className="secondary" onClick={reset}>Reset adventure</button><button className="text-button" onClick={()=>setConfirmReset(false)}>Keep exploring</button></div>}</div></div></details></div>
 <p className="dd-scene-position">{mode==='play'?'Chapter 1 · Play':mode==='explore'?`Chapter 2 · ${pairs} of 3 clues`:'Chapter 3 · Use your discovery'}</p>
 <div key={adventure} ref={stage} className="dd-stage">{(['play','explore','quant'] as const).map(m=>canEnterMode(m,journey)&&<section key={m} id={`panel-${m}`} aria-label={`${m} stage`} hidden={mode!==m}>
 {m==='play'?<PlayMode ready={exploreReady} rounds={journey.rounds} onChoice={die=>dispatch({type:'choose',die})} onRound={result=>dispatch({type:'round',result})} onInvestigate={()=>enter('explore')}/>:m==='explore'?<ExploreMode journey={journey} onHypothesis={hypothesis=>dispatch({type:'hypothesis',hypothesis})} onExperiment={(result,hypothesis)=>dispatch({type:'experiment',result,hypothesis})} onQuant={()=>enter('quant')}/>:<><details className="dd-section-switch"><summary>{research?'Research Notes':'Strategy Challenge'} · Change section</summary><div className="dd-research-nav" aria-label="Quant sections"><button aria-pressed={!research} onClick={()=>setResearch(false)}>✧ Strategy Challenge</button><button aria-pressed={research} onClick={()=>setResearch(true)}>✎ Research Notes</button></div></details><div hidden={research}><StrategyExperiment onRound={()=>dispatch({type:'strategy'})} onResearch={()=>{setResearch(true);stage.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}/></div><div hidden={!research}><QuantMode onStrategy={()=>setResearch(false)}/></div></>}
 </section>)}</div>

</main></MotionConfig>;
}
