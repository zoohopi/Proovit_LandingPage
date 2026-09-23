const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:950}});
  await page.setContent('<body style="margin:0;background:#0a0708"><div style="height:1000px"></div><proovit-reviews></proovit-reviews><div style="height:2000px"></div></body>');
  for(const name of ['reviews-stage','landing-motion'])await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'..',name+'.js'),'utf8')});
  const wheel=async delta=>{await page.mouse.move(5,450);await page.mouse.wheel(0,delta);};
  const rest=()=>page.evaluate(()=>{const e=document.querySelector('proovit-reviews'),r=e.shadowRoot.querySelector('.wrap').getBoundingClientRect();return {top:r.top,expected:e.restPosition(r),active:e.active,phase:e.wheelPhase,transitioning:e.transitioning};});
  await page.evaluate(()=>{const e=document.querySelector('proovit-reviews'),r=e.shadowRoot.querySelector('.wrap').getBoundingClientRect();scrollTo(0,scrollY+r.top-e.restPosition(r)-100);});
  await wheel(1100);await page.waitForTimeout(1000);
  let state=await rest();assert.ok(Math.abs(state.top-state.expected)<1,JSON.stringify(state));
  // Cursor is outside the content: both wheel steps must still advance the card.
  await wheel(120);await page.waitForTimeout(360);assert.equal((await rest()).phase,1);
  await wheel(120);await page.waitForTimeout(1100);assert.equal((await rest()).active,1);
  await wheel(120);await page.waitForTimeout(360);await wheel(120);await page.waitForTimeout(1100);assert.equal((await rest()).active,2);
  const before=await page.evaluate(()=>scrollY);await wheel(300);await page.waitForTimeout(700);assert.ok(await page.evaluate(()=>scrollY)>before+50,'Last card releases page scrolling');
  // Re-enter upward; reverse wheel transitions remain usable.
  await page.evaluate(()=>{const e=document.querySelector('proovit-reviews'),r=e.shadowRoot.querySelector('.wrap').getBoundingClientRect();scrollTo(0,scrollY+r.top-e.restPosition(r));});
  await wheel(-120);await page.waitForTimeout(360);await wheel(-120);await page.waitForTimeout(1100);assert.equal((await rest()).active,1);
  await page.locator('[aria-label="다음 고객 후기"]').click();await page.waitForTimeout(100);
  await page.locator('.receipt').evaluate(e=>e.getAnimations().forEach(a=>a.cancel()));await page.waitForTimeout(50);
  assert.equal((await rest()).transitioning,false,'Cancellation releases the transition lock');
  assert.equal(await page.locator('[aria-label="다음 고객 후기"]').isEnabled(),true);
  for(const selector of ['.eyebrow','.quote-mark'])assert.equal(await page.locator(selector).evaluate(e=>getComputedStyle(e).color),'rgb(255, 46, 126)');
  await page.screenshot({path:path.join(__dirname,'reviews-wheel-fixed.png')});
  console.log('PASS: exact scroll stop, wheel over outer gutter, two-stage forward/reverse cards, last-card exit, animation cancellation recovery, brand colors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
