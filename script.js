/* ===== LOGO DROP INTRO ===== */
(function() {
  const drop = document.getElementById('logoDrop');
  if (!drop) return;

  // Cuando termina el fade-out del overlay → habilitar scroll y eliminar nodo
  setTimeout(() => {
    document.documentElement.classList.remove('intro-loading');
    drop.remove();
  }, 3100);
})();

/* ===== CURSOR ===== */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .cat-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.8)';
    follower.style.borderColor = 'rgba(201,168,76,0.7)';
    follower.style.background = 'rgba(201,168,76,0.06)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.borderColor = 'rgba(201,168,76,0.4)';
    follower.style.background = 'transparent';
  });
});

/* ===== PARTICLES CANVAS ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '#C9A84C' : '#F0D080';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#C9A84C';
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  if (!open) {
    Object.assign(navLinks.style, {
      flexDirection: 'column',
      position: 'absolute',
      top: '100%', left: 0, right: 0,
      background: 'rgba(10,10,10,0.98)',
      padding: '1.5rem 5%',
      borderBottom: '1px solid rgba(201,168,76,0.2)'
    });
  } else {
    navLinks.removeAttribute('style');
  }
});

/* ===== SCROLL REVEAL ===== */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}
initReveal();

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, +e.target.dataset.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ===== TAB SWITCHING ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('tab-' + target);
    panel.classList.add('active');
    // Ensure category view is shown when switching tabs
    const catView = document.getElementById('cat-view-' + target);
    const prodView = document.getElementById('prod-view-' + target);
    if (catView) catView.classList.remove('hidden');
    if (prodView) prodView.classList.add('hidden');
    setTimeout(initReveal, 50);
  });
});

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    if (navLinks.style.display === 'flex' && window.innerWidth < 768) {
      navLinks.removeAttribute('style');
    }
  });
});

/* ===================================================
   SUPABASE — configuración
=================================================== */
const SUPA_URL = 'https://mecicdtcofqdleoplqed.supabase.co';
const SUPA_KEY = 'sb_publishable_7Nh_oq9MDKCOxkP8PDbQyg_s7JeDE-4';
const sbClient = supabase.createClient(SUPA_URL, SUPA_KEY);

