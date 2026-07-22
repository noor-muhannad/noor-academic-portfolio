const root=document.documentElement,body=document.body;
const langBtn=document.getElementById("langToggle"),themeBtn=document.getElementById("themeToggle"),menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
document.getElementById("year").textContent=new Date().getFullYear();

window.addEventListener("load",()=>setTimeout(()=>document.getElementById("introScreen").classList.add("hide"),1100));

function setLang(lang){
  const ar=lang==="ar";
  root.lang=lang;root.dir=ar?"rtl":"ltr";body.classList.toggle("arabic",ar);
  document.querySelectorAll("[data-en]").forEach(el=>el.innerHTML=ar?el.dataset.ar:el.dataset.en);
  langBtn.textContent=ar?"English":"العربية";localStorage.setItem("noor-lang",lang)
}
function setTheme(theme){
  root.dataset.theme=theme;themeBtn.textContent=theme==="dark"?"☀":"☾";localStorage.setItem("noor-theme",theme)
}
setLang(localStorage.getItem("noor-lang")||((navigator.language||"").startsWith("ar")?"ar":"en"));
setTheme(localStorage.getItem("noor-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
langBtn.onclick=()=>setLang(root.lang==="ar"?"en":"ar");
themeBtn.onclick=()=>setTheme(root.dataset.theme==="dark"?"light":"dark");
menuBtn.onclick=()=>nav.classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a=>a.onclick=()=>nav.classList.remove("open"));

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add("visible");
    e.target.querySelectorAll?.("[data-count]").forEach(counter=>{
      const target=+counter.dataset.count;let current=0;const step=Math.max(1,Math.ceil(target/35));
      const timer=setInterval(()=>{current=Math.min(target,current+step);counter.textContent=current+(target>=10?"+":"");if(current>=target)clearInterval(timer)},35)
    });
    io.unobserve(e.target)
  }
}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(e=>io.observe(e));

addEventListener("scroll",()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  document.getElementById("scrollProgress").style.width=(max?scrollY/max*100:0)+"%"
});

const glow=document.getElementById("cursorGlow");
if(matchMedia("(pointer:fine)").matches){
  body.addEventListener("mousemove",e=>{glow.style.opacity=1;glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"})
}

const canvas=document.getElementById("networkCanvas"),ctx=canvas.getContext("2d");
let pts=[],w=0,h=0;
function resize(){
  const dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;
  canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);
  pts=Array.from({length:Math.max(28,Math.min(70,Math.floor(w/22)))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.6+.7}))
}
function draw(){
  ctx.clearRect(0,0,w,h);const dark=root.dataset.theme==="dark";
  const dc=dark?"rgba(148,183,229,.3)":"rgba(23,63,111,.2)",lc=dark?"rgba(239,77,121,.10)":"rgba(159,18,57,.08)";
  pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<-10||p.x>w+10)p.vx*=-1;if(p.y<-10||p.y>h+10)p.vy*=-1;ctx.beginPath();ctx.fillStyle=dc;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);if(d<125){ctx.beginPath();ctx.strokeStyle=lc;ctx.lineWidth=1-d/125;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke()}}
  requestAnimationFrame(draw)
}
resize();draw();addEventListener("resize",resize);

const qrUrl="https://noor-muhannad.github.io/noor-academic-portfolio/";
const qr=document.createElement("img");qr.className="qr-image";qr.alt="Portfolio QR";qr.src="https://api.qrserver.com/v1/create-qr-code/?size=230x230&data="+encodeURIComponent(qrUrl);
document.getElementById("qrcode").appendChild(qr);
