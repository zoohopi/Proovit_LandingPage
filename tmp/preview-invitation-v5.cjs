const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({headless:true,channel:'msedge'});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const source = fs.readFileSync('proovit-landing.dc.html','utf8');
  const section = source.slice(source.indexOf('<section id="invite"'),source.indexOf('\n  <footer'))
    .replace(/\{\{ serial \}\}/g,'456번').replace(/\{\{ issuedAt \}\}/g,'2026.09.21')
    .replace(/\{\{ feeLabel \}\}/g,'50,000').replace(/\{\{ participantsLabel \}\}/g,'456')
    .replace(/\{\{ ctaLabel \}\}/g,'이 초대장을 받겠습니다').replace(/\{\{ stampOpacity \}\}/g,'0').replace(/\{\{ flameOpacity \}\}/g,'0');
  await page.setContent('<base href="http://127.0.0.1:4173/"><style>body{margin:0;background:#090709;color:#f4ede4;font-family:Arial,sans-serif;text-align:center}*{box-sizing:border-box}</style><link rel="stylesheet" href="invitation-stage.css"><link rel="stylesheet" href="invitation-materials.css">'+section);
  await page.addScriptTag({path:'invitation-stage.js'});
  await page.evaluate(()=>window.mountProovitInvitation(document.querySelector('#invite')));
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForTimeout(1800);
    await page.screenshot({path:`tmp/invitation-v5-${name}-closed.png`});
    await page.evaluate(()=>scrollTo(0,document.querySelector('.invite-scroll').offsetHeight-innerHeight));
    await page.waitForTimeout(1800);
    await page.screenshot({path:`tmp/invitation-v5-${name}.png`});
    console.log(name,await page.locator('.invitation-stage').getAttribute('data-state'));
    console.log(await page.evaluate(()=>{
      const letter=document.querySelector('.invitation-letter');
      const meta=letter.children[4].lastElementChild;
      const a=meta.children[0].getBoundingClientRect(),b=meta.children[1].getBoundingClientRect();
      const note=letter.children[6],r=document.createRange();r.selectNodeContents(note);
      return {metadataCenterDifference:Math.abs(a.x+a.width/2-b.x-b.width/2),noteLines:r.getClientRects().length,noteWidth:note.getBoundingClientRect().width};
    }));
  }
  await browser.close();
})();