/* ===================================================
   CATALOG DATA — fallback si Supabase no tiene datos
=================================================== */
const DEFAULT_CATALOG = {
  /* -------- CABALLERO -------- */
  gorras: {
    label: 'Gorras', icon: '🧢', isDama: false,
    products: [
      { name: 'Gorra Snapback', price: '$45.000', img: 'images/Gorras/gorra1.jpg', badge: 'NUEVO', waText: 'la gorra snapback' },
      { name: 'Gorra Dad Hat',  price: '$40.000', img: 'images/Gorras/gorra2.jpg', waText: 'la gorra dad hat' },
      { name: 'Gorra Trucker',  price: '$42.000', img: 'images/Gorras/gorra3.jpg', waText: 'la gorra trucker' },
      { name: 'Gorra Premium',  price: '$50.000', img: 'images/Gorras/gorra4.jpg', badge: 'TOP', waText: 'la gorra premium' },
    ]
  },
  relojes: {
    label: 'Relojes', icon: '⌚', isDama: false,
    products: [
      { name: 'Reloj Urbano',   price: '$80.000', img: 'images/Relojes/reloj1.jpg', badge: 'TOP', waText: 'el reloj urbano' },
      { name: 'Reloj Clásico',  price: '$75.000', img: 'images/Relojes/reloj2.jpg', waText: 'el reloj clásico' },
      { name: 'Reloj Sport',    price: '$70.000', img: 'images/Relojes/reloj3.jpg', waText: 'el reloj sport' },
      { name: 'Reloj Dorado',   price: '$85.000', img: 'images/Relojes/reloj4.jpg', badge: 'NUEVO', waText: 'el reloj dorado' },
    ]
  },
  gafas: {
    label: 'Gafas', icon: '🕶️', isDama: false,
    products: [
      { name: 'Gafas Wayfarer', price: '$35.000', img: 'images/Gafas/gafa1.jpg', waText: 'las gafas wayfarer' },
      { name: 'Gafas Aviador',  price: '$38.000', img: 'images/Gafas/gafa2.jpg', badge: 'TOP', waText: 'las gafas aviador' },
      { name: 'Gafas Cuadradas',price: '$36.000', img: 'images/Gafas/gafa3.jpg', waText: 'las gafas cuadradas' },
    ]
  },
  camisetas: {
    label: 'Camisetas', icon: '👕', isDama: false,
    products: [
      { name: 'Camiseta Oversize', price: '$55.000', img: 'images/Camisetas/camiseta1.jpg', badge: 'HOT', waText: 'la camiseta oversize' },
      { name: 'Camiseta Urbana',   price: '$50.000', img: 'images/Camisetas/camiseta2.jpg', waText: 'la camiseta urbana' },
      { name: 'Camiseta Tela Fría',price: '$48.000', img: 'images/Camisetas/camiseta3.jpg', waText: 'la camiseta tela fría' },
      { name: 'Camiseta Estampada',price: '$52.000', img: 'images/Camisetas/camiseta4.jpg', badge: 'NUEVO', waText: 'la camiseta estampada' },
    ]
  },
  busos: {
    label: 'Busos', icon: '🧥', isDama: false,
    products: [
      { name: 'Buso Hoodie',       price: '$85.000', img: 'images/Busos/buso1.jpg', badge: 'TOP', waText: 'el buso hoodie' },
      { name: 'Buso Cuello Redondo', price: '$75.000', img: 'images/Busos/buso2.jpg', waText: 'el buso cuello redondo' },
      { name: 'Buso Slim',         price: '$78.000', img: 'images/Busos/buso3.jpg', waText: 'el buso slim' },
    ]
  },
  canguros: {
    label: 'Canguros', icon: '🦘', isDama: false,
    products: [
      { name: 'Canguro Urban',  price: '$80.000', img: 'images/Canguros/canguro1.jpg', badge: 'NUEVO', waText: 'el canguro urban' },
      { name: 'Canguro Classic',price: '$75.000', img: 'images/Canguros/canguro2.jpg', waText: 'el canguro classic' },
    ]
  },
  jeans: {
    label: 'Jeans', icon: '👖', isDama: false,
    products: [
      { name: 'Jean Slim',    price: '$90.000', img: 'images/Jeans/jean1.jpg', badge: 'NUEVO', waText: 'el jean slim' },
      { name: 'Jean Baggy',   price: '$95.000', img: 'images/Jeans/jean2.jpg', badge: 'HOT', waText: 'el jean baggy' },
      { name: 'Jean Clásico', price: '$85.000', img: 'images/Jeans/jean3.jpg', waText: 'el jean clásico' },
    ]
  },
  mochos: {
    label: 'Mochos', icon: '🩳', isDama: false,
    products: [
      { name: 'Mocho Cargo',  price: '$60.000', img: 'images/Mochos/mocho1.jpg', waText: 'el mocho cargo' },
      { name: 'Mocho Classic',price: '$55.000', img: 'images/Mochos/mocho2.jpg', waText: 'el mocho classic' },
    ]
  },
  pantalonetas: {
    label: 'Pantalonetas', icon: '🏃', isDama: false,
    products: [
      { name: 'Pantaloneta Sport', price: '$45.000', img: 'images/Pantalonetas/pantaloneta1.jpg', waText: 'la pantaloneta sport' },
      { name: 'Pantaloneta Urban', price: '$48.000', img: 'images/Pantalonetas/pantaloneta2.jpg', badge: 'NUEVO', waText: 'la pantaloneta urban' },
    ]
  },
  polos: {
    label: 'Polos', icon: '👔', isDama: false,
    products: [
      { name: 'Polo Clásico',   price: '$65.000', img: 'images/Polos/polo1.jpg', waText: 'el polo clásico' },
      { name: 'Polo Slim Fit',  price: '$68.000', img: 'images/Polos/polo2.jpg', badge: 'TOP', waText: 'el polo slim fit' },
    ]
  },
  conjuntos: {
    label: 'Conjuntos', icon: '🤝', isDama: false,
    products: [
      { name: 'Conjunto Urban',  price: '$130.000', img: 'images/Conjuntos/conjunto1.jpg', badge: 'COMBO', waText: 'el conjunto urban' },
      { name: 'Conjunto Sport',  price: '$125.000', img: 'images/Conjuntos/conjunto2.jpg', waText: 'el conjunto sport' },
    ]
  },
  correas: {
    label: 'Correas', icon: '🪡', isDama: false,
    products: [
      { name: 'Correa de Cuero',   price: '$35.000', img: 'images/Correas/correa1.jpg', waText: 'la correa de cuero' },
      { name: 'Correa Reversible', price: '$38.000', img: 'images/Correas/correa2.jpg', badge: 'NUEVO', waText: 'la correa reversible' },
    ]
  },
  morrales: {
    label: 'Morrales', icon: '🎒', isDama: false,
    products: [
      { name: 'Morral Urban',    price: '$70.000', img: 'images/Morrales/morral1.jpg', badge: 'TOP', waText: 'el morral urban' },
      { name: 'Morral Escolar',  price: '$65.000', img: 'images/Morrales/morral2.jpg', waText: 'el morral escolar' },
    ]
  },
  carrieles: {
    label: 'Carrieles', icon: '🧳', isDama: false,
    products: [
      { name: 'Cariel Paisa',    price: '$120.000', img: 'images/Carrieles/cariel1.jpg', badge: 'EXCLUSIVO', waText: 'el cariel paisa' },
      { name: 'Cariel Moderno',  price: '$110.000', img: 'images/Carrieles/cariel2.jpg', waText: 'el cariel moderno' },
    ]
  },
  pulseras: {
    label: 'Pulseras', icon: '💎', isDama: false,
    products: [
      { name: 'Pulsera Premium', price: '$25.000', img: 'images/Pulseras/pulsera1.jpg', badge: 'NUEVO', waText: 'la pulsera premium' },
      { name: 'Pulsera Dorada',  price: '$28.000', img: 'images/Pulseras/pulsera2.jpg', waText: 'la pulsera dorada' },
      { name: 'Pulsera Plata',   price: '$26.000', img: 'images/Pulseras/pulsera3.jpg', waText: 'la pulsera de plata' },
    ]
  },
  billeteras: {
    label: 'Billeteras', icon: '👛', isDama: false,
    products: [
      { name: 'Billetera Slim',   price: '$30.000', img: 'images/Billeteras/billetera1.jpg', waText: 'la billetera slim' },
      { name: 'Billetera Cuero',  price: '$45.000', img: 'images/Billeteras/billetera2.jpg', badge: 'TOP', waText: 'la billetera de cuero' },
      { name: 'Billetera Doble',  price: '$38.000', img: 'images/Billeteras/billetera3.jpg', waText: 'la billetera doble' },
    ]
  },
  perfumes: {
    label: 'Perfumes', icon: '🌿', isDama: false,
    products: [
      { name: 'Perfume Masculino', price: '$55.000', img: 'images/Perfumes/perfume1.jpg', badge: 'TOP', waText: 'el perfume masculino' },
      { name: 'Perfume Intenso',   price: '$60.000', img: 'images/Perfumes/perfume2.jpg', waText: 'el perfume intenso' },
      { name: 'Perfume Fresco',    price: '$52.000', img: 'images/Perfumes/perfume3.jpg', waText: 'el perfume fresco' },
    ]
  },

  /* -------- DAMA -------- */
  'relojes-dama': {
    label: 'Relojes', icon: '⌚', isDama: true,
    products: [
      { name: 'Reloj Delicado',  price: '$75.000', img: 'images/Relojes Dama/reloj_dama1.jpg', badge: 'NUEVO', waText: 'el reloj dama delicado' },
      { name: 'Reloj Elegante',  price: '$80.000', img: 'images/Relojes Dama/reloj_dama2.jpg', waText: 'el reloj dama elegante' },
      { name: 'Reloj Rosado',    price: '$78.000', img: 'images/Relojes Dama/reloj_dama3.jpg', badge: 'TOP', waText: 'el reloj dama rosado' },
    ]
  },
  'gafas-dama': {
    label: 'Gafas', icon: '🕶️', isDama: true,
    products: [
      { name: 'Gafas Cat Eye',     price: '$35.000', img: 'images/Gafas Dama/gafa_dama1.jpg', badge: 'NUEVO', waText: 'las gafas dama cat eye' },
      { name: 'Gafas Mariposa',    price: '$37.000', img: 'images/Gafas Dama/gafa_dama2.jpg', waText: 'las gafas dama mariposa' },
    ]
  },
  'busos-dama': {
    label: 'Busos', icon: '🧥', isDama: true,
    products: [
      { name: 'Buso Femenino',    price: '$75.000', img: 'images/Busos Dama/buso_dama1.jpg', badge: 'NUEVO', waText: 'el buso dama' },
      { name: 'Buso Cropped',     price: '$70.000', img: 'images/Busos Dama/buso_dama2.jpg', waText: 'el buso dama cropped' },
    ]
  },
  bolsos: {
    label: 'Bolsos', icon: '👜', isDama: true,
    products: [
      { name: 'Bolso Mini',     price: '$65.000', img: 'images/Bolsos/bolso1.jpg', badge: 'NUEVO', waText: 'el bolso mini' },
      { name: 'Bolso Tote',     price: '$80.000', img: 'images/Bolsos/bolso2.jpg', waText: 'el bolso tote' },
      { name: 'Bolso Clutch',   price: '$55.000', img: 'images/Bolsos/bolso3.jpg', badge: 'TOP', waText: 'el bolso clutch' },
    ]
  },
  'correas-dama': {
    label: 'Correas', icon: '🪡', isDama: true,
    products: [
      { name: 'Correa Femenina', price: '$30.000', img: 'images/Correas Dama/correa_dama1.jpg', badge: 'NUEVO', waText: 'la correa dama' },
      { name: 'Correa Lazo',     price: '$28.000', img: 'images/Correas Dama/correa_dama2.jpg', waText: 'la correa dama lazo' },
    ]
  },
  'perfumes-dama': {
    label: 'Perfumes', icon: '🌸', isDama: true,
    products: [
      { name: 'Perfume Floral',  price: '$55.000', img: 'images/Perfumes Dama/perfume_dama1.jpg', badge: 'TOP', waText: 'el perfume floral' },
      { name: 'Perfume Dulce',   price: '$50.000', img: 'images/Perfumes Dama/perfume_dama2.jpg', waText: 'el perfume dulce' },
      { name: 'Perfume Intenso', price: '$58.000', img: 'images/Perfumes Dama/perfume_dama3.jpg', waText: 'el perfume dama intenso' },
    ]
  },
  'billeteras-dama': {
    label: 'Billeteras', icon: '👛', isDama: true,
    products: [
      { name: 'Billetera Elegante', price: '$35.000', img: 'images/Billeteras Dama/billetera_dama1.jpg', badge: 'NUEVO', waText: 'la billetera dama elegante' },
      { name: 'Billetera Color',    price: '$32.000', img: 'images/Billeteras Dama/billetera_dama2.jpg', waText: 'la billetera dama de color' },
    ]
  }
}; // end DEFAULT_CATALOG

