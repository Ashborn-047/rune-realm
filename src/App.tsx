import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { BookOpen, Sparkles, ChevronRight, PenTool, Flame, Leaf, Wind, Droplets, Snowflake } from 'lucide-react';

/* ─────────────────────────────────────────────
   THEME SYSTEM
   ───────────────────────────────────────────── */
const THEMES = {
  void: {
    name: 'The Void',
    icon: '◈',
    bg: '#05030a',
    surface: '#0d0918',
    border: '#2a1f45',
    accent: '#7c3aed',
    accentGlow: '#a855f7',
    accentDim: '#4c1d95',
    text: '#e9d5ff',
    textMuted: '#7c6a9b',
    gold: '#c084fc',
    gradA: '#7c3aed',
    gradB: '#4f46e5',
    particle: '#a855f7',
    runeStroke: '#8b5cf6',
    css: `
      --bg: #05030a; --surface: #0d0918; --border: #2a1f45;
      --accent: #7c3aed; --accent-glow: #a855f7; --accent-dim: #4c1d95;
      --text: #e9d5ff; --text-muted: #7c6a9b; --gold: #c084fc;
      --grad-a: #7c3aed; --grad-b: #4f46e5;
      --particle: #a855f7; --rune-stroke: #8b5cf6;
    `
  },
  ember: {
    name: 'Ember of Surtr',
    icon: '◉',
    bg: '#070300',
    surface: '#130800',
    border: '#3d1500',
    accent: '#ea580c',
    accentGlow: '#f97316',
    accentDim: '#7c2d12',
    text: '#fed7aa',
    textMuted: '#92400e',
    gold: '#fbbf24',
    gradA: '#dc2626',
    gradB: '#ea580c',
    particle: '#f97316',
    runeStroke: '#fb923c',
    css: `
      --bg: #070300; --surface: #130800; --border: #3d1500;
      --accent: #ea580c; --accent-glow: #f97316; --accent-dim: #7c2d12;
      --text: #fed7aa; --text-muted: #92400e; --gold: #fbbf24;
      --grad-a: #dc2626; --grad-b: #ea580c;
      --particle: #f97316; --rune-stroke: #fb923c;
    `
  },
  frost: {
    name: 'Ice of Niflheim',
    icon: '◇',
    bg: '#00060f',
    surface: '#010c1a',
    border: '#0c2a4a',
    accent: '#0ea5e9',
    accentGlow: '#38bdf8',
    accentDim: '#0c4a6e',
    text: '#e0f2fe',
    textMuted: '#0369a1',
    gold: '#7dd3fc',
    gradA: '#0ea5e9',
    gradB: '#6366f1',
    particle: '#38bdf8',
    runeStroke: '#7dd3fc',
    css: `
      --bg: #00060f; --surface: #010c1a; --border: #0c2a4a;
      --accent: #0ea5e9; --accent-glow: #38bdf8; --accent-dim: #0c4a6e;
      --text: #e0f2fe; --text-muted: #0369a1; --gold: #7dd3fc;
      --grad-a: #0ea5e9; --grad-b: #6366f1;
      --particle: #38bdf8; --rune-stroke: #7dd3fc;
    `
  },
  gold: {
    name: 'Gold of Asgard',
    icon: '◆',
    bg: '#060400',
    surface: '#110900',
    border: '#3d2800',
    accent: '#ca8a04',
    accentGlow: '#eab308',
    accentDim: '#713f12',
    text: '#fef9c3',
    textMuted: '#854d0e',
    gold: '#fde047',
    gradA: '#ca8a04',
    gradB: '#dc2626',
    particle: '#eab308',
    runeStroke: '#fbbf24',
    css: `
      --bg: #060400; --surface: #110900; --border: #3d2800;
      --accent: #ca8a04; --accent-glow: #eab308; --accent-dim: #713f12;
      --text: #fef9c3; --text-muted: #854d0e; --gold: #fde047;
      --grad-a: #ca8a04; --grad-b: #dc2626;
      --particle: #eab308; --rune-stroke: #fbbf24;
    `
  }
};

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const runicData = [
  { name:"Fehu", meaning:"Wealth, Cattle, Abundance", sound:"F", char:"ᚠ", path:"M 30 10 L 30 90 M 30 30 L 70 10 M 30 50 L 70 30", desc:"Represents mobile wealth and energy. In ancient times, cattle were the measure of a person's prosperity. Fehu signals abundance flowing outward.", deity:"Freyr", element:"Fire", aett:"Freyr's Aett" },
  { name:"Uruz", meaning:"Wild Ox, Strength, Untamed Power", sound:"U", char:"ᚢ", path:"M 30 90 L 30 10 L 70 50 L 70 90", desc:"Physical strength and untamed potential, embodied by the wild aurochs. Uruz calls forth primal vitality from the deep places of the self.", deity:"Thor", element:"Earth", aett:"Freyr's Aett" },
  { name:"Thurisaz", meaning:"Giant, Thor, Conflict, Protection", sound:"TH", char:"ᚦ", path:"M 30 10 L 30 90 M 30 30 L 70 50 L 30 70", desc:"Reactive force and conflict before resolution. The thorn that wounds but also protects. Associated with the Jötnar and the thunder god.", deity:"Thor", element:"Fire", aett:"Freyr's Aett" },
  { name:"Ansuz", meaning:"God, Odin, Breath, Communication", sound:"A", char:"ᚨ", path:"M 30 10 L 30 90 M 30 20 L 70 50 M 30 40 L 70 70", desc:"Divine inspiration and wisdom flowing through breath. The rune of Odin, of communication, poetry, and the power of words to shape reality.", deity:"Odin", element:"Air", aett:"Freyr's Aett" },
  { name:"Raido", meaning:"Journey, Riding, Rhythm", sound:"R", char:"ᚱ", path:"M 30 10 L 30 90 M 30 10 L 70 30 L 30 50 M 30 50 L 70 90", desc:"The sacred journey, both physical and spiritual. Raido is the rhythm of the universe, the right ordering of movement through time.", deity:"Odin", element:"Air", aett:"Freyr's Aett" },
  { name:"Kenaz", meaning:"Torch, Knowledge, Creativity", sound:"K", char:"ᚲ", path:"M 70 20 L 30 50 L 70 80", desc:"The torch held in the darkness — knowledge that illuminates. Kenaz is creative fire, the light of skill and craftsmanship.", deity:"Freya", element:"Fire", aett:"Freyr's Aett" },
  { name:"Gebo", meaning:"Gift, Generosity, Partnerships", sound:"G", char:"ᚷ", path:"M 20 20 L 80 80 M 80 20 L 20 80", desc:"The sacred gift that creates bonds between giver and receiver. Gebo is the principle of reciprocity that holds all relationships in balance.", deity:"Freyr", element:"Air", aett:"Freyr's Aett" },
  { name:"Wunjo", meaning:"Joy, Harmony, Fellowship", sound:"W", char:"ᚹ", path:"M 30 10 L 30 90 M 30 10 L 70 35 L 30 60", desc:"Joy, the flag of perfection flying in clear air. Wunjo is the realization of wishes, kinship, and belonging among one's people.", deity:"Odin", element:"Air", aett:"Freyr's Aett" },
  { name:"Hagalaz", meaning:"Hail, Destruction, Radical Change", sound:"H", char:"ᚺ", path:"M 30 10 L 30 90 M 70 10 L 70 90 M 30 40 L 70 60", desc:"Hail — the coldest seed that must shatter before life can emerge. Hagalaz is crisis and transformation, destruction as the mother of creation.", deity:"Urd", element:"Ice", aett:"Heimdall's Aett" },
  { name:"Nauthiz", meaning:"Need, Necessity, Restriction", sound:"N", char:"ᚾ", path:"M 50 10 L 50 90 M 20 35 L 80 65", desc:"The need-fire born of friction and constraint. Nauthiz is the forge of character, the hardship that sharpens the soul into its truest form.", deity:"Skuld", element:"Fire", aett:"Heimdall's Aett" },
  { name:"Isa", meaning:"Ice, Stillness, Concentration", sound:"I", char:"ᛁ", path:"M 50 10 L 50 90", desc:"Ice — perfect stillness, pure concentration of the ego. Isa freezes what must not move, the axis around which all else turns.", deity:"Verdandi", element:"Ice", aett:"Heimdall's Aett" },
  { name:"Jera", meaning:"Year, Harvest, Cycles", sound:"J/Y", char:"ᛃ", path:"M 50 10 L 20 40 L 50 70 M 50 30 L 80 60 L 50 90", desc:"The harvest earned through right action and patient tending. Jera is the wheel of the year, the cosmic guarantee that effort bears fruit in its season.", deity:"Freyr", element:"Earth", aett:"Heimdall's Aett" },
  { name:"Eihwaz", meaning:"Yew Tree, Endurance, Life & Death", sound:"EI", char:"ᛇ", path:"M 50 10 L 50 90 M 50 10 L 80 40 M 50 90 L 20 60", desc:"The yew tree — both weapon and coffin, spanning life and death. The axis of Yggdrasil itself, connecting the nine worlds through its roots.", deity:"Odin", element:"Earth", aett:"Heimdall's Aett" },
  { name:"Perthro", meaning:"Mystery, Chance, Fate", sound:"P", char:"ᛈ", path:"M 30 10 L 30 90 M 30 20 L 60 40 L 60 60 L 30 80", desc:"The dice cup, the mystery of chance and the web of fate. What lies in Perthro's cup is known only to the Norns who weave the threads of destiny.", deity:"The Norns", element:"Water", aett:"Heimdall's Aett" },
  { name:"Algiz", meaning:"Elk, Protection, Defense", sound:"Z", char:"ᛉ", path:"M 50 10 L 50 90 M 50 45 L 20 15 M 50 45 L 80 15", desc:"The protective reach of the elk's antlers. Algiz guards the sacred boundary between human and divine, shielding the seeker on the path.", deity:"Heimdall", element:"Air", aett:"Heimdall's Aett" },
  { name:"Sowilo", meaning:"Sun, Success, Wholeness", sound:"S", char:"ᛊ", path:"M 70 20 L 30 40 L 70 60 L 30 80", desc:"The sun-wheel spinning its conquering light across the sky. Sowilo is victory, wholeness, and the life-force that defeats all darkness.", deity:"Sol", element:"Fire", aett:"Heimdall's Aett" },
  { name:"Tiwaz", meaning:"Tyr, Justice, War, Honor", sound:"T", char:"ᛏ", path:"M 50 15 L 50 90 M 20 45 L 50 15 L 80 45", desc:"The spear-point of Tyr, the sky-father of justice. Tiwaz demands honorable sacrifice — the one-handed god who gave his hand so others might be free.", deity:"Tyr", element:"Air", aett:"Tyr's Aett" },
  { name:"Berkano", meaning:"Birch, Birth, New Beginnings", sound:"B", char:"ᛒ", path:"M 30 10 L 30 90 M 30 10 L 70 30 L 30 50 M 30 50 L 70 70 L 30 90", desc:"The birch goddess of birth, healing, and sanctuary. Berkano is the greenest of leaves, the beginning that emerges from sheltered darkness.", deity:"Frigg", element:"Earth", aett:"Tyr's Aett" },
  { name:"Ehwaz", meaning:"Horse, Trust, Teamwork", sound:"E", char:"ᛖ", path:"M 30 90 L 30 10 L 50 40 L 70 10 L 70 90", desc:"The sacred bond between rider and horse, trust made physical. Ehwaz is harmonious partnership, the two that move as one across the world-plain.", deity:"Freyr", element:"Earth", aett:"Tyr's Aett" },
  { name:"Mannaz", meaning:"Man, Mankind, Humanity", sound:"M", char:"ᛗ", path:"M 30 90 L 30 10 L 70 40 M 70 90 L 70 10 L 30 40", desc:"Humanity in its fullness — the rational mind, the social animal, the one who reaches both toward earth and sky. The divine mirror.", deity:"Odin", element:"Air", aett:"Tyr's Aett" },
  { name:"Laguz", meaning:"Water, Intuition, Flow", sound:"L", char:"ᛚ", path:"M 30 10 L 30 90 M 30 10 L 70 50", desc:"Water that flows to the lowest place, finding every hidden path. Laguz is the unconscious mind, intuition, and the deep currents beneath surface reality.", deity:"Njord", element:"Water", aett:"Tyr's Aett" },
  { name:"Ingwaz", meaning:"Ing, Fertility, Internal Growth", sound:"NG", char:"ᛜ", path:"M 50 20 L 80 50 L 50 80 L 20 50 Z", desc:"The seed held in perfect potential. Ingwaz is the completion of one cycle and the gestation of the next — the world held inside the egg before hatching.", deity:"Freyr", element:"Earth", aett:"Tyr's Aett" },
  { name:"Othala", meaning:"Heritage, Estate, Ancestry", sound:"O", char:"ᛟ", path:"M 50 10 L 80 40 L 65 85 L 35 85 L 20 40 Z M 20 40 L 50 10 L 80 40", desc:"The sacred enclosure of home and ancestral wisdom. Othala is what cannot be bought or sold — the inheritance of bloodline, land, and spiritual tradition.", deity:"Odin", element:"Earth", aett:"Tyr's Aett" },
  { name:"Dagaz", meaning:"Day, Breakthrough, Awakening", sound:"D", char:"ᛞ", path:"M 20 50 L 50 20 L 80 50 L 50 80 Z M 20 50 L 50 80 M 50 20 L 80 50", desc:"The crack of dawn — the moment of breakthrough between darkness and light. Dagaz is the awakening that cannot be undone, the point of no return.", deity:"Odin", element:"Fire", aett:"Tyr's Aett" }
];

