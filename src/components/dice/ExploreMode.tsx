import {useEffect, useRef, useState} from 'react';
import type {Die, SimulationResult} from '../../types';
import {DICE} from '../../games/diceDuel/diceConfig';
import {pairKey, testedPairs, type JourneyState, type Hypothesis} from '../../games/diceDuel/progression';
import {calculateWinProbability, findBestResponse} from '../../games/diceDuel/probability';
import {simulateMatches} from '../../games/diceDuel/simulation';
import {DieVisual} from './DieCard';
import {PairControls} from './PairControls';
import {ConvergenceChart} from '../charts/ConvergenceChart';
import {Keeper} from './Keeper';
import {ArrowRight} from '../ui/Icons';

const pct = (probability: number) => (probability * 100).toFixed(1) + '%';
interface Props {
  onQuant: () => void;
  journey: JourneyState;
  onHypothesis: (hypothesis: Hypothesis) => void;
  onExperiment: (result: SimulationResult, hypothesis: Hypothesis) => void;
}

export function ExploreMode({onQuant, journey, onHypothesis, onExperiment}: Props) {
  const first = DICE.find(die => die.id === journey.firstDie) ?? DICE[0];
  const [hypothesis, setHypothesis] = useState<Hypothesis | null>(journey.hypothesis);
  const [a, setA] = useState<Die>(first);
  const [b, setB] = useState<Die>(() => findBestResponse(first));
  const [trials, setTrials] = useState(100);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [points, setPoints] = useState<SimulationResult['points']>([]);
  const [busy, setBusy] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const frame = useRef<number | undefined>(undefined);
  useEffect(() => () => { if (frame.current !== undefined) cancelAnimationFrame(frame.current); }, []);
  const pairs = testedPairs(journey.experiments);
  const discovered = pairs.size === 3;
  const showWorkshop = !discovered || replaying;
  const nextPair = DICE.map((die, index) => [die, DICE[(index + 1) % 3]])
    .find(([x, y]) => !pairs.has(pairKey(x.id, y.id)));

  function predict(value: Hypothesis) {
    setHypothesis(value);
    onHypothesis(value);
  }
  function run(x = a, y = b) {
    if (busy || !hypothesis) return;
    setA(x); setB(y); setBusy(true); setResult(null); setPoints([]);
    const prediction = hypothesis;
    const simulation = simulateMatches(x, y, trials);
    const started = performance.now();
    function tick(now: number) {
      const progress = Math.min(1, (now - started) / 1000);
      setPoints(simulation.points.slice(0, Math.max(1, Math.ceil(progress * simulation.points.length))));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else { setResult(simulation); setBusy(false); onExperiment(simulation, prediction); }
    }
    frame.current = requestAnimationFrame(tick);
  }
  const winner = result && (result.wins > result.losses ? a.name : result.losses > result.wins ? b.name : null);
  const keeper = !showWorkshop
    ? '“A loop! Every die has a rival it can beat. What if you made me choose first?”'
    : busy
      ? '“Watch the trail. A run of luck can look convincing… until it changes.”'
      : result
        ? `“${winner ? winner + ' came out ahead this time.' : 'An even result this time.'} A short run is evidence, not proof.”`
        : '“What’s your hunch? We can test it together. You’re allowed to change your mind.”';

  return <>
    <Keeper mood={!showWorkshop ? 'celebrating' : busy ? 'anticipating' : 'thinking'}><p>{keeper}</p></Keeper>
    {showWorkshop && (!hypothesis ? <section className="hunch-scene">
      <div className="dd-scene-heading"><h2>What’s your hunch?</h2><p>Pick a prediction. The experiment comes next.</p></div>
      <div data-guide="hunch" className="hunch-choices">
        {DICE.map(die => <button className="secondary" key={die.id} onClick={() => predict(die.id)}>
          <span style={{color: die.color}} aria-hidden="true">✦</span> {die.name} is strongest
        </button>)}
        <button className="secondary" onClick={() => predict('none')}>It depends on the opponent</button>
      </div>
    </section> : <>
      <div className="dd-workshop-status">
        <span>{discovered ? 'Free exploration' : `Clues collected · ${pairs.size} / 3`}</span>
        {discovered && <button className="text-button" disabled={busy} onClick={() => setReplaying(false)}>Back to discovery</button>}
        <details className="dd-hunch-details"><summary>Your prediction</summary>
          <div className="hunch-note">{hypothesis === 'none' ? 'It depends on the opponent.' : `${DICE.find(die => die.id === hypothesis)!.name} is strongest.`}
            <button className="text-button" disabled={busy} onClick={() => setHypothesis(null)}>Change prediction</button>
          </div>
        </details>
      </div>
      <section className="panel watch-scene" aria-label="Experiment table">
        <div className="watch-heading">
          <h2 className="dd-sr-only">{a.name} versus {b.name}</h2>
          <div className="dd-experiment-dice">
            <div><DieVisual die={a} small/><b style={{color: a.color}}>{a.name}</b></div>
            <span aria-hidden="true">vs.</span>
            <div><DieVisual die={b} small/><b style={{color: b.color}}>{b.name}</b></div>
          </div>
          <p className="small-text">{busy ? 'Real, independent rolls. Watch the pattern emerge.' : result
            ? `${result.trials.toLocaleString()} duels · ${result.wins} wins · ${result.losses} losses · ${result.ties} ties`
            : 'One matchup. Many duels. What will the evidence show?'}</p>
        </div>
        {points.length ? <ConvergenceChart points={points} theory={calculateWinProbability(a, b) * 100}/>
          : <div className="evidence-empty"><span aria-hidden="true">✧</span><p>Your experiment will appear here.</p></div>}
        {points.length > 0 && <div className="dd-chart-key"><span>━ Observed win rate</span><span>┄ Exact probability</span></div>}
        <div className="watch-readout" aria-live="polite">{busy ? `${points.at(-1)?.round ?? 0} rolls observed…` : result && <>
          <span>Observed <b>{pct(result.wins / result.trials)}</b></span><span>Exact chance {pct(calculateWinProbability(a, b))}</span>
        </>}</div>
        <div className="dd-actions">
          <button data-guide={!discovered && (busy ? pairs.size > 0 : Boolean(result && nextPair)) ? "next" : "experiment"} className="primary" disabled={busy} onClick={() => result && nextPair && !discovered ? run(nextPair[0], nextPair[1]) : run()}>
            {busy ? 'Watching the dice…' : result && nextPair && !discovered ? 'Watch a Different Matchup' : result ? 'Run Again' : 'Run the Experiment'} <ArrowRight size={17}/>
          </button>
        </div>
        <details className="quiet-details experiment-settings"><summary>Adjust matchup or number of duels</summary>
          <fieldset disabled={busy}>
            <PairControls a={a} b={b} onA={die => { setA(die); setResult(null); setPoints([]); }} onB={die => { setB(die); setResult(null); setPoints([]); }}/>
            <label className="control-label">Duels per experiment<select value={trials} onChange={event => setTrials(Number(event.target.value))}>
              {[10, 100, 1000, 10000].map(count => <option key={count} value={count}>{count.toLocaleString()}</option>)}
            </select></label>
            <p className="small-text">Short runs can disagree. More rolls help you investigate the long-run pattern.</p>
            <button className="secondary" onClick={() => run()}>Run This Setup</button>
          </fieldset>
        </details>
      </section>
      {journey.experiments.length > 0 && <details className="evidence-trail"><summary>Your collected clues · {pairs.size} / 3</summary>
        <section aria-label="Discovered matchups"><div>{DICE.map((die, index) => {
          const other = DICE[(index + 1) % 3];
          const experiment = [...journey.experiments].reverse().find(item => pairKey(item.result.a, item.result.b) === pairKey(die.id, other.id));
          return <div key={die.id} className={experiment ? 'found' : 'unseen'}><b>{die.name} & {other.name}</b>
            <span>{experiment ? `${experiment.result.trials.toLocaleString()} duels observed` : 'Not tested yet'}</span></div>;
        })}</div></section>
      </details>}
    </>)}
    {discovered && !replaying && <section className="panel story-reveal" aria-label="Discovery revealed">
      <span className="dd-reveal-star" aria-hidden="true">✦</span><span className="step-label">THE KEEPER’S SECRET</span>
      <h2>There is no strongest die.</h2>
      <div className="revealed-cycle">{DICE.map((die, index) => <div key={die.id}>
        <b style={{color: die.color}}>{die.name}</b><span aria-hidden="true">→</span><b style={{color: DICE[(index + 1) % 3].color}}>{DICE[(index + 1) % 3].name}</b>
        <small>{pct(calculateWinProbability(die, DICE[(index + 1) % 3]))} exact win chance</small>
      </div>)}</div>
      <p className="small-text">Each die has an edge over one rival and a weakness against another. Exact outcome counting confirms the loop—even when a short experiment disagrees.</p>
      <div className="dd-actions">
        <button data-guide="strategy" className="primary" onClick={onQuant}>Enter the Strategy Challenge <ArrowRight size={17}/></button>
        <button className="text-button" onClick={() => { if (!hypothesis) predict('none'); setReplaying(true); }}>Keep experimenting</button>
      </div>
      <details className="quiet-details"><summary>Compare every exact matchup</summary>
        <table className="probability-table"><thead><tr><th>Row beats column</th>{DICE.map(die => <th key={die.id}>{die.name}</th>)}</tr></thead>
          <tbody>{DICE.map(x => <tr key={x.id}><th>{x.name}</th>{DICE.map(y => <td key={y.id} className={calculateWinProbability(x, y) > .5 ? 'advantage' : ''}>{pct(calculateWinProbability(x, y))}</td>)}</tr>)}</tbody>
        </table>
      </details>
    </section>}
  </>;
}