// Si CATALOG aún no cargó cuando se use, fallback a DEFAULT
function getCatalog() { return CATALOG || DEFAULT_CATALOG; }


function buildProductCard(p, isDama) {
  const accentClass = isDama ? 'dama-card' : '';
  const badgeHtml = p.badge ? `<div class="product-badge${isDama ? ' badge-dama' : ''}">${p.badge}</div>` : '';
  const waUrl = `https://wa.me/573122281686?text=Hola!%20quiero%20pedir%20${encodeURIComponent(p.waText)}`;
  const btnClass = isDama ? 'product-wa-btn dama-btn' : 'product-wa-btn';
  const cartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6" stroke-linecap="round"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 10a4 4 0 01-8 0"/></svg>`;
  return `
    <div class="product-card ${accentClass} fade-in">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" class="product-img"
             onerror="this.parentElement.classList.add('no-img')">
        <div class="product-img-fallback">${getCatalog()[currentCatKey]?.icon || '📦'}</div>
        ${badgeHtml}
        <button class="add-to-cart-btn"
          data-name="${p.name}"
          data-price="${p.price}"
          data-img="${p.img}"
          data-cat="${getCatalog()[currentCatKey]?.label || ''}"
          data-isdama="${isDama}">
          ${cartIcon} Agregar
        </button>
      </div>
      <div class="product-info">
        <h4 class="product-name">${p.name}</h4>
        <div class="product-price-row">
          <span class="product-price">${p.price}</span>
          <a href="${waUrl}" target="_blank" class="${btnClass}">Pedir →</a>
        </div>
      </div>
    </div>`;
}

/* ===== CTA CARD (ver más en WA) ===== */
function buildCtaCard(label, catKey, isDama) {
  const waMsg = encodeURIComponent(`Hola! quiero ver el catálogo completo de ${label}`);
  const waUrl = `https://wa.me/573122281686?text=${waMsg}`;
  const btnStyle = isDama ? `style="background:var(--dama)"` : '';
  const cardClass = isDama ? 'product-card product-card--cta dama-card' : 'product-card product-card--cta';
  return `
    <div class="${cardClass} fade-in">
      <div class="product-cta-inner">
        <span class="product-cta-icon">${getCatalog()[catKey]?.icon || '📦'}</span>
        <p>¿Querés ver más ${label.toLowerCase()}?</p>
        <a href="${waUrl}" target="_blank" class="btn-gold" ${btnStyle}>Ver todos →</a>
      </div>
    </div>`;
}

