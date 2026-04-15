import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "https://esm.sh/gsap@3.12.5";
import { BookOpen, Sparkles, ChevronRight, PenTool } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   THEME SYSTEM
═══════════════════════════════════════════════════════ */
const THEMES = {
  ember: {
    name: "Ember of Surtr", icon: "◉",
    bg:"#070300", surface:"#130800", border:"#3d1500",
    accent:"#ea580c", accentGlow:"#f97316", accentDim:"#7c2d1288",
    text:"#fed7aa", textMuted:"#92400e", gold:"#fbbf24",
    gradA:"#dc2626", gradB:"#ea580c",
    particle:"#f97316", runeStroke:"#fb923c",
    css:`--bg:#070300;--surface:#130800;--border:#3d1500;--accent:#ea580c;--accent-glow:#f97316;--accent-dim:#7c2d1288;--text:#fed7aa;--text-muted:#92400e;--gold:#fbbf24;--grad-a:#dc2626;--grad-b:#ea580c;--particle:#f97316;--rune-stroke:#fb923c;`
  },
  void: {
    name: "The Void", icon: "◈",
    bg:"#05030a", surface:"#0d0918", border:"#2a1f45",
    accent:"#7c3aed", accentGlow:"#a855f7", accentDim:"#4c1d9588",
    text:"#e9d5ff", textMuted:"#7c6a9b", gold:"#c084fc",
    gradA:"#7c3aed", gradB:"#4f46e5",
    particle:"#a855f7", runeStroke:"#8b5cf6",
    css:`--bg:#05030a;--surface:#0d0918;--border:#2a1f45;--accent:#7c3aed;--accent-glow:#a855f7;--accent-dim:#4c1d9588;--text:#e9d5ff;--text-muted:#7c6a9b;--gold:#c084fc;--grad-a:#7c3aed;--grad-b:#4f46e5;--particle:#a855f7;--rune-stroke:#8b5cf6;`
  },
  frost: {
    name: "Ice of Niflheim", icon: "◇",
    bg:"#00060f", surface:"#010c1a", border:"#0c2a4a",
    accent:"#0ea5e9", accentGlow:"#38bdf8", accentDim:"#0c4a6e88",
    text:"#e0f2fe", textMuted:"#0369a1", gold:"#7dd3fc",
    gradA:"#0ea5e9", gradB:"#6366f1",
    particle:"#38bdf8", runeStroke:"#7dd3fc",
    css:`--bg:#00060f;--surface:#010c1a;--border:#0c2a4a;--accent:#0ea5e9;--accent-glow:#38bdf8;--accent-dim:#0c4a6e88;--text:#e0f2fe;--text-muted:#0369a1;--gold:#7dd3fc;--grad-a:#0ea5e9;--grad-b:#6366f1;--particle:#38bdf8;--rune-stroke:#7dd3fc;`
  },
  gold: {
    name: "Gold of Asgard", icon: "◆",
    bg:"#060400", surface:"#110900", border:"#3d2800",
    accent:"#ca8a04", accentGlow:"#eab308", accentDim:"#713f1288",
    text:"#fef9c3", textMuted:"#854d0e", gold:"#fde047",
    gradA:"#ca8a04", gradB:"#dc2626",
    particle:"#eab308", runeStroke:"#fbbf24",
    css:`--bg:#060400;--surface:#110900;--border:#3d2800;--accent:#ca8a04;--accent-glow:#eab308;--accent-dim:#713f1288;--text:#fef9c3;--text-muted:#854d0e;--gold:#fde047;--grad-a:#ca8a04;--grad-b:#dc2626;--particle:#eab308;--rune-stroke:#fbbf24;`
  }
};

