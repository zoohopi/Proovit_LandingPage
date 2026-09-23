const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1280,height:1000}});
  await page.setContent('<body style="margin:0;background:#0a0708"><proovit-pot></proovit-pot></body>');
  await page.addScriptTag({url:'http://127.0.0.1:4173/pot-stage.js'});
  await page.waitForFunction(()=>document.querySelector('proovit-pot').elapsed>1.4);
  await page.screenshot({path:'tmp/money-explosion-middle.png'});
  await page.waitForFunction(()=>document.querySelector('proovit-pot').elapsed>5.3);
  const state=()=>page.locator('.bill').evaluateAll(bills=>bills.map(b=>[b.style.transform,b.firstChild.style.transform,b.style.opacity]));
  const frozen=await state();
  assert.equal(new Set(await page.locator('.bill').evaluateAll(b=>b.map(x=>x.dataset.pose))).size,6);
  await page.waitForTimeout(600);
  assert.deepEqual(await state(),frozen,'Money must stay stationary after the burst');
  await page.waitForFunction(()=>document.querySelector('proovit-pot').elapsed>4.5);
  assert.equal(await page.locator('.final-frame').count(),0,'No still image replaces the moving notes');
  assert.equal(await page.locator('h2').isVisible(),true);
  assert.ok(await page.locator('.cash-back .bill').count()>0);
  await page.screenshot({path:'tmp/money-burst-desktop.png'});
  await page.locator('.replay').click();
  assert.notDeepEqual(await state(),frozen,'Replay restarts the burst');
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(5600);
  await page.screenshot({path:'tmp/money-burst-mobile.png'});
  assert.equal(await page.locator('.bill:visible').count(),18);
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.cash:visible').count(),0);
  console.log('PASS: continuous 30-note fall and hold, no image swap, visible heading, depth layers, replay, mobile 18 notes, reduced motion');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