/* ===== CATEGORY CARD TILT ===== */
document.querySelectorAll('.cat-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    card.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${-y}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transformStyle = '';
  });
});

/* ===== CATEGORY CLICK — open product view ===== */
let currentCatKey = '';

document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const catKey = card.dataset.cat;
    const panel  = card.dataset.panel;
    currentCatKey = catKey;
    const data = getCatalog()[catKey];
    if (!data) return;

    const catView  = document.getElementById('cat-view-' + panel);
    const prodView = document.getElementById('prod-view-' + panel);
    const gridEl   = document.getElementById('products-' + panel);
    const titleEl  = document.getElementById('prod-title-' + panel);
    const iconEl   = document.getElementById('prod-icon-' + panel);
    const backBtn  = prodView.querySelector('.back-btn');

    titleEl.textContent = data.label;
    iconEl.textContent  = data.icon;
    if (data.isDama) backBtn.classList.add('dama-back');
    else backBtn.classList.remove('dama-back');

    // Loading
    gridEl.innerHTML = `<div class="cat-loading"><span class="cat-loading-dot"></span><span class="cat-loading-dot"></span><span class="cat-loading-dot"></span></div>`;
    catView.classList.add('hidden');
    prodView.classList.remove('hidden');
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Cargar desde Supabase
    sbClient
      .from('productos')
      .select('*')
      .eq('categoria', catKey)
      .eq('activo', true)
      .order('created_at', { ascending: true })
      .then(({ data: rows, error }) => {
        let html = '';

        if (error || !rows || rows.length === 0) {
          // Sin productos en Supabase → mostrar "Próximamente"
          html = `<div class="no-products-msg">
            <span style="font-size:3rem;opacity:0.3">${data.icon}</span>
            <p>Próximamente</p>
            <span>Este catálogo estará disponible muy pronto</span>
          </div>`;
        } else {
          rows.forEach(row => {
            const p = {
              name:    row.nombre,
              price:   row.precio,
              img:     row.imagen_url || '',
              badge:   row.badge,
              waText:  row.wa_text || row.nombre.toLowerCase(),
              sizes:   row.tallas || null,
            };
            html += buildProductCard(p, data.isDama);
          });
          html += buildCtaCard(data.label, catKey, data.isDama);
        }

        gridEl.innerHTML = html;

        // Stagger + tilt
        setTimeout(() => {
          prodView.querySelectorAll('.product-card').forEach((c, i) => {
            c.style.animationDelay = `${i * 0.06}s`;
          });
          prodView.querySelectorAll('.product-card:not(.product-card--cta)').forEach(c => {
            c.addEventListener('mousemove', e => {
              const rect = c.getBoundingClientRect();
              const x = (e.clientX - rect.left - rect.width / 2) / 22;
              const y = (e.clientY - rect.top - rect.height / 2) / 22;
              c.style.transform = `translateY(-5px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.01)`;
              c.style.transformStyle = 'preserve-3d';
            });
            c.addEventListener('mouseleave', () => {
              c.style.transform = '';
              c.style.transformStyle = '';
            });
          });
        }, 50);
      });
  });
});

