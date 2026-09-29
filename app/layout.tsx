"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Business data                                                        */
/* ------------------------------------------------------------------ */

const WA_NUMBER = "27718205432";
const PHONE_DISPLAY = "071 820 5432";
const PHONE_TEL = "+27718205432";
const ADDRESS_LINE_1 = "Shop B5, Level 2";
const ADDRESS_LINE_2 = "Pearls Mall, Umhlanga";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Barber at Pearls, Pearls Mall, Umhlanga");

// Opens Google's "write a review" dialog for the shop's Google Maps listing.
const GOOGLE_PLACE_ID = "ChIJs_IUYgAP9x4RW7K8SwCo0ro";
const REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

type Service = { id: string; name: string; tagline: string; includes: string[] };

const SERVICES: Service[] = [
  {
    id: "fade",
    name: "Fade",
    tagline: "Skin, low, mid or high, blended clean into your length.",
    includes: ["Shape consultation", "Clipper and scissor blend", "Line-up and neck finish"],
  },
  {
    id: "beard",
    name: "Beard Trim",
    tagline: "Shaped to your jaw, with sharp cheek and neck lines.",
    includes: ["Length and shape", "Crisp outline", "Tidy finish"],
  },
  {
    id: "shave",
    name: "Hot Towel Shave",
    tagline: "The classic ritual: hot towel, close razor, cool finish.",
    includes: ["Hot towel prep", "Close razor shave", "Cool towel finish"],
  },
  {
    id: "vip",
    name: "VIP Styling",
    tagline: "The full treatment for weddings, events and big days.",
    includes: ["Cut and beard work", "Styled finish", "Extra time in the chair"],
  },
];

const DAYS = ["Today", "Tomorrow", "This weekend", "Another day"] as const;
const TIMES = ["Morning", "Afternoon", "Late afternoon"] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/* Styles: everything visual lives here so it never depends on the     */
/* Tailwind CDN compiling custom values.                                */
/* ------------------------------------------------------------------ */

