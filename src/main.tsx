import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {MotionConfig} from 'framer-motion';
import {Header} from './components/layout/Header';
import {Home} from './pages/Home';
import {DiceDuel} from './pages/DiceDuel';
import './styles/index.css';
function App(){const [page,setPage]=useState<'home'|'duel'>('home');function navigate(p:'home'|'duel'){setPage(p);window.scrollTo({top:0,behavior:'smooth'});}return <MotionConfig reducedMotion="user"><div className="ambient"/><div className="site-shell"><Header home={page==='home'} onHome={()=>navigate('home')} onExplore={()=>navigate('duel')}/>{page==='home'?<Home onStart={()=>navigate('duel')}/>:<DiceDuel onHome={()=>navigate('home')}/>}</div></MotionConfig>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
