/* PROOVIT hero: one coordinated timeline, with responsive card coordinates. */
(() => {
  const ASSETS = new URL('./assets/', document.currentScript?.src || location.href).href;
  const HERO_ASSETS = new URL('./assets/히어로 페이지/', document.currentScript?.src || location.href).href;
  const clamp = (n) => Math.max(0, Math.min(1, n));
  const ease = (n) => { n = clamp(n); return n * n * (3 - 2 * n); };
  class ProovitHero extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() {
      if (this.running) return;
      this.running = true;
      this.shadowRoot.innerHTML = `
        <style>
          :host{display:block;color:#F4EDE4;font-family:'Pretendard Variable',Pretendard,system-ui,sans-serif}
          *{box-sizing:border-box}button,a{-webkit-tap-highlight-color:transparent}button{font:inherit;cursor:pointer}
          .stage{height:100svh;min-height:620px;position:relative;background:#0A0708;overflow:hidden}
          .background{position:absolute;inset:0;background:url('${HERO_ASSETS}hero-background.png') center/cover;opacity:0}
          .background:after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 83%,#0A0708)}
          nav{position:fixed;inset:0 0 auto;z-index:40;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(22px,5vw,80px);background:rgba(10,7,8,.76);backdrop-filter:blur(16px);border-bottom:1px solid #ffffff20;opacity:0;visibility:hidden}
          .logo{width:132px;height:auto;display:block}.invite{padding:10px 22px;border:1px solid #FF2E7E;border-radius:40px;color:#F4EDE4;font-size:14px;font-weight:700;text-decoration:none;transition:background .2s}
          .invite:hover{background:#ff2e7e22}.invite:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid #FFB6D0;outline-offset:5px}
          .actor{position:absolute;left:50%;top:110px;height:calc(100% - 175px);max-height:760px;max-width:94%;width:auto;object-fit:contain;transform:translateX(-50%);opacity:0;pointer-events:none}
          canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.meteors{z-index:0}.actor{z-index:1}.magic{z-index:2}
          h1{position:absolute;z-index:3;left:50%;margin:0;transform:translateX(-50%);width:max-content;max-width:94%;font-size:clamp(25px,3.1vw,46px);line-height:1.3;font-weight:850;letter-spacing:-.045em;text-align:center;text-shadow:0 3px 25px #000,0 1px 5px #000}
          .line{display:block;white-space:nowrap}.letter{visibility:hidden}.pink{color:#FF2E7E}.caret{display:inline-block;width:2px;height:.88em;background:#FF2E7E;margin-left:5px;vertical-align:-.03em;opacity:0}
          .controls{position:absolute;z-index:4;bottom:23px;right:clamp(18px,4vw,60px);display:flex;gap:8px}.controls button{border:1px solid #ffffff24;background:#0a070899;color:#bcaeb5;border-radius:30px;padding:8px 12px;font-size:11px}.controls button:hover{color:#fff;border-color:#FF2E7E}
          .next{position:absolute;z-index:4;bottom:24px;left:50%;transform:translateX(-50%);font-size:12px;letter-spacing:.06em;color:#F4EDE4;text-decoration:none;opacity:0;visibility:hidden}.next span{color:#FF2E7E;margin-left:10px}
          @media(max-width:600px){nav{height:62px;padding:0 20px}.logo{width:105px}.invite{font-size:12px;padding:8px 15px}.stage{min-height:560px}.actor{top:115px;height:auto;width:94%;max-height:calc(100% - 205px)}h1{font-size:clamp(22px,5.4vw,32px)}.controls{bottom:18px;right:16px}.next{bottom:68px}}
          @media(prefers-reduced-motion:reduce){.background,.actor,nav,.next{opacity:1;visibility:visible}.letter{visibility:visible}}
        </style>
        <section class="stage" aria-label="프루빗 게임 초대">
          <div class="background"></div>
          <nav aria-label="메인 내비게이션"><a href="#scene-01" class="home" aria-label="프루빗 처음으로"><img class="logo" src="${ASSETS}logo-pink.webp" alt="프루빗"></a><a class="invite" href="#invite">초대창 확인</a></nav>
          <canvas class="meteors" aria-hidden="true"></canvas>
          <img class="actor" src="${HERO_ASSETS}hero-proovie.png" alt="명함을 건네며 미소 짓는 프로비" fetchpriority="high">
          <canvas class="magic" aria-hidden="true"></canvas>
          <h1 aria-label="선생님, 저랑 게임 한 번 하시겠습니까?"><span class="line" aria-hidden="true"></span><span class="line" aria-hidden="true"></span></h1>
          <a class="next" href="#scene-02">어떤 게임인지 궁금해요 <span>↓</span></a>
          <div class="controls"><button class="replay">다시 보기</button></div>
        </section>`;
      const $ = (s) => this.shadowRoot.querySelector(s);
      this.stage = $('.stage'); this.actor = $('.actor'); this.bg = $('.background'); this.nav = $('nav'); this.heading = $('h1'); this.next = $('.next');
      this.canvas = $('.magic'); this.ctx = this.canvas.getContext('2d'); this.sky = $('.meteors'); this.skyCtx = this.sky.getContext('2d');
      this.letters = [];
      ['선생님, 저랑', '게임 한 번 하시겠습니까?'].forEach((line, row) => {
        const el = this.shadowRoot.querySelectorAll('.line')[row];
        Array.from(line).forEach((char, i) => { const span = document.createElement('span'); span.className = 'letter' + (row === 1 && i < 2 ? ' pink' : ''); span.textContent = char; el.append(span); this.letters.push(span); });
      });
      this.caret = document.createElement('span'); this.caret.className = 'caret'; this.shadowRoot.querySelectorAll('.line')[1].append(this.caret);
      this.media = matchMedia('(prefers-reduced-motion: reduce)'); this.reduced = this.media.matches;
      this.abort = new AbortController(); const opts = { signal: this.abort.signal };
      $('.replay').addEventListener('click', () => { window.scrollTo({ top: Math.max(0, this.stage.getBoundingClientRect().top + window.scrollY), behavior: 'instant' }); this.start(); }, opts);
      this.shadowRoot.querySelectorAll('a').forEach((link) => link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href')); if (!target) return;
        e.preventDefault(); window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - (link.classList.contains('home') ? 0 : 90)), behavior: this.reduced ? 'instant' : 'smooth' });
        window.dispatchEvent(new CustomEvent('proovit:hero-link', { detail: { target: link.getAttribute('href') } }));
      }, opts));
      this.media.addEventListener('change', (e) => { this.reduced = e.matches; this.start(); }, opts);
      const updatePlayback = () => {
        if (document.hidden || !this.inView) { this.pausedAt ||= performance.now(); cancelAnimationFrame(this.frame); }
        else if (this.started) { if (this.pausedAt) this.started += performance.now() - this.pausedAt; this.pausedAt = 0; cancelAnimationFrame(this.frame); this.frame = requestAnimationFrame((n) => this.tick(n)); }
      };
      this.inView=true;
      this.viewportObserver=new IntersectionObserver(([entry])=>{this.inView=entry.isIntersecting;updatePlayback();});
      this.viewportObserver.observe(this.stage);
      document.addEventListener('visibilitychange', updatePlayback, opts);
      this.resize = new ResizeObserver(() => this.measure()); this.resize.observe(this.stage); this.resize.observe(this.actor);
      this.paths = ['M130 50 A90 90 0 1 1 129.99 50','M310 230 L400 50 L490 230 Z','M570 50 H750 V230 H570 Z'].map((d) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); return { el:p, length:p.getTotalLength() }; });
      // Fixed, asymmetric set: no new stars accumulate over time.
      this.stars = [[.09,.24,85,48,1.3,8,0],[.24,.18,45,65,.8,11,3],[.19,.51,65,40,.7,9,6],[.07,.65,35,28,.5,13,2],[.28,.34,24,38,.65,10,7],[.81,.24,-64,74,1,12,4],[.9,.48,34,66,.7,9,1],[.86,.62,-40,55,.6,14,5],[.96,.32,-36,42,.5,11,8]];
      Promise.all([this.actor.decode().catch(() => {}), new Promise((resolve) => { const im = new Image(); im.onload = im.onerror = resolve; im.src = HERO_ASSETS + 'hero-background.png'; })]).then(() => { if (this.running) { this.measure(); this.start(); } });
    }
    measure() {
      const box = this.stage.getBoundingClientRect(); const a = this.actor.getBoundingClientRect();
      this.w = box.width; this.h = box.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      [this.canvas, this.sky].forEach((c) => { c.width = Math.round(this.w*dpr); c.height = Math.round(this.h*dpr); c.getContext('2d').setTransform(dpr,0,0,dpr,0,0); });
      // Blank card on original 1145 × 1373 transparent character asset.
      this.card = { x:a.left-box.left+a.width*.286, y:a.top-box.top+a.height*.407, width:a.width*.113 };
      this.heading.style.top = (a.top-box.top+a.height*.565) + 'px';
      if (this.reduced && this.started) this.tick(performance.now());
    }
    start() { cancelAnimationFrame(this.frame); this.started = performance.now(); this.particles = []; this.lastTyped = 0; this.lastTime = 0; this.frame = requestAnimationFrame((n) => this.tick(n)); }
    tick(now) {
      if (!this.running || !this.card) return;
      const t = this.reduced ? 10 : (now-this.started)/1000;
      const dt = Math.min(.04, Math.max(0, t-this.lastTime)); this.lastTime = t;
      this.bg.style.opacity = ease(t/.9);
      const reveal = ease((t-3.55)/1.35);
      this.actor.style.opacity = reveal; this.nav.style.opacity = reveal; this.nav.style.visibility = reveal > 0 ? 'visible' : 'hidden'; this.nav.style.transform = `translateY(${(1-reveal)*-8}px)`;
      const count = this.reduced ? this.letters.length : Math.floor(Math.max(0,t-5.55)/.095);
      this.letters.forEach((el,i) => el.style.visibility = i < count ? 'visible' : 'hidden');
      this.lastTyped = count;
      this.caret.style.opacity = count > 0 && count < this.letters.length && Math.floor(t*8)%2 ? 1 : 0;
      this.next.style.opacity = ease((t-8)/.6); this.next.style.visibility = t > 8 ? 'visible' : 'hidden';
      this.drawMagic(t, dt); this.drawStars(t, reveal);
      this.stage.dataset.phase = t < .9 ? 'background' : t < 2.95 ? 'drawing' : t < 3.55 ? 'complete' : t < 5.55 ? 'character' : t < 8 ? 'typing' : 'idle';
      if (!this.reduced && !document.hidden && this.inView) this.frame = requestAnimationFrame((n) => this.tick(n));
    }
    drawMagic(t, dt) {
      const c = this.ctx; c.clearRect(0,0,this.w,this.h);
      const shrink = ease((t-3.55)/1.8); const initialWidth = Math.min(780,this.w*.79);
      const width = initialWidth + (this.card.width-initialWidth)*shrink;
      const x = this.w/2+(this.card.x-this.w/2)*shrink; const y = this.h*.43+(this.card.y-this.h*.43)*shrink;
      const scale = width/800; c.save(); c.translate(x,y); c.rotate(-.065*shrink); c.scale(scale,scale); c.translate(-400,-140);
      // The card material appears behind the completed outlines, then merges into the held card.
      const material = ease((t-3.05)/.4)*(1-ease((t-4.75)/.6));
      if (material > 0) { c.save(); c.globalAlpha = material; c.fillStyle = '#171110'; c.shadowColor='#FF2E7E'; c.shadowBlur=18; c.beginPath(); c.roundRect(-28,-35,856,350,18); c.fill(); c.strokeStyle='#ff2e7e66'; c.lineWidth=2; c.stroke(); c.restore(); }
      this.paths.forEach((path,i) => {
        const progress = clamp((t-.9-i*.16)/(1.85-i*.12)); if (progress <= 0) return;
        c.save(); c.lineWidth=shrink>.95 ? 12 : 3.4; c.strokeStyle='#FF6BA0'; c.shadowColor='#FF2E7E'; c.shadowBlur=16; c.lineCap='round'; c.beginPath();
        const length = path.length*progress;
        for(let d=0;d<=length;d+=3){const p=path.el.getPointAtLength(d);if(d===0)c.moveTo(p.x,p.y);else c.lineTo(p.x,p.y);}
        const tip=path.el.getPointAtLength(length); c.lineTo(tip.x,tip.y); c.stroke(); c.shadowBlur=4;c.strokeStyle='#FFD2E3';c.lineWidth=shrink>.95?5:1.1;c.stroke();c.restore();
        if(progress<1 && !this.reduced){
          const px=x+(tip.x-400)*scale,py=y+(tip.y-140)*scale;
          for(let k=0;k<5;k++){const angle=Math.random()*Math.PI*2,speed=35+Math.random()*140;this.particles.push({x:px,y:py,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.25+Math.random()*.45,max:.7});}
          c.save();c.fillStyle='#fff1f7';c.shadowColor='#FF2E7E';c.shadowBlur=25;c.beginPath();c.arc(tip.x,tip.y,5,0,Math.PI*2);c.fill();c.restore();
        }
      }); c.restore();
      this.particles=this.particles.filter((p)=>p.life>0);
      this.particles.forEach((p)=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=145*dt;c.save();c.globalAlpha=clamp(p.life/p.max);c.strokeStyle='#FF6BA0';c.shadowColor='#FF2E7E';c.shadowBlur=5;c.lineWidth=1.3;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*.028,p.y-p.vy*.028);c.stroke();c.restore();});
    }
    drawStars(t, opacity) {
      const c=this.skyCtx;c.clearRect(0,0,this.w,this.h);if(opacity<=0)return;
      this.stars.forEach(([nx,ny,dx,dy,size,period,offset])=>{
        const phase=this.reduced ? .4 : ((t-3.55+offset)%period)/period;
        const alpha=this.reduced ? .55 : Math.sin(phase*Math.PI)*.8;
        const x=nx*this.w+dx*(phase-.5),y=ny*this.h+dy*(phase-.5);
        c.save();c.globalAlpha=opacity*alpha;const gradient=c.createLinearGradient(x-dx*.8,y-dy*.8,x,y);gradient.addColorStop(0,'#ff2e7e00');gradient.addColorStop(1,'#FF6BA0');c.strokeStyle=gradient;c.lineWidth=size;c.shadowColor='#FF2E7E';c.shadowBlur=8;c.beginPath();c.moveTo(x-dx*.8,y-dy*.8);c.lineTo(x,y);c.stroke();c.fillStyle='#FFD6E5';c.beginPath();c.arc(x,y,size*1.6,0,Math.PI*2);c.fill();c.restore();
      });
    }
    disconnectedCallback(){this.running=false;cancelAnimationFrame(this.frame);this.viewportObserver?.disconnect();this.resize?.disconnect();this.abort?.abort();}
  }
  if(!customElements.get('proovit-hero'))customElements.define('proovit-hero',ProovitHero);
})();

