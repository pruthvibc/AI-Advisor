'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type AuthMode = 'login' | 'signup';
type AuthStatus = 'idle' | 'loading' | 'success_new' | 'success_returning' | 'error';

/* ─────────────────────────────────────────────
   COUNTER HOOK
───────────────────────────────────────────── */
function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const duration = 2200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target]);
  return val;
}

/* ─────────────────────────────────────────────
   FEATURE DATA
───────────────────────────────────────────── */
const FEATURES = [
  { icon: '📄', title: 'Resume Analyser', desc: 'Deep semantic parsing against role-specific requirements with precision scoring and ATS compatibility checks.' },
  { icon: '🗺️', title: 'Personalised Roadmap', desc: 'Week-by-week adaptive learning plans calibrated to your current skills, target role, and real-world timelines.' },
  { icon: '🎓', title: 'Course Recommendations', desc: 'Curated content from Coursera, edX, and Udemy — matched precisely to your skill gaps and learning style.' },
  { icon: '🎤', title: 'AI Mock Interviews', desc: 'Conversational interview simulations with real-time STAR-method feedback and confidence scoring.' },
  { icon: '🏅', title: 'Skill Verification Badge', desc: 'Pass AI-assessed evaluations to earn shareable badges that prove competency to recruiters.' },
  { icon: '✨', title: 'Resume Rewriter', desc: 'ATS-optimised, role-tailored resume rewriting that highlights what matters most for your target role.' },
  { icon: '💼', title: 'Job Opportunity Matcher', desc: 'Curated listings matched to your skill profile, location preference, and salary expectations in real time.' },
  { icon: '🎯', title: 'Self-Introduction Coach', desc: 'Craft a compelling "Tell me about yourself" with AI coaching — scripted, practised, and interview-ready.' },
  { icon: '📊', title: 'Skill Gap Analytics', desc: "Visual dashboards showing exactly which skills you're missing, their market value, and time-to-learn estimates." },
];

const STEPS = [
  { num: '01', title: 'Upload Resume & Target Role', desc: 'Paste a job description or choose from our role library. AI instantly maps your profile to employer expectations.' },
  { num: '02', title: 'Receive Your AI Roadmap', desc: 'Get a structured learning plan with prioritised skills, recommended resources, and realistic completion timelines.' },
  { num: '03', title: 'Practice & Get Verified', desc: 'Complete mock interviews, earn skill badges, and let AI rewrite your resume to match your upgraded profile.' },
  { num: '04', title: 'Apply With Confidence', desc: "Browse matched listings with your polished resume, verified skills, and a rehearsed personal pitch. You're ready." },
];

const TESTIMONIALS = [
  { initials: 'AR', colorFrom: '#6366f1', colorTo: '#7c3aed', name: 'Arjun Rao', role: 'Software Engineer @ Razorpay', text: 'PathAI found skill gaps I had no idea about. The roadmap was surgical — not generic. Got my first SWE offer in 6 weeks.', stars: 5 },
  { initials: 'PM', colorFrom: '#0891b2', colorTo: '#2563eb', name: 'Priya Mehta', role: 'Product Manager @ Swiggy', text: 'The mock interviews were harder than the real ones. The AI feedback on structure and communication was genuinely useful.', stars: 5 },
  { initials: 'KS', colorFrom: '#059669', colorTo: '#0d9488', name: 'Karan Shah', role: 'Data Analyst @ Infosys', text: 'My rewritten resume got 3× more callbacks. The skill badge actually came up in my final interview round.', stars: 5 },
];

