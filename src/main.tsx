import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AnimatePresence,MotionConfig,motion} from 'framer-motion';
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
function App(){const [guideRun,setGuideRun]=useState(0);function startGuide(){navigate('home');setGuideRun(n=>n+1);}const [page,setPage]=useState<'home'|'duel'|'horses'>('home'),[info,setInfo]=useState<'how'|'about'|null>(null);function navigate(p:'home'|'duel'|'horses'){setPage(p);window.scrollTo({top:0,behavior:'smooth'});}return <MotionConfig reducedMotion="user"><div className="ambient"/><div className="sky-clouds" aria-hidden="true"/><div className={`site-shell scene-${page}`}><Header home={page==='home'} onHome={()=>navigate('home')} onExplore={()=>navigate('home')} onInfo={setInfo} onGuide={startGuide}/><AnimatePresence mode="wait"><motion.div key={page} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3}}>{page==='home'?<Home onStart={()=>navigate('duel')} onBrainTeaser={()=>navigate('horses')}/>:page==='duel'?<DiceDuel onHome={()=>navigate('home')} onGuide={startGuide}/>:<HorseTeaser onHome={()=>navigate('home')}/>}</motion.div></AnimatePresence>{info&&<InfoDialog kind={info} onClose={()=>setInfo(null)} onStart={()=>navigate('duel')}/>}</div><ActionGuide run={guideRun} page={page}/></MotionConfig>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
