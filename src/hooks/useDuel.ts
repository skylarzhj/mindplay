import {useEffect,useRef,useState} from 'react';
import type {Die,MatchResult} from '../types';
import {DICE} from '../games/diceDuel/diceConfig';
import {findBestResponse} from '../games/diceDuel/probability';
import {playMatch} from '../games/diceDuel/diceEngine';
export function useDuel(){const [selected,setSelected]=useState<Die|null>(null),[opponent,setOpponent]=useState<Die|null>(null),[history,setHistory]=useState<MatchResult[]>([]),[rolling,setRolling]=useState(false),[result,setResult]=useState<MatchResult|null>(null);const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);useEffect(()=>()=>clearTimeout(timer.current),[]);
function choose(d:Die){clearTimeout(timer.current);setSelected(d);setOpponent(findBestResponse(d));setResult(null);setHistory([]);setRolling(false);}
function roll(){if(!selected||!opponent||rolling)return;setRolling(true);setResult(null);const next=playMatch(selected,opponent);timer.current=setTimeout(()=>{setResult(next);setHistory(h=>[...h,next]);setRolling(false);},800);}
function reset(){clearTimeout(timer.current);setSelected(null);setOpponent(null);setHistory([]);setResult(null);setRolling(false);}
return {selected,opponent,history,rolling,result,choose,roll,reset};}
