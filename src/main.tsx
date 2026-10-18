import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {MotionConfig} from 'framer-motion';
import {ActionGuide} from './components/onboarding/ActionGuide';
import {Header} from './components/layout/Header';
import {InfoDialog} from './components/layout/InfoDialog';
import {Home} from './pages/Home';
import {DiceDuel} from './pages/DiceDuel';
import {HorseTeaser} from './pages/HorseTeaser';
import './styles/index.css';
import './styles/fantasy.css';
import './styles/home-discovery.css';
import './styles/races-readability.css';
import './styles/game-polish.css';
import './components/dice/dice-duel.css';
function App(){
 const [guideRun,setGuideRun]=useState(0),[page,setPage]=useState<'home'|'duel'|'horses'>('home');
 const [visited,setVisited]=useState({home:true,duel:false,horses:false});
 const [info,setInfo]=useState<'how'|'about'|null>(null),[storyOpen,setStoryOpen]=useState(false);
 function startGuide(){setStoryOpen(false);setGuideRun(n=>n+1);}
 function navigate(p:'home'|'duel'|'horses'){setVisited(v=>({...v,[p]:true}));setPage(p);window.scrollTo({top:0,behavior:'instant'});}
 return <MotionConfig reducedMotion="user"><div className="ambient"/><div className="sky-clouds" aria-hidden="true"/><div className={`site-shell scene-${page}`}><Header home={page==='home'} onHome={()=>navigate('home')} onExplore={()=>navigate('home')} onInfo={setInfo} onGuide={startGuide}/>
 <div hidden={page!=='home'}><Home onStart={()=>navigate('duel')} onBrainTeaser={()=>navigate('horses')}/></div>
 {visited.duel&&<div hidden={page!=='duel'}><DiceDuel onHome={()=>navigate('home')} onGuide={startGuide}/></div>}
 {visited.horses&&<div hidden={page!=='horses'}><HorseTeaser onHome={()=>navigate('home')} storyOpen={storyOpen&&page==='horses'} onStoryOpen={setStoryOpen}/></div>}
 {info&&<InfoDialog kind={info} onClose={()=>setInfo(null)}/>}</div><ActionGuide run={guideRun} page={page} suspended={!!info||storyOpen}/></MotionConfig>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
