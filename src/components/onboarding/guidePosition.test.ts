import {describe,it,expect} from 'vitest';
import {guidePosition} from './guidePosition';
describe('guide placement',()=>{
 it('places the hint beside a control on desktop',()=>{
  expect(guidePosition({left:300,top:250,width:180,height:50},{width:310,height:220},{width:1200,height:800})).toEqual({left:496,top:165,ready:true});
 });
 it('uses the left side when the right side is full',()=>{
  const p=guidePosition({left:900,top:250,width:180,height:50},{width:310,height:220},{width:1200,height:800});
  expect(p.left+310).toBeLessThan(900);
 });
 it('keeps a mobile hint above a low button and clear of the target',()=>{
  const p=guidePosition({left:70,top:650,width:250,height:50},{width:310,height:220},{width:390,height:844});
  expect(p.left).toBeGreaterThanOrEqual(16);
  expect(p.left+310).toBeLessThanOrEqual(374);
  expect(p.top+220).toBeLessThan(650);
 });
 it('keeps the hint inside a short viewport when no side fits',()=>{
  const p=guidePosition({left:20,top:30,width:300,height:230},{width:310,height:220},{width:390,height:300});
  expect(p.top).toBeGreaterThanOrEqual(16);
  expect(p.top+220).toBeLessThanOrEqual(284);
 });
});
