import {useEffect,useRef,useState,type PointerEvent as ReactPointerEvent} from 'react';
interface Drag {id:number;x:number;y:number;startX:number;startY:number;moved:boolean;touch:boolean;laneOrigin:boolean;}
interface Options {busy:boolean;onPlace:(id:number,lane:number)=>void;onRemove:(id:number)=>void;onSelect:(id:number)=>void;}
export function useHorseDrag(options:Options){
 const [drag,setDrag]=useState<Drag|null>(null);const active=useRef<Drag|null>(null),hold=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),callbacks=useRef(options);callbacks.current=options;
 useEffect(()=>{if(drag===null)return;function clear(){clearTimeout(hold.current);active.current=null;setDrag(null);}
 function move(e:PointerEvent){const d=active.current;if(!d)return;const dx=e.clientX-d.startX,dy=e.clientY-d.startY;
 // A horizontal touch swipe belongs to the carousel; vertical movement drags a horse.
 if(d.touch&&!d.laneOrigin&&!d.moved&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.15){clear();return;}
 const moved=d.moved||Math.hypot(dx,dy)>7;const next={...d,x:e.clientX,y:e.clientY,moved};if(moved)clearTimeout(hold.current);active.current=next;setDrag(next);
 if(moved){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-lane]');const y=e.clientY;if(!target&&y>innerHeight-65)window.scrollBy(0,14);else if(!target&&y<65)window.scrollBy(0,-14);}}
 function up(e:PointerEvent){const d=active.current;if(!d)return;const target=document.elementFromPoint(e.clientX,e.clientY);const lane=target?.closest<HTMLElement>('[data-drop-lane]');if(!callbacks.current.busy){if(d.moved&&lane)callbacks.current.onPlace(d.id,Number(lane.dataset.dropLane));else if(d.moved&&target?.closest('[data-stable]'))callbacks.current.onRemove(d.id);else if(!d.moved)callbacks.current.onSelect(d.id);}clear();}
 function touchmove(e:TouchEvent){if(active.current?.moved)e.preventDefault();}
 window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',clear);window.addEventListener('touchmove',touchmove,{passive:false});return()=>{clearTimeout(hold.current);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',clear);window.removeEventListener('touchmove',touchmove);};
 },[drag?.id]);
 function beginDrag(id:number,e:ReactPointerEvent){if(callbacks.current.busy||e.button!==0)return;if(e.pointerType!=='touch'){e.preventDefault();window.getSelection()?.removeAllRanges();}clearTimeout(hold.current);const d={id,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,touch:e.pointerType==='touch',laneOrigin:!!e.currentTarget.closest('[data-drop-lane]')};active.current=d;setDrag(d);if(d.touch)hold.current=setTimeout(()=>{if(active.current?.id===id){active.current={...active.current,moved:true};setDrag(active.current);}},320);}
 function cancel(){clearTimeout(hold.current);active.current=null;setDrag(null);}
 return {drag,beginDrag,cancel};
}
