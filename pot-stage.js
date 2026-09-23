/* One-shot money overlay with an ease-out landing on the approved artwork. */
(() => {
  const assets = new URL('./assets/'+encodeURIComponent('저금통 페이지')+'/', document.currentScript?.src || location.href);
  class ProovitPot extends HTMLElement {
    constructor(){super();this.attachShadow({mode:'open'});}
    connectedCallback(){
      if(this.live)return;this.live=true;
      this.shadowRoot.innerHTML=`
        <style>
          :host{display:block;width:100%;font-family:'Pretendard Variable',Pretendard,system-ui,sans-serif;color:#F4EDE4}
          *{box-sizing:border-box}.scene{position:relative;max-width:1000px;margin:auto}
          h2{margin:0 0 24px;text-align:center;font-size:clamp(24px,3.6vw,40px);font-weight:900;letter-spacing:-.03em;line-height:1.3;text-wrap:pretty}
          .art{position:relative;aspect-ratio:1677/938;isolation:isolate;overflow:hidden;background:#0b0806;container-type:inline-size}
          .clean-plate,.money-overlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
          .clean-plate{z-index:0}
          .money-overlay{z-index:3;transform:translate3d(0,-115%,0);opacity:0;will-change:transform}
          .landed .money-overlay{will-change:auto}
          .lights{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;mix-blend-mode:screen;mask-image:linear-gradient(#000 0%,#000 55%,transparent 91%)}
          .lights i{position:absolute;top:-12%;left:25%;width:50%;height:110%;transform-origin:50% 0;clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);background:linear-gradient(90deg,transparent 0%,#ca854008 12%,#eaa85e24 32%,#f2b46440 46%,#fff1c454 50%,#f2b46440 54%,#eaa85e24 68%,#ca854008 88%,transparent 100%);filter:blur(9px);animation:beam-sway 9s ease-in-out infinite alternate;animation-play-state:paused}
          .lights i:nth-child(2){left:16%;width:32%;opacity:.6;animation-delay:-3s;transform:rotate(12deg)}
          .lights i:nth-child(3){left:53%;width:28%;opacity:.45;animation-delay:-6s;transform:rotate(-13deg)}
          .lights b{position:absolute;inset:-80% 24% 0;background:linear-gradient(180deg,transparent 30%,#ca854000 40%,#eaa85e16 47%,#f2b46435 51%,#fff1c448 54%,#f2b46420 59%,transparent 68%);filter:blur(18px);animation:light-flow 5.8s linear infinite;animation-play-state:paused}
          .lights{mask-image:linear-gradient(transparent 0%,#000 9%,#000 55%,transparent 91%)}
          .lights i{clip-path:none;mask-image:radial-gradient(ellipse at 50% 0%,#000 0%,#0009 40%,transparent 72%)}
          .backdrop{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 5%,#edaa5c44,transparent 55%),radial-gradient(ellipse at 50% 88%,#a65f252b,transparent 45%)}
          .bg{position:absolute;inset:0;z-index:0;overflow:hidden;opacity:.78;pointer-events:none;mask-image:linear-gradient(to bottom,transparent,#000 7%,#000 84%,transparent),linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);mask-composite:intersect}
          .bg img{position:absolute;top:-17%;left:-17%;width:134%;height:134%;object-fit:cover}
          .foreground{clip-path:none;filter:drop-shadow(0 0 10px #f2b46433)}
          .lights{filter:brightness(1.7)}.lights b{filter:blur(12px) brightness(2)}
          .god-rays{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;mix-blend-mode:screen;mask-image:linear-gradient(transparent,#000 8%,#000 62%,transparent 94%)}
          .god-rays i{position:absolute;left:41%;top:-18%;width:18%;height:120%;transform-origin:50% 0;background:linear-gradient(90deg,transparent,#ca854022 12%,#eaa85e55 30%,#f2b464a0 43%,#fff9dbd9 50%,#f2b464a0 57%,#eaa85e55 70%,transparent);filter:blur(7px);animation:divine-sway 8s ease-in-out infinite alternate;animation-play-state:paused}
          .god-rays i:nth-child(2){left:27%;width:12%;animation-delay:-3s;animation-duration:10s;opacity:.65}.god-rays i:nth-child(3){left:62%;width:10%;animation-delay:-6s;animation-duration:12s;opacity:.7}
          @keyframes divine-sway{from{transform:rotate(-16deg) scaleX(.8)}to{transform:rotate(16deg) scaleX(1.2)}}

          .lights,.god-rays{z-index:2;opacity:.35}
          .lit .lights>*,.lit .god-rays>*{animation-play-state:running}
          .burst-glow{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(ellipse at 50% 40%,#ffc96955,transparent 52%);mix-blend-mode:screen;opacity:var(--burst-glow,0)}
          @keyframes beam-sway{from{rotate:-3deg;opacity:.4}to{rotate:3deg;opacity:.75}}
          @keyframes light-flow{0%{transform:translateY(-30%);opacity:0}18%{opacity:.75}78%{opacity:.55}100%{transform:translateY(60%);opacity:0}}
          .controls{text-align:center;margin-top:12px}.replay{font:inherit;font-size:12px;color:#BEB0AA;border:1px solid #ffffff25;border-radius:24px;padding:8px 16px;background:#171110;cursor:pointer}.replay:hover{border-color:#FFC24D;color:#FFE8AC}.replay:focus-visible{outline:2px solid #FFC24D;outline-offset:4px}.note{margin:10px 0 0;text-align:center;font-size:11px;color:#8E8480;line-height:1.6}
          @media(max-width:600px){.note{font-size:10px;padding:0 10px}}
          @media(prefers-reduced-motion:reduce){.lights>*,.god-rays>*{animation:none!important}.lights b{display:none}.money-overlay{will-change:auto}}
          .jackpot{position:absolute;z-index:5;left:44.1%;top:81.5%;width:24.4%;height:9.8%;display:flex;align-items:center;justify-content:center;background:#171210;border-radius:8px;box-shadow:0 0 5px 3px #171210;color:#ffce61;font-size:4.05cqw;font-weight:900;letter-spacing:-.02em;font-variant-numeric:tabular-nums;text-shadow:0 0 12px #ffb53155;line-height:1}
          .reel{display:block;overflow:hidden;width:.64em;height:1.1em}.reel-strip{display:block;will-change:transform}.reel-strip span{display:block;height:1.1em;line-height:1.1em;text-align:center}.separator{width:.25em;text-align:center}.jackpot.locked{filter:brightness(1);animation:jackpot-lock .42s ease-out}.jackpot.locked .reel-strip{will-change:auto}@keyframes jackpot-lock{0%{text-shadow:0 0 18px #fff0bc,0 0 6px #fff;transform:translateY(-1px)}40%{text-shadow:0 0 12px #ffc35a;transform:translateY(1px)}100%{text-shadow:0 0 12px #ffb53155;transform:none}}
          @media(prefers-reduced-motion:reduce){.jackpot.locked{animation:none}}
        </style>
        <div class="scene" data-phase="waiting">
          <h2>“이 돈의 주인이<br>되고 싶지&nbsp;않으십니까?”</h2>
          <div class="art">
            <img class="clean-plate" src="${assets}pot-clean-plate-v1.png" alt="황금 돼지저금통과 예상 상금 50,000원에서 1,250,000원" decoding="async">
            <div class="lights" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
            <div class="god-rays" aria-hidden="true"><i></i><i></i><i></i></div>
            <img class="money-overlay" src="${assets}money-overlay-transparent-v1.png" width="1676" height="939" alt="" aria-hidden="true" decoding="async">
            <div class="burst-glow" aria-hidden="true"></div>
            <div class="jackpot" role="img" aria-label="예상 상금 1,250,000원"></div>
          </div>
          <div class="controls"><button type="button" class="replay">상금 연출 다시 보기</button></div>
          <p class="note">연출용 예상 상금 예시입니다. 실제 회수 금액은 아래 시뮬레이션에서 확인하세요.</p>
        </div>`;
      const $=s=>this.shadowRoot.querySelector(s);
      this.counter=$('.jackpot');
      this.counter.innerHTML=Array.from('1,250,000',c=>c===','?'<span class="separator" aria-hidden="true">,</span>':'<span class="reel" aria-hidden="true"><span class="reel-strip">'+Array.from({length:20},(_,i)=>'<span>'+i%10+'</span>').join('')+'</span></span>').join('');
      this.reels=[...this.counter.querySelectorAll('.reel')];
      this.scene=$('.scene');this.overlay=$('.money-overlay');this.elapsed=0;this.render(0);
      this.media=matchMedia('(prefers-reduced-motion: reduce)');this.reduced=this.media.matches;
      this.abort=new AbortController();const opts={signal:this.abort.signal};
      $('.replay').addEventListener('click',()=>{this.elapsed=0;this.started=true;this.render(0);this.resume();},opts);
      this.media.addEventListener('change',e=>{this.reduced=e.matches;this.resume();},opts);
      document.addEventListener('visibilitychange',()=>this.resume(),opts);
      Promise.all([$('.clean-plate'),this.overlay].map(img=>img.decode())).then(()=>{if(!this.live)return;this.ready=true;if(this.inView)this.begin();}).catch(()=>{this.reduced=true;this.ready=true;this.render(4);});
      this.observer=new IntersectionObserver(entries=>{this.inView=entries[0].isIntersecting;if(this.inView&&this.ready)this.begin();else this.resume();},{threshold:.2});
      this.observer.observe($('.art'));
    }
    begin(){if(!this.started){this.started=true;this.elapsed=0;}this.resume();}
    resume(){
      cancelAnimationFrame(this.frame);
      this.scene.classList.toggle('lit',this.inView&&!document.hidden&&!this.reduced);
      if(!this.live||!this.started)return;
      if(this.reduced){this.elapsed=4;this.render(4);return;}
      if(!this.inView||document.hidden||this.elapsed>=3.8)return;
      this.last=performance.now();this.frame=requestAnimationFrame(n=>this.tick(n));
    }
    tick(now){if(!this.live)return;this.elapsed+=Math.min(.05,(now-this.last)/1000);this.last=now;this.render(this.elapsed);if(this.elapsed<3.8)this.frame=requestAnimationFrame(n=>this.tick(n));}
    render(t){
      const countProgress=Math.max(0,Math.min(1,(t-.3)/3.1));
      const value=countProgress===1?1250000:1250000*(1-Math.pow(1-countProgress,3));
      this.counter.dataset.value=String(Math.floor(value));
      this.counter.classList.toggle('locked',countProgress===1);
      this.reels.forEach((reel,i)=>{
        const place=Math.pow(10,6-i),number=value/place;
        const digit=countProgress===1?Math.floor(number)%10:number%10;
        reel.style.visibility=value>=place||i===6?'visible':'hidden';
        reel.firstChild.style.transform='translateY(-'+digit*1.1+'em)';
      });
      this.counter.querySelectorAll('.separator').forEach((comma,i)=>comma.style.visibility=value>=(i===0?1000000:1000)?'visible':'hidden');
      const p=Math.max(0,Math.min(1,(t-.15)/1.4));
      // Quartic ease-out: decisive entrance, then a soft stationary landing.
      this.overlay.style.transform=`translate3d(0,-${115*Math.pow(1-p,4)}%,0)`;
      this.overlay.style.opacity=p>0?'1':'0';
      // Keep the same transparent money layer visible after landing.
      this.scene.classList.toggle('landed',p===1);
      this.scene.style.setProperty('--burst-glow',String(.14*p));
      this.scene.dataset.phase=p===1?'complete':t<.15?'ready':p<.4?'falling':'settling';
    }
    disconnectedCallback(){this.live=false;cancelAnimationFrame(this.frame);this.observer?.disconnect();this.abort?.abort();}
  }
  if(!customElements.get('proovit-pot'))customElements.define('proovit-pot',ProovitPot);
})();
