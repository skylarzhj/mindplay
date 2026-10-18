import {useState} from 'react';
import {InspectDie} from './InspectDie';
import type {DieId, MatchResult} from '../../types';
import {DICE} from '../../games/diceDuel/diceConfig';
import {DieVisual} from './DieCard';
import {useDuel} from '../../hooks/useDuel';
import {Keeper} from './Keeper';
import {ArrowRight, RotateCcw} from '../ui/Icons';

interface Props {
  onInvestigate: () => void;
  onChoice: (die: DieId) => void;
  onRound: (result: MatchResult) => void;
}

export function PlayMode({onInvestigate, onChoice, onRound}: Props) {
  const [browsing, setBrowsing] = useState(0);
  const game = useDuel(onRound);
  const wins = game.history.filter(round => round.outcome === 'win').length;
  const losses = game.history.filter(round => round.outcome === 'loss').length;
  const message = game.rolling
    ? '“A little suspense is part of the game…”'
    : !game.selected
      ? '“Three enchanted dice. Pick the one you trust, and I’ll choose after you.”'
      : !game.result
        ? `“${game.selected.name}? I’ll take ${game.opponent!.name}. Higher roll wins.”`
        : game.result.outcome === 'win'
          ? '“Nicely rolled! A stronger die, or a lucky roll? Let’s investigate.”'
          : '“One roll proves very little. Shall we find out what’s really going on?”';

  return <>
    <Keeper mood={game.rolling ? 'anticipating' : game.result ? game.result.outcome === 'win' ? 'celebrating' : 'teasing' : 'idle'}>
      <p>{message}</p>
    </Keeper>
    {!game.selected ? <section className="dd-selection" aria-label="Choose a die">
      <div className="dd-scene-heading">
        <h2>Which die feels lucky?</h2>
        <p>Browse the three dice. Unseal one to inspect its faces.</p>
      </div>
      <div className="dd-die-browser">
        <button className="dd-browse-arrow" aria-label="Previous die" onClick={() => setBrowsing(i => (i + 2) % 3)}>‹</button>
        <div className="dd-browser-center">
          {DICE.map((die, i) => <div key={die.id} hidden={browsing !== i}>
            <InspectDie die={die} onChoose={() => { game.choose(die); onChoice(die.id); }}/>
          </div>)}
        </div>
        <button className="dd-browse-arrow" aria-label="Next die" onClick={() => setBrowsing(i => (i + 1) % 3)}>›</button>
      </div>
      <div className="dd-browse-position" aria-label={`Die ${browsing + 1} of 3`}>
        {DICE.map((die, i) => <span key={die.id} className={browsing === i ? 'current' : ''} aria-hidden="true"/>)}
        <small>{browsing + 1} of 3 dice</small>
      </div>
    </section> : <>
      <div className="battle panel">
        <div className="battle-die">
          <span className="eyebrow">YOU · {game.selected.name}</span>
          <DieVisual die={game.selected} value={game.result?.player} rolling={game.rolling}/>
          <span>{game.result ? `You rolled ${game.result.player}` : 'Your chosen die'}</span>
        </div>
        <div className="battle-center">
          <span className="versus" aria-hidden="true">VS</span>
          <div aria-live="polite" className={`result ${game.result?.outcome || ''}`}>
            {game.rolling ? 'The dice are dancing…' : game.result ? game.result.outcome === 'win' ? 'You win!' : game.result.outcome === 'loss' ? 'The Keeper wins.' : 'A perfect tie.' : 'Ready to try your luck?'}
          </div>
          {!game.result && <button className="primary" disabled={game.rolling} onClick={game.roll}>
            {game.rolling ? 'Rolling…' : 'Begin the Duel'} <ArrowRight size={17}/>
          </button>}
        </div>
        <div className="battle-die">
          <span className="eyebrow">KEEPER · {game.opponent!.name}</span>
          <DieVisual die={game.opponent!} value={game.result?.opponent} rolling={game.rolling}/>
          <span>{game.result ? `Keeper rolled ${game.result.opponent}` : 'Chosen after yours'}</span>
        </div>
      </div>
      {game.result && <div className="dd-next-step">
        <p>A lucky roll is one clue. What happens over many duels?</p>
        <div className="dd-actions">
          <button className="primary" onClick={onInvestigate}>Investigate this matchup <ArrowRight size={17}/></button>
          <button className="text-button" onClick={game.roll}>Roll Again</button>
        </div>
      </div>}
      <details className="dd-duel-options">
        <summary>Change die & duel record</summary>
        <button className="text-button" disabled={game.rolling} onClick={game.reset}>Try a Different Die</button>
        <div className="stats">
          <div><strong>{wins}</strong><span>Your wins</span></div>
          <div><strong>{losses}</strong><span>Keeper wins</span></div>
          <div><strong>{game.history.length - wins - losses}</strong><span>Ties</span></div>
          <div><strong>{game.history.length ? `${(wins / game.history.length * 100).toFixed(1)}%` : '—'}</strong><span>Your win rate</span></div>
        </div>
        <button className="text-button" disabled={game.rolling} onClick={() => game.choose(game.selected!)}><RotateCcw size={15}/> Reset this matchup</button>
      </details>
    </>}
  </>;
}