/* ===== BACK BUTTON — return to category grid ===== */
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.dataset.panel;
    document.getElementById('prod-view-' + panel).classList.add('hidden');
    document.getElementById('cat-view-'  + panel).classList.remove('hidden');
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== PARALLAX HERO ===== */
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - window.scrollY / (window.innerHeight * 0.8);
  }
});

/* ===== GOLD RIPPLE ON CLICK ===== */
document.addEventListener('click', e => {
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    width:4px; height:4px; background:rgba(201,168,76,0.6);
    border-radius:50%; pointer-events:none; z-index:9997;
    transform:translate(-50%,-50%);
    animation: rippleAnim 0.6s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { width:80px; height:80px; opacity:0; } }`;
document.head.appendChild(rippleStyle);

/* ===================================================================
   ===== CARRITO DE COMPRAS =====
=================================================================== */
let cart = [];

// Helpers
function parsePriceCOP(str) {
  return parseInt(str.replace(/\D/g, '')) || 0;
}
function formatPriceCOP(num) {
  return '$' + num.toLocaleString('es-CO');
}

// Abrir / cerrar panel
const cartPanel   = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartBtn     = document.getElementById('cartBtn');
const cartClose   = document.getElementById('cartClose');

function openCart() {
  cartPanel.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Renderizar carrito
function renderCart() {
  const listEl   = document.getElementById('cartList');
  const emptyEl  = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  const totalEl  = document.getElementById('cartTotal');
  const countEl  = document.getElementById('cartCount');
  const waBtn    = document.getElementById('cartWaBtn');

  // Count badge
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = totalQty;
  if (totalQty > 0) countEl.classList.add('visible');
  else countEl.classList.remove('visible');

  // Empty / filled state
  if (cart.length === 0) {
    emptyEl.style.display  = 'flex';
    listEl.style.display   = 'none';
    footerEl.style.display = 'none';
    return;
  }
  emptyEl.style.display  = 'none';
  listEl.style.display   = 'flex';
  footerEl.style.display = 'flex';

  // Build items
  listEl.innerHTML = cart.map((item, idx) => `
    <li class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}"
           onerror="this.style.opacity=0.2">
      <div class="cart-item-info">
        <span class="cart-item-cat">${item.cat}</span>
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatPriceCOP(parsePriceCOP(item.price) * item.qty)}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-action="up" data-idx="${idx}">+</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-action="down" data-idx="${idx}">−</button>
        <button class="qty-btn remove" data-action="remove" data-idx="${idx}" title="Eliminar">✕</button>
      </div>
    </li>
  `).join('');

  // Total
  const total = cart.reduce((s, i) => s + parsePriceCOP(i.price) * i.qty, 0);
  totalEl.textContent = formatPriceCOP(total);

  // WhatsApp link
  const lines = cart.map(i => `• ${i.name} x${i.qty} — ${formatPriceCOP(parsePriceCOP(i.price) * i.qty)}`).join('\n');
  const msg = `Hola! Quiero hacer el siguiente pedido:\n\n${lines}\n\nTotal: ${formatPriceCOP(total)}`;
  waBtn.href = `https://wa.me/573122281686?text=${encodeURIComponent(msg)}`;

  // Qty buttons
  listEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx    = parseInt(btn.dataset.idx);
      const action = btn.dataset.action;
      if (action === 'up')     { cart[idx].qty++; }
      if (action === 'down')   { cart[idx].qty--; if (cart[idx].qty <= 0) cart.splice(idx, 1); }
      if (action === 'remove') { cart.splice(idx, 1); }
      renderCart();
    });
  });
}