const UNICODE_RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛟᛞ";

const useBreakpoints = () => {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
  };
};

/* ─────────────────────────────────────────────
   NEBULA BACKGROUND CANVAS
   ───────────────────────────────────────────── */
const NebulaBackground = ({ theme }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const starsRef = useRef([]);
  const nebulaRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const t = THEMES[theme];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    starsRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.005 + 0.002,
      brightness: Math.random() * 0.6 + 0.2
    }));

    // Generate nebula blobs
    nebulaRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      rx: Math.random() * 0.35 + 0.15,
      ry: Math.random() * 0.25 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.001 + 0.0003,
      opacity: Math.random() * 0.06 + 0.02,
      color: i % 2 === 0 ? t.gradA : t.gradB
    }));

    let time = 0;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = t.bg;
      ctx.fillRect(0, 0, w, h);

      // Draw nebula blobs
      nebulaRef.current.forEach(n => {
        const x = n.x * w;
        const y = n.y * h;
        const rx = n.rx * w;
        const ry = n.ry * h;
        const pulse = 1 + Math.sin(time * n.speed + n.phase) * 0.15;

        const grd = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry) * pulse);
        grd.addColorStop(0, n.color + '22');
        grd.addColorStop(0.4, n.color + '11');
        grd.addColorStop(1, 'transparent');

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, ry / rx);
        ctx.translate(-x, -y);
        ctx.beginPath();
        ctx.arc(x, y, rx * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      });

      // Draw rune grid overlay (very subtle)
      ctx.font = '16px serif';
      ctx.fillStyle = t.particle + '08';
      const cols = Math.ceil(w / 60), rows = Math.ceil(h / 60);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 4 !== 0) continue;
          const idx = (r * cols + c) % UNICODE_RUNES.length;
          ctx.fillText(UNICODE_RUNES[idx], c * 60 + 15, r * 60 + 40);
        }
      }

      // Draw stars
      starsRef.current.forEach(s => {
        const brightness = s.brightness * (0.6 + 0.4 * Math.sin(time * s.speed + s.phase));
        const x = s.x * w, y = s.y * h;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.fill();

        // Occasional cross-sparkle
        if (s.r > 1.2 && brightness > 0.7) {
          ctx.strokeStyle = `rgba(255,255,255,${brightness * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); ctx.stroke();
        }
      });

      time++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [theme]);

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
};

/* ─────────────────────────────────────────────
   PARTICLE BURST  (for rune reveal)
   ───────────────────────────────────────────── */
const ParticleBurst = ({ x, y, color, onDone }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 300; canvas.height = 300;
    const particles = Array.from({ length: 40 }, () => ({
      x: 150, y: 150,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      r: Math.random() * 3 + 1,
      life: 1,
      decay: Math.random() * 0.02 + 0.015,
      char: UNICODE_RUNES[Math.floor(Math.random() * UNICODE_RUNES.length)]
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, 300, 300);
      let alive = false;
      particles.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= p.decay;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = color;
        ctx.font = `${p.r * 4}px serif`;
        ctx.fillText(p.char, p.x, p.y);
      });
      ctx.globalAlpha = 1;
      if (alive) raf = requestAnimationFrame(draw);
      else onDone?.();
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position:'fixed', left: x-150, top: y-150,
      width:300, height:300, pointerEvents:'none', zIndex:9999
    }} />
  );
};

/* ─────────────────────────────────────────────
   LOADING SCREEN
   ───────────────────────────────────────────── */
const LoadingScreen = ({ theme, onComplete }) => {
  const t = THEMES[theme];
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sigilRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 22;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => -Math.random() * 40);
    let raf;

    const draw = () => {
      ctx.fillStyle = `${t.bg}30`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px serif`;
      for (let i = 0; i < drops.length; i++) {
        const rune = UNICODE_RUNES[Math.floor(Math.random() * UNICODE_RUNES.length)];
        const alpha = Math.random() * 0.65 + 0.2;
        ctx.fillStyle = `${t.particle}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fillText(rune, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.35;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const tl = gsap.timeline({ onComplete });
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' })
      .fromTo(sigilRef.current, { opacity:0, scale:0.6, filter:'blur(12px)' }, { opacity:1, scale:1, filter:'blur(0px)', duration:1, ease:'power3.out' }, '<')
      .fromTo(textRef.current, { opacity:0, y:18 }, { opacity:1, y:0, duration:0.7, ease:'power2.out' }, '-=0.45')
      .to(sigilRef.current, { scale:1.08, duration:0.45, yoyo:true, repeat:1, ease:'sine.inOut' }, '+=0.35')
      .to(textRef.current, { opacity:0, y:-10, filter:'blur(4px)', duration:0.45, ease:'power2.in' }, '+=0.15')
      .to(sigilRef.current, { opacity:0, scale:1.18, filter:'blur(8px)', duration:0.6, ease:'power2.in' }, '<')
      .to(canvasRef.current, { opacity:0.22, duration:0.55, ease:'power2.inOut' }, '<')
      .to(containerRef.current, { opacity:0, duration:0.65, ease:'power2.inOut' }, '-=0.15');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [theme, onComplete]);

  return (
    <div ref={containerRef} style={{
      position:'fixed', inset:0, zIndex:1200, overflow:'hidden',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:t.bg
    }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, opacity:0.85 }} />
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 55% 55% at 50% 50%, transparent 10%, ${t.bg}cc 75%, ${t.bg} 100%)`
      }} />
      <div style={{ position:'relative', textAlign:'center' }}>
        <div ref={sigilRef} style={{
          fontSize:'5rem', color:t.accentGlow, fontFamily:'serif',
          letterSpacing:'0.08em', filter:`drop-shadow(0 0 30px ${t.accent}88)`
        }}>
          ᛟ
        </div>
        <div ref={textRef} style={{
          marginTop:'1rem', color:'var(--text-muted)', fontFamily:'serif',
          fontSize:'0.72rem', letterSpacing:'0.42em', textTransform:'uppercase'
        }}>
          Casting the runes...
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   RUNIC BRAND MARK
   ───────────────────────────────────────────── */
const RunicLogo = ({ compact = false }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
    <span style={{
      fontFamily:'serif',
      fontSize: compact ? '1rem' : '1.25rem',
      color:'var(--accent-glow)',
      lineHeight:1,
      letterSpacing:'0.08em',
      textShadow:'0 0 6px var(--accent-glow), 0 0 18px var(--accent), 0 0 30px var(--accent-dim)'
    }}>
      ᚱᚱ
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   EPIC INTRO SCREEN
   ───────────────────────────────────────────── */
const IntroScreen = ({ onEnter, theme }) => {
  const t = THEMES[theme];
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 28);
    const drops = Array(cols).fill(0).map(() => -Math.random() * 30);
    let raf;
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '22px serif';
      for (let i = 0; i < drops.length; i++) {
        const alpha = Math.random() * 0.7 + 0.1;
        ctx.fillStyle = t.particle + Math.floor(alpha * 255).toString(16).padStart(2,'0');
        ctx.fillText(UNICODE_RUNES[Math.floor(Math.random() * UNICODE_RUNES.length)], i * 28 + 4, drops[i] * 28);
        if (drops[i] * 28 > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i] += 0.3;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    // GSAP reveal sequence
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(titleRef.current, { opacity:1, y:0, duration:1.4, ease:'power4.out' })
      .to(subtitleRef.current, { opacity:1, y:0, duration:1, ease:'power3.out' }, '-=0.6')
      .to(btnRef.current, { opacity:1, scale:1, duration:0.8, ease:'back.out(1.7)' }, '-=0.3')
      .call(() => setReady(true));

    return () => cancelAnimationFrame(raf);
  }, [theme]);

  const handleEnter = () => {
    gsap.to(containerRef.current, {
      opacity: 0, scale: 1.05, duration: 0.8, ease: 'power2.in',
      onComplete: onEnter
    });
  };

  return (
    <div ref={containerRef} style={{
      position:'fixed', inset:0, zIndex:1000, display:'flex',
      flexDirection:'column', alignItems:'center', justifyContent:'center',
      background: t.bg
    }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, opacity:0.6 }} />

      {/* Central vignette */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 60% 60% at 50% 50%, transparent 20%, ${t.bg}cc 70%, ${t.bg} 100%)`
      }} />

      {/* Glowing circle behind title */}
      <div style={{
        position:'absolute', width:500, height:500, borderRadius:'50%',
        background:`radial-gradient(circle, ${t.accent}15 0%, transparent 70%)`,
        animation:'pulse-slow 4s ease-in-out infinite'
      }} />

      <div style={{ position:'relative', textAlign:'center', padding:'0 2rem' }}>
        {/* Decorative rune above */}
        <div style={{
          fontSize:'4rem', marginBottom:'1rem', opacity:0.3,
          color: t.accentGlow, fontFamily:'serif',
          animation:'float-gentle 6s ease-in-out infinite'
        }}>ᛟ</div>

        <h1
          ref={titleRef}
          style={{
            opacity:0, transform:'translateY(40px)',
            fontFamily: '"Cinzel Decorative", "Palatino Linotype", serif',
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0 0 1rem',
            background: `linear-gradient(135deg, ${t.text} 0%, ${t.accentGlow} 50%, ${t.gold} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 0 40px ${t.accent}88)`
          }}
        >
          Rune Realm
        </h1>

        <div
          ref={subtitleRef}
          style={{
            opacity:0, transform:'translateY(20px)',
            color: t.textMuted,
            fontSize: 'clamp(0.75rem, 2vw, 1rem)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontFamily: 'serif',
            marginBottom: '3rem'
          }}
        >
          Wisdom of the Elder Futhark
        </div>

        <button
          ref={btnRef}
          onClick={handleEnter}
          style={{
            opacity:0, scale:'0.8',
            padding: '1rem 3rem',
            background: 'transparent',
            border: `1px solid ${t.accent}88`,
            color: t.text,
            fontSize: '0.85rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'serif',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale:1.05, borderColor: t.accentGlow, duration:0.3 });
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale:1, borderColor: t.accent+'88', duration:0.3 });
          }}
        >
          <span style={{
            position:'absolute', inset:0,
            background:`linear-gradient(90deg, transparent, ${t.accent}22, transparent)`,
            animation:'shimmer 3s infinite'
          }} />
          Enter the Futhark
        </button>

        {/* Bottom rune row */}
        <div style={{
          marginTop: '4rem', display:'flex', gap:'1.5rem',
          justifyContent:'center', opacity:0.2, fontSize:'1.3rem',
          fontFamily:'serif', color: t.text,
          letterSpacing:'1rem'
        }}>
          ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   THEME SWITCHER
   ───────────────────────────────────────────── */
const ThemeSwitcher = ({ current, onChange }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) gsap.fromTo(panelRef.current, { opacity:0, y:-10, scale:0.95 }, { opacity:1, y:0, scale:1, duration:0.25, ease:'power2.out' });
  }, [open]);

  return (
    <div style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Choose theme"
        style={{
          background: 'transparent',
          border: `1px solid var(--border)`,
          color: 'var(--accent-glow)',
          padding: '6px 12px',
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '1rem',
          display:'flex', alignItems:'center', gap:'6px',
          transition: 'all 0.2s'
        }}
      >
        <span>{THEMES[current].icon}</span>
        <span style={{ fontSize:'0.7rem', letterSpacing:'0.1em', color:'var(--text-muted)' }}>Theme</span>
      </button>

      {open && (
        <div ref={panelRef} style={{
          position:'absolute', top:'calc(100% + 8px)', right:0,
          background:'var(--surface)',
          border:'1px solid var(--border)',
          borderRadius:'8px',
          padding:'8px',
          zIndex:1000,
          minWidth:'160px',
          boxShadow:`0 20px 40px rgba(0,0,0,0.6)`
        }}>
          {Object.entries(THEMES).map(([key, th]) => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false); }}
              style={{
                display:'flex', alignItems:'center', gap:'10px',
                width:'100%', padding:'8px 12px',
                background: current === key ? 'var(--accent-dim)' : 'transparent',
                border:'none', color:'var(--text)',
                cursor:'pointer', borderRadius:'4px',
                fontSize:'0.8rem', letterSpacing:'0.05em',
                transition:'background 0.2s'
              }}
            >
              <span style={{ fontSize:'1rem' }}>{th.icon}</span>
              {th.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   RUNE DETAIL OVERLAY
   ───────────────────────────────────────────── */
const RuneDetail = ({ rune, onBack, theme }) => {
  const t = THEMES[theme];
  const { isMobile } = useBreakpoints();
  const overlayRef = useRef(null);
  const runeRef = useRef(null);
  const infoRef = useRef(null);
  const [burst, setBurst] = useState(null);
  const floatingRunes = useMemo(
    () =>
      Array.from({ length: isMobile ? 12 : 22 }, (_, i) => ({
        char: UNICODE_RUNES[(i * 7 + rune.name.length) % UNICODE_RUNES.length],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * (isMobile ? 16 : 22) + (isMobile ? 12 : 14)}px`,
        duration: `${Math.random() * 8 + 8}s`,
        delay: `${Math.random() * 4}s`,
        opacity: Math.random() * 0.14 + 0.06
      })),
    [isMobile, rune.name]
  );

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity:0 }, { opacity:1, duration:0.4 })
      .fromTo(runeRef.current,
        { scale:0.2, opacity:0, rotation:-30, filter:'blur(30px)' },
        { scale:1, opacity:1, rotation:0, filter:'blur(0px)', duration:1.2, ease:'power4.out' }, '-=0.1')
      .fromTo(infoRef.current.children,
        { opacity:0, x:50 },
        { opacity:1, x:0, duration:0.6, ease:'power3.out', stagger:0.12 }, '-=0.5');

    // Trigger a burst
    setTimeout(() => {
      const rect = runeRef.current?.getBoundingClientRect();
      if (rect) setBurst({ x: rect.left + rect.width/2, y: rect.top + rect.height/2 });
    }, 300);

    // Continuous rotation glow on the rune
    gsap.to(runeRef.current, {
      filter:`drop-shadow(0 0 30px ${t.accentGlow}) drop-shadow(0 0 60px ${t.accent}88)`,
      duration:2, repeat:-1, yoyo:true, ease:'sine.inOut'
    });
  }, [rune]);

  const handleBack = () => {
    gsap.to(overlayRef.current, { opacity:0, scale:0.97, duration:0.4, onComplete:onBack });
  };

  const elementIcons = {
    Fire: Flame,
    Earth: Leaf,
    Air: Wind,
    Water: Droplets,
    Ice: Snowflake,
  };

  const overlay = (
    <div ref={overlayRef} style={{
      position:'fixed', inset:0, zIndex:200,
      background: `${t.bg}f0`,
      backdropFilter:'blur(20px)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding: isMobile ? '1rem' : '2rem', overflowY:'auto'
    }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        {floatingRunes.map((fr, idx) => (
          <span
            key={`${rune.name}-${idx}`}
            style={{
              position:'absolute',
              left: fr.left,
              top: fr.top,
              color: t.accentGlow,
              opacity: fr.opacity,
              fontFamily:'serif',
              fontSize: fr.size,
              textShadow:`0 0 18px ${t.accent}66`,
              animation:`float-gentle ${fr.duration} ease-in-out ${fr.delay} infinite`
            }}
          >
            {fr.char}
          </span>
        ))}
      </div>

      {burst && <ParticleBurst x={burst.x} y={burst.y} color={t.accentGlow} onDone={() => setBurst(null)} />}

      <button onClick={handleBack} style={{
        position:'fixed', top: isMobile ? '0.8rem' : '1.5rem', left: isMobile ? '0.8rem' : '1.5rem',
        background:`${t.surface}cc`,
        border:`1px solid ${t.border}`,
        color:'var(--text-muted)',
        padding: isMobile ? '6px 10px' : '8px 16px',
        cursor:'pointer',
        borderRadius:'4px',
        fontSize: isMobile ? '0.62rem' : '0.75rem',
        letterSpacing:'0.2em',
        textTransform:'uppercase',
        display:'flex', alignItems:'center', gap:'8px',
        transition:'all 0.2s'
      }} onMouseEnter={e => gsap.to(e.currentTarget, { x:-4, duration:0.2 })}
         onMouseLeave={e => gsap.to(e.currentTarget, { x:0, duration:0.2 })}>
        ← Back
      </button>

      <div style={{
        display:'flex', flexDirection:'row', alignItems:'center',
        gap: isMobile ? '1.5rem' : '4rem', maxWidth:'900px', width:'100%',
        flexWrap:'wrap', justifyContent:'center'
      }}>
        {/* Rune SVG */}
        <div ref={runeRef} style={{ flexShrink:0 }}>
          <svg
            width={isMobile ? 190 : 260} height={isMobile ? 190 : 260} viewBox="0 0 100 100"
            fill="none"
            style={{
              stroke:`var(--rune-stroke)`,
              filter:`drop-shadow(0 0 20px ${t.accentGlow}88)`,
              animation:'float-gentle 5s ease-in-out infinite'
            }}
            strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d={rune.path} />
          </svg>
          {/* Unicode char below */}
          <div style={{
            textAlign:'center', fontSize:'2.5rem', fontFamily:'serif',
            color: t.accentGlow + '60', marginTop:'-1rem',
            letterSpacing:'0.1em'
          }}>{rune.char}</div>
        </div>

        {/* Info panel */}
        <div ref={infoRef} style={{ flex:1, minWidth:'280px' }}>
          <div style={{
            fontSize:'0.7rem', letterSpacing:'0.4em',
            color:'var(--text-muted)', textTransform:'uppercase',
            marginBottom:'0.5rem', fontFamily:'serif'
          }}>{rune.aett}</div>

          <h2 style={{
            fontSize: isMobile ? 'clamp(1.8rem, 9vw, 2.6rem)' : 'clamp(2.5rem, 5vw, 4rem)',
            fontFamily:'"Cinzel Decorative", "Palatino Linotype", serif',
            fontWeight:700,
            background:`linear-gradient(135deg, var(--text), var(--accent-glow))`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text',
            margin:'0 0 0.5rem', letterSpacing:'0.05em'
          }}>{rune.name}</h2>

          <div style={{
            display:'inline-block',
            padding:'4px 16px',
            background:`var(--accent-dim)`,
            border:`1px solid var(--accent)44`,
            borderRadius:'20px',
            fontSize:'0.7rem', letterSpacing:'0.25em',
            color:'var(--accent-glow)',
            marginBottom:'1rem'
          }}>
            SOUND: {rune.sound}
          </div>

          <p style={{
            fontSize:'1.2rem', fontFamily:'serif', fontStyle:'italic',
            color:'var(--accent-glow)', opacity:0.8,
            marginBottom:'1rem'
          }}>"{rune.meaning}"</p>

          <div style={{ width:'40px', height:'1px', background:`var(--accent)44`, marginBottom:'1.2rem' }} />

          <p style={{
            color:'var(--text)', opacity:0.85,
            lineHeight:1.8, fontSize:'1rem',
            marginBottom:'1.5rem'
          }}>{rune.desc}</p>

          {/* Attributes row */}
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            {[
              {
                label:'Element',
                val: (() => {
                  const Icon = elementIcons[rune.element];
                  return (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px' }}>
                      {Icon ? <Icon size={14} /> : null}
                      {rune.element}
                    </span>
                  );
                })()
              },
              { label:'Deity', val:rune.deity },
            ].map(attr => (
              <div key={attr.label} style={{
                padding:'8px 16px',
                background:'var(--surface)',
                border:'1px solid var(--border)',
                borderRadius:'4px',
                fontSize:'0.75rem'
              }}>
                <div style={{ color:'var(--text-muted)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'2px' }}>{attr.label}</div>
                <div style={{ color:'var(--text)', fontFamily:'serif' }}>{attr.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

/* ─────────────────────────────────────────────
   HISTORICAL EXPLORER
   ───────────────────────────────────────────── */
const HistoricalExplorer = ({ theme }) => {
  const t = THEMES[theme];
  const { isMobile } = useBreakpoints();
  const [selectedRune, setSelectedRune] = useState(null);
  const [hoveredRune, setHoveredRune] = useState(null);
  const [activeAett, setActiveAett] = useState('all');
  const gridRef = useRef(null);

  const aetts = ['all', "Freyr's Aett", "Heimdall's Aett", "Tyr's Aett"];
  const filtered = activeAett === 'all' ? runicData : runicData.filter(r => r.aett === activeAett);

  const handleRuneClick = (rune, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, { scale:1.3, duration:0.15, yoyo:true, repeat:1, ease:'power2.inOut' });
    setTimeout(() => setSelectedRune(rune), 100);
  };

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(gridRef.current.children,
        { opacity:0, y:30, scale:0.9 },
        { opacity:1, y:0, scale:1, duration:0.5, stagger:0.04, ease:'power3.out' }
      );
    }
  }, [activeAett]);

  if (selectedRune) {
    return <RuneDetail rune={selectedRune} onBack={() => setSelectedRune(null)} theme={theme} />;
  }

  return (
    <div>
      <header style={{ textAlign:'center', marginBottom:'3rem' }}>
        <div style={{
          fontSize:'0.7rem', letterSpacing:'0.5em', textTransform:'uppercase',
          color:'var(--text-muted)', marginBottom:'1rem', fontFamily:'serif'
        }}>Carved in Stone, Carried Through Ages</div>
        <h2 style={{
          fontFamily:'"Cinzel Decorative", "Palatino Linotype", serif',
          fontSize:'clamp(1.8rem, 4vw, 3rem)',
          background:`linear-gradient(135deg, var(--text), var(--accent-glow))`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          margin:'0 0 1rem',
          letterSpacing:'0.08em'
        }}>Elder Futhark</h2>
        <p style={{ color:'var(--text-muted)', maxWidth:'500px', margin:'0 auto 2rem', lineHeight:1.7, fontSize:'0.95rem' }}>
          24 runes across three sacred families, each carrying the weight of worlds.
        </p>

        {/* Aett filters */}
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
          {aetts.map(a => (
            <button key={a} onClick={() => setActiveAett(a)} style={{
              padding: isMobile ? '5px 12px' : '6px 18px',
              background: activeAett === a ? `var(--accent-dim)` : 'transparent',
              border:`1px solid ${activeAett === a ? 'var(--accent)' : 'var(--border)'}`,
              color: activeAett === a ? 'var(--accent-glow)' : 'var(--text-muted)',
              borderRadius:'20px',
              cursor:'pointer',
              fontSize: isMobile ? '0.64rem' : '0.75rem', letterSpacing:'0.15em', textTransform:'uppercase',
              transition:'all 0.25s',
              fontFamily:'serif'
            }}>
              {a === 'all' ? 'All 24 Runes' : a.replace("'s Aett","")}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div ref={gridRef} style={{
        display:'grid',
        gridTemplateColumns:`repeat(auto-fill, minmax(${isMobile ? 88 : 110}px, 1fr))`,
        gap: isMobile ? '0.7rem' : '1rem'
      }}>
        {filtered.map((rune) => (
          <button
            key={rune.name}
            onClick={e => handleRuneClick(rune, e)}
            onMouseEnter={e => {
              setHoveredRune(rune.name);
              gsap.to(e.currentTarget, { y:-8, scale:1.05, duration:0.3, ease:'power2.out' });
            }}
            onMouseLeave={e => {
              setHoveredRune(null);
              gsap.to(e.currentTarget, { y:0, scale:1, duration:0.4, ease:'power2.out' });
            }}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              padding: isMobile ? '1rem 0.5rem' : '1.5rem 1rem',
              background:'var(--surface)',
              border:`1px solid var(--border)`,
              borderRadius:'8px',
              cursor:'pointer',
              transition:'border-color 0.3s, box-shadow 0.3s',
              position:'relative', overflow:'hidden',
              boxShadow: hoveredRune === rune.name ? `0 0 30px ${t.accent}22, inset 0 0 20px ${t.accent}08` : 'none'
            }}
          >
            {/* Hover glow overlay */}
            <div style={{
              position:'absolute', inset:0,
              background:`radial-gradient(circle at 50% 40%, ${t.accent}15, transparent 70%)`,
              opacity: hoveredRune === rune.name ? 1 : 0,
              transition:'opacity 0.3s', pointerEvents:'none'
            }} />

            <svg
              width={isMobile ? 46 : 56} height={isMobile ? 46 : 56} viewBox="0 0 100 100" fill="none"
              style={{
                stroke: hoveredRune === rune.name ? 'var(--accent-glow)' : 'var(--text-muted)',
                transition:'stroke 0.3s',
                filter: hoveredRune === rune.name ? `drop-shadow(0 0 12px ${t.accentGlow})` : 'none',
                zIndex:1
              }}
              strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d={rune.path} />
            </svg>

            <span style={{
              marginTop:'0.75rem',
              fontSize: isMobile ? '0.58rem' : '0.65rem',
              letterSpacing:'0.2em',
              textTransform:'uppercase',
              color: hoveredRune === rune.name ? 'var(--accent-glow)' : 'var(--text-muted)',
              fontFamily:'serif',
              transition:'color 0.3s',
              zIndex:1
            }}>{rune.name}</span>

            {hoveredRune === rune.name && (
              <span style={{
                position:'absolute', bottom:'6px',
                fontSize:'0.6rem', color:'var(--text-muted)', opacity:0.6
              }}>{rune.char}</span>
            )}
          </button>
        ))}
      </div>

      {/* Aett legend at bottom */}
      <div style={{
        marginTop:'3rem', padding: isMobile ? '1.2rem' : '2rem',
        background:'var(--surface)',
        border:'1px solid var(--border)',
        borderRadius:'8px',
        display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
        gap:'1.5rem'
      }}>
        {[
          { name:"Freyr's Aett", runes:"ᚠᚢᚦᚨᚱᚲᚷᚹ", desc:"First family — abundance, strength, communication, gifts." },
          { name:"Heimdall's Aett", runes:"ᚺᚾᛁᛃᛇᛈᛉᛊ", desc:"Second family — fate, hardship, stillness, protection." },
          { name:"Tyr's Aett", runes:"ᛏᛒᛖᛗᛚᛜᛟᛞ", desc:"Third family — justice, birth, humanity, heritage, dawn." },
        ].map(aett => (
          <div key={aett.name}>
            <div style={{ fontFamily:'serif', color:'var(--accent-glow)', fontSize:'0.8rem', marginBottom:'4px', letterSpacing:'0.1em' }}>{aett.name}</div>
            <div style={{ fontFamily:'serif', fontSize:'1.5rem', color:'var(--text)', opacity:0.5, marginBottom:'6px', letterSpacing:'0.3em' }}>{aett.runes}</div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.75rem', lineHeight:1.6 }}>{aett.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SCRATCH CANVAS
   ───────────────────────────────────────────── */
const ScratchReveal = ({ rune, onReveal, theme }) => {
  const t = THEMES[theme];
  const { isMobile } = useBreakpoints();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scratchSamplesRef = useRef(0);
  const [drawing, setDrawing] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0812';
    ctx.fillRect(0,0,300,300);
    // Stone texture
    for (let i = 0; i < 8000; i++) {
      const v = Math.floor(Math.random()*25+5);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(Math.random()*300, Math.random()*300, Math.random()*3+1, 1);
    }
    // Faint rune grid
    ctx.font = '18px serif';
    ctx.fillStyle = t.particle + '18';
    for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
      ctx.fillText(UNICODE_RUNES[Math.floor(Math.random()*UNICODE_RUNES.length)], c*38+8, r*38+28);
    }
    ctx.font = 'bold 16px serif';
    ctx.fillStyle = t.textMuted + '88';
    ctx.textAlign='center';
    ctx.fillText('— Rub to reveal your fate —', 150, 155);
  }, []);

  const scratch = e => {
    if (!drawing || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = 300 / rect.width, scaleY = 300 / rect.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (cx - rect.left) * scaleX;
    const y = (cy - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 28);
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill();

    scratchSamplesRef.current += 1;
    if (scratchSamplesRef.current % 6 === 0) {
      const px = ctx.getImageData(0,0,300,300).data;
      let cleared = 0;
      for (let i=3; i<px.length; i+=4) {
        // Use near-transparent instead of alpha===0 for robust detection.
        if (px[i] < 20) cleared++;
      }
      if (cleared/(300*300) > 0.5) {
        setRevealed(true);
        setDrawing(false);
        const tl = gsap.timeline({ onComplete: onReveal });
        tl.to(canvasRef.current, { opacity:0, scale:1.1, duration:0.7, ease:'power2.out' })
          .to(containerRef.current.querySelector('.rune-reveal'),
            { scale:1.15, duration:0.4, yoyo:true, repeat:1, ease:'power2.inOut' }, '<')
          .to(containerRef.current,
            { opacity:0, y:-24, filter:'blur(6px)', duration:0.6, ease:'power2.in' }, '+=0.25');
      }
    }
  };

  return (
    <div ref={containerRef} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem' }}>
      <div style={{ position:'relative', width: isMobile ? 260 : 300, height: isMobile ? 260 : 300 }}>
        {/* Rune behind */}
        <div className="rune-reveal" style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <svg width="180" height="180" viewBox="0 0 100 100" fill="none"
            style={{
              stroke: t.runeStroke,
              filter:`drop-shadow(0 0 20px ${t.accentGlow}) drop-shadow(0 0 50px ${t.accent}88)`,
              animation: revealed ? 'float-gentle 5s ease-in-out infinite' : 'none'
            }}
            strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d={rune.path} />
          </svg>
        </div>

        {/* Scratch surface */}
        <canvas
          ref={canvasRef}
          width={300} height={300}
          style={{
            position:'absolute', inset:0,
            width:'100%', height:'100%',
            borderRadius:'8px',
            cursor:'crosshair',
            touchAction:'none',
            transition:'opacity 0.8s'
          }}
          onMouseDown={() => setDrawing(true)}
          onMouseUp={() => setDrawing(false)}
          onMouseLeave={() => setDrawing(false)}
          onMouseMove={scratch}
          onTouchStart={() => setDrawing(true)}
          onTouchEnd={() => setDrawing(false)}
          onTouchMove={scratch}
        />
      </div>

      <p style={{
        color: revealed ? 'var(--accent-glow)' : 'var(--text-muted)',
        fontFamily:'serif', letterSpacing:'0.3em', fontSize:'0.8rem',
        textTransform:'uppercase', transition:'color 0.5s',
        animation: revealed ? 'pulse-slow 2s ease-in-out infinite' : 'none'
      }}>
        {revealed ? `The Norns reveal: ${rune.name}` : 'Uncover your fate'}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DAILY RUNE JOURNAL
   ───────────────────────────────────────────── */
const DailyRuneJournal = ({ theme }) => {
  const t = THEMES[theme];
  const { isMobile, isTablet } = useBreakpoints();
  const [dailyState, setDailyState] = useState({ rune:null, drawnDate:null, journalEntry:'' });
  const [scratchRune, setScratchRune] = useState(null);
  const [journalVal, setJournalVal] = useState('');
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('runeRealm_daily');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.drawnDate === new Date().toDateString()) {
          setDailyState(p);
          setJournalVal(p.journalEntry || '');
        }
      }
    } catch(e) {}

    gsap.fromTo(headerRef.current,
      { opacity:0, y:-30 }, { opacity:1, y:0, duration:0.8, ease:'power3.out' });
  }, []);

  const save = state => {
    setDailyState(state);
    try { localStorage.setItem('runeRealm_daily', JSON.stringify(state)); } catch(e) {}
  };

  const startDraw = () => {
    const rune = runicData[Math.floor(Math.random() * runicData.length)];
    setScratchRune(rune);
    gsap.fromTo(contentRef.current,
      { opacity:0, scale:0.95 }, { opacity:1, scale:1, duration:0.5 });
  };

  useEffect(() => {
    if (dailyState.rune && resultRef.current) {
      gsap.fromTo(resultRef.current.children,
        { opacity:0, y:26, filter:'blur(6px)' },
        { opacity:1, y:0, filter:'blur(0px)', duration:0.6, stagger:0.14, ease:'power3.out' });
    }
  }, [dailyState.rune]);

  const handleReveal = () => {
    const state = { rune: scratchRune, drawnDate: new Date().toDateString(), journalEntry:'' };
    save(state);
    setScratchRune(null);
  };

  const handleJournal = e => {
    setJournalVal(e.target.value);
    save({ ...dailyState, journalEntry: e.target.value });
  };

  const today = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div style={{ maxWidth:'800px', margin:'0 auto' }}>
      <header ref={headerRef} style={{ textAlign:'center', marginBottom:'3rem' }}>
        <div style={{
          fontSize: isMobile ? '0.58rem' : '0.7rem', letterSpacing: isMobile ? '0.28em' : '0.5em', textTransform:'uppercase',
          color:'var(--text-muted)', marginBottom:'0.75rem', fontFamily:'serif'
        }}>{today}</div>
        <h2 style={{
          fontFamily:'"Cinzel Decorative", "Palatino Linotype", serif',
          fontSize:'clamp(1.8rem, 4vw, 3rem)',
          background:`linear-gradient(135deg, var(--text), var(--accent-glow))`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          margin:'0 0 0.75rem', letterSpacing:'0.08em'
        }}>Daily Draw</h2>
        <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:1.7 }}>
          Still your mind. Draw from the ancient bag. Let the Norns speak.
        </p>
      </header>

      <div ref={contentRef}>
        {/* Scratch state */}
        {scratchRune && !dailyState.rune && (
          <ScratchReveal rune={scratchRune} onReveal={handleReveal} theme={theme} />
        )}

        {/* Draw button */}
        {!scratchRune && !dailyState.rune && (
          <div style={{
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            minHeight:'300px',
            border:`1px dashed ${t.border}`,
            borderRadius:'12px',
            background:'var(--surface)',
            gap:'1.5rem'
          }}>
            {/* Decorative rune bag icon */}
            <div style={{ fontSize:'4rem', opacity:0.3, fontFamily:'serif', color:'var(--accent-glow)' }}>
              ᛟ
            </div>

            <button
              onClick={startDraw}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.05, duration:0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale:1, duration:0.2 })}
              style={{
                padding:'1rem 3rem',
                background:`linear-gradient(135deg, ${t.accentDim}, ${t.accent}44)`,
                border:`1px solid ${t.accent}66`,
                color:'var(--text)',
                cursor:'pointer',
                borderRadius:'4px',
                fontSize:'0.85rem', letterSpacing:'0.3em', textTransform:'uppercase',
                fontFamily:'serif',
                position:'relative', overflow:'hidden'
              }}
            >
              <span style={{
                position:'absolute', inset:0,
                background:`linear-gradient(90deg, transparent, ${t.accent}22, transparent)`,
                animation:'shimmer 2.5s infinite'
              }} />
              Draw Your Rune
            </button>

            <p style={{
              color:'var(--text-muted)', fontSize:'0.8rem', maxWidth:'300px',
              textAlign:'center', lineHeight:1.7
            }}>Each day reveals one stave from the Elder Futhark. Reflect. Journal. Return tomorrow.</p>
          </div>
        )}

        {/* Journal view */}
        {dailyState.rune && (
          <div ref={resultRef} style={{ display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap:'2rem' }}>
            {/* Rune card */}
            <div style={{
              background:'var(--surface)',
              border:`1px solid ${t.border}`,
              borderRadius:'12px',
              padding: isMobile ? '1.4rem' : '2.5rem',
              display:'flex', flexDirection:'column', alignItems:'center',
              textAlign:'center',
              position:'relative', overflow:'hidden'
            }}>
              <div style={{
                position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                width:'200px', height:'200px', borderRadius:'50%',
                background:`radial-gradient(circle, ${t.accent}18, transparent 70%)`,
                pointerEvents:'none'
              }} />

              <svg width="140" height="140" viewBox="0 0 100 100" fill="none"
                style={{
                  stroke:'var(--rune-stroke)',
                  filter:`drop-shadow(0 0 15px ${t.accentGlow}88)`,
                  animation:'float-gentle 6s ease-in-out infinite',
                  marginBottom:'1.5rem', zIndex:1
                }}
                strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d={dailyState.rune.path} />
              </svg>

              <h3 style={{
                fontFamily:'"Cinzel Decorative", "Palatino Linotype", serif',
                fontSize:'2rem', color:'var(--text)',
                margin:'0 0 0.5rem', zIndex:1
              }}>{dailyState.rune.name}</h3>

              <div style={{
                padding:'3px 14px',
                background:'var(--accent-dim)',
                border:`1px solid ${t.accent}44`,
                borderRadius:'20px',
                fontSize:'0.65rem', letterSpacing:'0.25em',
                color:'var(--accent-glow)',
                marginBottom:'1rem', zIndex:1
              }}>{dailyState.rune.sound} · {dailyState.rune.element}</div>

              <p style={{
                fontFamily:'serif', fontStyle:'italic',
                color:'var(--accent-glow)', opacity:0.8,
                fontSize:'1rem', zIndex:1
              }}>"{dailyState.rune.meaning}"</p>

              <div style={{
                marginTop:'1rem', padding:'0.75rem',
                background:`${t.bg}88`,
                borderRadius:'4px',
                fontSize:'0.8rem', color:'var(--text-muted)',
                lineHeight:1.6, zIndex:1
              }}>
                {dailyState.rune.desc?.substring(0, 120)}…
              </div>
            </div>

            {/* Journal */}
            <div style={{
              background:'var(--surface)',
              border:`1px solid ${t.border}`,
              borderRadius:'12px',
              padding: isMobile ? '1.2rem' : '2rem',
              display:'flex', flexDirection:'column'
            }}>
              <div style={{
                display:'flex', alignItems:'center', gap:'8px',
                marginBottom:'1rem',
                paddingBottom:'0.75rem',
                borderBottom:`1px solid ${t.border}`
              }}>
                <PenTool size={16} color={t.accentGlow} />
                <span style={{
                  fontFamily:'serif', color:'var(--accent-glow)',
                  letterSpacing:'0.15em', fontSize:'0.85rem', textTransform:'uppercase'
                }}>Reflection</span>
              </div>

              <p style={{
                color:'var(--text-muted)', fontSize:'0.8rem',
                lineHeight:1.7, marginBottom:'1rem'
              }}>
                How does <em style={{ color:'var(--text)' }}>{dailyState.rune.meaning}</em> manifest in your life today? The runes are mirrors, not prophecy.
              </p>

              <textarea
                value={journalVal}
                onChange={handleJournal}
                placeholder="Write your thoughts here. The Norns are listening..."
                style={{
                  flex:1, minHeight:'180px',
                  background:`${t.bg}88`,
                  border:`1px solid ${t.border}`,
                  borderRadius:'6px',
                  padding:'1rem',
                  color:'var(--text)', fontSize:'0.9rem',
                  lineHeight:1.7, resize:'none',
                  outline:'none', fontFamily:'serif',
                  transition:'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = t.accent}
                onBlur={e => e.target.style.borderColor = t.border}
              />

              <div style={{
                marginTop:'1rem',
                display:'flex', justifyContent:'space-between', alignItems:'center'
              }}>
                <span style={{ color:'var(--text-muted)', fontSize:'0.7rem', letterSpacing:'0.1em' }}>
                  {dailyState.rune.deity} watches
                </span>
                <span style={{
                  fontSize:'0.7rem', color:'var(--text-muted)',
                  letterSpacing:'0.05em'
                }}>
                  {journalVal.length} runes spoken
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState('intro');
  const [showLoading, setShowLoading] = useState(true);
  const [theme, setTheme] = useState('ember');
  const t = THEMES[theme];
  const { isMobile, isTablet } = useBreakpoints();
  const mainRef = useRef(null);

  const navigateTo = useCallback(nextView => {
    if (mainRef.current) {
      gsap.to(mainRef.current, {
        opacity:0, y:-20, duration:0.25, ease:'power2.in',
        onComplete: () => {
          setView(nextView);
          gsap.fromTo(mainRef.current,
            { opacity:0, y:20 },
            { opacity:1, y:0, duration:0.4, ease:'power3.out' });
        }
      });
    } else {
      setView(nextView);
    }
  }, []);

  // Apply theme CSS vars
  useEffect(() => {
    const style = document.getElementById('theme-vars') || (() => {
      const s = document.createElement('style');
      s.id = 'theme-vars';
      document.head.appendChild(s);
      return s;
    })();
    style.textContent = `:root { ${t.css} }`;
  }, [theme]);

  if (view === 'intro') {
    return (
      <>
        <NebulaBackground theme={theme} />
        <IntroScreen onEnter={() => navigateTo('home')} theme={theme} />
        {showLoading && <LoadingScreen theme={theme} onComplete={() => setShowLoading(false)} />}
      </>
    );
  }

  return (
    <>
      <NebulaBackground theme={theme} />

      {/* Nav */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        background:'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))',
        padding: isMobile ? '0 0.75rem' : '0 1.5rem',
        height: isMobile ? '52px' : '56px',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <button
          onClick={() => navigateTo('home')}
          style={{
            border:'none', cursor:'pointer',
            backgroundColor:'transparent',
            padding:0,
            display:'flex',
            alignItems:'center'
          }}
        >
          <RunicLogo compact={isMobile} />
        </button>

        <div style={{ display:'flex', gap: isMobile ? '0.28rem' : '0.5rem', alignItems:'center' }}>
          {[
            { key:'explorer', label:'Explorer', icon:<BookOpen size={15}/> },
            { key:'daily', label:'Daily Draw', icon:<Sparkles size={15}/> },
          ].map(nav => (
            <button key={nav.key} onClick={() => navigateTo(nav.key)} style={{
              display:'flex', alignItems:'center', gap:'6px',
              padding: isMobile ? '5px 8px' : '6px 14px',
              background: view === nav.key ? 'var(--accent-dim)' : 'transparent',
              border:`1px solid ${view === nav.key ? 'var(--accent)' : 'transparent'}`,
              borderRadius:'4px',
              color: view === nav.key ? 'var(--accent-glow)' : 'var(--text-muted)',
              cursor:'pointer', fontSize: isMobile ? '0.68rem' : '0.75rem', letterSpacing:'0.1em',
              transition:'all 0.2s'
            }}>
              {nav.icon}
              {!isMobile && <span>{isTablet ? nav.label.replace(' Draw', '') : nav.label}</span>}
            </button>
          ))}

          <ThemeSwitcher current={theme} onChange={setTheme} />
        </div>
      </nav>

      {/* Main */}
      <main ref={mainRef} style={{
        position:'relative', zIndex:10,
        maxWidth:'1100px', margin:'0 auto',
        padding: isMobile ? '4.2rem 0.9rem 4rem' : '5rem 1.5rem 6rem'
      }}>
        {view === 'home' && <HomeView theme={theme} onNavigate={navigateTo} />}
        {view === 'explorer' && <HistoricalExplorer theme={theme} />}
        {view === 'daily' && <DailyRuneJournal theme={theme} />}
      </main>

      <footer style={{
        position:'relative',
        zIndex:10,
        marginTop:'2rem',
        padding: isMobile ? '2rem 0.9rem 2.2rem' : '2.5rem 1.5rem 3rem',
        borderTop:`1px solid ${t.border}`,
        background:'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.1), rgba(0,0,0,0))'
      }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', justifyContent:'center' }}>
            <RunicLogo />
          </div>
          <div style={{
            marginTop:'1rem',
            fontFamily:'serif',
            fontSize: isMobile ? '0.8rem' : '1rem',
            letterSpacing: isMobile ? '0.34rem' : '0.8rem',
            color:'var(--text-muted)',
            opacity:0.5
          }}>
            ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ
          </div>
          <p style={{
            marginTop:'1rem',
            color:'var(--text-muted)',
            fontSize:'0.72rem',
            letterSpacing:'0.2em',
            textTransform:'uppercase'
          }}>
            Carved in memory. Spoken in fire.
          </p>
        </div>
      </footer>
    </>
  );
}

/* ─────────────────────────────────────────────
   HOME VIEW
   ───────────────────────────────────────────── */
const HomeView = ({ theme, onNavigate }) => {
  const t = THEMES[theme];
  const { isMobile, isTablet } = useBreakpoints();
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const [hovCard, setHovCard] = useState(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current.children,
      { opacity:0, y:40 },
      { opacity:1, y:0, duration:0.8, stagger:0.15, ease:'power3.out' });
    gsap.fromTo(cardsRef.current.children,
      { opacity:0, scale:0.92, y:30 },
      { opacity:1, scale:1, y:0, duration:0.6, stagger:0.2, ease:'back.out(1.3)', delay:0.5 });
  }, []);

  const cards = [
    {
      key:'explorer',
      title:'Historical Explorer',
      subtitle:'24 runes. Three aetts. One primordial alphabet.',
      icon:'ᚠ',
      desc:'Journey through the Elder Futhark — each stave carved with the weight of two thousand years of Germanic wisdom.'
    },
    {
      key:'daily',
      title:'Daily Draw',
      subtitle:'Consult the Norns. Scratch. Reveal. Reflect.',
      icon:'ᛟ',
      desc:'Uncover your rune of the day through an ancient stone-scratch ritual, then journal your reflections in the sacred space.'
    }
  ];

  return (
    <div>
      <div ref={heroRef} style={{ textAlign:'center', marginBottom: isMobile ? '3rem' : '5rem', paddingTop: isMobile ? '1rem' : '2rem' }}>
        {/* Decorative rune row */}
        <div style={{
          fontFamily:'serif', fontSize: isMobile ? '1rem' : '1.6rem', letterSpacing: isMobile ? '0.5rem' : '1.5rem',
          color:'var(--text-muted)', opacity:0.2, marginBottom: isMobile ? '1.1rem' : '2rem'
        }}>
          {isMobile ? 'ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ' : 'ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ'}
        </div>

        <h1 style={{
          fontFamily:'"Cinzel Decorative", "Palatino Linotype", serif',
          fontSize:'clamp(2.5rem, 6vw, 5rem)',
          background:`linear-gradient(135deg, var(--text) 0%, var(--accent-glow) 50%, var(--gold) 100%)`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          margin:'0 0 1.5rem',
          letterSpacing:'0.08em',
          filter:`drop-shadow(0 0 40px ${t.accent}44)`
        }}>
          Wisdom of the Staves
        </h1>

        <p style={{
          color:'var(--text-muted)', maxWidth:'520px', margin:'0 auto 3rem',
          lineHeight:1.9, fontSize: isMobile ? '0.92rem' : '1.05rem', fontFamily:'serif'
        }}>
          Step into the ancient world of the Germanic peoples. Explore the primordial alphabet
          carved into stone and bone, or let the runes speak to you through daily ritual.
        </p>

        {/* Big decorative rune */}
        <div style={{
          fontSize: isMobile ? '4.2rem' : '6rem', fontFamily:'serif',
          color:'var(--accent-glow)', opacity:0.12,
          animation:'float-gentle 8s ease-in-out infinite',
          lineHeight:1, marginBottom:'2rem'
        }}>ᛟ</div>
      </div>

      <div ref={cardsRef} style={{
        display:'grid',
        gridTemplateColumns:`repeat(auto-fit, minmax(${isMobile ? 230 : isTablet ? 260 : 300}px, 1fr))`,
        gap: isMobile ? '1rem' : '2rem',
        maxWidth:'800px', margin:'0 auto'
      }}>
        {cards.map(card => (
          <button
            key={card.key}
            onClick={() => onNavigate(card.key)}
            onMouseEnter={e => {
              setHovCard(card.key);
              gsap.to(e.currentTarget, { y:-10, duration:0.3, ease:'power2.out' });
            }}
            onMouseLeave={e => {
              setHovCard(null);
              gsap.to(e.currentTarget, { y:0, duration:0.4, ease:'power2.out' });
            }}
            style={{
              padding: isMobile ? '1.5rem' : '2.5rem',
              background:'var(--surface)',
              border:`1px solid ${hovCard === card.key ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius:'12px',
              cursor:'pointer',
              textAlign:'left',
              position:'relative', overflow:'hidden',
              transition:'border-color 0.3s',
              boxShadow: hovCard === card.key ? `0 20px 60px ${t.accent}22` : 'none'
            }}
          >
            <div style={{
              position:'absolute', inset:0,
              background:`radial-gradient(ellipse at 30% 30%, ${t.accent}12, transparent 60%)`,
              opacity: hovCard === card.key ? 1 : 0,
              transition:'opacity 0.4s', pointerEvents:'none'
            }} />

            <div style={{
              fontSize:'3.5rem', fontFamily:'serif',
              color:'var(--accent-glow)', opacity: hovCard === card.key ? 0.7 : 0.3,
              transition:'opacity 0.3s',
              marginBottom:'1rem', lineHeight:1
            }}>{card.icon}</div>

            <div style={{
              fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase',
              color:'var(--accent-glow)', marginBottom:'0.5rem', fontFamily:'serif'
            }}>{card.subtitle}</div>

            <h3 style={{
              fontFamily:'"Cinzel Decorative", "Palatino Linotype", serif',
              fontSize: isMobile ? '1.25rem' : '1.5rem', color:'var(--text)',
              margin:'0 0 1rem', letterSpacing:'0.05em'
            }}>{card.title}</h3>

            <p style={{
              color:'var(--text-muted)', fontSize: isMobile ? '0.78rem' : '0.875rem',
              lineHeight:1.7, margin:'0 0 1.5rem'
            }}>{card.desc}</p>

            <div style={{
              display:'flex', alignItems:'center', gap:'8px',
              color:'var(--accent-glow)', fontSize:'0.75rem',
              letterSpacing:'0.2em', textTransform:'uppercase'
            }}>
              Enter <ChevronRight size={14} />
            </div>
          </button>
        ))}
      </div>

      {/* Bottom rune strip */}
      <div style={{
        textAlign:'center', marginTop:'5rem',
        fontFamily:'serif', fontSize: isMobile ? '1rem' : '1.6rem', letterSpacing: isMobile ? '0.45rem' : '1.5rem',
        color:'var(--text-muted)', opacity:0.15
      }}>
        {isMobile ? 'ᛏ ᛒ ᛖ ᛗ' : 'ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛟ ᛞ'}
      </div>
    </div>
  );
};