/* ═══════════════════════════════════════════════════════
   RUNE DATA
═══════════════════════════════════════════════════════ */
const RUNES = [
  { name:"Fehu",    meaning:"Wealth, Cattle, Abundance",         sound:"F",    char:"ᚠ", path:"M 30 10 L 30 90 M 30 30 L 70 10 M 30 50 L 70 30",              desc:"Represents mobile wealth and energy. In ancient times, cattle were the measure of a person's prosperity. Fehu signals abundance flowing outward into the world.",      deity:"Freyr",     element:"Fire",  aett:"Freyr's Aett" },
  { name:"Uruz",    meaning:"Wild Ox, Strength, Power",          sound:"U",    char:"ᚢ", path:"M 30 90 L 30 10 L 70 50 L 70 90",                               desc:"Physical strength and untamed potential, embodied by the wild aurochs. Uruz calls forth primal vitality from the deep, wild places of the self.",              deity:"Thor",      element:"Earth", aett:"Freyr's Aett" },
  { name:"Thurisaz",meaning:"Giant, Thor, Conflict",             sound:"TH",   char:"ᚦ", path:"M 30 10 L 30 90 M 30 30 L 70 50 L 30 70",                       desc:"Reactive force and conflict before resolution. The thorn that wounds but also protects. Associated with the Jötnar and the thunder-god Thor.",               deity:"Thor",      element:"Fire",  aett:"Freyr's Aett" },
  { name:"Ansuz",   meaning:"God, Odin, Communication",          sound:"A",    char:"ᚨ", path:"M 30 10 L 30 90 M 30 20 L 70 50 M 30 40 L 70 70",               desc:"Divine inspiration and wisdom flowing through breath. The rune of Odin, of communication, poetry, and the power of words to shape reality itself.",         deity:"Odin",      element:"Air",   aett:"Freyr's Aett" },
  { name:"Raido",   meaning:"Journey, Riding, Rhythm",           sound:"R",    char:"ᚱ", path:"M 30 10 L 30 90 M 30 10 L 70 30 L 30 50 M 30 50 L 70 90",       desc:"The sacred journey, both physical and spiritual. Raido is the rhythm of the cosmos, the right ordering of movement through time and across distance.",       deity:"Odin",      element:"Air",   aett:"Freyr's Aett" },
  { name:"Kenaz",   meaning:"Torch, Knowledge, Creativity",      sound:"K",    char:"ᚲ", path:"M 70 20 L 30 50 L 70 80",                                       desc:"The torch held in darkness — knowledge that illuminates. Kenaz is creative fire, the light of skill and craftsmanship burning in skilled hands.",            deity:"Freya",     element:"Fire",  aett:"Freyr's Aett" },
  { name:"Gebo",    meaning:"Gift, Generosity, Partnership",     sound:"G",    char:"ᚷ", path:"M 20 20 L 80 80 M 80 20 L 20 80",                               desc:"The sacred gift that creates bonds between giver and receiver. Gebo is the principle of reciprocity that holds all relationships in cosmic balance.",        deity:"Freyr",     element:"Air",   aett:"Freyr's Aett" },
  { name:"Wunjo",   meaning:"Joy, Harmony, Fellowship",          sound:"W",    char:"ᚹ", path:"M 30 10 L 30 90 M 30 10 L 70 35 L 30 60",                       desc:"Joy, the flag of perfection flying in clear air. Wunjo is the realization of wishes, kinship, and belonging among one's people and tribe.",               deity:"Odin",      element:"Air",   aett:"Freyr's Aett" },
  { name:"Hagalaz", meaning:"Hail, Destruction, Change",         sound:"H",    char:"ᚺ", path:"M 30 10 L 30 90 M 70 10 L 70 90 M 30 40 L 70 60",               desc:"Hail — the coldest seed that shatters before life can emerge. Hagalaz is crisis and transformation, destruction as the mother of all new creation.",      deity:"Urd",       element:"Ice",   aett:"Heimdall's Aett" },
  { name:"Nauthiz", meaning:"Need, Necessity, Restriction",      sound:"N",    char:"ᚾ", path:"M 50 10 L 50 90 M 20 35 L 80 65",                               desc:"The need-fire born of friction and constraint. Nauthiz is the forge of character, the hardship that sharpens the soul into its truest, most enduring form.",  deity:"Skuld",     element:"Fire",  aett:"Heimdall's Aett" },
  { name:"Isa",     meaning:"Ice, Stillness, Concentration",     sound:"I",    char:"ᛁ", path:"M 50 10 L 50 90",                                               desc:"Ice — perfect stillness, pure concentration of the ego. Isa freezes what must not move, the axis mundi around which all else turns in silence.",           deity:"Verdandi",  element:"Ice",   aett:"Heimdall's Aett" },
  { name:"Jera",    meaning:"Year, Harvest, Cycles",             sound:"J/Y",  char:"ᛃ", path:"M 50 10 L 20 40 L 50 70 M 50 30 L 80 60 L 50 90",               desc:"The harvest earned through right action and patient tending. Jera is the wheel of the year, the cosmic guarantee that effort bears fruit in its season.",  deity:"Freyr",     element:"Earth", aett:"Heimdall's Aett" },
  { name:"Eihwaz",  meaning:"Yew Tree, Endurance, Life & Death", sound:"EI",   char:"ᛇ", path:"M 50 10 L 50 90 M 50 10 L 80 40 M 50 90 L 20 60",               desc:"The yew tree — weapon and coffin, spanning life and death. The axis of Yggdrasil itself, connecting the nine worlds through its ancient roots.",          deity:"Odin",      element:"Earth", aett:"Heimdall's Aett" },
  { name:"Perthro", meaning:"Mystery, Chance, Fate",             sound:"P",    char:"ᛈ", path:"M 30 10 L 30 90 M 30 20 L 60 40 L 60 60 L 30 80",               desc:"The dice cup, the mystery of chance and the web of fate. What lies in Perthro's cup is known only to the Norns who weave the threads of all destinies.",  deity:"The Norns", element:"Water", aett:"Heimdall's Aett" },
  { name:"Algiz",   meaning:"Elk, Protection, Defense",          sound:"Z",    char:"ᛉ", path:"M 50 10 L 50 90 M 50 45 L 20 15 M 50 45 L 80 15",               desc:"The protective reach of the elk's antlers. Algiz guards the sacred boundary between human and divine, shielding the seeker upon the path.",             deity:"Heimdall",  element:"Air",   aett:"Heimdall's Aett" },
  { name:"Sowilo",  meaning:"Sun, Success, Wholeness",           sound:"S",    char:"ᛊ", path:"M 70 20 L 30 40 L 70 60 L 30 80",                               desc:"The sun-wheel spinning conquering light across the sky. Sowilo is victory, wholeness, and the life-force that defeats all darkness and shadow.",           deity:"Sol",       element:"Fire",  aett:"Heimdall's Aett" },
  { name:"Tiwaz",   meaning:"Tyr, Justice, War, Honor",          sound:"T",    char:"ᛏ", path:"M 50 15 L 50 90 M 20 45 L 50 15 L 80 45",                       desc:"The spear-point of Tyr, sky-father of justice. Tiwaz demands honorable sacrifice — the one-handed god who gave his hand so others might be free.",       deity:"Tyr",       element:"Air",   aett:"Tyr's Aett" },
  { name:"Berkano", meaning:"Birch, Birth, New Beginnings",      sound:"B",    char:"ᛒ", path:"M 30 10 L 30 90 M 30 10 L 70 30 L 30 50 M 30 50 L 70 70 L 30 90", desc:"The birch goddess of birth, healing, and sanctuary. Berkano is the greenest of leaves, the beginning that emerges from sheltered, sacred darkness.",    deity:"Frigg",     element:"Earth", aett:"Tyr's Aett" },
  { name:"Ehwaz",   meaning:"Horse, Trust, Teamwork",            sound:"E",    char:"ᛖ", path:"M 30 90 L 30 10 L 50 40 L 70 10 L 70 90",                       desc:"The sacred bond between rider and horse — trust made physical. Ehwaz is harmonious partnership, the two that move as one across the world-plain.",      deity:"Freyr",     element:"Earth", aett:"Tyr's Aett" },
  { name:"Mannaz",  meaning:"Man, Mankind, Humanity",            sound:"M",    char:"ᛗ", path:"M 30 90 L 30 10 L 70 40 M 70 90 L 70 10 L 30 40",               desc:"Humanity in its fullness — the rational mind, the social animal, the one who reaches both toward earth and sky. The living divine mirror.",             deity:"Odin",      element:"Air",   aett:"Tyr's Aett" },
  { name:"Laguz",   meaning:"Water, Intuition, Flow",            sound:"L",    char:"ᛚ", path:"M 30 10 L 30 90 M 30 10 L 70 50",                               desc:"Water flowing to the lowest place, finding every hidden path. Laguz is the unconscious mind, intuition, and the deep currents beneath surface reality.",  deity:"Njord",     element:"Water", aett:"Tyr's Aett" },
  { name:"Ingwaz",  meaning:"Ing, Fertility, Internal Growth",   sound:"NG",   char:"ᛜ", path:"M 50 20 L 80 50 L 50 80 L 20 50 Z",                             desc:"The seed held in perfect potential. Ingwaz is the completion of one cycle and gestation of the next — the world held inside the egg before hatching.",     deity:"Freyr",     element:"Earth", aett:"Tyr's Aett" },
  { name:"Othala",  meaning:"Heritage, Estate, Ancestry",        sound:"O",    char:"ᛟ", path:"M 50 10 L 80 40 L 65 85 L 35 85 L 20 40 Z M 20 40 L 50 10 L 80 40", desc:"The sacred enclosure of home and ancestral wisdom. Othala is what cannot be bought — the inheritance of bloodline, land, and spiritual tradition.",   deity:"Odin",      element:"Earth", aett:"Tyr's Aett" },
  { name:"Dagaz",   meaning:"Day, Breakthrough, Awakening",      sound:"D",    char:"ᛞ", path:"M 20 50 L 50 20 L 80 50 L 50 80 Z M 20 50 L 50 80 M 50 20 L 80 50", desc:"The crack of dawn — the moment of breakthrough between darkness and light. Dagaz is the awakening that cannot be undone, the point of no return.",    deity:"Odin",      element:"Fire",  aett:"Tyr's Aett" }
];

const UNICODE = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛟᛞ";
const rndRune = () => UNICODE[Math.floor(Math.random() * UNICODE.length)];

