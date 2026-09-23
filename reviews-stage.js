(() => {
  const reviews = [
    { number:456, name:'김*은', amount:'232,653', date:'09.02 14:21', account:'12*-**-****-***', mission:'30일의 기록, 완주의 보상', quote:'매일 작은 목표를 완료하는 일이 습관이 됐어요. 마지막 날에는 입금액만큼이나 끝까지 해냈다는 사실이 기뻤습니다.' },
    { number:34, name:'이*호', amount:'432,200', date:'08.14 11:02', account:'30*-****-**-***', mission:'미루던 일에서, 매일 하는 일로', quote:'혼자라면 내일로 미뤘을 일들을 하나씩 끝냈어요. 함께 도전하는 사람들이 있다는 게 다시 시작할 힘이 됐습니다.' },
    { number:218, name:'박*진', amount:'186,450', date:'09.04 09:32', account:'11*-***-******', mission:'퇴근 후 한 시간, 21일 완주', quote:'퇴근하면 늘 쉬고 싶었는데 인증 하나만 하자는 마음으로 시작했어요. 쌓인 기록을 보니까 다음 도전도 해보고 싶어졌습니다.' }
  ];
  class ProovitReviews extends HTMLElement {
    constructor(){super();this.attachShadow({mode:'open'});this.active=0;}
    connectedCallback(){
      this.shadowRoot.innerHTML=`<style>
        :host{display:block;color:#f4ede4;font-family:inherit}*{box-sizing:border-box}
        .wrap{max-width:1060px;margin:auto;padding:0 clamp(22px,5vw,56px)}header{text-align:center;margin-bottom:64px}.eyebrow{color:#eaa85e;font-size:11px;letter-spacing:.2em;font-weight:700}h2{font-size:clamp(26px,3.6vw,40px);line-height:1.3;letter-spacing:-.04em;margin:18px 0 14px}header p{color:#a99c97;font-size:14px;line-height:1.7;margin:0}
        .layout{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:clamp(36px,7vw,90px)}.stack{position:relative;isolation:isolate;min-width:0;padding:16px 10px 16px}.stack:before,.stack:after{content:'';position:absolute;inset:16px 10px;border:1px solid #eaa85e30;border-radius:24px;background:#201614;transform:rotate(-6deg);z-index:-1}.stack:after{transform:rotate(5deg);background:#181211;z-index:-2}
        .receipt{border:1px solid #eaa85e66;border-radius:24px;background:radial-gradient(ellipse at 90% 0%,#eaa85e20,transparent 65%),#15100f;padding:clamp(24px,4vw,38px);box-shadow:0 24px 60px #0005;min-height:340px}.top{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:12px;color:#b8a89e}.check{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#eaa85e18;color:#f2b464;font-size:20px}.label{margin-top:32px;font-size:14px;color:#cfbda9}.amount{font-size:clamp(28px,3.8vw,42px);letter-spacing:-.05em;font-weight:800;color:#ffdf9e;white-space:nowrap;margin:10px 0 26px}.amount small{font-size:.5em;margin-left:5px}dl{border-top:1px dashed #ffffff24;margin:0;padding-top:20px;font-size:12px}dl div{display:flex;justify-content:space-between;gap:12px;margin:12px 0}dt{color:#8e8480}dd{margin:0;color:#d8ccc6}.badge{display:inline-block;border:1px solid #ff6ba033;border-radius:30px;padding:7px 12px;color:#ff9cbe;font-size:11px}.quote-mark{font-family:Georgia,serif;font-size:70px;color:#eaa85e;line-height:1;margin-top:22px;height:50px}blockquote{margin:0;font-size:clamp(20px,2.5vw,26px);font-weight:500;letter-spacing:-.025em;line-height:1.75;min-height:180px}.person{margin-top:22px;font-size:14px;font-weight:700}.mission{font-size:12px;color:#a99c97;margin-top:8px}.controls{display:flex;align-items:center;gap:12px;margin-top:28px}.controls button{height:42px;width:42px;border-radius:50%;border:1px solid #ffffff26;background:#ffffff08;color:#f4ede4;font-size:22px;cursor:pointer;transition:background .2s,transform .2s}.controls button:hover{background:#eaa85e20;transform:translateY(-2px)}button:focus-visible{outline:2px solid #f2b464;outline-offset:4px}.count{font-size:12px;color:#a99c97;margin-left:8px;font-variant-numeric:tabular-nums}.note{text-align:center;font-size:11px;color:#8e8480;line-height:1.9;margin-top:45px}
        .copy,.receipt{text-align:left}blockquote,h2{word-break:keep-all;overflow-wrap:break-word}.quote-row{display:flex;align-items:flex-start;gap:16px}.avatar{width:52px;height:52px;flex:0 0 52px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 20%,#eaa85e55,#603324);border:1px solid #f2b46455;color:#ffe8ac;font-size:18px;font-weight:700;box-shadow:0 0 0 5px #ffffff04}.wheel-hint{font-size:11px;color:#8e8480;margin-top:14px}.quote-row blockquote{font-size:clamp(18px,2.2vw,24px)}
        @media(max-width:680px){header{margin-bottom:36px}.layout{grid-template-columns:1fr;gap:36px}.stack{max-width:410px;width:100%;margin:auto}.receipt{min-height:320px}blockquote{min-height:0}.copy{padding:0 8px}.note{margin-top:28px}}
        /* Pink illuminated glass with layered depth; card-turn transforms stay on the receipt. */
        .stack{perspective:1100px;filter:drop-shadow(0 24px 30px #0006)}
        .stack:before,.stack:after{border:1px solid #ff6ba04d;background:linear-gradient(135deg,#ff2e7e22,#34172a66 45%,#ffffff09);backdrop-filter:blur(16px);box-shadow:inset 0 1px 0 #ffffff25,0 5px 0 #321324,0 12px 28px #ff2e7e12;transform:translate(10px,12px) rotate(5deg)}
        .stack:after{transform:translate(-8px,20px) rotate(-6deg);opacity:.65}
        .receipt{position:relative;isolation:isolate;overflow:hidden;border:1px solid #ffb1cf66;border-radius:26px;background:linear-gradient(125deg,#ffffff16 0%,#ff2e7e20 28%,#21121fbd 62%,#ff6ba012),#160f18aa;backdrop-filter:blur(24px) saturate(150%);-webkit-backdrop-filter:blur(24px) saturate(150%);box-shadow:inset 0 1px 0 #ffffff6b,inset 1px 0 0 #ffffff25,inset 0 -2px 0 #ff2e7e55,0 5px 0 #40152d,0 8px 0 #1a0d18,0 28px 65px #0009,0 0 45px #ff2e7e18}
        .receipt:before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(115deg,transparent 15%,#ffffff0d 16%,#ffffff03 36%,transparent 37%),radial-gradient(ellipse at 0 0,#ff6ba037,transparent 64%)}
        .receipt:after{content:'';position:absolute;inset:8px;border:1px solid #ffffff0a;border-radius:19px;pointer-events:none}
        .receipt .top{color:#f0bad1;letter-spacing:.04em}.receipt .check{color:#fff0f7;background:linear-gradient(135deg,#ff78ad,#ff2e7e);border:1px solid #ffc6df80;box-shadow:inset 0 1px 1px #ffffff80,0 3px 0 #8f1b4b,0 0 22px #ff2e7e50}
        .receipt .label{color:#ffb1d0}.receipt .amount{color:#fff1f7;text-shadow:0 0 24px #ff2e7e55}.receipt dl{border-color:#ff9ac338}.receipt dt{color:#b694a8}.receipt dd{color:#f1dce7}
        .eyebrow,.quote-mark{color:#ff2e7e}.avatar{background:radial-gradient(circle at 30% 20%,#ff6ba066,#40152d);border-color:#ff2e7e80;color:#ffb6d0;box-shadow:0 0 0 5px #ff2e7e0d,0 0 20px #ff2e7e18}
        /* Sculpted glass: pink key light, violet body and cool edge reflections. */
        .stack{transform:perspective(1400px) rotateY(-7deg) rotateX(3deg);filter:drop-shadow(0 30px 28px #0008)}
        .stack:before,.stack:after{inset:18px 10px;border-radius:38px 44px 38px 44px / 36px 40px 44px 40px;border-color:#ffc3e07a;background:radial-gradient(ellipse at 8% 10%,#ff2e7e55,transparent 65%),linear-gradient(140deg,#782752a6,#34254dc4 55%,#6886c24a);box-shadow:inset 0 2px 1px #fff6,inset 0 -2px 1px #95c6ff55,0 4px 0 #47234e,0 7px 0 #201829,0 22px 45px #0007;transform:translate(18px,17px) rotate(6deg)}
        .stack:after{transform:translate(-14px,30px) rotate(-7deg);background:linear-gradient(150deg,#f548894a,#553a864d 48%,#4688a93b);border-color:#b3b4fb55;opacity:.8}
        .receipt{border-color:#ffd4e666;border-radius:36px 42px 36px 42px / 34px 38px 42px 38px;background:radial-gradient(ellipse at 0% 0%,#ff619949,transparent 55%),radial-gradient(ellipse at 100% 95%,#62b9df2e,transparent 48%),radial-gradient(ellipse at 90% 40%,#9271d12b,transparent 60%),linear-gradient(135deg,#412135e8,#211727ed 50%,#212535e3);backdrop-filter:blur(28px) saturate(160%);box-shadow:inset 0 2px 2px #ffe9f180,inset 2px 0 2px #ffbddc2e,inset -2px 0 3px #b5ddff22,inset 0 -3px 3px #a69acf66,0 2px 0 #b6749d,0 5px 0 #713952,0 8px 0 #3a263e,0 11px 0 #151322,0 28px 60px #0009,0 0 60px #ff2e7e13}
        .receipt:before{inset:0;z-index:0;border-radius:inherit;padding:2px;background:conic-gradient(from 160deg,#a9d7f58c,transparent 18%,#ff75b47a 32%,#ffecf6ed 43%,#ff82b8b0 55%,transparent 66%,#bf9aff99 82%,#a9d7f58c);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
        .receipt:after{inset:7px;border-radius:29px 35px 29px 35px;border-color:#ffe5f112;background:linear-gradient(123deg,#fff0 2%,#ffffff0d 3%,#ffffff03 20%,transparent 21%,transparent 63%,#bfeaff06 64%,transparent 90%);box-shadow:inset 0 1px 0 #fff2,inset 0 -1px 0 #c9ceff16}
        .receipt .top{color:#ffd0e3;font-size:11px;letter-spacing:.08em}.receipt .check{width:38px;height:38px;background:radial-gradient(circle at 30% 15%,#ffb1d5,#ff2e7e 65%,#a52064);border-color:#ffd2e7aa;box-shadow:inset 0 2px 2px #fff8,inset 0 -2px 2px #b4165c,0 3px 0 #761845,0 6px 12px #11091488,0 0 24px #ff2e7e38}
        .receipt .label{color:#ffa6cb;letter-spacing:.04em}.receipt .amount{color:#fff3f9;text-shadow:0 2px 1px #0006,0 0 28px #ff2e7e38}.receipt .amount small{color:#e5c5da}
        .receipt dl{border:1px solid #e9d2ff18;border-top-color:#ffd0e333;border-radius:18px;padding:12px 16px;margin:0 -3px;background:linear-gradient(130deg,#100c1638,#a9caff05);box-shadow:inset 0 2px 5px #0d07182b,0 1px 0 #ffe4fa12}.receipt dt{color:#bca7bc}.receipt dd{color:#f3e9f4;font-variant-numeric:tabular-nums}
        @media(max-width:680px){.stack{transform:perspective(1400px) rotateY(-4deg) rotateX(2deg);padding:16px 14px 22px}.stack:before{transform:translate(9px,14px) rotate(4deg)}.stack:after{transform:translate(-7px,24px) rotate(-4deg)}.receipt{padding:27px 25px}}
      </style><div class="wrap"><header><span class="eyebrow">PROOVIT · FINISHER STORIES</span><h2>완주의 기쁨이,<br>입금의 순간까지.</h2><p>도전을 끝낸 프루버들의 입금 내역과 이야기</p></header><div class="layout"><div class="stack"><article class="receipt"></article></div><div class="copy"><span class="badge">고객 후기 · 예시</span><div class="story" aria-live="polite" aria-atomic="true"></div><div class="controls"><button type="button" aria-label="이전 고객 후기">←</button><button type="button" aria-label="다음 고객 후기">→</button><span class="count"></span></div></div></div><p class="note">입금 내역과 후기는 화면 구성을 위한 예시입니다. 개인별 결과는 다를 수 있습니다.<br>계좌번호와 이름은 마스킹 처리했습니다.</p></div>`;
      this.abort=new AbortController();
      this.shadowRoot.querySelectorAll('button').forEach((button,i)=>button.addEventListener('click',()=>this.show(this.active+(i?1:-1),true),{signal:this.abort.signal}));
      this.show(0,false);
      this.wheelTotal=0;this.lastWheel=-Infinity;this.snapped=false;this.wheelPhase=0;this.wheelDirection=0;
      this.shadowRoot.querySelector('.controls').insertAdjacentHTML('afterend','<p class="wheel-hint">휠 2단계로 넘기기 · 마지막 후기에서 다음 섹션으로</p><div class="wheel-progress" aria-hidden="true" style="display:flex;gap:5px;margin-top:10px"><i></i><i></i></div>');
      const progressStyle=document.createElement('style');
      progressStyle.textContent='.wheel-progress i{display:block;width:26px;height:3px;border-radius:3px;background:#ffffff18;transition:background .35s}.wheel-progress i.done{background:#ff2e7e}.stack{perspective:1100px}.receipt{transform-origin:50% 85%}.controls button:disabled{opacity:.4;cursor:default}';
      this.shadowRoot.append(progressStyle);
      // Clamp the momentum destination before the heading can overshoot its stop.
      window.addEventListener('proovit:scroll-target',e=>{
        const {from,to}=e.detail;
        if(to===from)return;
        const direction=Math.sign(to-from);
        if((direction>0&&this.active===reviews.length-1)||(direction<0&&this.active===0))return;
        const bounds=this.shadowRoot.querySelector('.wrap').getBoundingClientRect();
        const anchor=scrollY+bounds.top-this.restPosition(bounds);
        if((from<=anchor&&to>=anchor)||(from>=anchor&&to<=anchor)){
          e.detail.to=anchor;this.snapped=true;
        }
      },{signal:this.abort.signal});
      window.addEventListener('wheel',e=>{
        if(e.defaultPrevented||e.ctrlKey||e.metaKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
        // Do not hijack form controls or independently scrollable UI.
        for(const el of e.composedPath()){
          if(!(el instanceof HTMLElement)||el===document.body||el===document.documentElement)continue;
          if(el.matches('input,textarea,select,[contenteditable="true"]'))return;
          if(/auto|scroll/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight)return;
        }
        const bounds=this.shadowRoot.querySelector('.wrap').getBoundingClientRect();
        // Lock the section with the eyebrow and title clear of the top edge.
        const rest=this.restPosition(bounds);
        if(bounds.top>rest+12||bounds.bottom<innerHeight*.4){this.snapped=false;return;}
        const direction=Math.sign(e.deltaY),now=performance.now();
        if(!this.transitioning&&((direction>0&&this.active===reviews.length-1)||(direction<0&&this.active===0))){if(this.wheelPhase)this.show(this.active,false);this.wheelTotal=0;this.wheelPhase=0;this.updateProgress();return;}
        if(!e.cancelable)return;
        e.preventDefault();e.stopPropagation();window.dispatchEvent(new Event('proovit:wheel-capture'));
        // Momentum can carry past the lock point; settle the section back into frame once.
        if(!this.snapped||Math.abs(bounds.top-rest)>2){this.snapped=true;if(Math.abs(bounds.top-rest)>2)scrollTo({top:scrollY+bounds.top-rest,behavior:'instant'});}
        if(this.transitioning||now-this.lastWheel<320)return;
        if(this.wheelDirection!==direction){this.wheelTotal=0;this.wheelPhase=0;this.wheelDirection=direction;}
        // A large wheel delta still advances only one of the two poses.
        this.wheelTotal+=Math.min(80,Math.abs(e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1));
        if(this.wheelTotal>=60){this.advanceWheel(direction);this.lastWheel=now;this.wheelTotal=0;}
      },{passive:false,capture:true,signal:this.abort.signal});
    }
    restPosition(bounds){return Math.max(80,(innerHeight-bounds.height)/2+40);}
    updateProgress(){this.shadowRoot.querySelectorAll('.wheel-progress i').forEach((el,i)=>el.classList.toggle('done',i<this.wheelPhase));}
    advanceWheel(direction){
      this.wheelPhase++;this.updateProgress();
      if(this.wheelPhase===2){this.show(this.active+direction,true);return;}
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const receipt=this.shadowRoot.querySelector('.receipt');
      const previous={transform:getComputedStyle(receipt).transform,opacity:getComputedStyle(receipt).opacity};
      receipt.getAnimations().forEach(a=>a.cancel());
      receipt.animate([previous,{transform:`translateY(${-direction*20}px) rotate(${-direction*2.5}deg) rotateX(3deg)`,opacity:.9}],{duration:420,easing:'cubic-bezier(.22,.75,.2,1)',fill:'forwards'});
    }
    async show(index,animate){
      if(this.transitioning)return;
      const receipt=this.shadowRoot.querySelector('.receipt'),story=this.shadowRoot.querySelector('.story');
      const motion=animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(!motion)[receipt,story].forEach(el=>el.getAnimations().forEach(a=>a.cancel()));
      if(motion){
        this.transitioning=true;
        this.shadowRoot.querySelectorAll('button').forEach(b=>b.disabled=true);
        const previous={transform:getComputedStyle(receipt).transform,opacity:getComputedStyle(receipt).opacity};
        [receipt,story].forEach(el=>el.getAnimations().forEach(a=>a.cancel()));
        const direction=index>=this.active?1:-1;
        const exit=receipt.animate([previous,{opacity:0,transform:`translateY(${-direction*76}px) rotate(${-direction*7}deg) scale(.96)`}],{duration:380,easing:'cubic-bezier(.45,0,.7,1)',fill:'forwards'});
        story.animate([{opacity:1},{opacity:0}],{duration:320,fill:'forwards'});
        try{await exit.finished;}catch{this.finishTransition();return;}
        if(!this.isConnected)return;
      }
      this.active=(index+reviews.length)%reviews.length;const r=reviews[this.active];
      receipt.innerHTML=`<div class="top"><span>PROOVIT · 입금 내역</span><span class="check">✓</span></div><div class="label">입금 완료</div><div class="amount">+${r.amount}<small>원</small></div><dl><div><dt>보낸 곳</dt><dd>프루빗</dd></div><div><dt>예금주</dt><dd>${r.name}</dd></div><div><dt>입금 계좌</dt><dd>${r.account}</dd></div><div><dt>입금 일시</dt><dd>${r.date}</dd></div></dl>`;
      story.innerHTML=`<div class="quote-mark" aria-hidden="true">“</div><div class="quote-row"><div class="avatar" aria-label="${r.name} 프로필">${r.name[0]}</div><blockquote>${r.quote}</blockquote></div><div class="person">${r.name} · 참가번호 ${r.number}번</div><div class="mission">${r.mission}</div>`;
      this.shadowRoot.querySelector('.count').textContent=`${this.active+1} / ${reviews.length}`;
      if(motion){
        [receipt,story].forEach(el=>el.getAnimations().forEach(a=>a.cancel()));
        const entrance=receipt.animate([{opacity:0,transform:'translateY(26px) rotate(3deg) scale(.97)'},{opacity:1,transform:'translateY(0) rotate(0) scale(1)'}],{duration:620,easing:'cubic-bezier(.16,1,.3,1)'});
        story.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});
        try{await entrance.finished;}catch{return;}
      }
      this.finishTransition();
    }
    finishTransition(){
      this.transitioning=false;this.wheelPhase=0;this.wheelTotal=0;this.lastWheel=-Infinity;this.updateProgress();
      this.shadowRoot.querySelectorAll('button').forEach(b=>b.disabled=false);
    }
    disconnectedCallback(){this.abort?.abort();this.shadowRoot.querySelectorAll('.receipt,.story').forEach(el=>el.getAnimations().forEach(a=>a.cancel()));this.transitioning=false;}
  }
  if(!customElements.get('proovit-reviews'))customElements.define('proovit-reviews',ProovitReviews);
})();
