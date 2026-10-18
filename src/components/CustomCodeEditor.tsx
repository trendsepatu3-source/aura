import React, { useState } from 'react';
import { Code, Play, RefreshCw, Zap, Check, Sparkles, BookOpen } from 'lucide-react';
import { MotionConfig } from '../types/motion';

interface CustomCodeEditorProps {
  config: MotionConfig;
  onUpdateCode: (code: string) => void;
  onRunPreview: () => void;
  onRender4K: () => void;
}

const CODE_EXAMPLES = [
  {
    name: '2027 Cyber Rings (Pusaran Neon)',
    code: `// 2027 Cyber Rings Particle Loop
const cx = width / 2;
const cy = height / 2;

// Background
ctx.fillStyle = '#05070d';
ctx.fillRect(0, 0, width, height);

// 16 Concentric pulsing neon rings
const rings = 16;
for (let i = 0; i < rings; i++) {
  const p = (progress + i / rings) % 1;
  const radius = p * (width * 0.48);
  const alpha = Math.sin(p * Math.PI) * 0.85;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = \`hsla(\${180 + i * 15}, 95%, 65%, \${alpha})\`;
  ctx.lineWidth = 3 + (1 - p) * 8;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 25 * alpha;
  ctx.stroke();
  ctx.restore();
}

// Center Glowing 2027
ctx.save();
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = 'bold ' + Math.round(width * 0.08) + 'px Outfit, sans-serif';
ctx.fillStyle = '#ffffff';
ctx.shadowColor = '#38bdf8';
ctx.shadowBlur = 40;
ctx.fillText('2027', cx, cy);
ctx.restore();`,
  },
  {
    name: 'Fireworks Blast & Golden Sparks (Kembang Api 2027)',
    code: `// Fireworks Blast & Golden Sparks
const cx = width / 2;
const cy = height / 2;

// Dark gradient
const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.7);
bg.addColorStop(0, '#130d04');
bg.addColorStop(1, '#020202');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, width, height);

// Fireworks burst particles
const sparkCount = 300;
for (let i = 0; i < sparkCount; i++) {
  const angle = (i / sparkCount) * Math.PI * 2;
  const speed = (0.3 + (i % 7) * 0.1) * (width * 0.4);
  const distance = progress * speed;
  const gravity = progress * progress * (height * 0.15);

  const x = cx + Math.cos(angle) * distance;
  const y = cy + Math.sin(angle) * distance * 0.8 + gravity;

  const alpha = Math.max(0, 1 - progress);
  const size = (3 + (i % 4) * 2) * alpha;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = \`hsla(\${40 + (i % 20)}, 100%, 70%, \${alpha})\`;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12 * alpha;
  ctx.fill();
  ctx.restore();
}

// Typography
ctx.save();
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = '800 ' + Math.round(width * 0.07) + 'px Cinzel, serif';
ctx.fillStyle = '#fef08a';
ctx.shadowColor = '#eab308';
ctx.shadowBlur = 30;
ctx.fillText('HAPPY NEW YEAR 2027', cx, cy);
ctx.restore();`,
  },
  {
    name: 'Golden Christmas Tree Fractal Spiral',
    code: `// Golden Christmas Tree Fractal Spiral
const cx = width / 2;
const treeTop = height * 0.2;
const treeBase = height * 0.85;

ctx.fillStyle = '#040b06';
ctx.fillRect(0, 0, width, height);

const points = 500;
for (let i = 0; i < points; i++) {
  const norm = i / points;
  const y = treeTop + norm * (treeBase - treeTop);
  const coneRadius = norm * (width * 0.22);
  const angle = norm * Math.PI * 20 + progress * Math.PI * 2;
  const x = cx + Math.cos(angle) * coneRadius;

  const alpha = 0.4 + (Math.sin(angle) + 1) * 0.3;
  const size = 3 + norm * 4;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = \`rgba(250, 204, 21, \${alpha})\`;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.restore();
}

// Glowing Top Star
ctx.save();
ctx.translate(cx, treeTop - 20);
ctx.rotate(progress * Math.PI * 2 * 0.3);
ctx.fillStyle = '#fef08a';
ctx.shadowColor = '#facc15';
ctx.shadowBlur = 40;
ctx.beginPath();
ctx.arc(0, 0, 18, 0, Math.PI * 2);
ctx.fill();
ctx.restore();`,
  },
];

export const CustomCodeEditor: React.FC<CustomCodeEditorProps> = ({
  config,
  onUpdateCode,
  onRunPreview,
  onRender4K,
}) => {
  const [code, setCode] = useState<string>(
    config.customCode || CODE_EXAMPLES[0].code
  );

  const handleApplyCode = (newCode: string) => {
    setCode(newCode);
    onUpdateCode(newCode);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 text-neutral-100 select-none overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Code className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white font-display">
            Custom HTML5 Canvas & Motion Graphic Engine
          </h2>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
            Live Scripting
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onUpdateCode(code);
              onRunPreview();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-neutral-700"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Terapkan & Uji di Kanvas</span>
          </button>

          <button
            onClick={() => {
              onUpdateCode(code);
              onRender4K();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Render Kode Ini ke 4K MP4</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Code Examples & Variable Reference */}
        <div className="w-full md:w-80 bg-neutral-900/60 border-r border-neutral-800 p-4 overflow-y-auto space-y-5 text-xs">
          <div className="space-y-2">
            <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilih Template Kode Jadi</span>
            </label>
            <div className="space-y-1.5">
              {CODE_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyCode(ex.code)}
                  className="w-full text-left p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:border-amber-500/50 hover:bg-neutral-900 text-neutral-300 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-xs text-white">{ex.name}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Klik untuk memuat kode ke editor
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <div className="font-semibold text-neutral-200">Variabel Global yang Tersedia:</div>
            <ul className="space-y-1.5 text-neutral-400 font-mono text-[11px]">
              <li>
                <span className="text-amber-400">ctx</span>: CanvasRenderingContext2D
              </li>
              <li>
                <span className="text-amber-400">t</span>: waktu berjalan dalam detik
              </li>
              <li>
                <span className="text-amber-400">progress</span>: siklus loop (0.0 s/d 1.0)
              </li>
              <li>
                <span className="text-amber-400">width, height</span>: dimensi kanvas aktif (misal 3840×2160)
              </li>
              <li>
                <span className="text-amber-400">Math</span>: library matematika JS
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-amber-950/20 rounded-xl border border-amber-900/40 text-neutral-300 text-[11px] leading-relaxed">
            <span className="font-semibold text-amber-300">Tips Seamless Looping:</span> Gunakan fungsi periodik{' '}
            <code className="text-amber-200 font-mono">Math.sin(progress * Math.PI * 2)</code> agar posisi dan animasi partikel di awal (0.0) dan akhir (1.0) tersambung mulus tanpa patahan.
          </div>
        </div>

        {/* Right: Code Editor Box */}
        <div className="flex-1 flex flex-col bg-neutral-950">
          <div className="px-4 py-2 bg-neutral-900/40 border-b border-neutral-800/80 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>motion-graphic-render.js (Deterministic Frame-by-Frame)</span>
            <span>UTF-8 · ES6+</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => handleApplyCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-neutral-950 text-neutral-100 font-mono text-xs p-4 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/40 selection:bg-amber-500/30 selection:text-amber-200"
          />
        </div>
      </div>
    </div>
  );
};
