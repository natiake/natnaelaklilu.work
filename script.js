// Basic site interactions: typing effect, smooth scroll for CTA, reveal on scroll, particle background, back-to-top

document.addEventListener('DOMContentLoaded', () => {
  // Typing / rotating subtitle
  const words = ["Learning.", "Building.", "Growing."];
  const el = document.getElementById('typing');
  let wi = 0, ci = 0, forward = true;

  function typeLoop(){
    const word = words[wi];
    if(forward){
      el.textContent = word.slice(0, ++ci);
      if(ci === word.length){ forward = false; setTimeout(typeLoop, 900); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if(ci === 0){ forward = true; wi = (wi+1) % words.length; }
    }
    setTimeout(typeLoop, forward ? 80 : 40);
  }
  typeLoop();

  // CTA scroll
  document.getElementById('view-work').addEventListener('click', () => {
    document.getElementById('projects').scrollIntoView({behavior:'smooth', block:'start'});
  });

  // IntersectionObserver reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(n => obs.observe(n));

  // Back to top button
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 600) backTop.style.display = 'block';
    else backTop.style.display = 'none';
  });
  backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Particle background
  initParticles();
});

/* PARTICLES: lightweight network */
function initParticles(){
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;

  function resize(){
    dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const count = Math.max(20, Math.floor((innerWidth*innerHeight)/90000));
  const points = [];
  for(let i=0;i<count;i++){
    points.push({
      x: Math.random()*innerWidth,
      y: Math.random()*innerHeight,
      vx: (Math.random()-0.5) * 0.4,
      vy: (Math.random()-0.5) * 0.4,
      r: Math.random()*1.6 + 0.6
    });
  }

  function draw(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    // lines
    for(let i=0;i<points.length;i++){
      for(let j=i+1;j<points.length;j++){
        const a = points[i], b = points[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 140){
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(18,199,192,${1 - dist/140})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    // points
    for(const p of points){
      ctx.beginPath();
      ctx.fillStyle = 'rgba(15,225,210,0.9)';
      ctx.globalAlpha = 0.07;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function step(){
    for(const p of points){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = innerWidth + 20;
      if(p.x > innerWidth + 20) p.x = -20;
      if(p.y < -20) p.y = innerHeight + 20;
      if(p.y > innerHeight + 20) p.y = -20;
    }
    draw();
    requestAnimationFrame(step);
  }
  step();
}