/* ─────────────────────────────────────────────
   CANVAS BACKGROUND COMPONENT
   Renders the dramatic light-shaft background from the reference image.
   Uses requestAnimationFrame for smooth one-time draw.
───────────────────────────────────────────── */
function LightShaftCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      /* ── Deep navy base gradient ── */
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   '#0b1829');
      bg.addColorStop(0.3, '#081220');
      bg.addColorStop(0.7, '#060d18');
      bg.addColorStop(1,   '#04080f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* ── Subtle blue atmosphere at top center ── */
      const topAtmo = ctx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, W * 0.7);
      topAtmo.addColorStop(0,   'rgba(60,110,200,0.18)');
      topAtmo.addColorStop(0.4, 'rgba(40, 80,170,0.07)');
      topAtmo.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = topAtmo;
      ctx.fillRect(0, 0, W, H * 0.75);

      /* ── Light shafts emanating from top-center ──
         Each shaft: angle from top-center, spread width, opacity.
         Matches the reference image's vertical cathedral-light feel.
      ── */
      const originX = W * 0.5;
      const originY = -H * 0.04;

      const shafts = [
        /* center brightest shaft */
        { angleDeg: 90,  spreadPx: 90,  alphaRoot: 0.11, alphaTip: 0.0 },
        /* flanking shafts */
        { angleDeg: 84,  spreadPx: 48,  alphaRoot: 0.07, alphaTip: 0.0 },
        { angleDeg: 96,  spreadPx: 42,  alphaRoot: 0.065, alphaTip: 0.0 },
        { angleDeg: 77,  spreadPx: 30,  alphaRoot: 0.048, alphaTip: 0.0 },
        { angleDeg: 103, spreadPx: 28,  alphaRoot: 0.044, alphaTip: 0.0 },
        { angleDeg: 70,  spreadPx: 18,  alphaRoot: 0.032, alphaTip: 0.0 },
        { angleDeg: 110, spreadPx: 16,  alphaRoot: 0.028, alphaTip: 0.0 },
        { angleDeg: 63,  spreadPx: 14,  alphaRoot: 0.022, alphaTip: 0.0 },
        { angleDeg: 117, spreadPx: 12,  alphaRoot: 0.02,  alphaTip: 0.0 },
        { angleDeg: 57,  spreadPx: 10,  alphaRoot: 0.016, alphaTip: 0.0 },
        { angleDeg: 123, spreadPx:  9,  alphaRoot: 0.014, alphaTip: 0.0 },
      ];

      const diag = Math.sqrt(W * W + H * H) * 1.15;

      shafts.forEach(({ angleDeg, spreadPx, alphaRoot }) => {
        const rad = (angleDeg * Math.PI) / 180;
        const dirX = Math.cos(rad);
        const dirY = Math.sin(rad);
        const perpX = -dirY;
        const perpY =  dirX;

        /* shaft is a quad: narrow at origin, same width all along (parallel sides)
           but faded with gradient so it naturally tapers visually */
        const endX = originX + dirX * diag;
        const endY = originY + dirY * diag;
        const hw = spreadPx * 0.5;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(originX + perpX * hw * 0.3, originY + perpY * hw * 0.3);
        ctx.lineTo(originX - perpX * hw * 0.3, originY - perpY * hw * 0.3);
        ctx.lineTo(endX   - perpX * hw,        endY   - perpY * hw);
        ctx.lineTo(endX   + perpX * hw,        endY   + perpY * hw);
        ctx.closePath();

        /* gradient along the shaft direction */
        const grad = ctx.createLinearGradient(originX, originY, endX, endY);
        grad.addColorStop(0,    `rgba(110,160,255,${alphaRoot * 1.4})`);
        grad.addColorStop(0.08, `rgba(90,140,240,${alphaRoot})`);
        grad.addColorStop(0.35, `rgba(70,120,220,${alphaRoot * 0.55})`);
        grad.addColorStop(0.7,  `rgba(50,90,190,${alphaRoot * 0.18})`);
        grad.addColorStop(1,    `rgba(30,60,150,0)`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      /* ── Horizontal floor glow (matches reference — subtle warm pool near bottom) ── */
      const floorGlow = ctx.createRadialGradient(W * 0.5, H, 0, W * 0.5, H, W * 0.8);
      floorGlow.addColorStop(0,   'rgba(15,35,90,0.22)');
      floorGlow.addColorStop(0.5, 'rgba(10,25,70,0.08)');
      floorGlow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = floorGlow;
      ctx.fillRect(0, H * 0.45, W, H * 0.55);

      /* ── Very faint mid-horizon accent line (depth cue) ── */
      const horizLine = ctx.createLinearGradient(0, H * 0.68, W, H * 0.68);
      horizLine.addColorStop(0,   'rgba(0,0,0,0)');
      horizLine.addColorStop(0.3, 'rgba(80,120,200,0.04)');
      horizLine.addColorStop(0.5, 'rgba(80,120,200,0.07)');
      horizLine.addColorStop(0.7, 'rgba(80,120,200,0.04)');
      horizLine.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = horizLine;
      ctx.fillRect(0, H * 0.67, W, 1);
    }

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [authError, setAuthError] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const c1 = useCounter(87, statsVisible);
  const c2 = useCounter(12, statsVisible);
  const c3 = useCounter(50, statsVisible);

  useEffect(() => {
    const saved = sessionStorage.getItem('ai_advisor_user');
    if (saved) router.replace('/');
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLoginOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loginOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loginOpen]);

  const openLogin = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setAuthStatus('idle');
    setAuthError('');
    setUsername('');
    setPassword('');
    setLoginOpen(true);
  };

  const handleAuth = useCallback(async () => {
    const u = username.trim();
    const p = password.trim();
    setAuthError('');
    if (!u) return setAuthError('Please enter a username.');
    if (u.length < 2) return setAuthError('Username must be at least 2 characters.');
    if (!p) return setAuthError('Please enter a password.');
    if (authMode === 'signup' && p.length < 4) return setAuthError('Password must be at least 4 characters.');

    setAuthStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });
      const data = await res.json();
      if (!data.success) {
        setAuthError(data.error || 'Something went wrong. Please try again.');
        setAuthStatus('error');
        return;
      }
      sessionStorage.setItem('ai_advisor_user', JSON.stringify({ name: data.user.name, id: data.user.id }));
      setAuthStatus(data.is_new ? 'success_new' : 'success_returning');
      setTimeout(() => router.replace('/'), 1500);
    } catch {
      setAuthError('Cannot connect to server. Make sure the backend is running on port 8000.');
      setAuthStatus('error');
    }
  }, [username, password, authMode, router]);

  const isLoading = authStatus === 'loading';
  const isSuccess = authStatus === 'success_new' || authStatus === 'success_returning';

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          font-family: 'Inter', sans-serif;
          background: #06090f;
          color: rgba(240,240,255,0.92);
          overflow-x: hidden;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #06090f; }
        ::-webkit-scrollbar-thumb { background: rgba(99,130,200,0.35); border-radius: 3px; }

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        /* ── Nav glass ── */
        .nav-glass {
          backdrop-filter: blur(28px) saturate(1.4);
          background: rgba(6, 9, 15, 0.45);
          border-bottom: 1px solid rgba(99, 130, 200, 0.07);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-glass.scrolled {
          background: rgba(6, 9, 15, 0.85);
          border-bottom-color: rgba(99, 130, 200, 0.13);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(99, 130, 200, 0.05);
        }

        /* ── Float UI panels ── */
        .float-panel {
          position: absolute;
          backdrop-filter: blur(18px) saturate(1.3);
          background: rgba(8, 14, 32, 0.55);
          border: 1px solid rgba(99, 130, 200, 0.1);
          border-radius: 16px; padding: 14px 16px;
          pointer-events: none;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        @keyframes floatA {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        /* ── Pulse dot ── */
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #6b8cff;
          position: relative; flex-shrink: 0;
        }
        .pulse-dot::after {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid rgba(107, 140, 255, 0.4);
          animation: pulseDot 2s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%,100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.6); opacity: 0; }
        }

        /* ── Reveal animation ── */
        .reveal {
          opacity: 0; transform: translateY(36px);
          transition: opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94),
                      transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* ── Shimmer ── */
        .shimmer { position: relative; overflow: hidden; }
        .shimmer::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 130, 200, 0.04), transparent);
          animation: shimmer 8s ease-in-out infinite;
        }
        @keyframes shimmer { 0%,100% { left: -100%; } 50% { left: 150%; } }

        /* ── Premium Glass Panel ── */
        .glass-panel {
          backdrop-filter: blur(24px) saturate(1.4);
          background: linear-gradient(160deg, rgba(10, 16, 40, 0.6) 0%, rgba(14, 20, 50, 0.4) 100%);
          border: 1px solid rgba(99, 130, 200, 0.09);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }
        .glass-panel::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(107, 140, 255, 0.22) 30%, rgba(140, 110, 220, 0.16) 70%, transparent 95%);
        }

        /* ── Dashboard glass ── */
        .dash-glass {
          background: linear-gradient(145deg, rgba(8, 14, 36, 0.65), rgba(12, 18, 46, 0.45));
          border: 1px solid rgba(99, 130, 200, 0.08);
          border-radius: 18px;
          position: relative;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        .dash-glass::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(107, 140, 255, 0.16), transparent);
        }

        /* ── Score ring ── */
        .ring-bg { fill: none; stroke: rgba(107, 140, 255, 0.08); stroke-width: 6; }
        .ring-fill {
          fill: none; stroke: url(#scoreGrad); stroke-width: 6;
          stroke-linecap: round; stroke-dasharray: 314; stroke-dashoffset: 314;
          transition: stroke-dashoffset 2.2s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .ring-fill.animated { stroke-dashoffset: 41; }

        /* ── Skill bar ── */
        .skill-bar-bg { height: 3px; background: rgba(107, 140, 255, 0.08); border-radius: 2px; overflow: hidden; }
        .skill-bar-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, #5b7fff, #8b6cff);
          width: 0%; transition: width 2s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        /* ── Premium Feature Card ── */
        .feature-card {
          background: linear-gradient(160deg, rgba(8, 14, 36, 0.5) 0%, rgba(12, 18, 46, 0.3) 100%);
          border: 1px solid rgba(99, 130, 200, 0.07);
          border-radius: 20px; padding: 32px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative; overflow: hidden; cursor: default;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .feature-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 20px;
          background: linear-gradient(135deg, rgba(80, 110, 200, 0.08), transparent 55%);
          opacity: 0; transition: opacity 0.5s;
        }
        .feature-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(107, 140, 255, 0.2) 30%, rgba(140, 110, 220, 0.12) 70%, transparent 95%);
          opacity: 0; transition: opacity 0.5s;
        }
        .feature-card:hover {
          border-color: rgba(107, 140, 255, 0.2);
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35), 0 0 40px rgba(80, 110, 200, 0.06);
        }
        .feature-card:hover::before, .feature-card:hover::after { opacity: 1; }
        .feature-card:hover .feat-icon {
          background: rgba(80, 110, 200, 0.15);
          box-shadow: 0 0 24px rgba(80, 110, 200, 0.2);
          border-color: rgba(107, 140, 255, 0.25);
        }

        .feat-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(80, 110, 200, 0.07);
          border: 1px solid rgba(99, 130, 200, 0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin-bottom: 20px;
          transition: all 0.5s;
        }

        /* ── Process step ── */
        .process-circle {
          width: 64px; height: 64px; border-radius: 50%;
          border: 1px solid rgba(99, 130, 200, 0.15);
          background: rgba(8, 14, 36, 0.75);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s; position: relative; z-index: 2;
          font-family: 'Space Grotesk', sans-serif; font-weight: 700;
          font-size: 14px; color: rgba(107, 140, 255, 0.7);
        }
        .process-circle::after {
          content: ''; position: absolute; inset: -5px; border-radius: 50%;
          border: 1px solid rgba(99, 130, 200, 0.05);
        }
        .process-node:hover .process-circle {
          border-color: rgba(107, 140, 255, 0.45);
          background: rgba(80, 110, 200, 0.1);
          box-shadow: 0 0 32px rgba(80, 110, 200, 0.15);
          color: rgba(107, 140, 255, 1);
        }

        /* ── CTA buttons ── */
        .cta-btn-filled {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 40px; border-radius: 60px;
          border: 1px solid rgba(107, 140, 255, 0.35);
          color: rgba(230, 235, 255, 0.95);
          font-weight: 600; font-size: 15px;
          cursor: pointer; transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Space Grotesk', sans-serif;
          position: relative; overflow: hidden;
          text-decoration: none; letter-spacing: 0.01em;
          background: linear-gradient(135deg, rgba(70, 100, 200, 0.3) 0%, rgba(100, 70, 180, 0.22) 100%);
          backdrop-filter: blur(12px);
        }
        .cta-btn-filled:hover {
          transform: translateY(-3px);
          border-color: rgba(107, 140, 255, 0.6);
          box-shadow: 0 12px 40px rgba(80, 110, 200, 0.25), 0 0 60px rgba(80, 110, 200, 0.08);
          background: linear-gradient(135deg, rgba(70, 100, 200, 0.45) 0%, rgba(100, 70, 180, 0.35) 100%);
        }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 40px; border-radius: 60px;
          border: 1px solid rgba(180, 190, 220, 0.12);
          color: rgba(180, 190, 220, 0.55);
          font-weight: 500; font-size: 15px;
          cursor: pointer; transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          text-decoration: none; letter-spacing: 0.01em;
          background: transparent;
        }
        .cta-btn:hover {
          transform: translateY(-3px);
          border-color: rgba(107, 140, 255, 0.35);
          color: rgba(220, 225, 255, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        /* ── Auth modal ── */
        .auth-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(3, 5, 14, 0.88);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .auth-overlay.open { opacity: 1; pointer-events: all; }
        .auth-panel {
          width: 460px; max-width: 94vw; max-height: 94vh; overflow-y: auto;
          background: linear-gradient(160deg, rgba(8, 14, 36, 0.95) 0%, rgba(12, 18, 46, 0.9) 100%);
          border: 1px solid rgba(99, 130, 200, 0.1);
          border-radius: 28px; padding: 48px 40px;
          position: relative;
          transform: translateY(24px) scale(0.96);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.55), 0 0 80px rgba(40, 60, 140, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }
        .auth-overlay.open .auth-panel { transform: translateY(0) scale(1); }
        .auth-panel::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(107, 140, 255, 0.28) 30%, rgba(140, 110, 220, 0.18) 70%, transparent 95%);
          border-radius: 28px 28px 0 0;
        }

        .auth-input {
          width: 100%; padding: 14px 18px;
          background: rgba(4, 7, 20, 0.75);
          border: 1px solid rgba(99, 130, 200, 0.1);
          border-radius: 14px;
          color: rgba(230, 235, 255, 0.92);
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; transition: all 0.35s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .auth-input::placeholder { color: rgba(180, 190, 220, 0.28); }
        .auth-input:focus {
          border-color: rgba(107, 140, 255, 0.35);
          box-shadow: 0 0 24px rgba(80, 110, 200, 0.1), inset 0 0 20px rgba(80, 110, 200, 0.03);
          background: rgba(4, 7, 20, 0.88);
        }

        .auth-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, rgba(60, 90, 190, 0.35), rgba(90, 60, 170, 0.28));
          border: 1px solid rgba(107, 140, 255, 0.25);
          border-radius: 14px; color: rgba(230, 235, 255, 0.95);
          font-weight: 600; font-size: 15px;
          font-family: 'Space Grotesk', sans-serif;
          cursor: pointer; transition: all 0.4s;
          letter-spacing: 0.02em;
        }
        .auth-submit:hover:not(:disabled) {
          border-color: rgba(107, 140, 255, 0.5);
          box-shadow: 0 8px 32px rgba(80, 110, 200, 0.2);
          background: linear-gradient(135deg, rgba(70, 100, 200, 0.45), rgba(100, 70, 180, 0.38));
          transform: translateY(-1px);
        }
        .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-tab {
          flex: 1; padding: 11px;
          border-radius: 12px; border: none;
          background: transparent; font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 600;
          color: rgba(180, 190, 220, 0.4); cursor: pointer;
          transition: all 0.3s;
        }
        .auth-tab.active {
          background: linear-gradient(135deg, rgba(60, 90, 190, 0.45), rgba(90, 60, 170, 0.35));
          color: rgba(230, 235, 255, 0.95);
          box-shadow: 0 4px 16px rgba(50, 70, 150, 0.15);
        }
        .auth-tab:not(.active):hover { color: rgba(200, 210, 240, 0.7); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(99, 130, 200, 0.08) 30%, rgba(99, 130, 200, 0.11) 50%, rgba(99, 130, 200, 0.08) 70%, transparent 95%);
          margin: 0 5%;
        }

        .testi-card {
          background: linear-gradient(160deg, rgba(8, 14, 36, 0.55) 0%, rgba(12, 18, 46, 0.35) 100%);
          border: 1px solid rgba(99, 130, 200, 0.07);
          border-radius: 22px; padding: 30px;
          transition: all 0.45s;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
        }
        .testi-card:hover {
          border-color: rgba(107, 140, 255, 0.18);
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.32), 0 0 40px rgba(80, 110, 200, 0.05);
        }

        .heading-glow {
          text-shadow: 0 0 60px rgba(107, 140, 255, 0.1), 0 0 120px rgba(89, 60, 150, 0.05);
        }
        .heading-glow-strong {
          text-shadow: 0 0 40px rgba(107, 140, 255, 0.18), 0 0 80px rgba(107, 140, 255, 0.07), 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      {/* ── CANVAS BACKGROUND — replaces the old CSS-only background ── */}
      <LightShaftCanvas />

      {/* ── SVG DEFS ── */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5b7fff" />
            <stop offset="100%" stopColor="#8b6cff" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── NAV ── */}
      <nav className={`nav-glass fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}
        style={{ padding: '0 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg,rgba(80,110,200,0.25),rgba(120,90,200,0.15))',
              border: '1px solid rgba(107,140,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              boxShadow: '0 4px 16px rgba(40,60,140,0.15)',
            }}>⚡</div>
            <span className="font-heading" style={{ fontWeight: 700, fontSize: 20, color: 'rgba(230,235,255,0.95)', letterSpacing: -0.5 }}>
              Path<span style={{ color: '#7b9bff' }}>AI</span>
            </span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {['Features', 'System', 'Process', 'Stories'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="font-body"
                style={{ fontSize: 14, fontWeight: 500, color: 'rgba(180,190,220,0.5)', textDecoration: 'none', transition: 'all .3s', letterSpacing: '0.01em' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(220,225,255,0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(180,190,220,0.5)'; }}
              >{l}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => openLogin('login')} style={{
              background: 'transparent', border: '1px solid rgba(107,140,255,0.15)', cursor: 'pointer',
              padding: '9px 22px', borderRadius: 50, fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14, fontWeight: 500, color: 'rgba(200,210,240,0.55)', transition: 'all .35s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(107,140,255,0.4)'; e.currentTarget.style.color = 'rgba(220,225,255,0.9)'; e.currentTarget.style.background = 'rgba(80,110,200,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(107,140,255,0.15)'; e.currentTarget.style.color = 'rgba(200,210,240,0.55)'; e.currentTarget.style.background = 'transparent'; }}>
              Sign In
            </button>
            <button onClick={() => openLogin('signup')} style={{
              background: 'linear-gradient(135deg,rgba(60,90,190,0.28),rgba(90,60,170,0.2))',
              border: '1px solid rgba(107,140,255,0.22)',
              color: 'rgba(230,235,255,0.9)', padding: '9px 22px', borderRadius: 50,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif", transition: 'all .35s', letterSpacing: '0.01em',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(70,100,200,0.4),rgba(100,70,180,0.3))'; e.currentTarget.style.borderColor = 'rgba(107,140,255,0.48)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(80,110,200,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(60,90,190,0.28),rgba(90,60,170,0.2))'; e.currentTarget.style.borderColor = 'rgba(107,140,255,0.22)'; e.currentTarget.style.boxShadow = 'none'; }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: 72 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

        {/* Floating panels */}
        <div className="float-panel" style={{ top: '20%', left: '4%', width: 176, zIndex: 2, animation: 'floatA 9s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <div className="pulse-dot" />
            <span className="font-mono" style={{ fontSize: 10, color: 'rgba(180,190,220,0.35)', textTransform: 'uppercase', letterSpacing: 1.2 }}>Resume Scan</span>
          </div>
          {[100, 75, 88, 62].map((w, i) => (
            <div key={i} style={{ height: 3, background: `rgba(${i % 2 ? '120,90,200' : '80,110,200'},${0.12 + i * 0.05})`, borderRadius: 2, marginBottom: 6, width: `${w}%` }} />
          ))}
        </div>

        <div className="float-panel" style={{ top: '62%', right: '4%', width: 154, zIndex: 2, animation: 'floatB 11s ease-in-out infinite' }}>
          <div className="font-mono" style={{ fontSize: 10, color: 'rgba(180,190,220,0.35)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Match Score</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            {[16, 24, 32, 20, 36, 28].map((h, i) => (
              <div key={i} style={{ width: 12, height: h, borderRadius: 3, background: i % 2 ? 'rgba(120,90,200,0.3)' : 'rgba(80,110,200,0.35)' }} />
            ))}
          </div>
        </div>

        <div className="float-panel" style={{ bottom: '16%', left: '6%', width: 194, zIndex: 2, animation: 'floatA 13s ease-in-out infinite', animationDelay: '-4s' }}>
          <div className="font-mono" style={{ fontSize: 10, color: 'rgba(180,190,220,0.35)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Skill Map</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {['Python', 'ML', 'AWS', 'SQL', 'React'].map(s => (
              <span key={s} className="font-mono" style={{ fontSize: 9, padding: '3px 8px', borderRadius: 50, background: 'rgba(80,110,200,0.08)', color: 'rgba(107,140,255,0.65)', border: '1px solid rgba(99,130,200,0.1)' }}>{s}</span>
            ))}
          </div>
        </div>

        <div className="float-panel" style={{ top: '28%', right: '5%', width: 138, zIndex: 2, animation: 'floatB 8s ease-in-out infinite', animationDelay: '-2s' }}>
          <div className="font-mono" style={{ fontSize: 10, color: 'rgba(180,190,220,0.35)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>AI Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
            <span className="font-mono" style={{ fontSize: 11, color: 'rgba(16,185,129,0.75)' }}>Processing…</span>
          </div>
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 5%', maxWidth: 880, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 20px', borderRadius: 50, background: 'rgba(80,110,200,0.06)', border: '1px solid rgba(99,130,200,0.1)', marginBottom: 32, animation: 'fadeInDown 0.9s ease-out 0.2s both', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <div className="pulse-dot" />
            <span className="font-mono" style={{ fontSize: 12, color: 'rgba(140,160,220,0.85)', fontWeight: 500, letterSpacing: 0.8 }}>Precision Career Intelligence — Powered by AI</span>
          </div>

          <h1 className="font-display heading-glow-strong" style={{ fontSize: 'clamp(42px,6.5vw,80px)', fontWeight: 700, lineHeight: 1.07, letterSpacing: -1.5, marginBottom: 28, animation: 'fadeInUp 0.9s ease-out 0.4s both' }}>
            <span style={{ background: 'linear-gradient(135deg,#d0d8f0 0%,#f0f2ff 40%,#e0e4f8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Land your dream job</span><br />
            <span style={{ background: 'linear-gradient(135deg,#7b9bff 0%,#a088e0 50%,#8b6cff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>faster than ever before</span>
          </h1>

          <p className="font-body" style={{ fontSize: 'clamp(16px,2vw,19px)', color: 'rgba(180,190,220,0.55)', maxWidth: 580, margin: '0 auto 44px', lineHeight: 1.8, fontWeight: 400, animation: 'fadeInUp 0.9s ease-out 0.6s both', letterSpacing: '0.01em' }}>
            Upload your resume. Get an AI-crafted roadmap, close skill gaps, ace mock interviews, and walk into your next role with confidence.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64, animation: 'fadeInUp 0.9s ease-out 0.8s both' }}>
            <button className="cta-btn-filled" onClick={() => openLogin('signup')}>
              Analyse My Resume →
            </button>
            <a href="#system" className="cta-btn">
              See how it works ↓
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ display: 'flex', gap: 56, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.9s ease-out 1s both' }}>
            {[{ val: c1, suffix: '%', label: 'Avg Match Score' }, { val: c2, suffix: '+', label: 'AI Models Active' }, { val: c3, suffix: 'K+', label: 'Careers Transformed' }].map(({ val, suffix, label }, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,transparent,rgba(99,130,200,0.15),transparent)', alignSelf: 'center' }} />}
                <div style={{ textAlign: 'center' }}>
                  <div className="font-heading heading-glow" style={{ fontSize: 30, fontWeight: 800, color: 'rgba(230,235,255,0.95)' }}>{val}{suffix}</div>
                  <div className="font-mono" style={{ fontSize: 11, color: 'rgba(160,170,200,0.4)', marginTop: 5, textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to top,#06090f,transparent)', zIndex: 4 }} />
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section id="system" style={{ position: 'relative', zIndex: 1, padding: '110px 5%' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(107,140,255,0.6)', marginBottom: 16 }}>Intelligent Dashboard</div>
            <h2 className="font-display heading-glow" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: -1, marginBottom: 16 }}>See Your Career Intelligence</h2>
            <p className="font-body" style={{ fontSize: 17, color: 'rgba(180,190,220,0.45)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Real-time analysis rendered as actionable insights, not raw data.</p>
          </div>

          <div className="glass-panel shimmer reveal" style={{ padding: '30px 36px', transitionDelay: '0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['rgba(107,140,255,0.25)', 'rgba(120,90,200,0.18)', 'rgba(107,140,255,0.1)'].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span className="font-mono" style={{ fontSize: 12, color: 'rgba(180,190,220,0.25)', marginLeft: 8 }}>PathAI Analysis Engine v3.2</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div className="pulse-dot" />
                <span className="font-mono" style={{ fontSize: 11, color: 'rgba(16,185,129,0.65)' }}>Live</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
              <div className="dash-glass" style={{ padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(180,190,220,0.3)', marginBottom: 22 }}>Resume Match Score</span>
                <ScoreRing />
                <span className="font-body" style={{ fontSize: 12, color: 'rgba(107,140,255,0.65)', marginTop: 16 }}>Senior Data Scientist</span>
              </div>

              <div className="dash-glass" style={{ padding: 26 }}>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(180,190,220,0.3)', marginBottom: 22, display: 'block' }}>Skill Gap Analysis</span>
                <SkillBars />
              </div>

              <div className="dash-glass" style={{ padding: 26 }}>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(180,190,220,0.3)', marginBottom: 22, display: 'block' }}>AI Recommendations</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {[
                    { icon: '⚡', text: 'Complete AWS Solutions Architect cert to close cloud gap', priority: 'High', color: '80,110,200' },
                    { icon: '🗺️', text: 'Add 2 system design projects to portfolio', priority: 'Medium', color: '120,90,200' },
                    { icon: '🎤', text: 'Practice behavioral interviews for L5+ roles', priority: 'High', color: '80,110,200' },
                  ].map(({ icon, text, priority, color }, i) => (
                    <div key={i} style={{ padding: '11px 14px', borderRadius: 12, background: `rgba(${color},0.05)`, border: `1px solid rgba(${color},0.08)`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13 }}>{icon}</span>
                      <div>
                        <p className="font-body" style={{ fontSize: 12, color: 'rgba(200,210,240,0.7)', lineHeight: 1.6 }}>{text}</p>
                        <span className="font-mono" style={{ fontSize: 10, color: 'rgba(160,170,200,0.35)', marginTop: 4, display: 'block' }}>Priority: {priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── FEATURES ── */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '110px 5%' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(107,140,255,0.6)', marginBottom: 16 }}>Capabilities</div>
            <h2 className="font-display heading-glow" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: -1, marginBottom: 16 }}>Your Complete Career Toolkit</h2>
            <p className="font-body" style={{ fontSize: 17, color: 'rgba(180,190,220,0.45)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>Every module precision-engineered to maximise your chances of landing the role you want.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="feat-icon">{f.icon}</div>
                <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: 'rgba(230,235,255,0.92)', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p className="font-body" style={{ fontSize: 14, color: 'rgba(180,190,220,0.45)', lineHeight: 1.8 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── PROCESS ── */}
      <section id="process" style={{ position: 'relative', zIndex: 1, padding: '110px 5%' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 76 }}>
            <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(107,140,255,0.6)', marginBottom: 16 }}>System Pipeline</div>
            <h2 className="font-display heading-glow" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: -1, marginBottom: 16 }}>From Resume to Offer in 4 Steps</h2>
            <p className="font-body" style={{ fontSize: 17, color: 'rgba(180,190,220,0.45)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>A structured intelligence pipeline that transforms your raw profile into a winning career strategy.</p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,130,200,0.12),transparent)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 36, position: 'relative', zIndex: 1 }}>
              {STEPS.map((s, i) => (
                <div key={i} className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, transitionDelay: `${i * 0.12}s` }}>
                  <div className="process-node process-circle">{s.num}</div>
                  <div style={{ textAlign: 'center' }}>
                    <div className="font-heading" style={{ fontSize: 15, fontWeight: 700, color: 'rgba(230,235,255,0.9)', marginBottom: 8, letterSpacing: '-0.01em' }}>{s.title}</div>
                    <div className="font-body" style={{ fontSize: 13, color: 'rgba(180,190,220,0.4)', lineHeight: 1.75 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── TESTIMONIALS ── */}
      <section id="stories" style={{ position: 'relative', zIndex: 1, padding: '110px 5%' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(107,140,255,0.6)', marginBottom: 16 }}>Success Stories</div>
            <h2 className="font-display heading-glow" style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: -1 }}>Real People, Real Results</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 3, marginBottom: 16 }}>{'★'.repeat(t.stars)}</div>
                <p className="font-body" style={{ fontSize: 15, color: 'rgba(200,210,240,0.55)', lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${t.colorFrom}, ${t.colorTo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>{t.initials}</div>
                  <div>
                    <div className="font-heading" style={{ fontSize: 14, fontWeight: 600, color: 'rgba(230,235,255,0.9)' }}>{t.name}</div>
                    <div className="font-body" style={{ fontSize: 12, color: 'rgba(160,170,200,0.45)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── AUTH CTA SECTION ── */}
      <section id="features-auth" style={{ position: 'relative', zIndex: 1, padding: '110px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="glass-panel shimmer reveal" style={{ padding: '64px 68px', display: 'flex', gap: 68, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(107,140,255,0.6)', marginBottom: 16 }}>Get Started Today</div>
              <h2 className="font-display heading-glow" style={{ fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 700, letterSpacing: -0.5, marginBottom: 18 }}>Your career transformation starts here</h2>
              <p className="font-body" style={{ fontSize: 16, color: 'rgba(180,190,220,0.45)', lineHeight: 1.8, marginBottom: 36, fontWeight: 400 }}>Join 50,000+ students and professionals who used PathAI to land roles they love. No email. No credit card.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Full resume analysis — free forever', 'Personalised roadmap on sign-up', '3 mock interview sessions included', 'No email required — just a username'].map(p => (
                  <div key={p} className="font-body" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(180,190,220,0.55)' }}>
                    <span style={{ color: '#10b981', fontSize: 15 }}>✓</span> {p}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 300, maxWidth: 400, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,130,200,0.08)', borderRadius: 22, padding: 34, boxShadow: '0 16px 48px rgba(0,0,0,0.22)' }}>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,130,200,0.08)', borderRadius: 14, padding: 4, marginBottom: 26 }}>
                {(['login', 'signup'] as AuthMode[]).map(m => (
                  <button key={m} className={`auth-tab ${authMode === m ? 'active' : ''}`} onClick={() => { setAuthMode(m); setAuthError(''); setAuthStatus('idle'); }}>
                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {isSuccess ? (
                <div style={{ textAlign: 'center', padding: '28px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>{authStatus === 'success_new' ? '✨' : '👋'}</div>
                  <div className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'rgba(230,235,255,0.95)' }}>{authStatus === 'success_new' ? `Welcome, ${username}!` : `Welcome back, ${username}!`}</div>
                  <div className="font-body" style={{ fontSize: 13, color: 'rgba(160,170,200,0.5)' }}>{authStatus === 'success_new' ? 'Setting up your profile…' : 'Restoring your progress…'}</div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(180,190,220,0.4)', letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Username</label>
                    <input className="auth-input" type="text" placeholder="Enter your username" value={username} onChange={e => { setUsername(e.target.value); setAuthError(''); }} autoComplete="username" />
                  </div>
                  <div style={{ marginBottom: authMode === 'signup' ? 12 : 20 }}>
                    <label className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(180,190,220,0.4)', letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input className="auth-input" type={showPw ? 'text' : 'password'}
                        placeholder={authMode === 'signup' ? 'Create a password (min 4 chars)' : 'Enter your password'}
                        value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                        autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                        style={{ paddingRight: 42 }}
                        onKeyDown={e => e.key === 'Enter' && handleAuth()} />
                      <button onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(180,190,220,0.35)', cursor: 'pointer', fontSize: 14 }}>
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div style={{ background: 'rgba(80,110,200,0.05)', border: '1px solid rgba(99,130,200,0.08)', borderRadius: 12, padding: '11px 16px', fontSize: 12, color: 'rgba(180,190,220,0.45)', lineHeight: 1.65, marginBottom: 16 }}>
                      ✨ Your roadmap, skill gaps, and certifications will be saved to your account.
                    </div>
                  )}

                  {authError && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 12, padding: '11px 16px', fontSize: 13, color: '#fca5a5', marginBottom: 16 }}>
                      {authError}
                    </div>
                  )}

                  <button className="auth-submit" onClick={handleAuth} disabled={isLoading || !username.trim() || !password.trim()}>
                    {isLoading
                      ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(200,210,240,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
                        {authMode === 'login' ? 'Signing in…' : 'Creating account…'}
                      </span>
                      : authMode === 'login' ? 'Sign In to PathAI →' : 'Create My Account →'
                    }
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(160,170,200,0.35)', marginTop: 18 }}>
                    {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); setAuthStatus('idle'); }}
                      style={{ background: 'none', border: 'none', color: '#7b9bff', fontWeight: 600, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>
                      {authMode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '90px 5% 130px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'rgba(40,60,140,0.04)', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div className="reveal" style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <h2 className="font-display heading-glow-strong" style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.12, marginBottom: 24 }}>
            Your career deserves{' '}
            <span style={{ background: 'linear-gradient(135deg,#7b9bff 0%,#a088e0 50%,#8b6cff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>precision intelligence</span>
          </h2>
          <p className="font-body" style={{ fontSize: 17, color: 'rgba(180,190,220,0.45)', marginBottom: 42, lineHeight: 1.75 }}>Stop guessing. Start knowing. Let AI map your optimal path forward.</p>
          <button className="cta-btn-filled" onClick={() => openLogin('signup')} style={{ margin: '0 auto', fontSize: 16, padding: '17px 46px' }}>
            Launch PathAI — It's Free →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(99,130,200,0.06)', padding: '44px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(80,110,200,0.1)', border: '1px solid rgba(99,130,200,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚡</div>
          <span className="font-body" style={{ fontSize: 13, color: 'rgba(160,170,200,0.35)' }}>© 2025 PathAI · Built for learners and job seekers everywhere</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" className="font-body" style={{ fontSize: 13, color: 'rgba(160,170,200,0.3)', textDecoration: 'none', transition: 'all .3s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(200,210,240,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(160,170,200,0.3)'; }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      <div className={`auth-overlay ${loginOpen ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setLoginOpen(false); }}>
        <div className="auth-panel">
          <button onClick={() => setLoginOpen(false)} style={{ position: 'absolute', top: 18, right: 18, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,130,200,0.08)', color: 'rgba(180,190,220,0.5)', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>✕</button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 30 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,rgba(80,110,200,0.25),rgba(120,90,200,0.15))', border: '1px solid rgba(107,140,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚡</div>
            <span className="font-heading" style={{ fontWeight: 700, fontSize: 19, color: 'rgba(230,235,255,0.95)' }}>Path<span style={{ color: '#7b9bff' }}>AI</span></span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h3 className="font-display" style={{ fontSize: 23, fontWeight: 700, marginBottom: 8, color: 'rgba(230,235,255,0.95)' }}>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h3>
            <p className="font-body" style={{ fontSize: 14, color: 'rgba(180,190,220,0.45)' }}>{authMode === 'login' ? 'Sign in to your career intelligence dashboard' : 'Start your career transformation today'}</p>
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,130,200,0.08)', borderRadius: 14, padding: 4, marginBottom: 26 }}>
            {(['login', 'signup'] as AuthMode[]).map(m => (
              <button key={m} className={`auth-tab ${authMode === m ? 'active' : ''}`} onClick={() => { setAuthMode(m); setAuthError(''); setAuthStatus('idle'); }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{authStatus === 'success_new' ? '✨' : '👋'}</div>
              <div className="font-display" style={{ fontSize: 21, fontWeight: 700, marginBottom: 10, color: 'rgba(230,235,255,0.95)' }}>{authStatus === 'success_new' ? `Welcome, ${username}!` : `Welcome back, ${username}!`}</div>
              <div className="font-body" style={{ fontSize: 13, color: 'rgba(160,170,200,0.5)' }}>{authStatus === 'success_new' ? 'Setting up your profile…' : 'Restoring your progress…'}</div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(180,190,220,0.4)', letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Username</label>
                <input className="auth-input" type="text" placeholder="Enter your username" value={username} onChange={e => { setUsername(e.target.value); setAuthError(''); }} autoComplete="username" autoFocus />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(180,190,220,0.4)', letterSpacing: 1.2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="auth-input" type={showPw ? 'text' : 'password'}
                    placeholder={authMode === 'signup' ? 'Create a password (min 4 chars)' : 'Enter your password'}
                    value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                    autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                    style={{ paddingRight: 42 }}
                    onKeyDown={e => e.key === 'Enter' && handleAuth()} />
                  <button onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(180,190,220,0.35)', cursor: 'pointer', fontSize: 14 }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div style={{ background: 'rgba(80,110,200,0.05)', border: '1px solid rgba(99,130,200,0.08)', borderRadius: 12, padding: '11px 16px', fontSize: 12, color: 'rgba(180,190,220,0.45)', lineHeight: 1.65, marginBottom: 18 }}>
                  ✨ Your username must be unique. Your roadmap, skill gaps, and certifications will be saved to your account.
                </div>
              )}

              {authError && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 12, padding: '11px 16px', fontSize: 13, color: '#fca5a5', marginBottom: 18 }}>
                  {authError}
                </div>
              )}

              <button className="auth-submit" onClick={handleAuth} disabled={isLoading || !username.trim() || !password.trim()}>
                {isLoading
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(200,210,240,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
                    {authMode === 'login' ? 'Signing in…' : 'Creating account…'}
                  </span>
                  : authMode === 'login' ? 'Sign In to PathAI →' : 'Create My Account →'
                }
              </button>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <span className="font-body" style={{ fontSize: 13, color: 'rgba(160,170,200,0.35)' }}>
                  {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                </span>
                <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); setAuthStatus('idle'); }}
                  style={{ background: 'none', border: 'none', color: '#7b9bff', fontWeight: 600, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {authMode === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </div>

              <p className="font-body" style={{ textAlign: 'center', fontSize: 11, color: 'rgba(140,150,180,0.25)', marginTop: 20 }}>
                Passwords are hashed and stored securely · No email required
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── SCROLL REVEAL OBSERVER ── */}
      <ScrollReveal />
    </>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function ScoreRing() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated) {
        setAnimated(true);
        let start: number | null = null;
        const dur = 2200;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          setScore(Math.round((1 - Math.pow(1 - p, 3)) * 87));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  return (
    <div ref={ref} style={{ position: 'relative', width: 120, height: 120 }}>
      <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: 120, height: 120 }}>
        <circle className="ring-bg" cx="60" cy="60" r="50" />
        <circle className={`ring-fill ${animated ? 'animated' : ''}`} cx="60" cy="60" r="50" />
      </svg>
      <div className="font-heading" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'rgba(230,235,255,0.95)', textShadow: '0 0 30px rgba(107,140,255,0.15)' }}>
        {score}%
      </div>
    </div>
  );
}

function SkillBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  const skills = [
    { name: 'Machine Learning', pct: 82, color: '#5b7fff' },
    { name: 'Cloud Architecture', pct: 64, color: '#8b6cff' },
    { name: 'Data Pipeline', pct: 91, color: '#5b7fff' },
    { name: 'System Design', pct: 47, color: '#8b6cff' },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated) setAnimated(true);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {skills.map(({ name, pct, color }) => (
        <div key={name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="font-body" style={{ fontSize: 12, color: 'rgba(200,210,240,0.55)' }}>{name}</span>
            <span className="font-mono" style={{ fontSize: 12, color: `${color}bb` }}>{pct}%</span>
          </div>
          <div className="skill-bar-bg">
            <div className="skill-bar-fill" style={{ width: animated ? `${pct}%` : '0%', background: `linear-gradient(90deg,${color},${color}99)` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}