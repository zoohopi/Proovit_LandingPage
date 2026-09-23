(() => {
  const entries=[
    ['421번','랜딩 카피 · 24일째','제목만 세 번 고쳤습니다 😅 그래도 초안 하나 올리고 나니 내일 뭘 할지는 선명해졌어요.','김'],
    ['93번','온보딩 메일 · 22일째','아침에 인증부터 끝내두면 하루가 확실히 가벼워요 ☀️ 이번엔 마지막 날까지 가봅니다!','이'],
    ['208번','버그 수정 · 21일째','거창한 기능 대신 버그 세 개. 작게 정해두니 바쁜 날에도 어떻게든 하게 되더라고요.','박'],
    ['34번','빌드 로그 · 18일째','다른 분들 기록 구경하다가 노트북을 다시 열었어요... 오늘 것도 제출 완료 ✅','최'],
    ['776번','가격 실험 · 21일째','혼자 만들 땐 계속 미루던 실험인데요~ 이번 주에 드디어 첫 결과를 봤습니다 🎉','정'],
    ['142번','글쓰기 · 27일째','첫 글이랑 오늘 글을 나란히 놓고 봤어요. 매일 조금씩 쓴 게 이렇게 쌓이네요 🙂','윤'],
    ['602번','개발 기록 · 12일째','퇴근이 늦어서 딱 20분. 그래도 인증은 했습니다. 끊기지만 말자는 마음으로요.','한'],
    ['908번','콜드메일 · 26일째','오늘 보낸 메일에 첫 답장이 왔어요!! 숫자보다 이 작은 반응이 훨씬 신나네요 😆','서'],
    ['79번','유저 인터뷰 · 19일째','질문을 짧게 바꿨더니 인터뷰가 훨씬 자연스러워졌어요. 오늘 배운 것도 기록 🔖','임']
  ];
  class ProovitCommunity extends HTMLElement {
    constructor(){super();this.attachShadow({mode:'open'});}
    connectedCallback(){
      const card=([id,role,text,initial],copy)=>`<article ${copy?'aria-hidden="true"':''}><p>${text}</p><footer><span class="avatar">${initial}</span><div><strong>참가번호 ${id}</strong><small>${role}</small></div><span class="dot" aria-hidden="true"></span></footer></article>`;
      this.shadowRoot.innerHTML=`<style>
      :host{display:block;color:#f4ede4;font-family:inherit}*{box-sizing:border-box}.wrap{max-width:1120px;margin:auto;padding:70px 24px 20px}header{text-align:center;max-width:600px;margin:0 auto 40px}.tag{font-size:11px;color:#ff9cbe;border:1px solid #ff6ba033;border-radius:30px;padding:8px 14px;display:inline-block}h2{font-size:clamp(26px,3.6vw,40px);line-height:1.35;letter-spacing:-.04em;margin:20px 0 14px;word-break:keep-all}header p{color:#a99c97;font-size:14px;line-height:1.7}.columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;height:640px;overflow:hidden;mask-image:linear-gradient(transparent,#000 12%,#000 85%,transparent)}.track{animation:rise var(--duration) linear infinite;animation-play-state:paused}.running .track{animation-play-state:running}.columns:focus-within .track{animation-play-state:paused}.group{display:grid;gap:20px;padding-bottom:20px}article{background:linear-gradient(145deg,#221615,#130e0e);border:1px solid #ffffff12;border-radius:22px;padding:26px 24px;text-align:left;box-shadow:0 15px 30px #0002}article p{font-size:15px;line-height:1.9;color:#d8ccc6;margin:0 0 26px;word-break:keep-all}footer{display:flex;align-items:center;gap:12px}.avatar{width:42px;height:42px;flex-shrink:0;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#734635,#302039);color:#ffd6bc;font-size:14px}strong{font-size:12px}small{display:block;font-size:11px;color:#8e8480;margin-top:6px}.dot{margin-left:auto;width:6px;height:6px;background:#ff6ba0;border-radius:50%;box-shadow:0 0 10px #ff6ba050}.foot{display:flex;gap:16px;align-items:center;justify-content:center;margin-top:20px;font-size:11px;color:#8e8480}button{font:inherit;color:#beb0aa;border:1px solid #ffffff25;border-radius:20px;background:#ffffff05;padding:8px 12px;cursor:pointer}button:focus-visible{outline:2px solid #ff6ba0}@keyframes rise{to{transform:translateY(-50%)}}@media(max-width:900px){.columns{grid-template-columns:repeat(2,minmax(0,1fr))}.column:nth-child(3){display:none}}@media(max-width:600px){.wrap{padding:50px 22px 0}.columns{grid-template-columns:1fr;height:590px;max-width:380px;margin:auto}.column:nth-child(2){display:none}.foot{flex-direction:column;gap:10px}}@media(prefers-reduced-motion:reduce){.track{animation:none!important}.group[aria-hidden]{display:none}.columns{overflow-y:auto;mask-image:none}}
      </style><div class="wrap"><header><span class="tag">함께 쌓아가는 오늘의 기록</span><h2>각자의 목표로,<br>같은 하루를 채우고 있습니다.</h2><p>작은 실행을 이어가는 프루버들의 이야기</p></header><div class="columns">${[0,1,2].map((n)=>`<div class="column"><div class="track" style="--duration:${[26,32,29][n]}s;animation-delay:${[-5,-24,-10][n]}s"><div class="group">${entries.slice(n*3,n*3+3).map(x=>card(x,false)).join('')}</div><div class="group" aria-hidden="true">${entries.slice(n*3,n*3+3).map(x=>card(x,true)).join('')}</div></div></div>`).join('')}</div><div class="foot"><span>참여 모습과 후기 문구는 연출용 예시입니다.</span><button type="button" aria-pressed="false">흐름 일시정지</button></div></div>`;
      this.paused=false;this.abort=new AbortController();this.visible=false;
      this.update=()=>this.shadowRoot.querySelector('.wrap').classList.toggle('running',this.visible&&!this.paused&&!document.hidden);
      this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.update();});this.observer.observe(this);
      document.addEventListener('visibilitychange',this.update,{signal:this.abort.signal});
      this.shadowRoot.querySelector('button').addEventListener('click',e=>{this.paused=!this.paused;e.currentTarget.textContent=this.paused?'흐름 재생':'흐름 일시정지';e.currentTarget.setAttribute('aria-pressed',String(this.paused));this.update();},{signal:this.abort.signal});
    }
    disconnectedCallback(){this.abort?.abort();this.observer?.disconnect();}
  }
  if(!customElements.get('proovit-community'))customElements.define('proovit-community',ProovitCommunity);
})();
