import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Type,
  Video,
  Layers,
  Palette,
  ShieldCheck,
  Check,
  Zap,
  HelpCircle,
  EyeOff,
  Flame,
} from 'lucide-react';
import {
  MotionConfig,
  RESOLUTION_PRESETS,
  ResolutionPreset,
  ExportFormat,
  BackgroundMode,
} from '../types/motion';
import { MOTION_PRESETS } from '../templates/motionPresets';

interface InspectorControlsProps {
  config: MotionConfig;
  onChangeConfig: (partial: Partial<MotionConfig>) => void;
  exportFormat: ExportFormat;
  onChangeExportFormat: (fmt: ExportFormat) => void;
  onStartRender: () => void;
  isRendering: boolean;
}

export const InspectorControls: React.FC<InspectorControlsProps> = ({
  config,
  onChangeConfig,
  exportFormat,
  onChangeExportFormat,
  onStartRender,
  isRendering,
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'visuals' | 'text'>('output');

  const selectedTemplate = MOTION_PRESETS.find((p) => p.id === config.templateId) || MOTION_PRESETS[0];
  const isChristmas = selectedTemplate.category === 'Christmas 2026';

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800 w-80 md:w-96 shrink-0 text-neutral-100 select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold tracking-tight text-white font-display">Kontrol Animasi & Render</h2>
        </div>
        <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700/60">
          {isChristmas ? 'Natal 2026' : 'Tahun Baru 2027'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-neutral-800 bg-neutral-950/60 p-1 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('output')}
          className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'output'
              ? 'bg-neutral-800 text-amber-300 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Output & 4K</span>
        </button>

        <button
          onClick={() => setActiveTab('visuals')}
          className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'visuals'
              ? 'bg-neutral-800 text-amber-300 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Partikel & FX</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'text'
              ? 'bg-neutral-800 text-amber-300 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Teks & Mode Jual</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ============================================================== */}
        {/* TAB 1: OUTPUT & EXPORT SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'output' && (
          <div className="space-y-4">
            {/* Quick 1-Click Microstock Preset */}
            <div className="p-3 bg-gradient-to-r from-amber-950/40 via-neutral-950 to-neutral-950 rounded-xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preset Standar Microstock (1-Klik):</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onChangeConfig({
                      backgroundMode: 'black',
                      showText: false,
                      resolution: '4k_uhd',
                      fps: 60,
                      durationSeconds: 10,
                      bitrateMbps: 50,
                    });
                    onChangeExportFormat('mp4');
                  }}
                  className="p-1.5 text-left rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-[11px] text-white cursor-pointer"
                >
                  <div className="font-semibold text-amber-300">Clean 4K 60FPS</div>
                  <div className="text-[9px] text-neutral-400">Hitam Pekat · Blend Screen</div>
                </button>

                <button
                  onClick={() => {
                    onChangeConfig({
                      backgroundMode: 'chroma_green',
                      showText: false,
                      resolution: '4k_uhd',
                      fps: 60,
                      durationSeconds: 10,
                    });
                    onChangeExportFormat('mp4');
                  }}
                  className="p-1.5 text-left rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-[11px] text-white cursor-pointer"
                >
                  <div className="font-semibold text-emerald-400">Green Screen</div>
                  <div className="text-[9px] text-neutral-400">CapCut / Chroma Key</div>
                </button>
              </div>
            </div>

            {/* Background Mode Selector with Microstock Guidance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-neutral-300 font-semibold">Background untuk Render</label>
                <span className="text-[10px] text-amber-400 font-mono">
                  {config.backgroundMode === 'black' ? '★ Standar Stock' : ''}
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    id: 'black',
                    label: 'Hitam Pekat #000000 (Rekomendasi Utama Microstock)',
                    desc: 'Video editor di Premiere/CapCut tinggal atur Blend Mode ke "Screen". Hitam otomatis transparan!',
                    isBest: true,
                  },
                  {
                    id: 'transparent',
                    label: 'Alpha Transparan (VFX PNG Sequence / WebM)',
                    desc: 'Langsung tembus tanpa blending mode, cocok untuk pengguna After Effects & DaVinci.',
                    isBest: false,
                  },
                  {
                    id: 'chroma_green',
                    label: 'Green Screen #00FF00',
                    desc: 'Bagus untuk pemula di CapCut ponsel yang memakai fitur kunci kroma (Chroma Key).',
                    isBest: false,
                  },
                  {
                    id: 'chroma_blue',
                    label: 'Blue Screen #0000FF',
                    desc: 'Alternatif kunci kroma jika partikel memiliki unsur warna hijau.',
                    isBest: false,
                  },
                  {
                    id: 'custom_gradient',
                    label: 'Full Background Gelap (Stage / Backdrop)',
                    desc: 'Jika ingin video utuh langsung tayang di panggung LED tanpa video lain di bawahnya.',
                    isBest: false,
                  },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onChangeConfig({ backgroundMode: bg.id as BackgroundMode })}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      config.backgroundMode === bg.id
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{bg.label}</span>
                      {config.backgroundMode === bg.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{bg.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="space-y-2">
              <label className="text-neutral-300 font-semibold flex items-center justify-between">
                <span>Resolusi Kanvas & Ekspor</span>
                <span className="text-[10px] text-amber-400 font-mono">Bebas Stutter</span>
              </label>
              <div className="space-y-1.5">
                {(Object.keys(RESOLUTION_PRESETS) as ResolutionPreset[]).map((resKey) => {
                  const item = RESOLUTION_PRESETS[resKey];
                  const isSelected = config.resolution === resKey;
                  return (
                    <button
                      key={resKey}
                      onClick={() => onChangeConfig({ resolution: resKey })}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">{item.label}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {item.width} × {item.height} ({item.aspectRatio}) · {item.category}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frame Rate & Durasi */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold">Frame Rate</label>
                <div className="flex bg-neutral-950 rounded-lg p-1 border border-neutral-800">
                  <button
                    onClick={() => onChangeConfig({ fps: 30 })}
                    className={`flex-1 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      config.fps === 30 ? 'bg-neutral-800 text-amber-300' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    30 FPS
                  </button>
                  <button
                    onClick={() => onChangeConfig({ fps: 60 })}
                    className={`flex-1 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      config.fps === 60 ? 'bg-neutral-800 text-amber-300' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    60 FPS (Ultra)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-semibold">Durasi Loop</label>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">10s Rekomendasi</span>
                </div>
                <select
                  value={config.durationSeconds}
                  onChange={(e) => onChangeConfig({ durationSeconds: parseInt(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value={5}>5 Detik (Batas Minimum Microstock)</option>
                  <option value={10}>10 Detik (⭐ Rekomendasi Emas Pasar)</option>
                  <option value={15}>15 Detik (Broadcast & Event Panjang)</option>
                  <option value={20}>20 Detik (Extended Visual Showcase)</option>
                </select>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  <span className="text-amber-300 font-semibold">10 Detik</span> adalah standar emas pasar microstock (Shutterstock & Adobe Stock mensyaratkan min. 5s). Cepat di-render, ukuran file hemat (~60-90MB), dan mudah di-loop tak terbatas oleh pembeli.
                </p>
              </div>
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <label className="text-neutral-300 font-semibold">Format Output Video</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onChangeExportFormat('mp4')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    exportFormat === 'mp4'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs">MP4 (H.264)</div>
                  <div className="text-[9px] text-neutral-500 font-mono mt-0.5">Universal Stock</div>
                </button>

                <button
                  onClick={() => onChangeExportFormat('webm')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    exportFormat === 'webm'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs">WebM (VP9)</div>
                  <div className="text-[9px] text-neutral-500 font-mono mt-0.5">High Speed</div>
                </button>

                <button
                  onClick={() => onChangeExportFormat('png_sequence')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    exportFormat === 'png_sequence'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs">PNG ZIP</div>
                  <div className="text-[9px] text-neutral-500 font-mono mt-0.5">Alpha VFX Pro</div>
                </button>
              </div>
            </div>

            {/* Bitrate Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Bitrate Video 4K</span>
                <span className="font-mono text-amber-400">{config.bitrateMbps} Mbps</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={config.bitrateMbps}
                onChange={(e) => onChangeConfig({ bitrateMbps: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PARTICLE PHYSICS & VISUAL FX */}
        {/* ============================================================== */}
        {activeTab === 'visuals' && (
          <div className="space-y-4">
            {/* Color Palette Presets */}
            <div className="space-y-2">
              <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Palet Warna Partikel</span>
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'gold_luxury', label: '24K Gold & Champagne (Tahun Baru)', colors: ['#fef08a', '#f59e0b', '#d97706'] },
                  { id: 'emerald_ruby', label: 'Christmas Emerald & Ruby (Natal)', colors: ['#10b981', '#ef4444', '#fde047'] },
                  { id: 'amber_warm', label: 'Warm Amber & Gold (Lampu Natal)', colors: ['#fbbf24', '#f59e0b', '#d97706'] },
                  { id: 'ice_aurora', label: 'Arctic Frost & White Snow', colors: ['#ffffff', '#38bdf8', '#e0f2fe'] },
                  { id: 'cyber_neon', label: 'Cyber Sapphire & Magenta 2027', colors: ['#06b6d4', '#ec4899', '#8b5cf6'] },
                  { id: 'champagne_rose', label: 'Rose Gold & Confetti', colors: ['#fda4af', '#f59e0b', '#ffffff'] },
                ].map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => onChangeConfig({ colorPalette: palette.id as any })}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      config.colorPalette === palette.id
                        ? 'bg-neutral-800 border-amber-500/50 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{palette.label}</span>
                    <div className="flex items-center gap-1">
                      {palette.colors.map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Particle Count Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Jumlah Partikel</span>
                <span className="font-mono text-amber-400">{config.particleCount} Partikel</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={config.particleCount}
                onChange={(e) => onChangeConfig({ particleCount: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Particle Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Kecepatan Gerak (Velocity)</span>
                <span className="font-mono text-amber-400">{config.particleSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                value={config.particleSpeed}
                onChange={(e) => onChangeConfig({ particleSpeed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Particle Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Ukuran Partikel (Scale)</span>
                <span className="font-mono text-amber-400">{config.particleSize.toFixed(1)} px</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={config.particleSize}
                onChange={(e) => onChangeConfig({ particleSize: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Glow Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Intensitas Glow Bloom</span>
                <span className="font-mono text-amber-400">{config.glowIntensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={config.glowIntensity}
                onChange={(e) => onChangeConfig({ glowIntensity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Turbulence */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Turbulensi & Gelombang</span>
                <span className="font-mono text-amber-400">{config.turbulence.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={config.turbulence}
                onChange={(e) => onChangeConfig({ turbulence: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TYPOGRAPHY & MODE JUAL MICROSTOCK */}
        {/* ============================================================== */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* The Crucial Microstock Choice: Clean Overlay vs With Text */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <label className="text-white font-bold text-xs flex items-center justify-between">
                <span>Mode Microstock (Strategi Jual)</span>
                <span className="text-amber-400 text-[10px] font-mono">Penting</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChangeConfig({ showText: false })}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    !config.showText
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Tanpa Teks (Clean)</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                    ★ Rekomendasi Jual: Pembeli bisa pasang teks sendiri.
                  </div>
                </button>

                <button
                  onClick={() => onChangeConfig({ showText: true })}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    config.showText
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" />
                    <span>Dengan Teks</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                    Untuk video ucapan langsung atau demo preview portofolio.
                  </div>
                </button>
              </div>
            </div>

            {config.showText ? (
              <div className="space-y-3.5 p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
                {/* Year Centerpiece with auto correction for Christmas 2026 vs New Year 2027 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-neutral-300 font-semibold">Tahun / Angka</label>
                    <div className="flex gap-1 text-[10px] font-mono">
                      <button
                        onClick={() => onChangeConfig({ yearText: '2026' })}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          config.yearText === '2026' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        Natal: 2026
                      </button>
                      <button
                        onClick={() => onChangeConfig({ yearText: '2027' })}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          config.yearText === '2027' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        Tahun Baru: 2027
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={config.yearText}
                    onChange={(e) => onChangeConfig({ yearText: e.target.value })}
                    placeholder={isChristmas ? '2026' : '2027'}
                    className="w-full bg-neutral-900 border border-neutral-800 text-amber-300 font-mono text-base font-bold rounded-lg p-2 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Main Headline */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-semibold">Judul Utama</label>
                  <input
                    type="text"
                    value={config.headlineText}
                    onChange={(e) => onChangeConfig({ headlineText: e.target.value })}
                    placeholder={isChristmas ? 'MERRY CHRISTMAS' : 'HAPPY NEW YEAR'}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg p-2 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-semibold">Subjudul / Pesan</label>
                  <input
                    type="text"
                    value={config.subtitleText}
                    onChange={(e) => onChangeConfig({ subtitleText: e.target.value })}
                    placeholder={isChristmas ? 'PEACE & JOY TO THE WORLD' : 'WELCOME THE FUTURE'}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg p-2 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Font Selection */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-semibold">Font Tipografi</label>
                  <select
                    value={config.fontFamily}
                    onChange={(e) => onChangeConfig({ fontFamily: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="Cinzel">Cinzel (Regal Luxury Serif)</option>
                    <option value="Outfit">Outfit (Modern Bold Sans)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Clean)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-2 text-neutral-300 leading-relaxed">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mode Bersih Aktif (Clean Master Overlay)</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Video akan dirender murni hanya berupa partikel, salju, stardust, atau konfeti yang bergerak tanpa teks apa pun.
                </p>
                <div className="text-[10px] text-amber-300 font-mono bg-neutral-950/80 p-2 rounded border border-neutral-800">
                  ✓ Cocok untuk pembeli di Videohive & Shutterstock karena mereka bebas menambahkan judul & logo mereka sendiri!
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary CTA Bottom Bar */}
      <div className="p-4 bg-neutral-950 border-t border-neutral-800">
        <button
          onClick={onStartRender}
          disabled={isRendering}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-neutral-950 font-bold text-sm rounded-lg shadow-xl shadow-amber-500/20 hover:from-amber-300 hover:to-yellow-300 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isRendering ? 'Sedang Render 4K...' : 'Mulai Render 4K MP4'}</span>
        </button>
        <div className="text-center mt-2 text-[10px] text-neutral-400 font-mono">
          {!config.showText ? 'Clean Overlay (Tanpa Teks)' : 'Dengan Teks'} · {RESOLUTION_PRESETS[config.resolution].width}×{RESOLUTION_PRESETS[config.resolution].height} · {config.fps} FPS
        </div>
      </div>
    </div>
  );
};
