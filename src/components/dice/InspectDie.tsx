import {useState, useRef, type CSSProperties} from 'react';
import type {Die} from '../../types';

const poses = [[0, 0], [0, -90], [0, -180], [0, -270], [-90, 0], [90, 0]];

export function InspectDie({die, onChoose}: {die: Die; onChoose: () => void}) {
  const [revealed, setRevealed] = useState(false);
  const [face, setFace] = useState(0);
  const start = useRef<number | null>(null);
  const dragged = useRef(false);

  return <div className={`dd-inspect ${revealed ? 'is-revealed' : ''}`} style={{'--die': die.color} as CSSProperties}>
    {!revealed ? <button className="dd-mystery" onClick={() => setRevealed(true)} aria-label="Unseal mysterious die">
      <span aria-hidden="true">✧</span><b>A little mystery</b><small>Tap to unseal your die</small>
    </button> : <>
      <div className="dd-cube-controls">
        <button className="dd-cube-view"
          onPointerDown={event => {
            start.current = event.clientX;
            dragged.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={event => {
            if (start.current !== null && Math.abs(event.clientX - start.current) > 18) {
              dragged.current = true;
              const direction = event.clientX < start.current ? 1 : 5;
              setFace(value => (value + direction) % 6);
            }
            start.current = null;
          }}
          onPointerCancel={() => { start.current = null; }}
          onClick={() => {
            if (!dragged.current) setFace(value => (value + 1) % 6);
            dragged.current = false;
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              const direction = event.key === 'ArrowRight' ? 1 : 5;
              setFace(value => (value + direction) % 6);
            }
          }}
          aria-label={`${die.name}: face ${face + 1} of 6, value ${die.faces[face]}. Click or use arrow keys to turn.`}>
          <span className="dd-cube" style={{transform: `rotateX(-16deg) rotateY(-24deg) rotateX(${poses[face][0]}deg) rotateY(${poses[face][1]}deg)`}}>
            {die.faces.map((value, index) => <span key={index} className={`dd-cube-face face-${index}`} aria-hidden="true">{value}</span>)}
          </span>
        </button>
      </div>
      <h3 style={{color: die.color}}>{die.name}</h3>
      <div className="dd-face-values" aria-label={`Six equally likely faces: ${die.faces.join(', ')}`}>
        {die.faces.map((value, index) => <span key={index} className={face === index ? 'current' : ''} aria-hidden="true">{value}</span>)}
      </div>
      <small>Tap or drag to turn · every face is equally likely</small>
      <button className="primary dd-choose" onClick={onChoose}>Choose {die.name} →</button>
    </>}
  </div>;
}