// Añadir al carrito
function addToCart(name, price, img, cat) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, img, cat, qty: 1 });
  }
  renderCart();

  // Bounce en el botón del nav
  cartBtn.classList.remove('bounce');
  void cartBtn.offsetWidth; // reflow
  cartBtn.classList.add('bounce');
  cartBtn.addEventListener('animationend', () => cartBtn.classList.remove('bounce'), { once: true });
}

// Delegación de eventos en el grid de productos
document.addEventListener('click', e => {
  const btn = e.target.closest('.add-to-cart-btn');
  if (!btn) return;
  addToCart(
    btn.dataset.name,
    btn.dataset.price,
    btn.dataset.img,
    btn.dataset.cat
  );
  // Feedback visual en el botón
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ Agregado';
  btn.style.color = '#4ade80';
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.color = '';
  }, 1200);
});

// Vaciar carrito
document.getElementById('cartClear').addEventListener('click', () => {
  cart = [];
  renderCart();
});

// Init
renderCart();

/* ==============================================
   FEATURE 1 — MAGNETIC BUTTONS
============================================== */
document.querySelectorAll('.btn-gold, .btn-wa, .nav-cta, .tab-btn, .float-cart, .wa-float').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ==============================================
   FEATURE 3 — PARALLAX HERO
============================================== */
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // inject parallax bg div
  const bg = document.createElement('div');
  bg.className = 'hero-parallax-bg';
  hero.prepend(bg);

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight * 1.5) {
      bg.style.transform = `translateY(${sy * 0.25}px)`;
      // subtle title parallax
      const title = hero.querySelector('.hero-title');
      if (title) title.style.transform = `translateY(${sy * 0.08}px)`;
    }
  }, { passive: true });
})();

/* ==============================================
   FEATURE 4 — TOAST NOTIFICATIONS
============================================== */
function showToast(name, price, img, isDama) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast' + (isDama ? ' dama' : '');
  toast.innerHTML = `
    <img class="toast-img" src="${img}" alt="${name}" onerror="this.style.opacity=0.2">
    <div class="toast-body">
      <span class="toast-label">Agregado al carrito</span>
      <span class="toast-name">${name}</span>
      <span class="toast-price">${price}</span>
    </div>
    <div class="toast-check">✓</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3000);
}

/* Patch addToCart to also show toast */
const _origAddToCart = addToCart;
window.addToCartWithToast = function(name, price, img, cat, isDama) {
  _origAddToCart(name, price, img, cat);
  showToast(name, price, img, isDama === 'true' || isDama === true);
};

// Override the click listener to use toast version
document.removeEventListener('click', document._cartClickHandler);
document._cartClickHandler2 = function(e) {
  const btn = e.target.closest('.add-to-cart-btn');
  if (!btn) return;
  window.addToCartWithToast(
    btn.dataset.name,
    btn.dataset.price,
    btn.dataset.img,
    btn.dataset.cat,
    btn.dataset.isdama
  );
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ Agregado';
  btn.style.color = '#4ade80';
  setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1200);
};
document.addEventListener('click', document._cartClickHandler2);

/* ==============================================
   FEATURE 5 — STAT GLOW ON COMPLETE
============================================== */
const _origAnimateCounter = animateCounter;
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
      el.classList.add('done');
      setTimeout(() => el.classList.remove('done'), 1500);
    }
    el.textContent = Math.floor(start);
  }, 16);
}
// Re-observe stats with new animateCounter
document.querySelectorAll('.stat-num').forEach(el => {
  const newObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, +e.target.dataset.target);
        newObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  newObs.observe(el);
});

/* ==============================================
   FEATURE 6 — LIGHTBOX
============================================== */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxName    = document.getElementById('lightboxName');
const lightboxPrice   = document.getElementById('lightboxPrice');
const lightboxWa      = document.getElementById('lightboxWa');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxBd      = document.getElementById('lightboxBackdrop');

function openLightbox(img, name, price, waText) {
  lightboxImg.src   = img;
  lightboxImg.alt   = name;
  lightboxName.textContent  = name;
  lightboxPrice.textContent = price;
  lightboxWa.href = `https://wa.me/573122281686?text=Hola!%20quiero%20pedir%20${encodeURIComponent(waText)}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBd.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Delegate click on product images
document.addEventListener('click', e => {
  const img = e.target.closest('.product-img-wrap .product-img');
  if (!img) return;
  const card = img.closest('.product-card');
  if (!card) return;
  const name  = card.querySelector('.product-name')?.textContent  || '';
  const price = card.querySelector('.product-price')?.textContent || '';
  const addBtn = card.querySelector('.add-to-cart-btn');
  const waText = addBtn ? addBtn.dataset.name : name;
  openLightbox(img.src, name, price, waText);
});