const STYLES = `
:root{
  --blue:#1B3FC4; --blue-2:#2F57F0; --red:#E0192B; --red-soft:#FF5A67;
  --ink:#0A1A4A; --paper:#FAFBFD; --wa:#25D366;
  --ink-70:rgba(10,26,74,.7); --ink-10:rgba(10,26,74,.1);
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:'Manrope',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;cursor:pointer}
h1,h2,h3,p{margin:0}
.display{font-family:'Anton','Impact','Arial Narrow',sans-serif;font-weight:400;letter-spacing:.005em}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
@media(min-width:640px){.wrap{padding:0 32px}}
:focus-visible{outline:3px solid var(--blue);outline-offset:3px;border-radius:10px}

/* ---------- barber pole ---------- */
@keyframes pole-spin{from{transform:translateY(0)}to{transform:translateY(-101.823px)}}
.stripes{position:absolute;left:0;right:0;top:0;bottom:-102px;
  background:repeating-linear-gradient(45deg,var(--red) 0 18px,#fff 18px 36px,var(--blue) 36px 54px,#fff 54px 72px);
  animation:pole-spin 2.4s linear infinite}
.glass{position:absolute;inset:0;background:linear-gradient(90deg,
  rgba(10,26,74,.5) 0%,rgba(255,255,255,.05) 18%,rgba(255,255,255,.8) 33%,
  rgba(255,255,255,.08) 52%,rgba(10,26,74,.18) 78%,rgba(10,26,74,.6) 100%)}
.chrome{background:linear-gradient(180deg,#F7F8FA 0%,#C8CDD6 30%,#8E96A3 52%,#E9ECF1 70%,#A7AEBA 100%)}
.pole{display:flex;flex-direction:column;align-items:center;height:100%;width:100%}
.pole-cap{width:124%;height:22px;box-shadow:0 4px 10px rgba(0,0,0,.25)}
.pole-cap.top{border-radius:999px 999px 6px 6px}
.pole-cap.bottom{border-radius:6px 6px 999px 999px}
.pole-ring{width:108%;height:8px}
.pole-body{position:relative;flex:1;width:100%;overflow:hidden;border-radius:999px;
  box-shadow:0 0 0 1px rgba(255,255,255,.7) inset,0 0 28px rgba(224,25,43,.65),
  0 0 70px rgba(47,87,240,.55),0 0 140px rgba(224,25,43,.35)}
.side-rail{position:fixed;left:16px;top:50%;transform:translateY(-50%);height:46vh;width:10px;
  z-index:40;pointer-events:none;display:none;border-radius:999px;overflow:hidden;
  box-shadow:0 0 18px rgba(224,25,43,.5),0 0 40px rgba(27,63,196,.35)}
@media(min-width:1280px){.side-rail{display:block}}

/* ---------- scissors progress ---------- */
.progress{position:fixed;inset:0 0 auto 0;height:36px;z-index:70;background:rgba(255,255,255,.82);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--ink-10)}
.progress .wrap{display:flex;align-items:center;gap:16px;height:100%}
.track{position:relative;flex:1;height:2px}
.hair{position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(10,26,74,.3) 55%,transparent 0);background-size:7px 2px}
.cut{position:absolute;inset:0;transform-origin:left;
  background:linear-gradient(90deg,var(--blue),var(--red),var(--blue));box-shadow:0 0 10px rgba(224,25,43,.6)}
.snipper{position:absolute;top:50%;margin-top:-12px;margin-left:-20px;width:40px;height:24px;
  filter:drop-shadow(0 2px 6px rgba(27,63,196,.4))}
.blade{position:absolute;inset:0}
.blade svg{width:100%;height:100%;overflow:visible;display:block}
.pct{width:40px;text-align:right;font-size:12px;font-weight:700;color:var(--ink-70);font-variant-numeric:tabular-nums}

/* ---------- nav ---------- */
.nav{position:fixed;left:0;right:0;top:48px;z-index:60}
.nav-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 12px 10px 14px;
  border-radius:18px;background:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.9);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 10px 30px rgba(10,26,74,.1)}
.brand{display:flex;align-items:center;gap:10px}
.brand-mark{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--blue);
  color:#fff;box-shadow:0 0 18px rgba(27,63,196,.5)}
.brand-name{font-size:22px;line-height:1}
.nav-links{display:none;gap:32px;font-size:14px;font-weight:700;color:var(--ink-70)}
.nav-links a:hover{color:var(--blue)}
@media(min-width:768px){.nav-links{display:flex}}

/* ---------- buttons ---------- */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;border-radius:16px;
  padding:16px 24px;border:0;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
.btn:hover{transform:translateY(-2px)}
.btn-sm{padding:10px 16px;font-size:14px;border-radius:12px}
.btn-red{background:var(--red);color:#fff;box-shadow:0 0 22px rgba(224,25,43,.45)}
.btn-blue{background:var(--blue);color:#fff;box-shadow:0 12px 30px rgba(27,63,196,.4)}
.btn-ghost{background:#fff;color:var(--ink);border:1px solid var(--ink-10);box-shadow:0 2px 8px rgba(10,26,74,.06)}
.btn-review{background:#fff;color:var(--ink);border:1px solid rgba(245,180,0,.45);box-shadow:0 0 0 4px rgba(245,180,0,.1),0 6px 18px rgba(10,26,74,.08)}
.btn-review svg{color:#F5B400;fill:#F5B400}
.btn-wa{background:var(--wa);color:#06381B;width:100%;box-shadow:0 0 30px rgba(37,211,102,.45)}
.btn-wa[aria-disabled="true"]{background:rgba(255,255,255,.1);color:rgba(255,255,255,.4);box-shadow:none;cursor:not-allowed;transform:none}

/* ---------- hero ---------- */
.hero{position:relative;overflow:hidden;padding-top:132px;
  background:
    radial-gradient(60% 50% at 85% 20%,rgba(224,25,43,.14),transparent 70%),
    radial-gradient(55% 55% at 5% 60%,rgba(27,63,196,.16),transparent 70%),
    linear-gradient(180deg,#fff 0%,#F1F4FC 100%)}
.hero-grid{display:grid;gap:40px;align-items:center;padding-bottom:40px}
@media(min-width:1024px){.hero-grid{grid-template-columns:1.15fr .85fr;gap:56px;padding-bottom:64px}.hero{padding-top:150px}}
.pill{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;background:#fff;
  border:1px solid rgba(27,63,196,.18);color:var(--blue);font-size:14px;font-weight:700;box-shadow:0 2px 10px rgba(27,63,196,.08)}
.headline-row{margin-top:24px;display:flex;align-items:stretch;gap:18px}
.h1{font-size:clamp(2.9rem,13vw,6rem);line-height:.92;min-width:0}
.h1 span{display:block}
/* Compact pole next to the headline on mobile and tablet: no frame, just the glowing pole */
.mini-pole{flex-shrink:0;width:30px;padding:2px 0 6px}
.mini-pole .pole-cap{height:12px}
.mini-pole .pole-ring{height:5px}
.mini-pole .pole-body{box-shadow:0 0 0 1px rgba(255,255,255,.7) inset,0 0 14px rgba(224,25,43,.5),0 0 30px rgba(47,87,240,.4)}
@media(min-width:640px){.mini-pole{width:40px}}
.stage-col{display:none}
@media(min-width:1024px){
  .h1{font-size:clamp(3.4rem,9vw,7.25rem)}
  .mini-pole{display:none}
  .stage-col{display:block}
}
.chrome-text{background:linear-gradient(180deg,var(--ink) 0%,var(--blue) 55%,var(--ink) 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
.l3{color:var(--red);text-shadow:0 0 28px rgba(224,25,43,.35)}
.lede{margin-top:26px;max-width:34rem;font-size:18px;line-height:1.65;color:var(--ink-70)}
.btn-row{margin-top:34px;display:flex;flex-wrap:wrap;gap:12px}

.stage{position:relative;height:420px;border-radius:40px;overflow:hidden;
  background:radial-gradient(70% 55% at 50% 45%,#2447D8 0%,#13287F 55%,var(--ink) 100%);
  border:1px solid rgba(255,255,255,.6);box-shadow:0 40px 90px rgba(10,26,74,.35),0 0 0 8px rgba(255,255,255,.55)}
@media(min-width:640px){.stage{height:540px}}
.stage::before{content:"";position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,transparent 60%,rgba(255,255,255,.06))}
.stage-halo{position:absolute;left:50%;top:45%;width:340px;height:340px;transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(224,25,43,.45),rgba(47,87,240,.25) 45%,transparent 70%);filter:blur(30px)}
.stage-pole{position:absolute;left:50%;top:34px;bottom:104px;width:104px;margin-left:-52px}
@media(min-width:640px){.stage-pole{width:120px;margin-left:-60px}}
.stage-floor{position:absolute;left:-30%;right:-30%;bottom:-40px;height:190px;transform:perspective(420px) rotateX(64deg);
  transform-origin:bottom center;opacity:.35}
.stage-label{position:absolute;left:18px;right:18px;bottom:18px;display:flex;justify-content:space-between;align-items:center;
  padding:12px 16px;border-radius:16px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:#fff;font-size:14px;font-weight:700}
.stage-label span{display:flex;align-items:center;gap:8px}
.stage-label .muted{color:rgba(255,255,255,.7);font-weight:600}

.checker{background:conic-gradient(var(--ink) 25%,#fff 0 50%,var(--ink) 0 75%,#fff 0) 0 0/44px 44px}
.floor-wrap{position:relative;height:110px;overflow:hidden}
.floor{position:absolute;left:-20%;right:-20%;top:0;height:260px;transform:perspective(520px) rotateX(62deg);transform-origin:top center;
  -webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.6),transparent 85%);mask-image:linear-gradient(180deg,rgba(0,0,0,.6),transparent 85%)}

/* ---------- marquee ---------- */
.marquee{overflow:hidden;background:var(--blue);color:#fff;padding:16px 0}
.marquee-row{display:flex;width:max-content;gap:40px;white-space:nowrap}
.marquee-item{display:flex;align-items:center;gap:40px;font-size:24px}

/* ---------- sections ---------- */
.section{padding:96px 0;scroll-margin-top:110px}
@media(min-width:640px){.section{padding:128px 0}}
.h2{font-size:clamp(2.8rem,6vw,4rem);line-height:.98}
.sub{margin-top:18px;max-width:38rem;font-size:18px;line-height:1.6;color:var(--ink-70)}

.book-grid{margin-top:56px;display:grid;gap:32px}
@media(min-width:1024px){.book-grid{grid-template-columns:1.35fr 1fr}}
.cards{display:grid;gap:16px}
@media(min-width:640px){.cards{grid-template-columns:1fr 1fr}}
.card{position:relative;overflow:hidden;text-align:left;padding:24px 24px 24px 28px;border-radius:24px;
  background:rgba(255,255,255,.8);border:1px solid var(--ink-10);transition:border-color .25s,box-shadow .25s,background .25s}
.card:hover{border-color:rgba(27,63,196,.45)}
.card.on{background:#fff;border-color:var(--blue);box-shadow:0 0 0 4px rgba(27,63,196,.12),0 20px 50px rgba(27,63,196,.18)}
.card-edge{position:absolute;top:0;bottom:0;left:0;width:6px;overflow:hidden;opacity:0;transition:opacity .25s}
.card.on .card-edge{opacity:1}
.card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.card-title{font-size:30px;line-height:1}
.tick{display:grid;place-items:center;flex-shrink:0;width:32px;height:32px;border-radius:50%;border:2px solid var(--ink-10);color:transparent;transition:all .2s}
.card.on .tick{background:var(--red);border-color:var(--red);color:#fff}
.card-tag{margin-top:12px;font-size:15px;line-height:1.6;color:var(--ink-70)}
.card-list{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:6px}
.card-list li{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:rgba(10,26,74,.82)}
.dot{width:6px;height:6px;border-radius:50%;background:var(--blue)}

.summary{position:relative;overflow:hidden;padding:28px;border-radius:32px;background:var(--ink);color:#fff;
  box-shadow:0 30px 70px rgba(10,26,74,.35)}
@media(min-width:1024px){.summary-wrap{position:sticky;top:120px;align-self:start}}
.blob{position:absolute;border-radius:50%;filter:blur(50px);pointer-events:none}
.blob.r{right:-60px;top:-60px;width:220px;height:220px;background:rgba(224,25,43,.35)}
.blob.b{left:-40px;bottom:-80px;width:220px;height:220px;background:rgba(47,87,240,.55)}
.summary > .inner{position:relative}
.summary h3{font-size:30px}
.chosen{margin-top:20px;min-height:88px}
.chosen-item{display:flex;align-items:center;gap:12px;margin-bottom:8px;padding:10px 16px;border-radius:12px;background:rgba(255,255,255,.1);font-weight:700}
.empty{color:rgba(255,255,255,.6)}
.field-label{display:flex;align-items:center;gap:8px;margin:24px 0 10px;font-size:14px;font-weight:700;color:rgba(255,255,255,.72)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}
.chip{padding:7px 14px;border-radius:999px;border:0;background:rgba(255,255,255,.1);color:rgba(255,255,255,.85);font-size:14px;font-weight:700}
.chip:hover{background:rgba(255,255,255,.2)}
.chip.day-on{background:#fff;color:var(--ink)}
.chip.time-on{background:var(--red);color:#fff}
.input{width:100%;padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);color:#fff;font:inherit}
.input::placeholder{color:rgba(255,255,255,.4)}
.input:focus{outline:none;border-color:rgba(255,255,255,.55)}
.preview{margin-top:20px;padding:12px 16px;border-radius:12px;background:rgba(255,255,255,.06);font-size:14px;color:rgba(255,255,255,.72)}
.preview summary{cursor:pointer;font-weight:700;color:rgba(255,255,255,.85)}
.preview pre{margin:12px 0 0;white-space:pre-wrap;font-family:inherit;line-height:1.6}
.send{margin-top:24px}
.note{margin-top:12px;text-align:center;font-size:12px;color:rgba(255,255,255,.5)}

/* ---------- experience ---------- */
.exp{position:relative;background:#fff}
.strip{position:absolute;left:0;right:0;height:12px}
.strip.top{top:0}.strip.bottom{bottom:0}
.exp-grid{display:grid;gap:56px;align-items:center}
@media(min-width:1024px){.exp-grid{grid-template-columns:.9fr 1.1fr}}
.points{display:grid;gap:16px}
.point{display:flex;gap:20px;padding:24px;border-radius:24px;border:1px solid rgba(10,26,74,.08);background:linear-gradient(135deg,#fff,#EEF1F8)}
.point-icon{display:grid;place-items:center;flex-shrink:0;width:48px;height:48px;border-radius:16px;color:var(--ink);box-shadow:inset 0 1px 3px rgba(0,0,0,.2)}
.point h3{font-size:18px;font-weight:800}
.point p{margin-top:6px;line-height:1.6;color:var(--ink-70)}

/* ---------- visit ---------- */
.visit-card{position:relative;overflow:hidden;padding:32px;border-radius:40px;color:#fff;
  background:linear-gradient(135deg,var(--blue),var(--ink));box-shadow:0 40px 90px rgba(27,63,196,.3)}
@media(min-width:640px){.visit-card{padding:56px}}
.visit-pole{position:absolute;right:48px;top:40px;bottom:40px;width:64px;display:none;opacity:.9}
@media(min-width:900px){.visit-pole{display:block}}
.visit-body{position:relative;max-width:42rem}
.visit-body .sub{color:rgba(255,255,255,.75)}
.tiles{margin-top:40px;display:grid;gap:16px}
@media(min-width:640px){.tiles{grid-template-columns:1fr 1fr}}
.tile{display:block;padding:20px;border-radius:18px;background:rgba(255,255,255,.1);transition:background .2s,transform .2s}
a.tile:hover{background:rgba(255,255,255,.16)}
.tile-icon{color:var(--red-soft)}
.tile-title{margin-top:12px;font-weight:800}
.tile-text{color:rgba(255,255,255,.72)}
.tile-link{margin-top:8px;font-size:14px;font-weight:700;text-decoration:underline;text-underline-offset:4px}
.tile-review{display:flex;align-items:center;justify-content:space-between;gap:16px;background:#fff;color:var(--ink)}
a.tile-review:hover{background:#fff;transform:translateY(-2px)}
.tile-review .tile-text{color:var(--ink-70)}
.tile-review .stars{display:flex;gap:2px;color:#F5B400;flex-shrink:0}
.tile-review .stars svg{fill:#F5B400}
@media(min-width:640px){.tile-review{grid-column:1 / -1}}
.tile-wa{background:var(--wa);color:#06381B}
a.tile-wa:hover{background:var(--wa);transform:translateY(-2px)}
.tile-wa .tile-text{color:rgba(6,56,27,.8)}

/* ---------- footer ---------- */
.footer{background:#fff;border-top:1px solid var(--ink-10)}
.footer .wrap{display:flex;flex-direction:column;gap:12px;padding-top:36px;padding-bottom:36px;font-size:14px;color:var(--ink-70)}
@media(min-width:640px){.footer .wrap{flex-direction:row;justify-content:space-between;align-items:center}}
.footer-brand{display:flex;align-items:center;gap:8px;font-weight:800;color:var(--ink)}

/* ---------- floating WhatsApp ---------- */
.fab{position:fixed;right:20px;bottom:max(20px,env(safe-area-inset-bottom));z-index:80;display:flex;align-items:center;gap:10px}
.fab-label{display:none;padding:9px 16px;border-radius:999px;background:#fff;color:var(--ink);font-size:14px;font-weight:800;box-shadow:0 8px 24px rgba(10,26,74,.15)}
@media(min-width:640px){.fab-label{display:block}}
.fab-btn{position:relative;display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:var(--wa);color:#fff;box-shadow:0 10px 30px rgba(37,211,102,.5)}
@keyframes ping{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.8);opacity:0}}
.fab-ping{position:absolute;inset:0;border-radius:50%;background:var(--wa);animation:ping 2.2s cubic-bezier(0,0,.2,1) infinite}
.fab-btn svg{position:relative}

@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .stripes,.fab-ping{animation:none}
}
`;

