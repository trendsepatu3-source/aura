/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { TemplateSidebar } from './components/TemplateSidebar';
import { ViewportRenderer } from './components/ViewportRenderer';
import { InspectorControls } from './components/InspectorControls';
import { CommercialAssetMarketplace } from './components/CommercialAssetMarketplace';
import { CustomCodeEditor } from './components/CustomCodeEditor';
import { RenderExportModal } from './components/RenderExportModal';
import { TechnicalSpecsModal } from './components/TechnicalSpecsModal';

import { MotionConfig, ExportFormat, RenderProgress, MotionPreset } from './types/motion';
import { MOTION_PRESETS } from './templates/motionPresets';
import { exportMotionGraphicVideo } from './services/videoExporter';
import { generateMicrostockMetadata, downloadJsonFile } from './services/metadataGenerator';

import goldenImg from './assets/images/golden_newyear_2027_luxury_1791620434102.jpg';
import christmasImg from './assets/images/christmas_emerald_bokeh_particles_1791620446512.jpg';
import champagneImg from './assets/images/champagne_sparkler_loop_backdrop_1791620457318.jpg';
import cyberImg from './assets/images/neon_cyber_2027_vortex_1791620468462.jpg';
import concertImg from './assets/images/sample_concert_crowd_stage_1791621579384.jpg';
import fireplaceImg from './assets/images/sample_family_christmas_fireplace_1791621593742.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'marketplace' | 'code' | 'specs'>('studio');

  // Initial Motion Config (Master Ethereal Spiral Tree Default)
  const [config, setConfig] = useState<MotionConfig>({
    templateId: 'sacred_spiral_tree_bethlehem_star',
    resolution: '4k_uhd',
    fps: 60,
    durationSeconds: 10,
    bitrateMbps: 50,
    backgroundMode: 'black',
    gradientStart: '#1e1035',
    gradientEnd: '#07040d',
    stockTextureUrl: christmasImg,

    // Particles
    particleCount: 720,
    particleSpeed: 1.0,
    particleSize: 3.5,
    glowIntensity: 1.7,
    turbulence: 1.1,
    colorPalette: 'gold_luxury',

    // Typography & Year (Stock Default: false - Clean Overlay)
    showText: false,
    headlineText: 'MERRY CHRISTMAS',
    subtitleText: 'HOLIDAY SPIRIT',
    yearText: '2026',
    fontFamily: 'Cinzel',
    goldShimmer: true,
    simulationFootage: 'none',
  });

  const [exportFormat, setExportFormat] = useState<ExportFormat>('mp4');
  const [isRenderModalOpen, setIsRenderModalOpen] = useState<boolean>(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState<boolean>(false);

  // Render State
  const [renderProgress, setRenderProgress] = useState<RenderProgress>({
    isRendering: false,
    currentFrame: 0,
    totalFrames: 0,
    percentage: 0,
    fps: 0,
    elapsedTime: 0,
    estimatedRemaining: 0,
    statusText: 'Siap merender...',
  });

  const abortControllerRef = useRef<boolean>(false);
  const loadedTexturesRef = useRef<Record<string, HTMLImageElement>>({});

  // Preload Image Assets for Canvas
  useEffect(() => {
    const imagesToPreload = [
      { key: goldenImg, src: goldenImg },
      { key: christmasImg, src: christmasImg },
      { key: champagneImg, src: champagneImg },
      { key: cyberImg, src: cyberImg },
      { key: 'concert', src: concertImg },
      { key: 'fireplace', src: fireplaceImg },
    ];

    imagesToPreload.forEach(({ key, src }) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedTexturesRef.current[key] = img;
      };
    });
  }, []);

  const handleUpdateConfig = (partial: Partial<MotionConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleSelectPreset = (preset: MotionPreset) => {
    setConfig((prev) => ({
      ...prev,
      ...preset.defaultConfig,
      templateId: preset.id,
      stockTextureUrl: preset.thumbnail,
    }));
  };

  const handleStartRender = async () => {
    abortControllerRef.current = false;
    setIsRenderModalOpen(true);

    const totalFrames = Math.round(config.durationSeconds * config.fps);

    setRenderProgress({
      isRendering: true,
      currentFrame: 0,
      totalFrames,
      percentage: 0,
      fps: 0,
      elapsedTime: 0,
      estimatedRemaining: 0,
      statusText: 'Menginisialisasi offline frame encoder...',
      error: undefined,
      downloadUrl: undefined,
      downloadFileName: undefined,
    });

    try {
      const result = await exportMotionGraphicVideo({
        config,
        format: exportFormat,
        onProgress: (prog) => {
          setRenderProgress(prog);
        },
        shouldAbort: () => abortControllerRef.current,
        loadedTextures: loadedTexturesRef.current,
      });

      const url = URL.createObjectURL(result.blob);

      // Generate complete Microstock Metadata (Title, Description, Tags, Categories)
      const metadata = generateMicrostockMetadata(config, exportFormat, result.fileName);
      const jsonFileName = `${result.fileName.replace(/\.[^/.]+$/, '')}_metadata.json`;
      const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json;charset=utf-8' });
      const jsonUrl = URL.createObjectURL(jsonBlob);

      // Otomatis download file JSON setiap kali render selesai!
      try {
        downloadJsonFile(jsonFileName, metadata);
      } catch (err) {
        console.warn('Auto-download JSON metadata warning:', err);
      }

      setRenderProgress((prev) => ({
        ...prev,
        isRendering: false,
        percentage: 100,
        statusText: 'Render 4K selesai & Metadata JSON terunduh otomatis!',
        downloadUrl: url,
        downloadFileName: result.fileName,
        downloadType: exportFormat,
        metadata,
        metadataJsonUrl: jsonUrl,
        metadataFileName: jsonFileName,
      }));
    } catch (err) {
      if (!abortControllerRef.current) {
        setRenderProgress((prev) => ({
          ...prev,
          isRendering: false,
          error: (err as Error).message || 'Terjadi kesalahan saat encoding video',
        }));
      }
    }
  };

  const handleCancelRender = () => {
    abortControllerRef.current = true;
    setRenderProgress((prev) => ({
      ...prev,
      isRendering: false,
      statusText: 'Render dibatalkan',
    }));
  };

  const handleLoadPresetFromMarketplace = (preset: MotionPreset) => {
    handleSelectPreset(preset);
    setActiveTab('studio');
  };

  const handleQuickRenderPresetFromMarketplace = (preset: MotionPreset) => {
    handleSelectPreset(preset);
    setActiveTab('studio');
    setTimeout(() => {
      handleStartRender();
    }, 150);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Universal Top Header */}
      <HeaderBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'specs') {
            setIsSpecsModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenRender={handleStartRender}
        isRendering={renderProgress.isRendering}
      />

      {/* Main Studio Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'studio' && (
          <>
            {/* Left: Template Selector Sidebar */}
            <TemplateSidebar
              currentTemplateId={config.templateId}
              onSelectTemplate={handleSelectPreset}
            />

            {/* Center: Live 4K Viewport Preview */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <ViewportRenderer
                config={config}
                onUpdateConfig={handleUpdateConfig}
                loadedTextures={loadedTexturesRef.current}
                onTriggerRender={handleStartRender}
              />
            </div>

            {/* Right: Fine-grained Parameter & 4K Export Controls */}
            <InspectorControls
              config={config}
              onChangeConfig={handleUpdateConfig}
              exportFormat={exportFormat}
              onChangeExportFormat={setExportFormat}
              onStartRender={handleStartRender}
              isRendering={renderProgress.isRendering}
            />
          </>
        )}

        {/* Tab 2: Commercial Asset Catalog (Aset Laris) */}
        {activeTab === 'marketplace' && (
          <CommercialAssetMarketplace
            onLoadPreset={handleLoadPresetFromMarketplace}
            onQuickRenderPreset={handleQuickRenderPresetFromMarketplace}
          />
        )}

        {/* Tab 3: Custom HTML/JS Canvas Code Editor */}
        {activeTab === 'code' && (
          <CustomCodeEditor
            config={config}
            onUpdateCode={(code) => {
              handleUpdateConfig({
                templateId: 'custom_html_canvas_code',
                customCode: code,
              });
            }}
            onRunPreview={() => {
              setActiveTab('studio');
            }}
            onRender4K={() => {
              setActiveTab('studio');
              setTimeout(() => {
                handleStartRender();
              }, 150);
            }}
          />
        )}
      </div>

      {/* Render Modal Dialog */}
      <RenderExportModal
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
        progress={renderProgress}
        onCancel={handleCancelRender}
        config={config}
        exportFormat={exportFormat}
      />

      {/* Technical Specs & Anti-Stutter Blueprint Modal */}
      <TechnicalSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />
    </div>
  );
}