/* ==============================================
   FEATURE 7 — INTRO SOUND
============================================== */
(function() {
  let muted = false;
  const muteBtn  = document.getElementById('introMute');
  const iconOn   = document.getElementById('muteIconOn');
  const iconOff  = document.getElementById('muteIconOff');
  if (!muteBtn) return;

  // Generate whoosh sound via Web Audio API — no external file needed
  function playWhoosh() {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Whoosh = filtered noise burst
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
      filter.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + 0.6);

      // Impact thud at peak
      const osc = ctx.createOscillator();
      const gainOsc = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime + 0.58);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.85);
      gainOsc.gain.setValueAtTime(0.3, ctx.currentTime + 0.58);
      gainOsc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      osc.connect(gainOsc);
      gainOsc.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.58);
      osc.stop(ctx.currentTime + 0.86);
    } catch(e) { /* audio not supported */ }
  }

  // Play on logo impact (0.62s after load)
  setTimeout(playWhoosh, 620);

  muteBtn.addEventListener('click', () => {
    muted = !muted;
    iconOn.style.display  = muted ? 'none'  : 'block';
    iconOff.style.display = muted ? 'block' : 'none';
  });
})();

/* ==============================================
   FEATURE 4 — MODO CLARO / OSCURO
============================================== */
(function() {
  const btn = document.getElementById('themeToggle');
  const moon = btn.querySelector('.icon-moon');
  const sun  = btn.querySelector('.icon-sun');
  let light = false;

  btn.addEventListener('click', () => {
    light = !light;
    document.body.classList.toggle('light-mode', light);
    moon.style.display = light ? 'none'  : 'block';
    sun.style.display  = light ? 'block' : 'none';
  });
})();

/* ==============================================
   FEATURE 1 — BÚSQUEDA EN TIEMPO REAL (Supabase)
============================================== */
(function() {
  const input    = document.getElementById('searchInput');
  const results  = document.getElementById('searchResults');
  const clearBtn = document.getElementById('searchClear');
  if (!input) return;

  let searchTimer = null;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearBtn.classList.toggle('visible', q.length > 0);
    if (q.length < 2) { results.classList.remove('open'); return; }

    clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
      const { data: hits } = await sbClient
        .from('productos')
        .select('*')
        .ilike('nombre', `%${q}%`)
        .eq('activo', true)
        .limit(8);

      if (!hits || hits.length === 0) {
        results.innerHTML = `<div class="search-no-results">Sin resultados para "${q}"</div>`;
      } else {
        results.innerHTML = hits.map(row => `
          <div class="search-result-item"
            data-img="${row.imagen_url || ''}"
            data-name="${row.nombre}"
            data-price="${row.precio}"
            data-watext="${row.wa_text || row.nombre}">
            <img class="search-result-img" src="${row.imagen_url || ''}" alt="${row.nombre}" onerror="this.style.opacity=0.2">
            <div class="search-result-info">
              <span class="search-result-name">${row.nombre}</span>
              <span class="search-result-cat">${row.categoria}</span>
            </div>
            <span class="search-result-price">${row.precio}</span>
          </div>`).join('');

        results.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            openLightbox(item.dataset.img, item.dataset.name, item.dataset.price, item.dataset.watext);
            results.classList.remove('open');
            input.value = '';
            clearBtn.classList.remove('visible');
          });
        });
      }
      results.classList.add('open');
    }, 300);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('visible');
    results.classList.remove('open');
    input.focus();
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) results.classList.remove('open');
  });
})();

/* ==============================================
   FEATURE 2 — LO MÁS PEDIDO (desde Supabase)
============================================== */
(function() {
  const grid = document.getElementById('hotGrid');
  if (!grid) return;

  sbClient
    .from('productos')
    .select('*')
    .eq('activo', true)
    .limit(5)
    .order('created_at', { ascending: false })
    .then(({ data: rows }) => {
      if (!rows || rows.length === 0) {
        grid.innerHTML = '<p style="font-family:var(--font-mono);font-size:0.6rem;color:var(--gray);letter-spacing:2px;padding:1rem;">Próximamente</p>';
        return;
      }
      grid.innerHTML = rows.map(row => `
        <div class="hot-card fade-in"
          data-img="${row.imagen_url || ''}"
          data-name="${row.nombre}"
          data-price="${row.precio}"
          data-watext="${row.wa_text || row.nombre}">
          <div class="hot-badge">TOP</div>
          <img class="hot-card-img" src="${row.imagen_url || ''}" alt="${row.nombre}"
               onerror="this.style.opacity=0.15">
          <div class="hot-card-body">
            <span class="hot-card-name">${row.nombre}</span>
            <span class="hot-card-price">${row.precio}</span>
          </div>
        </div>`).join('');

      grid.querySelectorAll('.hot-card').forEach(card => {
        card.addEventListener('click', () => {
          openLightbox(card.dataset.img, card.dataset.name, card.dataset.price, card.dataset.watext);
        });
      });
    });
})();