/* ------------------------------------------------------------------ */
/* Scissors scroll progress                                            */
/* ------------------------------------------------------------------ */

function Blade({ upper }: { upper: boolean }) {
  // The screw sits at the centre of the 40x24 viewBox, so rotating the
  // wrapper around its centre pivots each blade on the screw.
  const id = upper ? "bladeU" : "bladeL";
  return (
    <svg viewBox="0 0 40 24" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#B9C0CB" />
          <stop offset="1" stopColor="#7C8593" />
        </linearGradient>
      </defs>
      {upper ? (
        <>
          <circle cx="7" cy="6.5" r="4.2" fill="none" stroke="#E0192B" strokeWidth="2.4" />
          <path d="M10.4 8.6 L20 12 L39 12 L20 9.6 Z" fill={`url(#${id})`} stroke="#5B6472" strokeWidth=".5" />
        </>
      ) : (
        <>
          <circle cx="7" cy="17.5" r="4.2" fill="none" stroke="#1B3FC4" strokeWidth="2.4" />
          <path d="M10.4 15.4 L20 12 L39 12 L20 14.4 Z" fill={`url(#${id})`} stroke="#5B6472" strokeWidth=".5" />
        </>
      )}
      <circle cx="20" cy="12" r="1.3" fill="#0A1A4A" />
    </svg>
  );
}

function ScissorsProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.35 });
  const left = useTransform(smooth, (v) => `${v * 100}%`);
  const open = useTransform(scrollYProgress, (v) => Math.abs(Math.sin(v * Math.PI * 36)) * 22);
  const upperRotate = useTransform(open, (a) => -a);
  const pct = useTransform(smooth, (v) => `${Math.round(v * 100)}%`);

  return (
    <div className="progress" role="progressbar" aria-label="Page scroll progress">
      <div className="wrap">
        <div className="track">
          <div className="hair" />
          <motion.div className="cut" style={{ scaleX: smooth }} />
          <motion.div className="snipper" style={{ left }}>
            <motion.div className="blade" style={{ rotate: upperRotate }}>
              <Blade upper />
            </motion.div>
            <motion.div className="blade" style={{ rotate: open }}>
              <Blade upper={false} />
            </motion.div>
          </motion.div>
        </div>
        <motion.span className="pct">{pct}</motion.span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Barber pole                                                          */
/* ------------------------------------------------------------------ */

function BarberPole() {
  return (
    <div className="pole" aria-hidden>
      <div className="pole-cap top chrome" />
      <div className="pole-ring chrome" />
      <div className="pole-body">
        <div className="stripes" />
        <div className="glass" />
      </div>
      <div className="pole-ring chrome" />
      <div className="pole-cap bottom chrome" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <nav className="nav-bar">
          <a href="#top" className="brand">
            <span className="brand-mark">
              <Scissors size={18} />
            </span>
            <span className="display brand-name">Barber at Pearls</span>
          </a>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#experience">The chair</a>
            <a href="#visit">Find us</a>
          </div>
          <a href="#services" className="btn btn-red btn-sm">
            Book a cut
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const stageY = useTransform(scrollY, [0, 700], [0, 50]);

  return (
    <section id="top" className="hero">
      <div className="wrap hero-grid">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.p variants={reveal} className="pill">
            <MapPin size={16} /> Level 2, Pearls Mall, Umhlanga
          </motion.p>
          <motion.div variants={reveal} className="headline-row">
            <h1 className="display h1">
              <span className="chrome-text">Sharp fades.</span>
              <span>Clean lines.</span>
              <span className="l3">Pearls polish.</span>
            </h1>
            <div className="mini-pole">
              <BarberPole />
            </div>
          </motion.div>
          <motion.p variants={reveal} className="lede">
            A premium barbershop in the heart of Umhlanga. Pick your services below and your booking message is ready
            to send on WhatsApp.
          </motion.p>
          <motion.div variants={reveal} className="btn-row">
            <a href="#services" className="btn btn-blue">
              <Scissors size={18} /> Choose your services
            </a>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-ghost">
              <Phone size={18} /> {PHONE_DISPLAY}
            </a>
            <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn btn-review">
              <Star size={18} /> Leave a Google review
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          style={{ y: stageY }}
          className="stage-col"
        >
          <div className="stage">
            <div className="stage-halo" />
            <div className="stage-floor checker" aria-hidden />
            <div className="stage-pole">
              <BarberPole />
            </div>
            <div className="stage-label">
              <span>
                <Sparkles size={16} color="#FF5A67" /> Shop B5
              </span>
              <span className="muted">Pearls of Umhlanga</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="floor-wrap" aria-hidden>
        <div className="floor checker" />
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Fades", "Beard trims", "Hot towel shaves", "VIP styling", "Pearls Mall, Umhlanga"];
  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden>
      <motion.div
        className="marquee-row"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[...row, ...row].map((w, i) => (
          <span key={i} className="display marquee-item">
            {w}
            <Scissors size={18} color="#FF5A67" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ServiceSelector() {
  const [selected, setSelected] = useState<string[]>(["fade"]);
  const [day, setDay] = useState<(typeof DAYS)[number]>("Today");
  const [time, setTime] = useState<(typeof TIMES)[number]>("Afternoon");
  const [name, setName] = useState("");

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const chosen = SERVICES.filter((s) => selected.includes(s.id));

  const message = useMemo(() => {
    const lines = [
      "Hi Barber at Pearls! ✂️",
      "I'd like to book:",
      ...chosen.map((s) => `• ${s.name}`),
      "",
      `Preferred day: ${day}`,
      `Preferred time: ${time}`,
    ];
    if (name.trim()) lines.push(`Name: ${name.trim()}`);
    lines.push("", "Please let me know what's available. Thanks!");
    return lines.join("\n");
  }, [chosen, day, time, name]);

  const canSend = chosen.length > 0;

  return (
    <section id="services" className="section">
      <div className="wrap">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={reveal}>
          <h2 className="display h2">Build your booking</h2>
          <p className="sub">
            Tap the services you want, pick when suits you, and send. We&apos;ll reply on WhatsApp to confirm your slot
            and price.
          </p>
        </motion.div>

        <div className="book-grid">
          <div className="cards">
            {SERVICES.map((s) => {
              const on = selected.includes(s.id);
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  aria-pressed={on}
                  whileTap={{ scale: 0.98 }}
                  className={`card${on ? " on" : ""}`}
                >
                  <div className="card-edge">
                    <div className="stripes" />
                  </div>
                  <div className="card-head">
                    <h3 className="display card-title">{s.name}</h3>
                    <span className="tick">
                      <Check size={16} strokeWidth={3} />
                    </span>
                  </div>
                  <p className="card-tag">{s.tagline}</p>
                  <ul className="card-list">
                    {s.includes.map((item) => (
                      <li key={item}>
                        <span className="dot" /> {item}
                      </li>
                    ))}
                  </ul>
                </motion.button>
              );
            })}
          </div>

          <div className="summary-wrap">
            <div className="summary">
              <div className="blob r" />
              <div className="blob b" />
              <div className="inner">
                <h3 className="display">Your booking</h3>

                <div className="chosen">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {chosen.length === 0 ? (
                      <motion.p key="empty" className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Select at least one service to start your message.
                      </motion.p>
                    ) : (
                      chosen.map((s) => (
                        <motion.div
                          key={s.id}
                          layout
                          className="chosen-item"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                        >
                          <Scissors size={16} color="#FF5A67" /> {s.name}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                <p className="field-label">
                  <Clock size={15} /> When suits you?
                </p>
                <div className="chips">
                  {DAYS.map((d) => (
                    <button key={d} type="button" onClick={() => setDay(d)} aria-pressed={day === d} className={`chip${day === d ? " day-on" : ""}`}>
                      {d}
                    </button>
                  ))}
                </div>
                <div className="chips">
                  {TIMES.map((t) => (
                    <button key={t} type="button" onClick={() => setTime(t)} aria-pressed={time === t} className={`chip${time === t ? " time-on" : ""}`}>
                      {t}
                    </button>
                  ))}
                </div>

                <label>
                  <span className="field-label">Your name (optional)</span>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Thabo" />
                </label>

                <details className="preview">
                  <summary>Preview message</summary>
                  <pre>{message}</pre>
                </details>

                <a
                  href={canSend ? waLink(message) : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!canSend}
                  onClick={(e) => {
                    if (!canSend) e.preventDefault();
                  }}
                  className="btn btn-wa send"
                >
                  <MessageCircle size={20} /> Send booking on WhatsApp
                </a>
                <p className="note">Opens WhatsApp to {PHONE_DISPLAY}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const points = [
    { icon: Scissors, title: "Cut with intent", body: "Every cut starts with a quick chat about shape, length and how you wear it day to day." },
    { icon: Sparkles, title: "A proper finish", body: "Clean necklines, sharp edges and a styled finish, so you leave looking ready for anything." },
    { icon: Star, title: "Treat yourself", body: "Add a hot towel shave or go VIP when it's a big day, or when you simply deserve it." },
  ];

  return (
    <section id="experience" className="section exp">
      <div className="strip top checker" aria-hidden />
      <div className="wrap exp-grid">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={reveal}>
          <h2 className="display h2">
            Old-school craft,
            <br />
            new-school chair.
          </h2>
          <p className="sub">
            Red, white and blue on the pole, checkerboard at your feet, and a barber who takes the time to get it right.
          </p>
        </motion.div>
        <div className="points">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="point">
              <span className="point-icon chrome">
                <Icon size={22} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="strip bottom checker" aria-hidden />
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="section">
      <div className="wrap">
        <div className="visit-card">
          <div className="visit-pole">
            <BarberPole />
          </div>
          <div className="visit-body">
            <h2 className="display h2">Come through to Pearls</h2>
            <p className="sub">Find us on the second level of Pearls Mall. Message ahead to check today&apos;s availability.</p>
            <div className="tiles">
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="tile">
                <MapPin className="tile-icon" size={22} />
                <p className="tile-title">{ADDRESS_LINE_1}</p>
                <p className="tile-text">{ADDRESS_LINE_2}</p>
                <p className="tile-link">Open in Google Maps</p>
              </a>
              <div className="tile">
                <Clock className="tile-icon" size={22} />
                <p className="tile-title">Hours and availability</p>
                <p className="tile-text">WhatsApp us for today&apos;s open slots.</p>
              </div>
              <a href={`tel:${PHONE_TEL}`} className="tile">
                <Phone className="tile-icon" size={22} />
                <p className="tile-title">Call</p>
                <p className="tile-text">{PHONE_DISPLAY}</p>
              </a>
              <a
                href={waLink("Hi Barber at Pearls! I'd like to book an appointment.")}
                target="_blank"
                rel="noopener noreferrer"
                className="tile tile-wa"
              >
                <MessageCircle size={22} />
                <p className="tile-title">WhatsApp</p>
                <p className="tile-text">Book in one tap</p>
              </a>
              <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="tile tile-review">
                <div>
                  <p className="tile-title" style={{ marginTop: 0 }}>Enjoyed your cut?</p>
                  <p className="tile-text">Leave us a review on Google</p>
                </div>
                <span className="stars" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={20} />
                  ))}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="checker" style={{ height: 8 }} aria-hidden />
      <div className="wrap">
        <p className="footer-brand">
          <Scissors size={16} color="#E0192B" /> Barber at Pearls
        </p>
        <p>
          {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
        </p>
        <p>&copy; {new Date().getFullYear()} Barber at Pearls</p>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <motion.a
      href={waLink("Hi Barber at Pearls! I'd like to book an appointment.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Book on WhatsApp at ${PHONE_DISPLAY}`}
      className="fab"
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="fab-label">Book on WhatsApp</span>
      <span className="fab-btn">
        <span className="fab-ping" />
        <MessageCircle size={26} />
      </span>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */

export default function Page() {
  return (
    <>
      <style>{STYLES}</style>
      <ScissorsProgress />
      <Nav />
      <div className="side-rail" aria-hidden>
        <div className="stripes" />
        <div className="glass" />
      </div>
      <main>
        <Hero />
        <Marquee />
        <ServiceSelector />
        <Experience />
        <Visit />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
