import {motion} from 'framer-motion';
import {LockKeyhole,ArrowRight} from '../ui/Icons';
export interface World { id:string; name:string; subtitle:string; stage:number; available:boolean; }
export const WORLDS:World[]=[
 {id:'curious',name:'The Curious Island',subtitle:'Luck, Logic & Intuition',stage:1,available:true},
 {id:'forest',name:'The Strategy Forest',subtitle:'Choices, Risks & Rewards',stage:2,available:false},
 {id:'labyrinth',name:'The Probability Labyrinth',subtitle:'Patterns, Uncertainty & Discovery',stage:3,available:false},
 {id:'arena',name:'The Quant Arena',subtitle:'Optimization & Beyond',stage:4,available:false},
];
export function WorldIsland({world,onEnter}:{world:World;onEnter:()=>void}){
 const contents=<><div className={`island-illustration art-${world.id}`} aria-hidden="true"/><div className="world-plaque"><span className="plaque-stage">Stage 0{world.stage}</span><h2>{world.name}</h2><p>{world.subtitle}</p><span className={`world-enter ${world.available?'available':''}`}>{world.available?<><span className="play-triangle">▶</span> Play Now <ArrowRight size={15}/></>:<><LockKeyhole size={13}/> Coming Soon</>}</span></div></>;
 return <motion.div className={`map-world map-${world.id} ${world.available?'is-open':'is-locked'}`} whileHover={{y:-8,scale:1.015}} transition={{duration:.35}}>{world.available?<button className="island-hit" onClick={onEnter} aria-label={`Play Now: ${world.name}`}>{contents}</button>:<div className="island-hit" aria-label={`${world.name}, locked, coming soon`}>{contents}<span className="island-lock" aria-hidden="true"><LockKeyhole size={15}/></span></div>}</motion.div>;
}
