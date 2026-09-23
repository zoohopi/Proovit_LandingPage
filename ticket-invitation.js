/* A real paper ticket: live type and serials, scroll choreography, fixed-center stamp. */
(() => {
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => { n = clamp(n); return n*n*(3-2*n); };
  const stops = [0, .58, .78, 1];
  const destination = 'https://proovit-ochre.vercel.app/demo/home';
  class ProovitTicketInvitation extends HTMLElement {
    constructor() { super(); this.attachShadow({mode:'open'}); }
    connectedCallback() {
      if (this.abort) return;
      this.abort = new AbortController();
      const options = {signal:this.abort.signal};
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const random = crypto.getRandomValues(new Uint32Array(1))[0];
      this.serial = String(100 + random % 900);
      this.progress = 0; this.target = 0; this.frame = 0; this.lastWheel = -Infinity; this.wheelSum = 0;
      this.shadowRoot.innerHTML = `<link rel="stylesheet" href="./ticket-invitation.css">
        <div class="track"><div class="stage">
          <header><span>YOUR NEXT CHAPTER</span><h2>당신의 차례입니다.</h2></header>
          <div class="ambient" aria-hidden="true"></div>
          <div class="scene">
            <div class="paper-runway" aria-hidden="true"></div>
            <div class="assembly">
              <div class="front">
                <div class="holder" aria-hidden="true"><span>PROOVIT · PRIVATE INVITATION</span></div>
                <div class="reel" aria-hidden="true">${Array.from({length:11}, (_,i) => `<div class="reel-item ${i===8?'selected':''}" style="--offset:${i-8}">${this.ticket(i===8?this.serial:String(100+(random+i*137)%900),i)}</div>`).join('')}</div>
                <div class="hero-ticket" aria-label="참가번호 ${this.serial} 초대장">${this.ticket(this.serial,'hero')}</div>
                <div class="cover" aria-hidden="true"><img src="assets/logo-pink.webp" alt=""><span>AN INVITATION TO PROVE IT</span></div>
              </div>
              <div class="back">
                <img class="back-art" src="assets/마지막 초대장 페이지/invitation-ticket-back-3d-v1.png" alt="" draggable="false">
                <span class="back-edition">PROOVIT · GAME 001</span>
                <h3>게임 한 판 하시겠습니까?</h3>
                <button class="stamp-target" disabled aria-label="초대장 중앙에 심볼 도장 찍기"><span class="stamp-guide">당신의 결심을 남겨주세요</span><img class="stamp" src="assets/symbol-pink.webp" alt="참가 도장"><i class="stamp-ring"></i></button>
                <span class="back-number">No. ${this.serial}</span>
              </div>
            </div>
          </div>
          <img class="cursor-stamp" src="assets/symbol-pink.webp" alt="" aria-hidden="true">
          <div class="controls"><p class="instruction" aria-live="polite">스크롤하면 당신의 초대장이 도착합니다.</p><div><button class="previous" aria-label="초대장 이전 단계">←</button><span class="step">01 / 07</span><button class="next" aria-label="초대장 다음 단계">다음 ↓</button></div></div>
          <p class="footnote">참가비는 챌린지 운영을 위한 참가 비용이며, 완주자에게 분배됩니다. 개인별 결과는 다를 수 있습니다.</p>
        </div></div>
        <dialog aria-labelledby="ticket-dialog-title"><div class="dialog-inner"><img src="assets/logo-pink.webp" alt="PROOVIT"><h2 id="ticket-dialog-title">proovit 서비스로 이동하겠습니까?</h2><p>당신의 다음 실행을 시작하세요.</p><div><button class="cancel">취소</button><a class="confirm" href="${destination}">확인</a></div></div></dialog>`;
      this.$ = s => this.shadowRoot.querySelector(s);
      this.stage = this.$('.stage'); this.track = this.$('.track'); this.dialog = this.$('dialog');
      this.onScroll = () => this.paint();
      window.addEventListener('scroll', this.onScroll, {...options, passive:true});
      window.addEventListener('resize', this.onScroll, options);
      // Stop global wheel momentum at the entrance so the first ticket isn't skipped.
      window.addEventListener('proovit:scroll-target', e => {
        const top = this.track.getBoundingClientRect().top + scrollY;
        if(e.detail.from < top-1 && e.detail.to > top) e.detail.to = top;
      }, options);
      window.addEventListener('wheel', e => this.wheel(e), {...options, capture:true, passive:false});
      window.addEventListener('touchstart', () => this.stop(), {...options, passive:true});
      window.addEventListener('keydown', e => { if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].includes(e.key)) this.stop(); }, options);
      this.$('.next').addEventListener('click', () => this.advance(1), options);
      this.$('.previous').addEventListener('click', () => this.advance(-1), options);
      this.$('.stamp-target').addEventListener('click', () => this.stamp(), options);
      this.$('.back').addEventListener('click', e => { if(!e.target.closest('button')) this.stamp(); }, options);
      this.$('.back').addEventListener('pointermove', e => {
        const r = this.stage.getBoundingClientRect();
        this.$('.cursor-stamp').style.transform = `translate(${e.clientX-r.left}px,${e.clientY-r.top}px) translate(-50%,-50%) rotate(-12deg)`;
        this.stage.classList.toggle('hover-stamp', e.pointerType!=='touch' && this.progress>.98 && !this.stamped);
      }, options);
      this.$('.back').addEventListener('pointerleave', () => this.stage.classList.remove('hover-stamp'), options);
      this.$('.cancel').addEventListener('click', () => this.dialog.close(), options);
      this.dialog.addEventListener('click', e => { if(e.target===this.dialog) this.dialog.close(); }, options);
      this.dialog.addEventListener('close', () => this.$('.stamp-target').focus({preventScroll:true}), options);
      this.observer = new ResizeObserver(() => this.paint()); this.observer.observe(this.track);
      this.paint();
    }
    ticket(number,id) {
      return `<article class="ticket ticket-render" aria-label="Proovit Game 001, 참가번호 ${number}, 참가비 50,000원, 30일 정원 456명"><img class="ticket-art" src="assets/마지막 초대장 페이지/invitation-ticket-3d-v7.png" alt="아치형 제목과 임시 QR 코드가 인쇄된 입체 종이 초대장" draggable="false"><strong class="number">No. ${number}</strong></article>`;
    }
    span() { return Math.max(1, this.track.offsetHeight-this.stage.offsetHeight); }
    stop() { cancelAnimationFrame(this.frame); this.frame=0; this.target=this.progress; }
    wheel(e) {
      if(this.dialog.open){if(e.cancelable)e.preventDefault();e.stopPropagation();return;}
      if(e.ctrlKey || e.metaKey || Math.abs(e.deltaX)>Math.abs(e.deltaY) || !e.deltaY || !e.cancelable) return;
      const r=this.track.getBoundingClientRect(), dir=Math.sign(e.deltaY);
      if(r.top>2 || r.bottom<innerHeight-2 || (dir<0&&this.progress<.001&&!this.frame) || (dir>0&&this.progress>.999&&!this.frame)) return;
      e.preventDefault(); e.stopPropagation(); window.dispatchEvent(new Event('proovit:wheel-capture'));
      const now=performance.now();
      if(now-this.lastWheel<400) return;
      if(this.wheelDirection!==dir) this.wheelSum=0;
      this.wheelDirection=dir;
      this.wheelSum+=Math.min(100,Math.abs(e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1));
      if(this.wheelSum<45) return;
      this.wheelSum=0; this.lastWheel=now; this.advance(dir);
    }
    advance(dir) {
      // Let the reel coast all the way into its selected ticket without a second
      // wheel gesture skipping the deceleration or starting the cover early.
      if(this.frame && dir>0 && this.target===.58)return;
      const p=this.frame?this.target:this.progress;
      const next=dir>0?stops.find(n=>n>p+.015):[...stops].reverse().find(n=>n<p-.015);
      if(next===undefined) return;
      this.stop(); this.target=next;
      window.dispatchEvent(new Event('proovit:wheel-capture'));
      const start=scrollY, end=this.track.getBoundingClientRect().top+scrollY+next*this.span();
      const reel=next===.58 && this.progress<.58;
      const began=performance.now(), duration=this.reduced.matches?0:reel?3000:1050;
      const tick=now=>{const t=duration?clamp((now-began)/duration):1;const eased=reel?t:1-Math.pow(1-t,4); scrollTo({top:start+(end-start)*eased,behavior:'instant'});this.paint(); if(t<1)this.frame=requestAnimationFrame(tick);else{this.frame=0;this.paint();}};
      this.frame=requestAnimationFrame(tick);
    }
    paint() {
      if(!this.stage)return;
      const p=this.progress=clamp(-this.track.getBoundingClientRect().top/this.span());
      const run=1-Math.pow(1-clamp(p/.50),3), isolate=smooth((p-.36)/.22), cover=smooth((p-.58)/.20), flip=smooth((p-.78)/.22);
      this.stage.style.setProperty('--run',run);
      this.stage.style.setProperty('--isolate',isolate);
      this.stage.style.setProperty('--cover',cover);
      this.stage.style.setProperty('--flip',flip);
      this.stage.style.setProperty('--reveal',smooth((flip-.65)/.35));
      this.$('.front').style.visibility=flip>.5?'hidden':'visible';
      this.$('.back').style.visibility=flip>.5?'visible':'hidden';
      const ready=p>.985;
      this.stage.classList.toggle('ready',ready);
      this.$('.back').inert=!ready;
      this.$('.stamp-target').disabled=!ready;
      const step=stops.findIndex(n=>n>=p-.01);
      this.$('.step').textContent=`0${(step<0?stops.length-1:step)+1} / 0${stops.length}`;
      this.$('.previous').disabled=p<.001;
      this.$('.next').disabled=ready;
      const text=ready?'클릭하여 당신의 초대장에 도장을 찍어주세요.':p>=.78?'초대장의 뒷면을 확인하세요.':p>=.58?'당신만의 초대장을 봉인합니다.':p>=.42?'당신의 초대장이 선택되었습니다.':'스크롤하면 당신의 초대장이 도착합니다.';
      if(this.$('.instruction').textContent!==text)this.$('.instruction').textContent=text;
    }
    stamp() {
      if(this.progress<.985 || this.dialog.open || this.stampPending)return;
      if(this.stamped){this.dialog.showModal();return;}
      this.stamped=true;this.stampPending=true;this.stage.classList.remove('hover-stamp');this.stage.classList.add('stamped');
      this.timer=setTimeout(()=>{this.stampPending=false;this.dialog.showModal();this.$('.confirm').focus();},this.reduced.matches?0:750);
    }
    disconnectedCallback(){this.stop();clearTimeout(this.timer);this.abort?.abort();this.observer?.disconnect();this.abort=null;}
  }
  customElements.define('proovit-ticket-invitation',ProovitTicketInvitation);
})();
