const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let Component,now=1000,reduced=false;
const pending=[];
function element(){return {style:{},classList:{toggle(){}},innerHTML:'',textContent:'',disabled:false,addEventListener(){},insertAdjacentHTML(){},getBoundingClientRect:()=>({top:30,bottom:830,height:800}),getAnimations:()=>[],animate(frames,options){let resolve;const finished=new Promise(r=>resolve=r);const a={frames,options,finished,cancel(){resolve();}};pending.push({a,resolve});return a;}};}
const elements={'.receipt':element(),'.story':element(),'.count':element(),'.wrap':element(),'.controls':element()};
const buttons=[element(),element()],dots=[element(),element()];
class HTMLElement{constructor(){this.isConnected=true;this.events={};}attachShadow(){this.shadowRoot={innerHTML:'',querySelector:s=>elements[s],querySelectorAll:s=>s==='button'?buttons:s==='.wheel-progress i'?dots:s==='.receipt,.story'?[elements['.receipt'],elements['.story']]:[],append(){}};}addEventListener(name,fn){this.events[name]=fn;}}
const context={HTMLElement,AbortController,Event,document:{createElement:()=>({})},window:{dispatchEvent(){}},innerHeight:900,scrollY:0,scrollTo(){},performance:{now:()=>now},matchMedia:()=>({matches:reduced}),getComputedStyle:()=>({transform:'none',opacity:'1'}),customElements:{get:()=>null,define:(name,C)=>Component=C}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'..','reviews-stage.js'),'utf8'),context);
const c=new Component();c.connectedCallback();
function wheel(delta,advance=400){now+=advance;let prevented=false;c.events.wheel({deltaY:delta,deltaX:0,deltaMode:0,cancelable:true,preventDefault(){prevented=true;},stopPropagation(){}});return prevented;}
async function finish(){for(let i=0;i<5;i++){pending.splice(0).forEach(p=>p.resolve());await Promise.resolve();}}
(async()=>{
assert.equal(c.active,0);
wheel(120);assert.equal(c.wheelPhase,1);assert.equal(c.active,0);
wheel(120,50);assert.equal(c.wheelPhase,1,'momentum burst must not skip phases');
wheel(9000);assert.equal(c.wheelPhase,2);assert.equal(c.transitioning,true);assert.equal(c.active,0,'large delta must not skip a card');
wheel(120);assert.equal(c.wheelPhase,2,'transition locks further wheel input');
await finish();assert.equal(c.active,1);assert.equal(c.wheelPhase,0);assert.equal(c.transitioning,false);
wheel(-120);assert.equal(c.wheelPhase,1);wheel(-120);assert.equal(c.wheelPhase,2);await finish();assert.equal(c.active,0);
wheel(120);assert.equal(c.wheelPhase,1);assert.equal(wheel(-120),false);assert.equal(c.wheelPhase,0,'reversing at first card restores resting state');
reduced=true;wheel(120);wheel(120);assert.equal(c.active,1);assert.equal(c.wheelPhase,0);
assert.equal(elements['.count'].textContent,'2 / 3');
wheel(120);wheel(120);assert.equal(c.active,2);assert.equal(elements['.count'].textContent,'3 / 3');
assert.equal(wheel(120),false,'last card releases wheel to the next section');
c.disconnectedCallback();
console.log('PASS: 2 wheel poses, 3 cards, momentum guard, oversized delta, transition lock, reverse, boundary release, reduced motion, cleanup');
})().catch(e=>{console.error(e);process.exitCode=1;});
