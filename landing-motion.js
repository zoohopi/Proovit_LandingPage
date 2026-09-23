/* Wheel momentum with native touch/keyboard scrolling and nested-scroll escape. */
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let target=0,frame=0,last=0;
  const stop=()=>{cancelAnimationFrame(frame);frame=0;};
  function tick(now){
    const dt=Math.min(50,now-last);last=now;
    const max=document.documentElement.scrollHeight-innerHeight;
    target=Math.max(0,Math.min(max,target));
    const request={from:scrollY,to:target};
    window.dispatchEvent(new CustomEvent('proovit:scroll-target',{detail:request}));
    target=request.to;
    const gap=target-scrollY;
    if(Math.abs(gap)<.6){window.scrollTo({top:target,behavior:'instant'});frame=0;return;}
    // Scroll positions may be integer-rounded. Keep the final steps moving
    // instead of repeatedly requesting a subpixel step that rounds to zero.
    const step=gap*(1-Math.exp(-dt/85));
    const distance=Math.min(Math.abs(gap),Math.max(1,Math.abs(step)));
    window.scrollTo({top:scrollY+Math.sign(gap)*distance,behavior:'instant'});
    frame=requestAnimationFrame(tick);
  }
  window.addEventListener('wheel',e=>{
    if(reduced.matches||e.ctrlKey||e.metaKey||e.defaultPrevented||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
    for(const el of e.composedPath()){
      if(!(el instanceof HTMLElement)||el===document.body||el===document.documentElement)continue;
      if(el.matches('input,textarea,select,[contenteditable="true"]'))return;
      const css=getComputedStyle(el);
      if(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight)return;
    }
    if(!e.cancelable)return;e.preventDefault();
    if(!frame)target=scrollY;
    const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
    target=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,target+delta));
    if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}
  },{passive:false});
  ['touchstart','pointerdown','keydown'].forEach(type=>window.addEventListener(type,stop,{passive:true}));
  reduced.addEventListener('change',stop);
  window.addEventListener('proovit:wheel-capture',stop);
  document.addEventListener('visibilitychange',stop);
})();
