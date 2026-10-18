import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './action-guide.css';
import {guidePosition,type GuideRect} from './guidePosition';
import {guideKey,guideSteps,type GuidePage} from './guideSteps';
function wasSeen(page:GuidePage){try{return localStorage.getItem(guideKey(page))==='seen';}catch{return false;}}
export function ActionGuide({run,page,suspended=false}:{run:number;page:GuidePage;suspended?:boolean}){
 // A separate instance per page means replay and completion never carry step numbers across islands.
 return <PageGuide key={page} run={run} page={page} suspended={suspended}/>;
}
function PageGuide({run,page,suspended}:{run:number;page:GuidePage;suspended:boolean}){
 const [active,setActive]=useState(()=>!wasSeen(page)),[index,setIndex]=useState(0);
 const [anchor,setAnchor]=useState<GuideRect|null>(null),[position,setPosition]=useState({top:16,left:16,ready:false});
 const card=useRef<HTMLElement>(null),previousRun=useRef(run),steps=guideSteps[page],step=steps[index];
 function finish(){setActive(false);try{localStorage.setItem(guideKey(page),'seen');}catch{/* Still works without device storage. */}}
 useEffect(()=>{if(run!==previousRun.current){previousRun.current=run;setIndex(0);setActive(true);}},[run]);
 useEffect(()=>{
  if(!active||suspended)return;
  const shell=document.querySelector<HTMLElement>('.site-shell');
  const previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  if(shell)shell.inert=true;
  card.current?.querySelector('button')?.focus({preventScroll:true});
  let frame=0,last:HTMLElement|null=null;
  function track(){
   const visible=(el:HTMLElement)=>!el.closest('[hidden]')&&el.getClientRects().length>0;
   const root=document.querySelector<HTMLElement>(page==='home'?'.home':page==='duel'?'.dice-duel':'.horse-page');
   const target=Array.from(root?.querySelectorAll<HTMLElement>(step.target)??[]).find(visible)??root;
   if(!target||!visible(target)){setAnchor(null);frame=requestAnimationFrame(track);return;}
   if(target!==last){last=target;target.scrollIntoView({block:'center',behavior:'instant'});}
   const r=target.getBoundingClientRect();
   const next={top:Math.round(r.top),left:Math.round(r.left),width:Math.round(r.width),height:Math.round(r.height)};
   setAnchor(a=>a&&a.top===next.top&&a.left===next.left&&a.width===next.width&&a.height===next.height?a:next);
   const pos=guidePosition(next,{width:card.current?.offsetWidth??310,height:card.current?.offsetHeight??300},{width:innerWidth,height:innerHeight});
   setPosition(p=>p.left===pos.left&&p.top===pos.top&&p.ready?p:pos);
   frame=requestAnimationFrame(track);
  }
  frame=requestAnimationFrame(track);
  const escape=(e:KeyboardEvent)=>{
   if(e.key==='Escape')finish();
   if(e.key==='Tab'){
    const buttons=Array.from(card.current?.querySelectorAll<HTMLButtonElement>('button')??[]);
    const first=buttons[0],last=buttons.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
   }
  };
  document.addEventListener('keydown',escape);
  return()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',escape);if(shell)shell.inert=false;if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});};
 },[active,page,index,suspended,step.target]);
 if(!active||suspended)return null;
 return createPortal(<div className="action-guide-layer"><div className="action-guide-shield"/>{anchor&&<div className="action-guide-spotlight" aria-hidden="true" style={{top:anchor.top-6,left:anchor.left-6,width:anchor.width+12,height:anchor.height+12}}/>}<aside ref={card} className="action-guide-card" style={{top:position.top,left:position.left}} role="dialog" aria-modal="true" aria-label={`${page==='home'?'Homepage':page==='duel'?'Dice Duel':'Royal Races'} guide`}><div aria-live="polite" aria-atomic="true"><span className="action-guide-count">{page==='home'?'WORLD MAP':page==='duel'?'DICE DUEL':'ROYAL RACES'} · {index+1} / {steps.length}</span><h2>{step.title}</h2><p>{step.body}</p></div><div className="action-guide-footer"><button onClick={finish}>Skip</button><div className="action-guide-controls">{index>0&&<button onClick={()=>setIndex(i=>i-1)}>Back</button>}<button className="secondary" onClick={()=>index===steps.length-1?finish():setIndex(i=>i+1)}>{index===steps.length-1?'Done':'Next'}</button></div></div></aside></div>,document.body);
}
