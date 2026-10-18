export interface GuideRect {top:number;left:number;width:number;height:number;}
/** Prefer a side with enough room so the hint never covers its control. */
export function guidePosition(target:GuideRect,card:{width:number;height:number},viewport:{width:number;height:number}){
 const gap=16,edge=16,right=target.left+target.width,bottom=target.top+target.height;
 const clamp=(n:number,size:number,limit:number)=>Math.max(edge,Math.min(n,limit-size-edge));
 const centeredTop=clamp(target.top+(target.height-card.height)/2,card.height,viewport.height);
 const centeredLeft=clamp(target.left+(target.width-card.width)/2,card.width,viewport.width);
 const candidates=[
  {left:right+gap,top:centeredTop},
  {left:target.left-card.width-gap,top:centeredTop},
  {left:centeredLeft,top:bottom+gap},
  {left:centeredLeft,top:target.top-card.height-gap},
 ];
 const fits=candidates.find(p=>p.left>=edge&&p.top>=edge&&p.left+card.width<=viewport.width-edge&&p.top+card.height<=viewport.height-edge);
 const position=fits??{left:centeredLeft,top:clamp(bottom+gap,card.height,viewport.height)};
 return {left:Math.round(position.left),top:Math.round(position.top),ready:true};
}
