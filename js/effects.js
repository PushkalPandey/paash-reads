// Twinkling starfield on the background canvas
function initStars() {
  const canvas = document.getElementById("star-canvas");
  const ctx    = canvas.getContext("2d");
  let stars    = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 130 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.2 + 0.2,
      a:  Math.random(),
      da: (Math.random() * 0.5 + 0.2) * (Math.random() < 0.5 ? 1 : -1) * 0.007,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a > 1 || s.a < 0) s.da *= -1;
      ctx.globalAlpha = Math.max(0, Math.min(1, s.a));
      ctx.fillStyle   = "#fff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}

// Floating petals that drift down the screen
function initPetals() {
  const glyphs = ["🌸", "🌷", "✿", "❀", "🌹", "✦"];

  function spawn() {
    const el = document.createElement("div");
    el.className   = "petal";
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const dur = Math.random() * 12 + 9;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 10 + 7}px;
      animation-duration: ${dur}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 500);
  }

  spawn();
  setInterval(spawn, 1800);
}
