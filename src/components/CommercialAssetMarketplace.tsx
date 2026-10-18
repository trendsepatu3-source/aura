import React, { useState } from 'react';
import {
  Flame,
  Download,
  Sparkles,
  DollarSign,
  TrendingUp,
  Tag,
  ShieldCheck,
  Play,
  ArrowRight,
  Layers,
  Check,
  EyeOff,
  HelpCircle,
} from 'lucide-react';
import { COMMERCIAL_ASSETS_CATALOG, MOTION_PRESETS } from '../templates/motionPresets';
import { MotionPreset } from '../types/motion';

interface CommercialAssetMarketplaceProps {
  onLoadPreset: (preset: MotionPreset) => void;
  onQuickRenderPreset: (preset: MotionPreset) => void;
}

export const CommercialAssetMarketplace: React.FC<CommercialAssetMarketplaceProps> = ({
  onLoadPreset,
  onQuickRenderPreset,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredAssets = filterCategory === 'all'
    ? COMMERCIAL_ASSETS_CATALOG
    : COMMERCIAL_ASSETS_CATALOG.filter((item) =>
        filterCategory === 'newyear'
          ? item.theme.includes('New Year') || item.theme.includes('Party') || item.theme.includes('2027')
          : item.theme.includes('Christmas') || item.theme.includes('2026')
      );

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-950 text-neutral-100 p-6 md:p-8 space-y-8 select-none">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/40 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Katalog Aset Komersial Siap Jual di Videohive, Shutterstock, Pond5 & Motion Array</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display">
            Aset Overlay Partikel Bersih (Clean Loop) Natal 2026 & Tahun Baru 2027
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            <strong className="text-emerald-400">Standar Emas Microstock:</strong> Semua template overlay di bawah dibuat <strong className="text-white">tanpa teks permanen</strong> agar pembeli (editor video, stasiun TV, agency) dapat bebas menaruh logo & judul mereka sendiri. Background menggunakan warna <strong className="text-amber-300">Hitam Pekat (#000000)</strong> sehingga pembeli cukup mengaktifkan Blend Mode <strong className="text-white">"Screen"</strong> di Premiere/CapCut.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Hak Cipta Milikmu (Siap Dijual)</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Rekomendasi Harga Lisensi: $40 - $85 / Download</span>
            <span aria-hidden="true">·</span>
            <span>Natal 2026 & Tahun Baru 2027</span>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Microstock Strategy Guide Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <EyeOff className="w-4 h-4" />
            <span>1. Kenapa Harus Dibuat Tanpa Teks (Clean Overlay)?</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Jika kamu mencantumkan teks mati seperti "Happy New Year 2027" di dalam videonya, pembeli hanya bisa menggunakannya untuk 1 bahasa dan 1 momen saja. Tetapi dengan <strong>Overlay Bersih (Tanpa Teks)</strong>, video editor di seluruh dunia bisa menggunakannya untuk iklan TV, bumper video YouTube, konser panggung, countdown, bahkan untuk video pernikahan!
          </p>
        </div>

        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>2. Bagaimana Cara Render Background-nya?</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            <strong>Gunakan background Hitam Pekat (#000000)!</strong> Ini adalah format standar industri microstock no. 1 di dunia. Di Adobe Premiere Pro, Final Cut, DaVinci Resolve, dan CapCut, pembeli cukup mengubah <em>Blending Mode</em> layer ke <strong>"Screen"</strong> atau <strong>"Add"</strong>. Warna hitam seketika lenyap jadi 100% transparan, dan partikel emas/salju membaur sempurna.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
            }`}
          >
            Semua Aset ({COMMERCIAL_ASSETS_CATALOG.length})
          </button>
          <button
            onClick={() => setFilterCategory('newyear')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterCategory === 'newyear'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
            }`}
          >
            Tahun Baru 2027
          </button>
          <button
            onClick={() => setFilterCategory('christmas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterCategory === 'christmas'
                ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
            }`}
          >
            Natal 2026
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-mono">
          <span>Potensi Royalti Rata-rata: </span>
          <span className="text-emerald-400 font-semibold">$1,500+/bulan</span>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const matchingPreset =
            MOTION_PRESETS.find((p) => p.id === asset.presetId) || MOTION_PRESETS[0];

          return (
            <div
              key={asset.id}
              className="group bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all"
            >
              {/* Preview Image Frame */}
              <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                <img
                  src={asset.previewImage}
                  alt={asset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                {/* SKU Code */}
                <div className="absolute top-2.5 left-2.5 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300 border border-neutral-800">
                  {asset.sku}
                </div>

                {/* Hot Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-amber-500 text-neutral-950 px-2 py-0.5 rounded text-[10px] font-bold shadow">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>Potensi Laku Tinggi</span>
                </div>

                {/* Estimated Earnings Bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-mono bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/60">
                  <span className="text-neutral-400 text-[11px]">Est. Pendapatan:</span>
                  <span className="text-emerald-400 font-bold">{asset.estimatedEarnings}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-amber-400 font-semibold">{asset.theme}</span>
                    <span className="text-neutral-500">{asset.category}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white leading-snug group-hover:text-amber-200 transition-colors">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {asset.description}
                  </p>
                </div>

                {/* Blend Mode Tip */}
                <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] text-amber-300/90 font-mono">
                  💡 {asset.blendModeTip}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onLoadPreset(matchingPreset)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-neutral-700/60"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buka di Studio</span>
                  </button>

                  <button
                    onClick={() => onQuickRenderPreset(matchingPreset)}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Render 4K Master</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