/* ═══════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:var(--bg,#070300);color:var(--text,#fed7aa);font-family:'Palatino Linotype',Palatino,Georgia,serif;overflow-x:hidden}
    button,textarea,input{font-family:inherit}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
    @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}40%{transform:translateY(-14px) rotate(2deg)}70%{transform:translateY(-7px) rotate(-1deg)}}
    @keyframes pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.6;transform:scale(1.06)}}
    @keyframes shimmer{0%{transform:translateX(-200%)}100%{transform:translateX(200%)}}
    @keyframes spin-slow{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    @keyframes particle-out{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--vx),var(--vy)) scale(0)}}
    .float{animation:float 7s ease-in-out infinite}
    .pulse{animation:pulse 3s ease-in-out infinite}
  `}</style>
);

/* ═══════════════════════════════════════════════════════
   APPLY THEME TO :root
═══════════════════════════════════════════════════════ */
const useThemeCss = (theme) => {
  useEffect(() => {
    let s = document.getElementById("rr-theme");
    if (!s) { s = document.createElement("style"); s.id = "rr-theme"; document.head.appendChild(s); }
    s.textContent = `:root{${THEMES[theme].css}}`;
  }, [theme]);
};

/* ═══════════════════════════════════════════════════════
   NEBULA BACKGROUND
═══════════════════════════════════════════════════════ */
const NebulaBackground = ({ theme }) => {
  const cvs = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const c = cvs.current, ctx = c.getContext("2d");
    const T = THEMES[theme];
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);

    const stars = Array.from({length:220},()=>({
      x:Math.random(), y:Math.random(),
      r:Math.random()*1.6+0.2, ph:Math.random()*Math.PI*2,
      sp:Math.random()*0.004+0.002, br:Math.random()*0.55+0.2
    }));
    const blobs = Array.from({length:7},(_,i)=>({
      x:Math.random(), y:Math.random(),
      rx:Math.random()*0.4+0.1, ry:Math.random()*0.3+0.08,
      ph:Math.random()*Math.PI*2, sp:Math.random()*0.0006+0.0002,
      op:Math.random()*0.07+0.015,
      col:i%2===0?T.gradA:T.gradB
    }));

    let t=0;
    const draw=()=>{
      const w=c.width, h=c.height;
      ctx.fillStyle=T.bg; ctx.fillRect(0,0,w,h);

      blobs.forEach(b=>{
        const bx=b.x*w, by=b.y*h;
        const rx=b.rx*w, ry=b.ry*h;
        const pulse=1+Math.sin(t*b.sp+b.ph)*0.18;
        const g=ctx.createRadialGradient(bx,by,0,bx,by,Math.max(rx,ry)*pulse);
        g.addColorStop(0,b.col+"28"); g.addColorStop(0.5,b.col+"10"); g.addColorStop(1,"transparent");
        ctx.save(); ctx.translate(bx,by); ctx.scale(1,ry/rx); ctx.translate(-bx,-by);
        ctx.beginPath(); ctx.arc(bx,by,rx*pulse,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill(); ctx.restore();
      });

      // subtle rune grid
      ctx.font="15px serif";
      const cols=Math.ceil(w/64), rows=Math.ceil(h/64);
      for(let r=0;r<rows;r++) for(let cc=0;cc<cols;cc++){
        if((r+cc)%5!==0) continue;
        ctx.fillStyle=T.particle+"09";
        ctx.fillText(UNICODE[(r*cols+cc)%UNICODE.length], cc*64+16, r*64+42);
      }

      stars.forEach(s=>{
        const br=s.br*(0.5+0.5*Math.sin(t*s.sp+s.ph));
        const sx=s.x*w, sy=s.y*h;
        ctx.beginPath(); ctx.arc(sx,sy,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${br})`; ctx.fill();
        if(s.r>1.2&&br>0.6){
          ctx.strokeStyle=`rgba(255,255,255,${br*0.35})`; ctx.lineWidth=0.5;
          ctx.beginPath(); ctx.moveTo(sx-7,sy); ctx.lineTo(sx+7,sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx,sy-7); ctx.lineTo(sx,sy+7); ctx.stroke();
        }
      });
      t++; raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[theme]);
  return <canvas ref={cvs} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
};

/* ═══════════════════════════════════════════════════════
   RUNE PARTICLE BURST
═══════════════════════════════════════════════════════ */
const ParticleBurst = ({ x, y, color, onDone }) => {
  const cvs = useRef(null);
  useEffect(()=>{
    const c=cvs.current, ctx=c.getContext("2d");
    c.width=320; c.height=320;
    const ps=Array.from({length:48},()=>({
      x:160, y:160,
      vx:(Math.random()-0.5)*12, vy:(Math.random()-0.5)*12,
      r:Math.random()*3+1, life:1, decay:Math.random()*0.02+0.012,
      ch:rndRune()
    }));
    let raf;
    const go=()=>{
      ctx.clearRect(0,0,320,320);
      let alive=false;
      ps.forEach(p=>{
        if(p.life<=0)return; alive=true;
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.12; p.life-=p.decay;
        ctx.globalAlpha=Math.max(0,p.life);
        ctx.fillStyle=color; ctx.font=`${p.r*5}px serif`;
        ctx.fillText(p.ch,p.x,p.y);
      });
      ctx.globalAlpha=1;
      if(alive) raf=requestAnimationFrame(go); else onDone?.();
    };
    go(); return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={cvs} style={{position:"fixed",left:x-160,top:y-160,width:320,height:320,pointerEvents:"none",zIndex:9999}}/>;
};

/* ═══════════════════════════════════════════════════════
   INTRO SCREEN
═══════════════════════════════════════════════════════ */
const IntroScreen = ({ onEnter, theme }) => {
  const T = THEMES[theme];
  const cvs = useRef(null);
  const wrap = useRef(null);
  const titleEl = useRef(null);
  const subEl = useRef(null);
  const btnEl = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(()=>{
    const c=cvs.current, ctx=c.getContext("2d");
    c.width=window.innerWidth; c.height=window.innerHeight;
    const cols=Math.floor(c.width/28);
    const drops=Array(cols).fill(0).map(()=>-Math.random()*25);
    let raf;
    const draw=()=>{
      ctx.fillStyle="rgba(0,0,0,0.07)"; ctx.fillRect(0,0,c.width,c.height);
      ctx.font="21px serif";
      for(let i=0;i<drops.length;i++){
        const a=Math.random()*0.75+0.1;
        ctx.fillStyle=T.particle+Math.floor(a*255).toString(16).padStart(2,"0");
        ctx.fillText(rndRune(), i*28+4, drops[i]*28);
        if(drops[i]*28>c.height&&Math.random()>0.97) drops[i]=0;
        drops[i]+=0.28;
      }
      raf=requestAnimationFrame(draw);
    };
    draw();

    const tl=gsap.timeline({delay:0.4});
    gsap.set([titleEl.current,subEl.current,btnEl.current],{opacity:0,y:40});
    tl.to(titleEl.current,{opacity:1,y:0,duration:1.5,ease:"power4.out"})
      .to(subEl.current,{opacity:1,y:0,duration:1,ease:"power3.out"},"-=0.8")
      .to(btnEl.current,{opacity:1,y:0,scale:1,duration:0.8,ease:"back.out(1.7)"},"-=0.4")
      .call(()=>setReady(true));

    return()=>cancelAnimationFrame(raf);
  },[theme]);

  const enter=()=>{
    gsap.to(wrap.current,{opacity:0,scale:1.04,duration:0.7,ease:"power2.in",onComplete:onEnter});
  };

  return(
    <div ref={wrap} style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:T.bg}}>
      <canvas ref={cvs} style={{position:"absolute",inset:0,opacity:0.55}}/>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 65% 65% at 50% 50%, transparent 10%, ${T.bg}bb 65%, ${T.bg} 100%)`,pointerEvents:"none"}}/>
      {/* ambient orb */}
      <div style={{position:"absolute",width:520,height:520,borderRadius:"50%",background:`radial-gradient(circle, ${T.accent}14 0%, transparent 70%)`,pointerEvents:"none"}} className="pulse"/>

      <div style={{position:"relative",textAlign:"center",padding:"0 2rem",zIndex:2}}>
        <div style={{fontSize:"3.5rem",fontFamily:"serif",color:T.accentGlow,opacity:0.28,marginBottom:"1.2rem",lineHeight:1}} className="float">ᛟ</div>

        <h1 ref={titleEl} style={{
          fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',
          fontSize:"clamp(2.8rem,9vw,6.5rem)",
          fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
          background:`linear-gradient(145deg, ${T.text} 0%, ${T.accentGlow} 45%, ${T.gold} 100%)`,
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          margin:"0 0 1.2rem",filter:`drop-shadow(0 0 50px ${T.accent}66)`
        }}>Rune Realm</h1>

        <div ref={subEl} style={{
          color:T.textMuted, fontSize:"clamp(0.7rem,1.8vw,0.95rem)",
          letterSpacing:"0.42em", textTransform:"uppercase", fontFamily:"serif", marginBottom:"3rem"
        }}>Wisdom of the Elder Futhark</div>

        <button ref={btnEl}
          onClick={enter}
          onMouseEnter={e=>gsap.to(e.currentTarget,{scale:1.06,borderColor:T.accentGlow,color:T.text,duration:0.25})}
          onMouseLeave={e=>gsap.to(e.currentTarget,{scale:1,borderColor:T.accent+"66",color:T.textMuted,duration:0.3})}
          style={{
            padding:"0.9rem 3rem",background:"transparent",
            border:`1px solid ${T.accent}66`,
            color:T.textMuted, fontSize:"0.82rem", letterSpacing:"0.32em",
            textTransform:"uppercase",cursor:"pointer",position:"relative",overflow:"hidden",
            fontFamily:"serif",transition:"color 0.3s"
          }}>
          <span style={{position:"absolute",inset:0,background:`linear-gradient(90deg,transparent,${T.accent}22,transparent)`,animation:"shimmer 3s infinite"}}/>
          Enter the Futhark
        </button>

        <div style={{marginTop:"4rem",fontFamily:"serif",fontSize:"1.4rem",letterSpacing:"1.4rem",color:T.text,opacity:0.12}}>
          ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   THEME SWITCHER
═══════════════════════════════════════════════════════ */
const ThemeSwitcher = ({ current, onChange }) => {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  useEffect(()=>{
    if(open&&panel.current) gsap.fromTo(panel.current,{opacity:0,y:-8,scale:0.94},{opacity:1,y:0,scale:1,duration:0.2,ease:"power2.out"});
  },[open]);
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        background:"transparent",border:"1px solid var(--border)",
        color:"var(--accent-glow)",padding:"5px 12px",cursor:"pointer",
        borderRadius:"4px",fontSize:"1rem",display:"flex",alignItems:"center",
        gap:"6px",transition:"all 0.2s"
      }}>
        <span>{THEMES[current].icon}</span>
        <span style={{fontSize:"0.65rem",letterSpacing:"0.12em",color:"var(--text-muted)"}}>Theme</span>
      </button>
      {open&&(
        <div ref={panel} style={{
          position:"absolute",top:"calc(100% + 8px)",right:0,
          background:"var(--surface)",border:"1px solid var(--border)",
          borderRadius:"8px",padding:"6px",zIndex:1000,minWidth:"175px",
          boxShadow:"0 20px 50px rgba(0,0,0,0.7)"
        }}>
          {Object.entries(THEMES).map(([key,th])=>(
            <button key={key} onClick={()=>{onChange(key);setOpen(false);}} style={{
              display:"flex",alignItems:"center",gap:"10px",width:"100%",
              padding:"8px 12px",background:current===key?"var(--accent-dim)":"transparent",
              border:"none",color:"var(--text)",cursor:"pointer",borderRadius:"4px",
              fontSize:"0.78rem",letterSpacing:"0.05em",transition:"background 0.15s"
            }}>
              <span style={{fontSize:"1rem"}}>{th.icon}</span>{th.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   RUNE DETAIL OVERLAY
═══════════════════════════════════════════════════════ */
const RuneDetail = ({ rune, onBack, theme }) => {
  const T = THEMES[theme];
  const overlay = useRef(null);
  const runeDiv = useRef(null);
  const infoDiv = useRef(null);
  const [burst, setBurst] = useState(null);

  useEffect(()=>{
    const tl=gsap.timeline();
    tl.fromTo(overlay.current,{opacity:0},{opacity:1,duration:0.4})
      .fromTo(runeDiv.current,
        {scale:0.15,opacity:0,rotation:-20,filter:"blur(40px)"},
        {scale:1,opacity:1,rotation:0,filter:"blur(0px)",duration:1.3,ease:"power4.out"},"-=0.1")
      .fromTo(Array.from(infoDiv.current?.children||[]),
        {opacity:0,x:60},
        {opacity:1,x:0,duration:0.6,ease:"power3.out",stagger:0.11},"-=0.7");

    setTimeout(()=>{
      const r=runeDiv.current?.getBoundingClientRect();
      if(r) setBurst({x:r.left+r.width/2,y:r.top+r.height/2});
    },350);

    const glow=gsap.to(runeDiv.current,{
      filter:`drop-shadow(0 0 35px ${T.accentGlow}) drop-shadow(0 0 70px ${T.accent}77)`,
      duration:2.2,repeat:-1,yoyo:true,ease:"sine.inOut"
    });
    return()=>glow.kill();
  },[rune]);

  const goBack=()=>{
    gsap.to(overlay.current,{opacity:0,scale:0.97,duration:0.35,onComplete:onBack});
  };

  const elemIcons={Fire:"🔥",Earth:"🌿",Air:"💨",Water:"💧",Ice:"❄️"};

  return(
    <div ref={overlay} style={{
      position:"fixed",inset:0,zIndex:200,
      background:`${T.bg}f0`,backdropFilter:"blur(24px)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"2rem",overflowY:"auto"
    }}>
      {burst&&<ParticleBurst x={burst.x} y={burst.y} color={T.accentGlow} onDone={()=>setBurst(null)}/>}

      <button onClick={goBack}
        onMouseEnter={e=>gsap.to(e.currentTarget,{x:-5,duration:0.2})}
        onMouseLeave={e=>gsap.to(e.currentTarget,{x:0,duration:0.2})}
        style={{
          position:"fixed",top:"1.5rem",left:"1.5rem",
          background:`${T.surface}cc`,border:`1px solid ${T.border}`,
          color:"var(--text-muted)",padding:"7px 16px",cursor:"pointer",
          borderRadius:"4px",fontSize:"0.7rem",letterSpacing:"0.22em",textTransform:"uppercase",
          display:"flex",alignItems:"center",gap:"8px",transition:"color 0.2s",zIndex:10
        }}>
        ← Back
      </button>

      <div style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"4rem",maxWidth:"920px",width:"100%",flexWrap:"wrap",justifyContent:"center",paddingTop:"2rem"}}>
        {/* Rune */}
        <div ref={runeDiv} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <svg width="270" height="270" viewBox="0 0 100 100" fill="none"
            style={{stroke:`var(--rune-stroke)`,filter:`drop-shadow(0 0 25px ${T.accentGlow}88)`,strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round"}}
            className="float">
            <path d={rune.path}/>
          </svg>
          <div style={{textAlign:"center",fontSize:"2.8rem",fontFamily:"serif",color:T.accentGlow+"55",marginTop:"-0.5rem",letterSpacing:"0.1em"}}>{rune.char}</div>
        </div>

        {/* Info */}
        <div ref={infoDiv} style={{flex:1,minWidth:"260px"}}>
          <div style={{fontSize:"0.65rem",letterSpacing:"0.45em",color:"var(--text-muted)",textTransform:"uppercase",marginBottom:"0.5rem",fontFamily:"serif"}}>{rune.aett}</div>
          <h2 style={{
            fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',
            fontSize:"clamp(2.2rem,5vw,4rem)",fontWeight:700,
            background:`linear-gradient(135deg, var(--text), var(--accent-glow))`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
            margin:"0 0 0.75rem",letterSpacing:"0.05em"
          }}>{rune.name}</h2>
          <div style={{display:"inline-block",padding:"4px 16px",background:"var(--accent-dim)",border:`1px solid ${T.accent}44`,borderRadius:"20px",fontSize:"0.68rem",letterSpacing:"0.25em",color:"var(--accent-glow)",marginBottom:"1rem"}}>
            SOUND: {rune.sound}
          </div>
          <p style={{fontSize:"1.15rem",fontFamily:"serif",fontStyle:"italic",color:"var(--accent-glow)",opacity:0.8,marginBottom:"1rem"}}>"{rune.meaning}"</p>
          <div style={{width:"38px",height:"1px",background:`${T.accent}44`,marginBottom:"1.2rem"}}/>
          <p style={{color:"var(--text)",opacity:0.85,lineHeight:1.85,fontSize:"0.98rem",marginBottom:"1.5rem"}}>{rune.desc}</p>
          <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
            {[{l:"Element",v:`${elemIcons[rune.element]||""} ${rune.element}`},{l:"Deity",v:rune.deity},{l:"Aett",v:rune.aett.replace("'s Aett","")}].map(a=>(
              <div key={a.l} style={{padding:"7px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"4px",fontSize:"0.72rem"}}>
                <div style={{color:"var(--text-muted)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"2px"}}>{a.l}</div>
                <div style={{color:"var(--text)",fontFamily:"serif"}}>{a.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   HISTORICAL EXPLORER
═══════════════════════════════════════════════════════ */
const Explorer = ({ theme }) => {
  const T = THEMES[theme];
  const [sel, setSel] = useState(null);
  const [hov, setHov] = useState(null);
  const [aett, setAett] = useState("all");
  const grid = useRef(null);

  const filtered = aett==="all" ? RUNES : RUNES.filter(r=>r.aett===aett);

  const click=(rune,e)=>{
    gsap.to(e.currentTarget,{scale:1.25,duration:0.12,yoyo:true,repeat:1,ease:"power2.inOut"});
    setTimeout(()=>setSel(rune),80);
  };

  useEffect(()=>{
    if(!grid.current) return;
    gsap.fromTo(Array.from(grid.current.children),
      {opacity:0,y:25,scale:0.88},
      {opacity:1,y:0,scale:1,duration:0.45,stagger:0.035,ease:"power3.out"});
  },[aett]);

  if(sel) return <RuneDetail rune={sel} onBack={()=>setSel(null)} theme={theme}/>;

  return(
    <div>
      <header style={{textAlign:"center",marginBottom:"3rem"}}>
        <div style={{fontSize:"0.65rem",letterSpacing:"0.5em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.9rem",fontFamily:"serif"}}>Carved in Stone · Carried Through Ages</div>
        <h2 style={{fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',fontSize:"clamp(1.8rem,4vw,3rem)",background:"linear-gradient(135deg, var(--text), var(--accent-glow))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",margin:"0 0 0.9rem",letterSpacing:"0.08em"}}>Elder Futhark</h2>
        <p style={{color:"var(--text-muted)",maxWidth:"480px",margin:"0 auto 2rem",lineHeight:1.8,fontSize:"0.92rem"}}>24 runes across three sacred families. Click any stave to enter its world.</p>
        <div style={{display:"flex",gap:"0.7rem",justifyContent:"center",flexWrap:"wrap"}}>
          {["all","Freyr's Aett","Heimdall's Aett","Tyr's Aett"].map(a=>(
            <button key={a} onClick={()=>setAett(a)} style={{
              padding:"5px 18px",background:aett===a?"var(--accent-dim)":"transparent",
              border:`1px solid ${aett===a?"var(--accent)":"var(--border)"}`,
              color:aett===a?"var(--accent-glow)":"var(--text-muted)",
              borderRadius:"20px",cursor:"pointer",fontSize:"0.72rem",letterSpacing:"0.15em",
              textTransform:"uppercase",transition:"all 0.22s",fontFamily:"serif"
            }}>{a==="all"?"All 24 Runes":a.replace("'s Aett","")}</button>
          ))}
        </div>
      </header>

      <div ref={grid} style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(105px,1fr))",gap:"0.9rem"}}>
        {filtered.map(rune=>(
          <button key={rune.name}
            onClick={e=>click(rune,e)}
            onMouseEnter={e=>{setHov(rune.name);gsap.to(e.currentTarget,{y:-9,scale:1.06,duration:0.28,ease:"power2.out"});}}
            onMouseLeave={e=>{setHov(null);gsap.to(e.currentTarget,{y:0,scale:1,duration:0.38,ease:"power2.out"});}}
            style={{
              display:"flex",flexDirection:"column",alignItems:"center",
              padding:"1.4rem 0.8rem",background:"var(--surface)",
              border:`1px solid ${hov===rune.name?"var(--accent)":"var(--border)"}`,
              borderRadius:"8px",cursor:"pointer",transition:"border-color 0.28s, box-shadow 0.28s",
              position:"relative",overflow:"hidden",
              boxShadow:hov===rune.name?`0 0 28px ${T.accent}22,inset 0 0 18px ${T.accent}08`:"none"
            }}>
            <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 40%, ${T.accent}14, transparent 70%)`,opacity:hov===rune.name?1:0,transition:"opacity 0.28s",pointerEvents:"none"}}/>
            <svg width="54" height="54" viewBox="0 0 100 100" fill="none"
              style={{stroke:hov===rune.name?"var(--accent-glow)":"var(--text-muted)",transition:"stroke 0.3s, filter 0.3s",filter:hov===rune.name?`drop-shadow(0 0 10px ${T.accentGlow})`:"none",strokeWidth:5,strokeLinecap:"round",strokeLinejoin:"round",zIndex:1}}>
              <path d={rune.path}/>
            </svg>
            <span style={{marginTop:"0.7rem",fontSize:"0.62rem",letterSpacing:"0.2em",textTransform:"uppercase",color:hov===rune.name?"var(--accent-glow)":"var(--text-muted)",fontFamily:"serif",transition:"color 0.28s",zIndex:1}}>{rune.name}</span>
            {hov===rune.name&&<span style={{position:"absolute",bottom:"5px",fontSize:"0.65rem",color:"var(--text-muted)",opacity:0.5}}>{rune.char}</span>}
          </button>
        ))}
      </div>

      {/* Aett legend */}
      <div style={{marginTop:"3rem",padding:"2rem",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"8px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"1.5rem"}}>
        {[
          {n:"Freyr's Aett",r:"ᚠᚢᚦᚨᚱᚲᚷᚹ",d:"First family — abundance, strength, communication, gifts."},
          {n:"Heimdall's Aett",r:"ᚺᚾᛁᛃᛇᛈᛉᛊ",d:"Second family — fate, hardship, stillness, protection."},
          {n:"Tyr's Aett",r:"ᛏᛒᛖᛗᛚᛜᛟᛞ",d:"Third family — justice, birth, humanity, heritage, dawn."},
        ].map(a=>(
          <div key={a.n}>
            <div style={{fontFamily:"serif",color:"var(--accent-glow)",fontSize:"0.78rem",marginBottom:"4px",letterSpacing:"0.1em"}}>{a.n}</div>
            <div style={{fontFamily:"serif",fontSize:"1.5rem",color:"var(--text)",opacity:0.45,marginBottom:"5px",letterSpacing:"0.3em"}}>{a.r}</div>
            <div style={{color:"var(--text-muted)",fontSize:"0.73rem",lineHeight:1.65}}>{a.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SCRATCH CANVAS
═══════════════════════════════════════════════════════ */
const ScratchCanvas = ({ rune, onReveal, theme }) => {
  const T = THEMES[theme];
  const cvs = useRef(null);
  const wrap = useRef(null);
  const [draw, setDraw] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(()=>{
    const c=cvs.current, ctx=c.getContext("2d");
    ctx.fillStyle="#09050f";
    ctx.fillRect(0,0,300,300);
    for(let i=0;i<9000;i++){
      const v=Math.floor(Math.random()*22+6);
      ctx.fillStyle=`rgb(${v},${v},${v})`;
      ctx.fillRect(Math.random()*300,Math.random()*300,Math.random()*3+0.5,1);
    }
    ctx.font="16px serif";
    ctx.fillStyle=T.particle+"16";
    for(let r=0;r<8;r++) for(let cc=0;cc<8;cc++) ctx.fillText(rndRune(),cc*38+6,r*38+26);
    ctx.font="bold 14px serif";
    ctx.fillStyle=T.textMuted+"99";
    ctx.textAlign="center";
    ctx.fillText("— Rub to reveal your fate —",150,152);
  },[]);

  const scratchAt=(cx,cy)=>{
    if(!draw||done) return;
    const c=cvs.current, ctx=c.getContext("2d");
    const rect=c.getBoundingClientRect();
    const sx=(cx-rect.left)*(300/rect.width);
    const sy=(cy-rect.top)*(300/rect.height);
    ctx.globalCompositeOperation="destination-out";
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,30);
    g.addColorStop(0,"rgba(0,0,0,1)"); g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(sx,sy,30,0,Math.PI*2); ctx.fill();
    if(Math.random()<0.09){
      const px=ctx.getImageData(0,0,300,300).data;
      let t=0; for(let i=3;i<px.length;i+=4) if(px[i]===0) t++;
      if(t/(300*300)>0.56){
        setDone(true);
        gsap.to(cvs.current,{opacity:0,scale:1.12,duration:0.85});
        gsap.to(wrap.current.querySelector(".behind-rune"),{scale:1.18,duration:0.4,yoyo:true,repeat:1,ease:"power2.inOut"});
        setTimeout(onReveal,1900);
      }
    }
  };

  return(
    <div ref={wrap} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem"}}>
      <div style={{position:"relative",width:300,height:300}}>
        {/* Rune underneath */}
        <div className="behind-rune" style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="175" height="175" viewBox="0 0 100 100" fill="none"
            style={{stroke:T.runeStroke,filter:`drop-shadow(0 0 22px ${T.accentGlow}) drop-shadow(0 0 55px ${T.accent}88)`,strokeWidth:5,strokeLinecap:"round",strokeLinejoin:"round",animation:done?"float 5s ease-in-out infinite":"none"}}>
            <path d={rune.path}/>
          </svg>
        </div>
        <canvas ref={cvs} width={300} height={300}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",borderRadius:"8px",cursor:"crosshair",touchAction:"none",transition:"opacity 0.9s"}}
          onMouseDown={()=>setDraw(true)} onMouseUp={()=>setDraw(false)} onMouseLeave={()=>setDraw(false)}
          onMouseMove={e=>scratchAt(e.clientX,e.clientY)}
          onTouchStart={()=>setDraw(true)} onTouchEnd={()=>setDraw(false)}
          onTouchMove={e=>scratchAt(e.touches[0].clientX,e.touches[0].clientY)}
        />
      </div>
      <p style={{color:done?"var(--accent-glow)":"var(--text-muted)",fontFamily:"serif",letterSpacing:"0.3em",fontSize:"0.78rem",textTransform:"uppercase",transition:"color 0.5s",animation:done?"pulse 2s ease-in-out infinite":"none"}}>
        {done?`The Norns speak: ${rune.name}`:"Uncover your fate"}
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   DAILY RUNE JOURNAL
═══════════════════════════════════════════════════════ */
const Daily = ({ theme }) => {
  const T = THEMES[theme];
  const [state, setState] = useState({rune:null,drawnDate:null,journalEntry:""});
  const [scratchRune, setScratchRune] = useState(null);
  const [jVal, setJVal] = useState("");
  const hdr = useRef(null);
  const body = useRef(null);

  useEffect(()=>{
    try{
      const s=localStorage.getItem("rr_daily");
      if(s){const p=JSON.parse(s); if(p.drawnDate===new Date().toDateString()){setState(p);setJVal(p.journalEntry||"");}}
    }catch(e){}
    gsap.fromTo(hdr.current,{opacity:0,y:-25},{opacity:1,y:0,duration:0.75,ease:"power3.out"});
  },[]);

  const save=(st)=>{
    setState(st);
    try{localStorage.setItem("rr_daily",JSON.stringify(st));}catch(e){}
  };

  const startDraw=()=>{
    setScratchRune(RUNES[Math.floor(Math.random()*RUNES.length)]);
    gsap.fromTo(body.current,{opacity:0,scale:0.96},{opacity:1,scale:1,duration:0.45});
  };

  const onReveal=()=>{
    const r=scratchRune;
    save({rune:r,drawnDate:new Date().toDateString(),journalEntry:""});
    setScratchRune(null);
    setTimeout(()=>{
      if(body.current?.children) gsap.fromTo(Array.from(body.current.children),{opacity:0,y:28},{opacity:1,y:0,duration:0.55,stagger:0.14,ease:"power3.out"});
    },100);
  };

  const handleJ=e=>{setJVal(e.target.value);save({...state,journalEntry:e.target.value});};

  const today=new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  return(
    <div style={{maxWidth:"820px",margin:"0 auto"}}>
      <header ref={hdr} style={{textAlign:"center",marginBottom:"2.5rem"}}>
        <div style={{fontSize:"0.65rem",letterSpacing:"0.5em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.7rem",fontFamily:"serif"}}>{today}</div>
        <h2 style={{fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',fontSize:"clamp(1.8rem,4vw,3rem)",background:"linear-gradient(135deg, var(--text), var(--accent-glow))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",margin:"0 0 0.75rem",letterSpacing:"0.08em"}}>Daily Draw</h2>
        <p style={{color:"var(--text-muted)",fontSize:"0.88rem",lineHeight:1.8}}>Still your mind. Draw from the ancient bag. Let the Norns speak.</p>
      </header>

      <div ref={body}>
        {scratchRune&&!state.rune&&<ScratchCanvas rune={scratchRune} onReveal={onReveal} theme={theme}/>}

        {!scratchRune&&!state.rune&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"320px",border:`1px dashed ${T.border}`,borderRadius:"12px",background:"var(--surface)",gap:"1.5rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 60%, ${T.accent}0c, transparent 70%)`,pointerEvents:"none"}}/>
            <div style={{fontSize:"5rem",fontFamily:"serif",color:"var(--accent-glow)",opacity:0.18,lineHeight:1}} className="float">ᛟ</div>
            <button onClick={startDraw}
              onMouseEnter={e=>gsap.to(e.currentTarget,{scale:1.07,duration:0.22})}
              onMouseLeave={e=>gsap.to(e.currentTarget,{scale:1,duration:0.22})}
              style={{
                padding:"0.9rem 2.8rem",background:`linear-gradient(135deg,${T.accentDim},${T.accent}44)`,
                border:`1px solid ${T.accent}66`,color:"var(--text)",cursor:"pointer",
                borderRadius:"4px",fontSize:"0.82rem",letterSpacing:"0.3em",textTransform:"uppercase",
                fontFamily:"serif",position:"relative",overflow:"hidden"
              }}>
              <span style={{position:"absolute",inset:0,background:`linear-gradient(90deg,transparent,${T.accent}22,transparent)`,animation:"shimmer 2.5s infinite"}}/>
              Draw Your Rune
            </button>
            <p style={{color:"var(--text-muted)",fontSize:"0.78rem",maxWidth:"300px",textAlign:"center",lineHeight:1.75}}>Each day reveals one stave. Scratch stone to reveal it. Journal your reflections. Return tomorrow.</p>
          </div>
        )}

        {state.rune&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"2rem"}}>
            {/* Rune card */}
            <div style={{background:"var(--surface)",border:`1px solid ${T.border}`,borderRadius:"12px",padding:"2.5rem",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"220px",height:"220px",borderRadius:"50%",background:`radial-gradient(circle, ${T.accent}18, transparent 70%)`,pointerEvents:"none"}}/>
              <svg width="145" height="145" viewBox="0 0 100 100" fill="none"
                style={{stroke:"var(--rune-stroke)",filter:`drop-shadow(0 0 16px ${T.accentGlow}88)`,strokeWidth:5,strokeLinecap:"round",strokeLinejoin:"round",marginBottom:"1.5rem",zIndex:1}}
                className="float">
                <path d={state.rune.path}/>
              </svg>
              <h3 style={{fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',fontSize:"2rem",color:"var(--text)",margin:"0 0 0.5rem",zIndex:1}}>{state.rune.name}</h3>
              <div style={{padding:"3px 14px",background:"var(--accent-dim)",border:`1px solid ${T.accent}44`,borderRadius:"20px",fontSize:"0.63rem",letterSpacing:"0.25em",color:"var(--accent-glow)",marginBottom:"0.9rem",zIndex:1}}>{state.rune.sound} · {state.rune.element}</div>
              <p style={{fontFamily:"serif",fontStyle:"italic",color:"var(--accent-glow)",opacity:0.78,fontSize:"0.98rem",zIndex:1}}>"{state.rune.meaning}"</p>
              <div style={{marginTop:"1rem",padding:"0.75rem",background:`${T.bg}88`,borderRadius:"4px",fontSize:"0.78rem",color:"var(--text-muted)",lineHeight:1.65,zIndex:1}}>{state.rune.desc.substring(0,130)}…</div>
            </div>

            {/* Journal */}
            <div style={{background:"var(--surface)",border:`1px solid ${T.border}`,borderRadius:"12px",padding:"2rem",display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"1rem",paddingBottom:"0.75rem",borderBottom:`1px solid ${T.border}`}}>
                <PenTool size={15} color={T.accentGlow}/>
                <span style={{fontFamily:"serif",color:"var(--accent-glow)",letterSpacing:"0.15em",fontSize:"0.82rem",textTransform:"uppercase"}}>Reflection</span>
              </div>
              <p style={{color:"var(--text-muted)",fontSize:"0.78rem",lineHeight:1.75,marginBottom:"1rem"}}>
                How does <em style={{color:"var(--text)"}}>{state.rune.meaning}</em> manifest in your life today? The runes are mirrors, not prophecy.
              </p>
              <textarea value={jVal} onChange={handleJ}
                placeholder="Write your thoughts here. The Norns are listening..."
                style={{flex:1,minHeight:"190px",background:`${T.bg}88`,border:`1px solid ${T.border}`,borderRadius:"6px",padding:"1rem",color:"var(--text)",fontSize:"0.88rem",lineHeight:1.75,resize:"none",outline:"none",fontFamily:"serif",transition:"border-color 0.2s"}}
                onFocus={e=>e.target.style.borderColor=T.accent}
                onBlur={e=>e.target.style.borderColor=T.border}
              />
              <div style={{marginTop:"0.9rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"var(--text-muted)",fontSize:"0.68rem",letterSpacing:"0.1em"}}>{state.rune.deity} watches</span>
                <span style={{fontSize:"0.68rem",color:"var(--text-muted)"}}>{jVal.length} runes spoken</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   HOME VIEW
═══════════════════════════════════════════════════════ */
const Home = ({ theme, onNav }) => {
  const T = THEMES[theme];
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const [hov, setHov] = useState(null);

  useEffect(()=>{
    gsap.fromTo(heroRef.current?.children,{opacity:0,y:35},{opacity:1,y:0,duration:0.75,stagger:0.13,ease:"power3.out"});
    gsap.fromTo(cardsRef.current?.children,{opacity:0,scale:0.9,y:28},{opacity:1,scale:1,y:0,duration:0.6,stagger:0.18,ease:"back.out(1.4)",delay:0.45});
  },[]);

  const cards=[
    {key:"explorer",icon:"ᚠ",sub:"24 Runes · Three Sacred Families",title:"Historical Explorer",desc:"Journey through the Elder Futhark — each stave carved with two thousand years of Germanic wisdom."},
    {key:"daily",icon:"ᛟ",sub:"Scratch · Reveal · Reflect",title:"Daily Draw",desc:"Uncover your rune through an ancient stone-scratch ritual. Journal reflections in this sacred space."}
  ];

  return(
    <div>
      <div ref={heroRef} style={{textAlign:"center",marginBottom:"5rem",paddingTop:"2rem"}}>
        <div style={{fontFamily:"serif",fontSize:"1.5rem",letterSpacing:"1.4rem",color:"var(--text-muted)",opacity:0.17,marginBottom:"2rem"}}>ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ</div>
        <h1 style={{fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',fontSize:"clamp(2.5rem,6vw,5rem)",background:`linear-gradient(145deg, var(--text) 0%, var(--accent-glow) 45%, var(--gold) 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",margin:"0 0 1.4rem",letterSpacing:"0.08em",filter:`drop-shadow(0 0 40px ${T.accent}44)`}}>Wisdom of the Staves</h1>
        <p style={{color:"var(--text-muted)",maxWidth:"500px",margin:"0 auto 2rem",lineHeight:1.9,fontSize:"1rem",fontFamily:"serif"}}>Step into the ancient world of the Germanic peoples. Explore the primordial alphabet carved into stone and bone, or let the runes speak to you.</p>
        <div style={{fontSize:"5rem",fontFamily:"serif",color:"var(--accent-glow)",opacity:0.1,lineHeight:1,marginBottom:"0.5rem"}} className="float">ᛟ</div>
      </div>
      <div ref={cardsRef} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"2rem",maxWidth:"760px",margin:"0 auto"}}>
        {cards.map(card=>(
          <button key={card.key} onClick={()=>onNav(card.key)}
            onMouseEnter={e=>{setHov(card.key);gsap.to(e.currentTarget,{y:-11,duration:0.28,ease:"power2.out"});}}
            onMouseLeave={e=>{setHov(null);gsap.to(e.currentTarget,{y:0,duration:0.38,ease:"power2.out"});}}
            style={{padding:"2.5rem",background:"var(--surface)",border:`1px solid ${hov===card.key?"var(--accent)":"var(--border)"}`,borderRadius:"12px",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden",transition:"border-color 0.28s",boxShadow:hov===card.key?`0 22px 60px ${T.accent}22`:"none"}}>
            <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 30% 30%, ${T.accent}12, transparent 60%)`,opacity:hov===card.key?1:0,transition:"opacity 0.38s",pointerEvents:"none"}}/>
            <div style={{fontSize:"3.2rem",fontFamily:"serif",color:"var(--accent-glow)",opacity:hov===card.key?0.65:0.25,transition:"opacity 0.3s",marginBottom:"0.9rem",lineHeight:1}}>{card.icon}</div>
            <div style={{fontSize:"0.62rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--accent-glow)",marginBottom:"0.4rem",fontFamily:"serif"}}>{card.sub}</div>
            <h3 style={{fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',fontSize:"1.45rem",color:"var(--text)",margin:"0 0 0.9rem",letterSpacing:"0.05em"}}>{card.title}</h3>
            <p style={{color:"var(--text-muted)",fontSize:"0.85rem",lineHeight:1.75,margin:"0 0 1.4rem"}}>{card.desc}</p>
            <div style={{display:"flex",alignItems:"center",gap:"6px",color:"var(--accent-glow)",fontSize:"0.72rem",letterSpacing:"0.2em",textTransform:"uppercase"}}>Enter <ChevronRight size={13}/></div>
          </button>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:"5rem",fontFamily:"serif",fontSize:"1.5rem",letterSpacing:"1.4rem",color:"var(--text-muted)",opacity:0.13}}>ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛟ ᛞ</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   APP SHELL
═══════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("intro");
  const [theme, setTheme] = useState("ember");
  const T = THEMES[theme];
  const mainRef = useRef(null);
  useThemeCss(theme);

  const nav = useCallback(to => {
    if(!mainRef.current){setView(to);return;}
    gsap.to(mainRef.current,{opacity:0,y:-18,duration:0.22,ease:"power2.in",onComplete:()=>{
      setView(to);
      gsap.fromTo(mainRef.current,{opacity:0,y:20},{opacity:1,y:0,duration:0.38,ease:"power3.out"});
    }});
  },[]);

  if(view==="intro") return <><GlobalStyles/><NebulaBackground theme={theme}/><IntroScreen onEnter={()=>nav("home")} theme={theme}/></>;

  return(
    <>
      <GlobalStyles/>
      <NebulaBackground theme={theme}/>

      <nav style={{position:"sticky",top:0,zIndex:100,background:`${T.bg}cc`,backdropFilter:"blur(22px)",borderBottom:`1px solid ${T.border}`,padding:"0 1.5rem",height:"54px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>nav("home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:'"Cinzel Decorative","Palatino Linotype",serif',fontSize:"1.05rem",letterSpacing:"0.1em",background:`linear-gradient(135deg, var(--text), var(--accent-glow))`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Rune Realm</button>
        <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
          {[{k:"explorer",l:"Explorer",I:<BookOpen size={14}/>},{k:"daily",l:"Daily",I:<Sparkles size={14}/>}].map(n=>(
            <button key={n.k} onClick={()=>nav(n.k)} style={{display:"flex",alignItems:"center",gap:"5px",padding:"5px 12px",background:view===n.k?"var(--accent-dim)":"transparent",border:`1px solid ${view===n.k?"var(--accent)":"transparent"}`,borderRadius:"4px",color:view===n.k?"var(--accent-glow)":"var(--text-muted)",cursor:"pointer",fontSize:"0.72rem",letterSpacing:"0.1em",transition:"all 0.2s"}}>
              {n.I}<span>{n.l}</span>
            </button>
          ))}
          <ThemeSwitcher current={theme} onChange={setTheme}/>
        </div>
      </nav>

      <main ref={mainRef} style={{position:"relative",zIndex:10,maxWidth:"1100px",margin:"0 auto",padding:"3rem 1.5rem 7rem"}}>
        {view==="home"    && <Home theme={theme} onNav={nav}/>}
        {view==="explorer"&& <Explorer theme={theme}/>}
        {view==="daily"   && <Daily theme={theme}/>}
      </main>
    </>
  );
}
