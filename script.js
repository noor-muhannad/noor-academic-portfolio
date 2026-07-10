
const root=document.documentElement, body=document.body;
const langBtn=document.getElementById("langToggle"),themeBtn=document.getElementById("themeToggle"),menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
document.getElementById("year").textContent=new Date().getFullYear();
function setLang(lang){const ar=lang==="ar";root.lang=lang;root.dir=ar?"rtl":"ltr";body.classList.toggle("arabic",ar);document.querySelectorAll("[data-en]").forEach(el=>{el.innerHTML=ar?el.dataset.ar:el.dataset.en});langBtn.textContent=ar?"English":"العربية";localStorage.setItem("noor-lang",lang)}
function setTheme(theme){root.dataset.theme=theme;themeBtn.textContent=theme==="dark"?"☀":"☾";localStorage.setItem("noor-theme",theme)}
setLang(localStorage.getItem("noor-lang")||((navigator.language||"").startsWith("ar")?"ar":"en"));
setTheme(localStorage.getItem("noor-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
langBtn.onclick=()=>setLang(root.lang==="ar"?"en":"ar");themeBtn.onclick=()=>setTheme(root.dataset.theme==="dark"?"light":"dark");
menuBtn.onclick=()=>nav.classList.toggle("open");document.querySelectorAll(".nav a").forEach(a=>a.onclick=()=>nav.classList.remove("open"));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll(".reveal").forEach(e=>io.observe(e));
addEventListener("scroll",()=>{const m=document.documentElement.scrollHeight-innerHeight;document.getElementById("scrollProgress").style.width=(m?scrollY/m*100:0)+"%"});
if(document.getElementById("qrcode")){const url=location.hostname?location.href.replace("contact.html",""):"https://noor-muhannad.github.io/noor-academic-portfolio/";const img=document.createElement("img");img.alt="QR Code";img.src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data="+encodeURIComponent(url);document.getElementById("qrcode").appendChild(img);document.getElementById("qrText").textContent=url}


// Soft cursor glow
const cursorGlow = document.getElementById("cursorGlow");
if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
  });
}

// Animated cyber network background
const cyberCanvas = document.getElementById("cyberCanvas");
if (cyberCanvas) {
  const ctx = cyberCanvas.getContext("2d");
  let points = [];
  let width = 0;
  let height = 0;
  let rafId;

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    cyberCanvas.width = width * dpr;
    cyberCanvas.height = height * dpr;
    cyberCanvas.style.width = width + "px";
    cyberCanvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(28, Math.min(70, Math.floor(width / 22)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.7
    }));
  };

  const drawNetwork = () => {
    ctx.clearRect(0, 0, width, height);
    const dark = document.documentElement.dataset.theme === "dark";
    const dotColor = dark ? "rgba(148,183,229,.34)" : "rgba(23,63,111,.22)";
    const lineColor = dark ? "rgba(239,77,121,.10)" : "rgba(159,18,57,.08)";

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10 || p.x > width + 10) p.vx *= -1;
      if (p.y < -10 || p.y > height + 10) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = dotColor;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 125) {
          ctx.beginPath();
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1 - dist / 125;
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(drawNetwork);
  };

  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", resizeCanvas);
}

// Subtle tilt effect for interactive cards
document.querySelectorAll(".card,.project-card,.certificate-card,.publication,.conference").forEach(card => {
  if (!window.matchMedia("(pointer:fine)").matches) return;
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 3.5}deg) rotateX(${-y * 3.5}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
