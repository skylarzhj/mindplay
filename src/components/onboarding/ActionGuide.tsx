import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './action-guide.css';
import {guidePosition} from './guidePosition';
const KEY='mindplay.action-guide.v1';
const steps={
 island:{number:1,title:'Your adventure starts here',body:'Click Play Dice Duel on Curious Island to meet the Keeper.'},
 unseal:{number:2,title:'Unseal a mysterious die',body:'Tap the sealed die to reveal its faces. You can browse the other dice, too.'},
 choose:{number:3,title:'Choose your companion',body:'Hover, swipe or tap the die to turn it. Then choose this die when you’re ready.'},
 roll:{number:4,title:'Begin your first duel',body:'Click Begin the Duel. The higher roll wins. Watch what happens when the Keeper chooses after you.'},
 investigate:{number:5,title:'Follow your curiosity',body:'Follow the investigation button to take your question to the experiment table.'},
 hunch:{number:6,title:'What do you think?',body:'Choose a prediction. Any hunch is a good starting point—you can change your mind later.'},
 experiment:{number:7,title:'Test your hunch',body:'Click Run the Experiment to watch many independent rolls and see a pattern emerge.'},
 next:{number:8,title:'Collect all three clues',body:'Click Watch a Different Matchup. Repeat until you’ve tested all three pairs of dice.'},
 strategy:{number:9,title:'Put your discovery to work',body:'You found the loop! Click Enter the Strategy Challenge to try choosing after the Keeper.'},
} as const;
type Step=keyof typeof steps;
type Anchor={id:Step;top:number;left:number;width:number;height:number};
export function ActionGuide({run,page}:{run:number;page:string}){
 const [active,setActive]=useState(()=>{try{return localStorage.getItem(KEY)!=='seen';}catch{return true;}});
 const [anchor,setAnchor]=useState<Anchor|null>(null),[position,setPosition]=useState({top:0,left:0,ready:false});
 const card=useRef<HTMLElement>(null);
 function finish(){setActive(false);setAnchor(null);try{localStorage.setItem(KEY,'seen');}catch{/* Works for this visit when storage is unavailable. */}}
 useEffect(()=>{if(run>0)setActive(true);},[run]);
 useEffect(()=>{
  if(!active)return;
  let frame=0,last:HTMLElement|null=null;
  function track(){
   const target=Array.from(document.querySelectorAll<HTMLElement>('[data-guide]')).find(el=>!el.closest('[hidden]')&&el.getClientRects().length>0);
   if(!target){setAnchor(a=>a===null?a:null);last=null;frame=requestAnimationFrame(track);return;}
   if(target!==last){last=target;const r=target.getBoundingClientRect();if(r.top<24||r.bottom>innerHeight-24)target.scrollIntoView({block:'center',behavior:'auto'});}
   const r=target.getBoundingClientRect(),id=target.dataset.guide as Step;
   const next={id,top:Math.round(r.top),left:Math.round(r.left),width:Math.round(r.width),height:Math.round(r.height)};
   setAnchor(a=>a&&Object.keys(next).every(k=>a[k as keyof Anchor]===next[k as keyof Anchor])?a:next);
   const pos=guidePosition(next,{width:card.current?.offsetWidth??310,height:card.current?.offsetHeight??220},{width:innerWidth,height:innerHeight});
   setPosition(p=>p.left===pos.left&&p.top===pos.top&&p.ready?p:pos);
   frame=requestAnimationFrame(track);
  }
  frame=requestAnimationFrame(track);
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')finish();};
  const complete=(e:MouseEvent)=>{if((e.target as Element).closest('[data-guide="strategy"]'))finish();};
  document.addEventListener('keydown',escape);document.addEventListener('click',complete);
  return()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',escape);document.removeEventListener('click',complete);};
 },[active,page]);
 if(!active||!anchor||!position.ready)return null;
 const step=steps[anchor.id];
 return createPortal(<div className="action-guide-layer"><div className="action-guide-spotlight" aria-hidden="true" style={{top:anchor.top-6,left:anchor.left-6,width:anchor.width+12,height:anchor.height+12}}/><aside ref={card} className="action-guide-card" style={{top:position.top,left:position.left}} aria-label="Step-by-step guide"><div aria-live="polite" aria-atomic="true"><span className="action-guide-count">YOUR ADVENTURE · {step.number} / 9</span><h2>{step.title}</h2><p>{step.body}</p></div><div className="action-guide-footer"><span>✧ Follow the highlighted control</span><button onClick={finish}>Skip guide</button></div></aside></div>,document.body);
}
