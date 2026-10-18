import { MotionConfig, RESOLUTION_PRESETS, ExportFormat } from '../types/motion';
import { MOTION_PRESETS } from '../templates/motionPresets';

export interface MicrostockMetadata {
  Title: string;
  Description: string;
  Keywords: string; // Continuous comma-separated string format (e.g. "new year 2027, gold luxury, ...")
  Categories: {
    Primary: string;
    Secondary: string;
  };

  // Helper properties / aliases for UI backward-compatibility
  keywordsArray?: string[];
  keywordsCount?: number;
  title?: string;
  description?: string;
  tags?: string[];
  keywords?: string;
  primaryCategory?: string;
  secondaryCategory?: string;
  csvKeywordsString?: string;
}

/**
 * Returns a broadcast-grade, natural English visual description for each preset.
 * Strictly 100% English.
 */
function getEnglishPresetVisualDescription(preset: any): string {
  const map: Record<string, string> = {
    sacred_spiral_tree_bethlehem_star:
      'Architectural minimalist dual-helical golden spiral pine tree wireframe studded with jewel baubles and crowned by the radiant Star of Bethlehem emitting volumetric godrays.',
    crystalline_snowflake_mandala:
      'Pure 6-fold mathematical fractal symmetry crystalline snowflake mandala rotating with ice diamond glints and radial starburst bloom.',
    golden_jingle_bell_ribbon_swing:
      'Harmonic swinging 24K golden holiday bell with acoustic chime light ripples, velvet ruby ribbon bow, and cascading gold stardust.',
    midnight_fireworks_nye2027_reveal:
      'Grand 360-degree golden willow fireworks canopy detonation crystallizing into crisp, 100% legible typography HAPPY NEW YEAR 2027 with specular sweep glint.',
    cosmic_ribbon_merry_christmas_reveal:
      'Dual cosmic light ribbons swirling into a radiant circular wreath, bursting outward to reveal crisp, 100% legible typography MERRY CHRISTMAS crowned with star sparkles.',
    gold_newyear_2027_countdown:
      'Premium 24K gold dust particles rotating in luxurious cosmic orbital rings with stardust sparkle.',
    nye_2027_grand_fireworks:
      'Harmonic bursts of golden fireworks and falling stardust glitter exploding across a pure black canvas.',
    champagne_confetti_sparklers:
      'Opulent 24K gold confetti ribbon storm cascading downward with sparkling champagne flares.',
    nye_2027_champagne_effervescence:
      'Sparkling champagne bubbles and effervescent golden particles ascending smoothly in luminous streams.',
    nye_2027_sparkler_waterfall:
      'Glittering golden sparkler waterfall curtain raining down with radiant ambient glow.',
    cyber_neon_2027_vortex:
      'High-velocity sapphire neon laser vortex spiraling forward through a futuristic cybernetic tunnel.',
    christmas_emerald_snowfall:
      'Gleaming emerald green and ruby red bokeh orbs drifting softly alongside crystalline snow flurries.',
    christmas_pure_gentle_snow:
      'Prismatic holiday snowfall blizzard drifting softly in a serene, pure winter atmosphere.',
    christmas_fairy_lights_garland:
      'Warm amber festive fairy lights and holiday bokeh garlands gently shimmering on a dark backdrop.',
    golden_christmas_tree_spiral:
      'Radiant sacred golden holiday tree helix spiraling upward with celestial stardust particles.',
    christmas_star_radiant_beams:
      'Sacred Star of Bethlehem emitting volumetric golden radiant beams and floating angelic dust.',
    celestial_aurora_ice_crystal:
      'Celestial emerald aurora borealis waves undulating with prismatic floating frost crystals.',
    nye_2027_bokeh_tunnel:
      'Hypnotic infinite golden bokeh tunnel pulling the viewer forward into a sea of luminous orbs.',
    christmas_fairy_dust_gust:
      'Magical holiday fairy wand gust sweeping across the frame with sparkling stardust trail.',
    christmas_diamond_ice_burst:
      'Faceted 3D diamond ice crystal burst refracting prismatic light beams and frost stardust.',
    nye_2027_curling_ribbons:
      'Metallic gold and velvet crimson serpentine streamers twisting and floating downwards gracefully.',
    nye_2027_clockwork_orbit:
      'Minimalist luxury Roman numeral clock dial sweeping with planetary stardust rings.',
    christmas_warm_embers_fireflies:
      'Warm ambient fireplace embers and floating golden stardust particles rising with cozy hearth warmth.',
    christmas_celestial_godrays:
      'Majestic celestial golden godrays and volumetric light shafts slicing through gentle atmospheric haze.',
    nye_2027_cyber_matrix_rain:
      'Streaming matrix binary data beams and glowing quantum stardust cascading down in a cyberpunk grid.',
    christmas_frost_window_vignette:
      'Luxury golden festoon fairy curtain and delicate crystalline icicle drops shimmering gently.',
    nye_2027_champagne_clink_burst:
      'Celebratory champagne toast starburst flash with champagne bubble splashes and golden glints.',
    nye_2027_golden_champagne_climax:
      'Grand midnight celebration climax with rising champagne effervescence and golden stardust flares.',
    christmas_candlelight_sanctuary:
      'Warm sacred candlelight luminary orbs glowing serenely with ambient flickering warmth.',
    nye_2027_laser_countdown_rings:
      'Concentric neon laser pulse rings expanding dynamically for high-impact midnight countdowns.',
    christmas_flying_sleigh_stardust:
      'Luminous golden star arc and sweeping stardust trail traversing a celestial winter sky.',
    nye_2027_light_leak_film_burn:
      'Warm champagne anamorphic lens flares and organic golden light leaks pulsing smoothly.',
    christmas_botanical_shimmer_fall:
      'Festive holly leaves and ruby winter berry dust falling gently with golden shimmer flakes.',
    nye_2027_molten_gold_vortex:
      'Luxurious 24K liquid gold fluid waves curling and churning in an opulent molten ribbon vortex.',
    christmas_ornament_pendulum_glint:
      'Reflective glass holiday bauble spheres swaying gently with specular starburst glints.',
    nye_2027_kamuro_willow_fireworks:
      'Classic golden Kamuro willow fireworks canopy cascading slowly with long-burning glitter trails.',
    nye_2027_synthwave_laser_grid:
      'Retro synthwave neon grid horizon with magenta and cyan speed dust particles racing forward.',
    nye_2027_gold_silk_caustics:
      'Silky 24K gold satin drapery caustics rippling smoothly with ambient luxury sheen.',
    christmas_cathedral_stained_glass:
      'Gothic cathedral stained-glass colored light beams illuminated by sacred winter incense dust.',
    christmas_snowglobe_vortex:
      'Swirling snow globe blizzard vortex with miniature glowing crystal snowflakes.',
    nye_2027_times_square_ball_drop:
      'Geodesic crystal celebration sphere descending amidst sparkling sunburst flares and ticker confetti.',
    nye_2027_zero_hour_clock_sweep:
      'Minimalist luxury midnight clock with precision golden sweep hands, tick markers, and countdown shockwaves.',
    christmas_pine_holly_shower:
      'Evergreen frosted pine needles and ruby holiday berries drifting in a gentle celebration shower.',
    nye_2027_prismatic_laser_tunnel:
      'High-energy EDM club prismatic laser beams and synchronized strobe pulses penetrating darkness.',
    nye_2027_typography_silhouette_reveal:
      'Sculpted 2027 typography silhouette revealed through shimmering golden stardust trails.',
    christmas_sky_lanterns_embers:
      'Warm glowing holiday sky wish lanterns floating peacefully into the celestial night sky.',
    nye_2027_champagne_flute_columns:
      'Dual luxury champagne flute vertical effervescence columns rising in synchronized harmony.',
    christmas_gingerbread_sugar_frost:
      'Whimsical gingerbread cookie stars and glittering sugar frost particles drifting playfully.',
    christmas_poinsettia_petals_drift:
      'Velveteen crimson poinsettia petals and golden pollen glints floating in an elegant seasonal draft.',
    christmas_cathedral_candle_wall:
      'Architectural grid of sacred cathedral votive candles flickering warmly with golden ambiance.',
    christmas_north_pole_compass:
      'Ornate celestial North Star navigational compass surrounded by undulating polar aurora ribbons.',
    christmas_nutcracker_golden_sparks:
      'Festive martial drumbeat sparks and toy soldier golden brass dust bursting with holiday vigor.',
    nye_2027_skyline_monolith_pulse:
      'Metropolitan midnight skyline silhouette crowned with golden laser beacons and celebration pulses.',
    nye_2027_stadium_confetti_blast:
      'Massive 24K metallic gold confetti cannon blast filling the entire frame with dense flutter.',
  };

  if (preset && map[preset.id]) {
    return map[preset.id];
  }

  const rawName = (preset?.name || 'Golden Particles')
    .replace(/\b(2026|2027)\b/g, '')
    .replace(/\(Clean Loop\)/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `Luminous ${rawName.toLowerCase()} particles and sparkling stardust flowing in a seamless kinetic motion.`;
}

export function generateMicrostockMetadata(
  config: MotionConfig,
  _format: ExportFormat,
  _videoFileName: string
): MicrostockMetadata {
  const preset = MOTION_PRESETS.find((p) => p.id === config.templateId) || MOTION_PRESETS[0];
  const res = RESOLUTION_PRESETS[config.resolution];
  const isChristmas = preset.category === 'Christmas 2026';
  const isCyber = preset.category === 'Futuristic & Cyber';
  const yearTag = isChristmas ? '2026' : '2027';

  // 1. Resolution label (e.g. "4K 60FPS", "2K 60FPS")
  const resLabel = res.width >= 3840 ? `4K ${config.fps}FPS` : res.width >= 2560 ? `2K ${config.fps}FPS` : `1080p ${config.fps}FPS`;

  // 2. Title Generation (100% English, standard broadcast microstock formula)
  const cleanPresetTitle = preset.name
    .replace(/\b(2026|2027)\b/g, '')
    .replace(/\(Clean Loop\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const title = `${cleanPresetTitle} (Clean Loop) ${yearTag} — ${resLabel} Seamless Loop Particle Overlay Background`;

  // 3. Description Generation (Concise, professional 3-sentence microstock copy in 100% English)
  let description = '';
  if (preset.id === 'gold_newyear_2027_countdown') {
    description =
      'Premium 24K gold dust particles rotating in luxurious cosmic orbital rings with stardust sparkle. Perfect for New Year 2027 countdown openers, gala events, holiday cards, awards ceremonies, and luxury brand promotions. Seamless 4K loop designed for broadcast backgrounds and celebration videos.';
  } else {
    const visual = getEnglishPresetVisualDescription(preset);
    let useCase = '';
    if (isChristmas) {
      useCase =
        'Perfect for Christmas 2026 holiday greetings, church services, festive winter openers, seasonal family videos, and holiday promotions.';
    } else if (isCyber) {
      useCase =
        'Perfect for futuristic DJ backdrops, EDM music festivals, cyberpunk openers, technology showcases, and high-energy club visuals.';
    } else {
      useCase = `Perfect for New Year ${yearTag} countdown openers, gala events, holiday cards, awards ceremonies, and luxury brand promotions.`;
    }
    description = `${visual} ${useCase} Seamless 4K loop designed for broadcast backgrounds and celebration videos.`;
  }

  // 4. Keywords Generation (~35-45 high-ranking keywords, 100% English)
  let rawKeywordsList: string[] = [];

  if (preset.id === 'crystalline_snowflake_mandala') {
    rawKeywordsList = [
      'snowflake mandala',
      'christmas 2026',
      'fractal crystal',
      'ice diamond',
      'gold stardust',
      'crystal snowflake',
      'winter wonderland',
      'six fold symmetry',
      'rotating snowflake',
      'starburst bloom',
      'holiday celebration',
      'merry christmas',
      'gold luxury',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'bokeh',
      'glow particles',
      'cinematic lighting',
      'ice crystals',
      'december 2026',
      'festive lights',
    ];
  } else if (preset.id === 'golden_jingle_bell_ribbon_swing') {
    rawKeywordsList = [
      'jingle bell silhouette',
      'christmas bell',
      'christmas 2026',
      'velvet ribbon',
      'golden bell',
      'harmonic chime',
      'acoustic wave',
      'bell swinging',
      'holiday celebration',
      'merry christmas',
      'jingle bells',
      'gold luxury',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'glow particles',
      'cinematic lighting',
      'ruby ribbon',
      'holiday greeting',
    ];
  } else if (preset.id === 'sacred_spiral_tree_bethlehem_star') {
    rawKeywordsList = [
      'spiral christmas tree',
      'bethlehem star',
      'christmas 2026',
      'minimalist wireframe',
      'helical tree',
      'golden spiral',
      'godrays',
      'sacred night',
      'church visuals',
      'holiday celebration',
      'merry christmas',
      'gemstone baubles',
      'gold luxury',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'glow particles',
      'cinematic lighting',
      'winter season',
      'festive lights',
      'divine light',
    ];
  } else if (preset.id === 'midnight_fireworks_nye2027_reveal') {
    rawKeywordsList = [
      'happy new year 2027',
      'new year 2027',
      'fireworks reveal',
      'midnight climax',
      'typography silhouette',
      'willow fireworks',
      'supernova burst',
      'countdown climax',
      'times square',
      'annual party',
      'celebration climax',
      'gold luxury',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'glow particles',
      'happy new year',
      'nye 2027',
      'midnight countdown',
      'champagne toast',
      'welcome 2027',
      'january 1 2027',
    ];
  } else if (preset.id === 'cosmic_ribbon_merry_christmas_reveal') {
    rawKeywordsList = [
      'merry christmas reveal',
      'christmas 2026',
      'script silhouette',
      'cosmic wreath',
      'holiday opener',
      'gold typography',
      'calligraphy script',
      'holiday celebration',
      'merry christmas',
      'shimmer text',
      'christmas greeting',
      'gold luxury',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'glow particles',
      'cinematic lighting',
      'holiday season',
      'december 2026',
      'festive lights',
    ];
  } else if (preset.id === 'gold_newyear_2027_countdown') {
    // Exact 39 keywords requested by user in order
    rawKeywordsList = [
      'new year 2027',
      'gold luxury',
      'clean overlay',
      'blend screen',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'bokeh',
      'glow particles',
      'cinematic lighting',
      'holiday celebration',
      'happy new year',
      'nye 2027',
      'midnight countdown',
      'luxury gold',
      '24k stardust',
      'champagne toast',
      'fireworks loop',
      'gala awards',
      'confetti storm',
      'celebration climax',
      'annual party',
      'times square',
      'welcome 2027',
      'january 1 2027',
    ];
  } else if (isChristmas) {
    rawKeywordsList = [
      'christmas 2026',
      'merry christmas',
      'holiday season',
      'winter wonderland',
      'snowfall',
      'crystalline snow',
      'fairy lights',
      'festive lights',
      'cozy hearth',
      'family holiday',
      'sacred night',
      'church visuals',
      'no text overlay',
      'customizable greeting',
      'december 2026',
      'clean overlay',
      'blend screen',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'bokeh',
      'glow particles',
      'cinematic lighting',
      'holiday celebration',
    ];
  } else if (isCyber) {
    rawKeywordsList = [
      'cyberpunk 2027',
      'neon laser',
      'edm festival',
      'dj visuals',
      'synthwave',
      'matrix stream',
      'future technology',
      'club rave',
      'clean overlay',
      'blend screen',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'bokeh',
      'glow particles',
      'cinematic lighting',
      'welcome 2027',
    ];
  } else {
    // Other New Year 2027 presets
    rawKeywordsList = [
      'new year 2027',
      'gold luxury',
      'clean overlay',
      'blend screen',
      '4k 60fps',
      'seamless loop',
      'motion graphics',
      'overlay',
      'particle background',
      '4k uhd',
      '60fps',
      'vfx',
      'alpha overlay',
      'screen blend mode',
      'black background',
      'clean background',
      'royalty free',
      'stock footage',
      'video editor asset',
      'broadcast backdrop',
      'stardust',
      'bokeh',
      'glow particles',
      'cinematic lighting',
      'holiday celebration',
      'happy new year',
      'nye 2027',
      'midnight countdown',
      'luxury gold',
      'champagne toast',
      'annual party',
      'times square',
      'welcome 2027',
      'january 1 2027',
    ];
  }

  // Deduplicate and ensure clean lowercase English strings
  const uniqueKeywordsArray = Array.from(
    new Set(rawKeywordsList.map((k) => k.trim().toLowerCase()))
  ).filter((k) => k.length > 0);

  // Formatted as continuous comma-separated string: "tag1, tag2, tag3, ..."
  // No line break, no surrounding quotes per keyword
  const keywordsString = uniqueKeywordsArray.join(', ');

  // 5. Categories (100% English)
  let primaryCategory = 'Holidays / Celebrations';
  let secondaryCategory = 'Special Effects / VFX';

  if (isCyber) {
    primaryCategory = 'Special Effects / VFX';
    secondaryCategory = 'Backgrounds / Textures';
  }

  const result: MicrostockMetadata = {
    Title: title,
    Description: description,
    Keywords: keywordsString,
    Categories: {
      Primary: primaryCategory,
      Secondary: secondaryCategory,
    },
  };

  // Hidden non-enumerable helper getters for backward compatibility with UI components
  // so JSON.stringify(result) prints ONLY: Title, Description, Keywords, Categories
  Object.defineProperty(result, 'keywordsArray', { get: () => uniqueKeywordsArray, enumerable: false });
  Object.defineProperty(result, 'keywordsCount', { get: () => uniqueKeywordsArray.length, enumerable: false });
  Object.defineProperty(result, 'title', { get: () => result.Title, enumerable: false });
  Object.defineProperty(result, 'description', { get: () => result.Description, enumerable: false });
  Object.defineProperty(result, 'tags', { get: () => uniqueKeywordsArray, enumerable: false });
  Object.defineProperty(result, 'keywords', { get: () => result.Keywords, enumerable: false });
  Object.defineProperty(result, 'primaryCategory', { get: () => result.Categories.Primary, enumerable: false });
  Object.defineProperty(result, 'secondaryCategory', { get: () => result.Categories.Secondary, enumerable: false });
  Object.defineProperty(result, 'csvKeywordsString', { get: () => result.Keywords, enumerable: false });

  return result;
}

/**
 * Downloads standard JSON file with the clean microstock format:
 * - Title (string)
 * - Description (string)
 * - Keywords (comma-separated string: "tag1, tag2, tag3")
 * - Categories ({ Primary, Secondary })
 */
export function downloadJsonFile(filename: string, data: MicrostockMetadata | any) {
  const keywordsStr =
    typeof data.Keywords === 'string'
      ? data.Keywords
      : Array.isArray(data.Keywords)
      ? data.Keywords.join(', ')
      : typeof data.keywords === 'string'
      ? data.keywords
      : Array.isArray(data.tags)
      ? data.tags.join(', ')
      : '';

  const cleanExportPayload = {
    Title: data.Title || data.title || '',
    Description: data.Description || data.description || '',
    Keywords: keywordsStr,
    Categories: {
      Primary: data.Categories?.Primary || data.primaryCategory || 'Holidays / Celebrations',
      Secondary: data.Categories?.Secondary || data.secondaryCategory || 'Special Effects / VFX',
    },
  };

  const jsonStr = JSON.stringify(cleanExportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads plain text .txt metadata file in exact user-requested layout:
 * Title:\n...\n\nDescription:\n...\n\nKeywords (N):\n...\n\nCategories:\nPrimary: ...\nSecondary: ...
 */
export function downloadTxtFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats metadata as clean, human-readable text block matching user specification.
 */
export function formatMicrostockText(data: MicrostockMetadata | any): string {
  if (!data) return '';
  const title = data.Title || data.title || '';
  const description = data.Description || data.description || '';
  const keywordsStr =
    typeof data.Keywords === 'string'
      ? data.Keywords
      : Array.isArray(data.Keywords)
      ? data.Keywords.join(', ')
      : typeof data.keywords === 'string'
      ? data.keywords
      : Array.isArray(data.tags)
      ? data.tags.join(', ')
      : '';

  const count = keywordsStr
    ? keywordsStr
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean).length
    : 0;

  const primary = data.Categories?.Primary || data.primaryCategory || 'Holidays / Celebrations';
  const secondary = data.Categories?.Secondary || data.secondaryCategory || 'Special Effects / VFX';

  return `Title:\n${title}\n\nDescription:\n${description}\n\nKeywords (${count}):\n${keywordsStr}\n\nCategories:\nPrimary: ${primary}\nSecondary: ${secondary}`;
}
