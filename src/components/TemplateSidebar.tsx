import React, { useState, useMemo } from 'react';
import { Layers, Check, Flame, Sparkles } from 'lucide-react';
import { MOTION_PRESETS } from '../templates/motionPresets';
import { MotionPreset } from '../types/motion';

interface TemplateSidebarProps {
  currentTemplateId: string;
  onSelectTemplate: (preset: MotionPreset) => void;
}

export const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
  currentTemplateId,
  onSelectTemplate,
}) => {
  const [filter, setFilter] = useState<'all' | 'siluet' | 'nye2027' | 'xmas2026' | 'code'>('siluet');

  const totalCount = MOTION_PRESETS.length;
  const siluetCount = 5;
  const nyeCount = useMemo(
    () => MOTION_PRESETS.filter((p) => p.category === 'New Year 2027' || p.category === 'Futuristic & Cyber' || p.category === 'Party & Confetti').length,
    []
  );
  const xmasCount = useMemo(
    () => MOTION_PRESETS.filter((p) => p.category === 'Christmas 2026').length,
    []
  );
  const codeCount = useMemo(
    () => MOTION_PRESETS.filter((p) => p.category === 'Custom Code').length,
    []
  );

  const filteredPresets = useMemo(() => {
    return MOTION_PRESETS.filter((p) => {
      if (filter === 'siluet') {
        return (
          p.id === 'sacred_spiral_tree_bethlehem_star' ||
          p.id === 'crystalline_snowflake_mandala' ||
          p.id === 'golden_jingle_bell_ribbon_swing' ||
          p.id === 'midnight_fireworks_nye2027_reveal' ||
          p.id === 'cosmic_ribbon_merry_christmas_reveal'
        );
      }
      if (filter === 'nye2027') return p.category === 'New Year 2027' || p.category === 'Futuristic & Cyber' || p.category === 'Party & Confetti';
      if (filter === 'xmas2026') return p.category === 'Christmas 2026';
      if (filter === 'code') return p.category === 'Custom Code';
      return true;
    });
  }, [filter]);

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 w-72 md:w-80 shrink-0 text-neutral-100 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight text-white font-display">Katalog Model Overlay</h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{totalCount} Siap 4K</span>
          </span>
        </div>

        {/* Progress Toward 50+ Models */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
            <span className="text-amber-300 font-semibold">{siluetCount} Model Siluet Kontur BARU ✨</span>
            <span className="text-emerald-300 font-bold">100% Siap</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-300"
              style={{ width: '100%' }}
            />
          </div>
          <div className="text-[9px] text-neutral-400 font-mono flex items-center justify-between px-0.5 pt-0.5">
            <span className="text-amber-300 font-bold">{siluetCount} Siluet</span>
            <span>+</span>
            <span className="text-emerald-400">{xmasCount} Natal</span>
            <span>+</span>
            <span className="text-amber-400">{nyeCount} 2027</span>
            <span>+</span>
            <span className="text-indigo-300">{codeCount} Code</span>
            <span>=</span>
            <span className="text-white font-bold">{totalCount} Model</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-5 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[10px]">
          <button
            onClick={() => setFilter('all')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              filter === 'all' ? 'bg-neutral-800 text-amber-300 font-semibold shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('siluet')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              filter === 'siluet' ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-xs' : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            Siluet ✨
          </button>
          <button
            onClick={() => setFilter('nye2027')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              filter === 'nye2027' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            2027
          </button>
          <button
            onClick={() => setFilter('xmas2026')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              filter === 'xmas2026' ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Natal
          </button>
          <button
            onClick={() => setFilter('code')}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              filter === 'code' ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredPresets.map((preset) => {
          const isSelected = preset.id === currentTemplateId;
          const isXmas = preset.category === 'Christmas 2026';
          const isSilhouette =
            preset.id === 'sacred_spiral_tree_bethlehem_star' ||
            preset.id === 'crystalline_snowflake_mandala' ||
            preset.id === 'golden_jingle_bell_ribbon_swing' ||
            preset.id === 'midnight_fireworks_nye2027_reveal' ||
            preset.id === 'cosmic_ribbon_merry_christmas_reveal';

          return (
            <div
              key={preset.id}
              onClick={() => onSelectTemplate(preset)}
              className={`group p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5'
                  : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-950'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 mb-2 border border-neutral-800/60">
                <img
                  src={preset.thumbnail}
                  alt={preset.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />

                {/* Hot Commercial Label */}
                {isSilhouette ? (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-amber-400 text-neutral-950 px-1.5 py-0.5 rounded text-[10px] font-bold shadow">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>Siluet Kontur ✨</span>
                  </div>
                ) : preset.isCommercialHot ? (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-amber-500/90 text-neutral-950 px-1.5 py-0.5 rounded text-[10px] font-bold shadow">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>Laris Microstock</span>
                  </div>
                ) : null}

                {/* Recommended Blend mode tag */}
                <div className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-neutral-200 bg-neutral-900/85 px-1.5 py-0.5 rounded backdrop-blur-sm border border-neutral-700/60">
                  Blend: {preset.recommendedBlendMode}
                </div>
              </div>

              {/* Title & Category */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold font-mono ${isSilhouette ? 'text-amber-300 font-bold' : isXmas ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {preset.category}
                  </span>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold font-mono">
                      <Check className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-xs text-white leading-snug group-hover:text-amber-200 transition-colors">
                  {preset.name}
                </h3>

                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>

                {/* Metadata unboxed text */}
                <div className="pt-1 flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                  <span>{preset.tags[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{preset.tags[1]}</span>
                  {preset.licensePrice && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400/80 font-medium">{preset.licensePrice}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
