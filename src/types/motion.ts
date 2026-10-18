export type ResolutionPreset = '4k_uhd' | '2k_qhd' | '1080p_fhd' | 'vertical_4k' | 'vertical_1080p' | 'square_4k';

export interface ResolutionConfig {
  id: ResolutionPreset;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: 'Landscape' | 'Vertical / Social' | 'Square';
}

export const RESOLUTION_PRESETS: Record<ResolutionPreset, ResolutionConfig> = {
  '4k_uhd': {
    id: '4k_uhd',
    label: '4K UHD Cinema (3840 × 2160)',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    category: 'Landscape',
  },
  '2k_qhd': {
    id: '2k_qhd',
    label: '2K QHD (2560 × 1440)',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    category: 'Landscape',
  },
  '1080p_fhd': {
    id: '1080p_fhd',
    label: '1080p Full HD (1920 × 1080)',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    category: 'Landscape',
  },
  'vertical_4k': {
    id: 'vertical_4k',
    label: 'Vertical 4K TikTok / Reels (2160 × 3840)',
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    category: 'Vertical / Social',
  },
  'vertical_1080p': {
    id: 'vertical_1080p',
    label: 'Vertical 1080p Stories (1080 × 1920)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    category: 'Vertical / Social',
  },
  'square_4k': {
    id: 'square_4k',
    label: 'Square Post 4K (2160 × 2160)',
    width: 2160,
    height: 2160,
    aspectRatio: '1:1',
    category: 'Square',
  },
};

export type BackgroundMode = 'black' | 'transparent' | 'chroma_green' | 'chroma_blue' | 'custom_gradient' | 'stock_texture';

export type ExportFormat = 'mp4' | 'webm' | 'png_sequence';

export type SimulationFootage = 'none' | 'concert' | 'fireplace';

export interface MotionConfig {
  templateId: string;
  resolution: ResolutionPreset;
  fps: 30 | 60;
  durationSeconds: number;
  bitrateMbps: number;
  backgroundMode: BackgroundMode;
  gradientStart: string;
  gradientEnd: string;
  stockTextureUrl?: string;

  // Particle & Physics parameters
  particleCount: number;
  particleSpeed: number;
  particleSize: number;
  glowIntensity: number;
  turbulence: number;
  colorPalette: 'gold_luxury' | 'emerald_ruby' | 'cyber_neon' | 'ice_aurora' | 'champagne_rose' | 'amber_warm';

  // Typography & Overlays (Microstock Default: false)
  showText: boolean;
  headlineText: string;
  subtitleText: string;
  yearText: string;
  fontFamily: 'Cinzel' | 'Outfit' | 'Plus Jakarta Sans';
  goldShimmer: boolean;

  // Microstock Blend Mode Simulator (for testing on real footage in preview)
  simulationFootage?: SimulationFootage;

  // Custom Code option
  customCode?: string;
}

export interface MotionPreset {
  id: string;
  name: string;
  category: 'Christmas 2026' | 'New Year 2027' | 'Party & Confetti' | 'Futuristic & Cyber' | 'Shape Morph' | 'Custom Code';
  description: string;
  tags: string[];
  thumbnail: string;
  defaultConfig: Partial<MotionConfig>;
  isCommercialHot: boolean;
  licensePrice?: string;
  loopSeamless: boolean;
  recommendedBlendMode: 'Screen / Add' | 'Direct Alpha' | 'Luma Key';
}

export interface CommercialAssetItem {
  id: string;
  title: string;
  sku: string;
  theme: string;
  category: string;
  specs: string;
  previewImage: string;
  estimatedEarnings: string;
  downloadsCount: number;
  tags: string[];
  description: string;
  presetId: string;
  blendModeTip: string;
}

export interface RenderProgress {
  isRendering: boolean;
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  fps: number;
  elapsedTime: number;
  estimatedRemaining: number;
  previewDataUrl?: string;
  statusText: string;
  error?: string;
  downloadUrl?: string;
  downloadFileName?: string;
  downloadType?: ExportFormat;
  metadata?: any;
  metadataJsonUrl?: string;
  metadataFileName?: string;
}