/* ==============================================
   FEATURE 3 — COMPARTIR PRODUCTO (share btn)
   Inyectado dinámicamente en buildProductCard
============================================== */
const _origBuildCard = buildProductCard;
buildProductCard = function(p, isDama) {
  const html = _origBuildCard(p, isDama);
  const shareIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke-linecap="round"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke-linecap="round"/></svg>`;
  const shareBtn = `<button class="share-btn" data-name="${p.name}" data-price="${p.price}" data-watext="${p.waText}" title="Compartir">${shareIcon}</button>`;
  // Insert share btn inside product-img-wrap (after badge or at end)
  return html.replace('</div>\n      <div class="product-info">', shareBtn + '</div>\n      <div class="product-info">');
};

// Stock badges injected into buildProductCard via override
const _origBuild2 = buildProductCard;
buildProductCard = function(p, isDama) {
  const html = _origBuild2(p, isDama);
  const stocks = ['EN STOCK', 'EN STOCK', 'ÚLTIMAS UNIDADES', 'EN STOCK'];
  const stockLabel = stocks[Math.floor(Math.random() * stocks.length)];
  const isLow = stockLabel === 'ÚLTIMAS UNIDADES';
  const stockHtml = `<span class="stock-badge${isLow ? ' low' : ''}"><span class="stock-dot"></span>${stockLabel}</span>`;
  return html.replace('</h4>', `</h4>${stockHtml}`);
};

// Share click handler
document.addEventListener('click', e => {
  const btn = e.target.closest('.share-btn');
  if (!btn) return;
  e.stopPropagation();
  const text = `Mirá este producto de FENIX CLOTHING: ${btn.dataset.name} — ${btn.dataset.price}\n¡Pedilo acá! https://wa.me/573122281686?text=Hola!%20quiero%20pedir%20${encodeURIComponent(btn.dataset.watext)}`;
  if (navigator.share) {
    navigator.share({ title: 'FENIX CLOTHING', text });
  } else {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
});

/* ==============================================
   FEATURE 7 — CONTADOR DE VISITANTES EN VIVO
============================================== */
(function() {
  const el = document.getElementById('viewerCount');
  if (!el) return;
  let count = 7 + Math.floor(Math.random() * 8); // 7–14

  function update() {
    const delta = Math.random() < 0.5 ? 1 : -1;
    count = Math.max(5, Math.min(28, count + delta));
    el.textContent = count;
    const next = 4000 + Math.random() * 8000; // cada 4–12s
    setTimeout(update, next);
  }
  setTimeout(update, 6000);
})();

/* ==============================================
   MAPA DORADO — Leaflet + Stadia dark tiles
============================================== */
(function initMap() {
  const container = document.getElementById('fenixMap');
  if (!container || typeof L === 'undefined') return;

  // Coordenadas Villa Verde, Pereira, Risaralda
  const LAT = 4.8133;
  const LNG = -75.7096;

  const map = L.map('fenixMap', {
    center: [LAT, LNG],
    zoom: 15,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false,
  });

  // Tile oscuro CartoDB — gratis, sin API key
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    subdomains: 'abcd',
  }).addTo(map);

  // Zoom control dorado en esquina inferior derecha
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Marker SVG dorado custom
  const goldIcon = L.divIcon({
    className: '',
    html: `
      <div style="
        width:42px; height:42px;
        background: #C9A84C;
        border: 3px solid #060608;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 0 0 4px rgba(201,168,76,0.25), 0 4px 20px rgba(0,0,0,0.6);
        display:flex; align-items:center; justify-content:center;
      ">
        <div style="
          transform: rotate(45deg);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px; letter-spacing: 1px;
          color: #060608; font-weight: 700; line-height:1;
        ">FX</div>
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -48],
  });

  const marker = L.marker([LAT, LNG], { icon: goldIcon }).addTo(map);

  // Popup dorado
  marker.bindPopup(`
    <div style="
      font-family: 'Space Grotesk', sans-serif;
      background: #0C0C10; color: #F0EEE8;
      padding: 0.8rem 1rem; border: 1px solid rgba(201,168,76,0.4);
      min-width: 160px; text-align:center;
    ">
      <div style="font-family:'Bebas Neue',sans-serif; font-size:1.2rem; letter-spacing:3px; color:#C9A84C;">FENIX CLOTHING</div>
      <div style="font-size:0.72rem; color:#6B6878; margin-top:0.3rem;">Villa Verde · Pereira</div>
    </div>
  `, {
    className: 'fenix-popup',
    closeButton: false,
  }).openPopup();

  // Colourizar tiles con CSS overlay dorado sutil
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:absolute; inset:0; pointer-events:none; z-index:400;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
    mix-blend-mode: overlay;
  `;
  container.style.position = 'relative';
  container.appendChild(overlay);
})();

/* ===== BUILD PRODUCT CARD HTML ===== */