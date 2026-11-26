import { useEffect, useRef } from 'react';

/*
 * The name, buried in noise. Wherever the cursor (or an autonomous scan on
 * touch devices) passes, the signal is restored and then slowly decays back
 * toward noise.
 */
const NOISE = ' .·:;-=+*x%#';

export default function SignalField({ text = 'GAURAV RAI', onStats }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue('--ink').trim() || '#ecebe4';
    const acid = css.getPropertyValue('--acid').trim() || '#d4ff3a';

    let W = 0, H = 0, dpr = 1, cell = 12, cols = 0, rows = 0;
    let mask = new Uint8Array(0);
    let clarity = new Float32Array(0);
    let raf = 0, last = 0, t0 = performance.now();
    const pointer = { x: -1e4, y: -1e4, active: false, lastMove: 0 };

    function buildMask() {
      const off = document.createElement('canvas');
      off.width = cols; off.height = rows;
      const o = off.getContext('2d');
      o.fillStyle = '#000'; o.fillRect(0, 0, cols, rows);
      o.fillStyle = '#fff';
      o.textBaseline = 'middle'; o.textAlign = 'center';
      const words = text.split(' ');
      const twoLine = cols / rows < 3.2 && words.length > 1;
      const lines = twoLine ? words : [text];
      let size = rows * (twoLine ? 0.42 : 0.7);
      const font = (s) => `800 ${s}px "Geist", "Helvetica Neue", Arial, sans-serif`;
      o.font = font(size);
      const widest = Math.max(...lines.map((l) => o.measureText(l).width));
      if (widest > cols * 0.92) size *= (cols * 0.92) / widest;
      o.font = font(size);
      const lh = size * 0.95;
      const y0 = rows / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((l, i) => o.fillText(l, cols / 2, y0 + i * lh));
      const data = o.getImageData(0, 0, cols, rows).data;
      mask = new Uint8Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) mask[i] = data[i * 4] > 90 ? 1 : 0;
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = W < 640 ? 6 : W < 1100 ? 8 : 9;
      cols = Math.floor(W / cell); rows = Math.floor(H / cell);
      clarity = new Float32Array(cols * rows);
      buildMask();
      if (reduce) clarity.fill(1);
      draw(performance.now());
    }

    function draw(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${cell * 1.05}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      const gap = 1;

      // Lens: the cursor, or an autonomous Lissajous scan when idle.
      let lx = pointer.x, ly = pointer.y;
      const idle = !pointer.active || now - pointer.lastMove > 2600;
      if (idle) {
        lx = W * (0.5 + 0.42 * Math.sin(t * 0.37));
        ly = H * (0.5 + 0.34 * Math.sin(t * 0.61 + 1.2));
      }
      const R = Math.max(70, Math.min(W, H) * (W < 640 ? 0.32 : 0.24));
      const R2 = R * R;

      // Boot sweep: a scanline restores the image once on load.
      const sweep = t < 2.4 ? (t / 2.4) * (rows + 8) : -1;

      let sum = 0, sigCells = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const px = x * cell, py = y * cell;
          const dx = px - lx, dy = py - ly;
          const d2 = dx * dx + dy * dy;
          let target = 0;
          if (d2 < R2) target = 1 - d2 / R2;
          if (sweep >= 0 && Math.abs(y - sweep) < 3) target = 1;
          let c = clarity[i];
          c = target > c ? c + (target - c) * 0.35 : c - 0.006;
          const floor = mask[i] ? 0.55 : 0; // the name is never fully lost
          if (c < floor) c = floor;
          if (reduce) c = 1;
          clarity[i] = c;

          const m = mask[i];
          if (m) { sum += c; sigCells++; }
          const clean = Math.random() < c * c * 1.15;

          if (clean) {
            if (m) {
              ctx.fillStyle = d2 < R2 * 0.12 && !reduce ? acid : ink;
              ctx.globalAlpha = 0.55 + 0.45 * c;
              ctx.fillRect(px, py, cell - gap, cell - gap);
            } else if (c > 0.5 && (x + y) % 4 === 0) {
              ctx.fillStyle = ink; ctx.globalAlpha = 0.12;
              ctx.fillText('·', px, py);
            }
          } else {
            // Noisy observation: signal cells are only statistically brighter.
            const n = Math.random();
            const level = m ? 0.35 + n * 0.65 : n * n * 0.75;
            if (level < 0.12) continue;
            const ch = NOISE[Math.min(NOISE.length - 1, Math.floor(level * NOISE.length))];
            ctx.fillStyle = ink;
            ctx.globalAlpha = (m ? 0.38 : 0.14) * level + (d2 < R2 ? 0.08 : 0);
            ctx.fillText(ch, px, py);
          }
        }
      }
      ctx.globalAlpha = 1;

      // Lens ring
      if (!reduce) {
        ctx.strokeStyle = acid; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(lx, ly, R, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 0.9; ctx.beginPath();
        ctx.moveTo(lx - 6, ly); ctx.lineTo(lx + 6, ly);
        ctx.moveTo(lx, ly - 6); ctx.lineTo(lx, ly + 6); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (onStats) {
        const snr = sigCells ? sum / sigCells : 0;
        onStats({ snr, x: Math.round(lx), y: Math.round(ly), idle });
      }
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (now - last < 40) return; // ~25 fps is plenty for noise
      last = now;
      draw(now);
    }

    function move(e) {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      pointer.x = p.clientX - r.left; pointer.y = p.clientY - r.top;
      pointer.active = true; pointer.lastMove = performance.now();
    }
    function leave() { pointer.active = false; }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);

    // Pause when off-screen.
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en.isIntersecting && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
    };
  }, [text, onStats]);

  return <canvas ref={ref} className="signal" aria-hidden="true" />;
}
