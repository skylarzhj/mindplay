import {useEffect,useRef,useState} from 'react';
import {motion} from 'framer-motion';
import {Dices,ArrowRight} from '../ui/Icons';
import {DieVisual} from '../dice/DieCard';
import {rollDie} from '../../games/diceDuel/diceEngine';
import type {Die} from '../../types';
const luckyDie:Die={id:'sapphire',name:'Lucky',faces:[1,2,3,4,5,6],color:'#f6dfac'};
export function LuckyDice({onStart,onBrainTeaser}:{onStart:()=>void;onBrainTeaser:()=>void}){
 const [rolling,setRolling]=useState(false),[value,setValue]=useState<number|undefined>(),[revealed,setRevealed]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 function roll(){if(rolling)return;setRolling(true);setRevealed(false);const result=rollDie(luckyDie);timer.current=setTimeout(()=>{setValue(result);setRolling(false);setRevealed(true);},850);}
 return <div className="lucky-dock"><div className="lucky-pedestal"><div className="magic-ring"/><DieVisual die={luckyDie} value={value} rolling={rolling}/><span className="pedestal-sparkle">✦</span></div><motion.div layout className="lucky-parchment"><span className="little-star">✧</span><h2>Feeling Lucky?</h2><p aria-live="polite">{revealed?`You rolled ${value}! ${value!<=3?'Curious Island':'Brain Teaser Island'} awaits.`:'Let fate choose your next adventure.'}</p>{revealed?<div className="lucky-actions"><button className="primary" onClick={()=>value!<=3?onStart():onBrainTeaser()}>Begin Adventure <ArrowRight size={15}/></button><button className="reroll" onClick={roll} aria-label="Roll lucky die again"><Dices size={19}/></button></div>:<button className="primary" disabled={rolling} onClick={roll}><Dices size={18}/>{rolling?'A little magic…':'Roll the Dice'}</button>}<span className="lucky-footnote">Two worlds open. A universe of possibilities.</span></motion.div></div>;
}
