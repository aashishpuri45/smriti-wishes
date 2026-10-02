const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [], width = 0, height = 0, dpr = 1;

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = width + "px"; canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(190, Math.floor(width * height / 6200));
  stars = Array.from({length: count}, () => ({
    x: Math.random() * width, y: Math.random() * height,
    radius: Math.random() * 1.25 + .2, alpha: Math.random() * .65 + .15,
    speed: Math.random() * .18 + .025, phase: Math.random() * Math.PI * 2
  }));
}
function drawStars(time = 0) {
  ctx.clearRect(0, 0, width, height);
  for (const s of stars) {
    const shimmer = .65 + Math.sin(time * .0007 + s.phase) * .35;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224,214,255,${s.alpha * shimmer})`; ctx.fill();
    s.y -= s.speed * .12;
    if (s.y < -2) { s.y = height + 2; s.x = Math.random() * width; }
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); requestAnimationFrame(drawStars);

const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
let musicOn = false;
musicToggle.addEventListener("click", async () => {
  if (!musicOn) {
    try {
      await music.play(); musicOn = true;
      musicToggle.classList.add("playing");
      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Piano playing";
    } catch (err) {
      musicLabel.textContent = "Add piano MP3";
      showToast("Add your piano instrumental as music.mp3, then try again.");
    }
  } else {
    music.pause(); musicOn = false;
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Play piano";
  }
});

document.getElementById("wishButton").addEventListener("click", () =>
  document.getElementById("message").scrollIntoView({behavior:"smooth"}));

const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
document.getElementById("wishStarButton").addEventListener("click", () => {
  showToast("Your wish is on its way, Smriti ✦");
  for (let i = 0; i < 22; i++) {
    const spark = document.createElement("span");
    spark.textContent = Math.random() > .5 ? "✦" : "·";
    spark.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:${Math.random()*75+10}vh;color:#d7c4ff;font-size:${Math.random()*16+8}px;pointer-events:none;z-index:9;opacity:0;animation:reveal .5s ease forwards`;
    document.body.appendChild(spark); setTimeout(() => spark.remove(), 1300);
  }
});

// The gallery works with local image files named in the HTML.
// Missing images show elegant placeholders until the user adds her photos.
document.querySelectorAll(".photo-card").forEach(card => {
  const img = card.querySelector("img");
  img.addEventListener("load", () => card.classList.add("has-photo"));
  img.addEventListener("error", () => card.classList.remove("has-photo"));
  card.addEventListener("click", () => {
    if (!card.classList.contains("has-photo")) {
      showToast("Add this photo in the photos folder to personalize the gallery.");
      return;
    }
    const box = document.getElementById("lightbox");
    document.getElementById("lightboxImage").src = img.src;
    box.classList.add("open"); box.setAttribute("aria-hidden", "false");
  });
});
function closeLightbox() {
  const box = document.getElementById("lightbox");
  box.classList.remove("open"); box.setAttribute("aria-hidden", "true");
  document.getElementById("lightboxImage").src = "";
}
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightbox").addEventListener("click", e => {
  if (e.target.id === "lightbox") closeLightbox();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
