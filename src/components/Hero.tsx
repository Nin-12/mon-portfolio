// src/components/Hero.tsx
import React, { memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

/* ═══════════════════════════════════════════════
   Types
═══════════════════════════════════════════════ */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseX: number;
  baseY: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  opacity: number;
  color: string;
}

/* ═══════════════════════════════════════════════
   Composant
═══════════════════════════════════════════════ */
const Hero: React.FC = memo(() => {
  const navigate  = useNavigate();
  const { dark }  = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef<number>(0);
  const darkRef   = useRef(dark);

  /* Sync dark → ref sans relancer l'animation */
  useEffect(() => { darkRef.current = dark; }, [dark]);

  /* ── Canvas animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 120;
    const particles: Particle[] = [];

    /* Palette selon le thème (lue en temps réel via darkRef) */
    const getColors = () => darkRef.current
      ? ['#a78bfa', '#67e8f9', '#34d399', '#f59e0b', '#e2e8f0']
      : ['#7c3aed', '#0891b2', '#059669', '#d97706', '#1e293b'];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      particles.length = 0;
      const colors = getColors();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const bx = Math.random() * canvas.width;
        const by = Math.random() * canvas.height;
        particles.push({
          x:           bx,
          y:           by,
          vx:          0,
          vy:          0,
          radius:      Math.random() * 2.2 + 0.8,
          baseX:       bx,
          baseY:       by,
          angle:       Math.random() * Math.PI * 2,
          orbitRadius: Math.random() * 60 + 20,
          orbitSpeed:  (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
          opacity:     Math.random() * 0.5 + 0.3,
          color:       colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colors = getColors();
      const { x: mx, y: my } = mouseRef.current;
      const ATTRACT_RADIUS  = 160;
      const ATTRACT_FORCE   = 0.08;
      const RETURN_FORCE    = 0.018;
      const DAMPING         = 0.88;

      particles.forEach((p, i) => {
        /* ── couleur réactive au thème ── */
        p.color = colors[i % colors.length];

        /* ── orbite de base ── */
        p.angle += p.orbitSpeed;
        const targetX = p.baseX + Math.cos(p.angle) * p.orbitRadius;
        const targetY = p.baseY + Math.sin(p.angle) * p.orbitRadius;

        /* ── attraction souris ── */
        const dx   = mx - p.x;
        const dy   = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ATTRACT_RADIUS && dist > 0) {
          const force = (ATTRACT_RADIUS - dist) / ATTRACT_RADIUS;
          p.vx += (dx / dist) * force * ATTRACT_FORCE * (ATTRACT_RADIUS / dist);
          p.vy += (dy / dist) * force * ATTRACT_FORCE * (ATTRACT_RADIUS / dist);
        }

        /* ── retour vers orbite ── */
        p.vx += (targetX - p.x) * RETURN_FORCE;
        p.vy += (targetY - p.y) * RETURN_FORCE;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x  += p.vx;
        p.y  += p.vy;

        /* ── dessin ── */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        /* ── liens entre particules proches ── */
        for (let j = i + 1; j < particles.length; j++) {
          const q    = particles[j];
          const ldx  = p.x - q.x;
          const ldy  = p.y - q.y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ldist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            const alpha = (1 - ldist / 80) * 0.18;
            ctx.strokeStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    init();
    draw();

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    const onResize = () => { resize(); init(); };

    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []); /* ← une seule fois, darkRef gère le thème en temps réel */

  /* ════════ RENDER ════════ */
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center text-center py-16 md:py-24 text-[var(--text)] overflow-hidden rounded-2xl font-mono"
    >
      {/* ── Canvas particules (plein fond) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-2xl"
        style={{ display: 'block' }}
      />

      {/* ── Contenu textuel (z-10 pour passer au-dessus du canvas) ── */}
      <div className="relative z-10 max-w-3xl px-4">

        {/* SYSTEM STATUS */}
        <p className="text-xs md:text-sm tracking-widest text-[var(--soc)] mb-4">
          [ SYSTEM ONLINE ] • SOC DASHBOARD ACTIVE • THREAT MONITORING ENABLED
        </p>

        {/* IDENTITÉ */}
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] mb-2">
          CYBERMASTER_NODE
        </p>

        {/* TITRE */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight flex flex-col tracking-tight">
          <span className="text-[var(--text)]">
            CYBERSECURITY
          </span>
          <span className="text-[var(--soc)] mt-5">
            RED TEAM & BLUE TEAM
          </span>
        </h1>

        {/* TERMINAL SUBTITLE */}
        <p className="text-sm md:text-lg text-[var(--muted)] mb-8 max-w-2xl mx-auto leading-relaxed">
          &gt; audit system initiated...<br />
          &gt; scanning infrastructure...<br />
          &gt; monitoring threats in real time
        </p>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/projects')}
          className="bg-[var(--accent)] text-[var(--bg)] font-bold px-7 py-3 rounded-lg shadow-lg hover:brightness-110 transition"
        >
          VOIR MES PROJETS
        </motion.button>

        {/* CURSOR */}
        <p className="mt-6 text-[var(--soc)] animate-pulse">
          _
        </p>

      </div>
    </motion.section>
  );
});

Hero.displayName = 'Hero';
export default Hero;