import {motion} from 'framer-motion';
import {Sparkles,LockKeyhole} from '../components/ui/Icons';
import {WORLDS,WorldIsland} from '../components/worlds/WorldIsland';
import {LuckyDice} from '../components/worlds/LuckyDice';
export function Home({onStart,onBrainTeaser}:{onStart:()=>void;onBrainTeaser:()=>void}){
 return <motion.main initial={{opacity:0}} animate={{opacity:1}} className="home fantasy-home">
  <section className="adventure-map" aria-label="Choose a Mindplay adventure">
   <div className="map-mist mist-one" aria-hidden="true"/>
   <div className="map-mist mist-two" aria-hidden="true"/>
   <div className="storybook-intro">
    <div className="eyebrow"><Sparkles size={13}/> AN ADVENTURE FOR THE CURIOUS</div>
    <h1>Mindplay<span>✦</span></h1>
    <h2>A World of Curious Games</h2>
    <p>Trust your instincts. Follow the clues. Discover the logic.</p>
    <span className="intro-note">No formulas required. Just a little curiosity.</span>
   </div>
   <div className="adventure-choices">
    <div className="adventure-choices-heading"><h2>Choose your adventure</h2><span><i className="availability-dot"/> 2 games ready to play</span></div>
    <div className="playable-worlds">{WORLDS.filter(world=>world.available).map(world=><WorldIsland key={world.id} world={world} onEnter={world.id==='brain'?onBrainTeaser:onStart}/>)}</div>
   </div>
   <section className="future-worlds" aria-labelledby="future-worlds-title">
    <div className="future-worlds-heading"><h2 id="future-worlds-title"><LockKeyhole size={15}/> More worlds coming soon</h2><p>Three new adventures on the horizon</p></div>
    <div className="future-islands">{WORLDS.filter(world=>!world.available).map(world=><WorldIsland key={world.id} world={world} onEnter={onStart}/>)}</div>
   </section>
   <LuckyDice onStart={onStart} onBrainTeaser={onBrainTeaser}/>
  </section>
  <footer><span>Play first. Get curious. Discover why.</span><span>You don’t have to be a genius. Just be curious. <span className="gold">✦</span></span></footer>
 </motion.main>;
}
