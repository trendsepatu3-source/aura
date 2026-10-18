import { MotionConfig } from '../types/motion';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  time: number;
  progress: number; // 0.0 to 1.0 (seamless loop)
  width: number;
  height: number;
  loadedTextures?: Record<string, HTMLImageElement>;
  isExportingOffline?: boolean;
}

// Pseudo-random deterministic hash for particle stability
function hash(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function drawMotionGraphicFrame({
  ctx,
  config,
  time,
  progress,
  width,
  height,
  loadedTextures,
  isExportingOffline = false,
}: RenderContext) {
  // Check if simulation footage preview is active (only in live preview, not in final offline master export)
  const isSimulatingFootage =
    !isExportingOffline &&
    config.simulationFootage &&
    config.simulationFootage !== 'none';

  // 1. Handle Background
  if (isSimulatingFootage) {
    // Render the sample reference video/photo behind
    const bgKey =
      config.simulationFootage === 'concert'
        ? 'concert'
        : 'fireplace';
    
    // Find loaded texture
    let simImg: HTMLImageElement | undefined = undefined;
    if (loadedTextures) {
      for (const key of Object.keys(loadedTextures)) {
        if (key.includes(bgKey)) {
          simImg = loadedTextures[key];
          break;
        }
      }
    }

    if (simImg) {
      ctx.drawImage(simImg, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);
    }

    // Set Screen Blend mode for particles on top of the footage
    ctx.globalCompositeOperation = 'screen';
  } else {
    ctx.globalCompositeOperation = 'source-over';

    if (config.backgroundMode === 'transparent') {
      ctx.clearRect(0, 0, width, height);
    } else if (config.backgroundMode === 'chroma_green') {
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(0, 0, width, height);
    } else if (config.backgroundMode === 'chroma_blue') {
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(0, 0, width, height);
    } else if (config.backgroundMode === 'custom_gradient') {
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.7
      );
      grad.addColorStop(0, config.gradientStart || '#1e1035');
      grad.addColorStop(1, config.gradientEnd || '#07040d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (config.backgroundMode === 'stock_texture' && config.stockTextureUrl && loadedTextures?.[config.stockTextureUrl]) {
      const img = loadedTextures[config.stockTextureUrl];
      ctx.drawImage(img, 0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, width, height);
    } else {
      // PURE BLACK (#000000) - THE GOLD STANDARD OF MICROSTOCK OVERLAYS!
      // In Premiere, CapCut, DaVinci, setting blend mode to "Screen" turns #000000 into 100% transparent.
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 2. Route by Template ID
  switch (config.templateId) {
    // Koleksi Siluet Kontur & Holiday Reveal (Master Microstock Assets)
    case 'sacred_spiral_tree_bethlehem_star':
      drawSacredSpiralTreeBethlehemStar(ctx, config, time, progress, width, height);
      break;
    case 'crystalline_snowflake_mandala':
      drawCrystallineSnowflakeMandala(ctx, config, time, progress, width, height);
      break;
    case 'golden_jingle_bell_ribbon_swing':
      drawGoldenJingleBellRibbonSwing(ctx, config, time, progress, width, height);
      break;
    case 'midnight_fireworks_nye2027_reveal':
      drawMidnightFireworksNye2027Reveal(ctx, config, time, progress, width, height);
      break;
    case 'cosmic_ribbon_merry_christmas_reveal':
      drawCosmicRibbonMerryChristmasReveal(ctx, config, time, progress, width, height);
      break;

    case 'gold_newyear_2027_countdown':
      drawGoldNewYear2027(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_grand_fireworks':
      drawFireworksBursts(ctx, config, time, progress, width, height);
      break;
    case 'champagne_confetti_sparklers':
      drawChampagneConfetti(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_champagne_effervescence':
      drawChampagneBubbles(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_sparkler_waterfall':
      drawSparklerWaterfall(ctx, config, time, progress, width, height);
      break;
    case 'cyber_neon_2027_vortex':
      drawCyberNeonVortex(ctx, config, time, progress, width, height);
      break;

    // Christmas 2026 Templates
    case 'christmas_emerald_snowfall':
      drawChristmasEmeraldSnow(ctx, config, time, progress, width, height);
      break;
    case 'christmas_pure_gentle_snow':
      drawPureGentleSnow(ctx, config, time, progress, width, height);
      break;
    case 'christmas_fairy_lights_garland':
      drawChristmasFairyLights(ctx, config, time, progress, width, height);
      break;
    case 'golden_christmas_tree_spiral':
      drawGoldenSpiralTree(ctx, config, time, progress, width, height);
      break;
    case 'christmas_star_radiant_beams':
      drawStarOfBethlehem(ctx, config, time, progress, width, height);
      break;
    case 'celestial_aurora_ice_crystal':
      drawCelestialAurora(ctx, config, time, progress, width, height);
      break;
    // 10 New Models (Stage 2 Expansion)
    case 'nye_2027_bokeh_tunnel':
      drawBokehTunnel(ctx, config, time, progress, width, height);
      break;
    case 'christmas_fairy_dust_gust':
      drawFairyDustStream(ctx, config, time, progress, width, height);
      break;
    case 'christmas_diamond_ice_burst':
      drawDiamondIceBurst(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_curling_ribbons':
      drawSpiralRibbons(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_clockwork_orbit':
      drawClockworkOrbit(ctx, config, time, progress, width, height);
      break;
    case 'christmas_warm_embers_fireflies':
      drawWarmEmbers(ctx, config, time, progress, width, height);
      break;
    case 'christmas_celestial_godrays':
      drawCelestialGodrays(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_cyber_matrix_rain':
      drawCyberMatrixStream(ctx, config, time, progress, width, height);
      break;
    case 'christmas_frost_window_vignette':
      drawFrostedVignette(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_champagne_clink_burst':
      drawChampagneClinkBurst(ctx, config, time, progress, width, height);
      break;

    // 10 New Models (Stage 3 Expansion: Total 33 Models)
    case 'nye_2027_golden_champagne_climax':
      drawChampagneClimax(ctx, config, time, progress, width, height);
      break;
    case 'christmas_candlelight_sanctuary':
      drawCandlelightSanctuary(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_laser_countdown_rings':
      drawLaserCountdownRings(ctx, config, time, progress, width, height);
      break;
    case 'christmas_flying_sleigh_stardust':
      drawSleighStardustTrail(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_light_leak_film_burn':
      drawAnamorphicLightLeaks(ctx, config, time, progress, width, height);
      break;
    case 'christmas_botanical_shimmer_fall':
      drawHolidayBotanicalFall(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_molten_gold_vortex':
      drawMoltenGoldVortex(ctx, config, time, progress, width, height);
      break;
    case 'christmas_ornament_pendulum_glint':
      drawOrnamentGlints(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_kamuro_willow_fireworks':
      drawKamuroWillowFireworks(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_synthwave_laser_grid':
      drawSynthwaveGrid(ctx, config, time, progress, width, height);
      break;

    // 10 New Models (Stage 4 Expansion: Researched High-Demand Microstock Assets)
    case 'nye_2027_gold_silk_caustics':
      drawGoldSilkCaustics(ctx, config, time, progress, width, height);
      break;
    case 'christmas_cathedral_stained_glass':
      drawCathedralStainedGlass(ctx, config, time, progress, width, height);
      break;
    case 'christmas_snowglobe_vortex':
      drawSnowglobeBlizzardVortex(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_times_square_ball_drop':
      drawTimesSquareBallDrop(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_zero_hour_clock_sweep':
      drawZeroHourClockSweep(ctx, config, time, progress, width, height);
      break;
    case 'christmas_pine_holly_shower':
      drawPineHollyShower(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_prismatic_laser_tunnel':
      drawPrismaticLaserTunnel(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_typography_silhouette_reveal':
      drawTypographySilhouetteReveal(ctx, config, time, progress, width, height);
      break;
    case 'christmas_sky_lanterns_embers':
      drawSkyLanternsEmbers(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_champagne_flute_columns':
      drawChampagneFluteColumns(ctx, config, time, progress, width, height);
      break;

    // 7 New Models (Final Stage Expansion: Exactly 50 Models)
    case 'christmas_gingerbread_sugar_frost':
      drawGingerbreadSugarFrost(ctx, config, time, progress, width, height);
      break;
    case 'christmas_poinsettia_petals_drift':
      drawPoinsettiaPetalsDrift(ctx, config, time, progress, width, height);
      break;
    case 'christmas_cathedral_candle_wall':
      drawCathedralCandleWall(ctx, config, time, progress, width, height);
      break;
    case 'christmas_north_pole_compass':
      drawNorthPoleCompass(ctx, config, time, progress, width, height);
      break;
    case 'christmas_nutcracker_golden_sparks':
      drawNutcrackerGoldenSparks(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_skyline_monolith_pulse':
      drawSkylineMonolithPulse(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_stadium_confetti_blast':
      drawStadiumConfettiBlast(ctx, config, time, progress, width, height);
      break;

    case 'custom_html_canvas_code':
      drawCustomCode(ctx, config, time, progress, width, height);
      break;
    default:
      drawGoldNewYear2027(ctx, config, time, progress, width, height);
      break;
  }

  // Reset blend mode
  ctx.globalCompositeOperation = 'source-over';

  // 3. Draw Typography Overlay only if explicitly enabled
  if (config.showText && config.templateId !== 'custom_html_canvas_code') {
    drawTextOverlay(ctx, config, time, progress, width, height);
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 1: Gold New Year 2027 Stardust & Cosmic Rings
// ----------------------------------------------------------------------
function drawGoldNewYear2027(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  // Concentric Orbiting Golden Energy Rings
  const ringCount = 5;
  for (let r = 0; r < ringCount; r++) {
    const ringRadius = (width * 0.16) + (r * width * 0.055);
    const ringAngle = (progress * Math.PI * 2 * (r % 2 === 0 ? 1 : -1) * 0.4) + (r * 0.8);
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ringAngle);
    ctx.scale(1, 0.45); // isometric tilt

    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(234, 179, 8, ${0.12 + Math.sin(progress * Math.PI * 2 + r) * 0.06})`;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    const beads = 8;
    for (let b = 0; b < beads; b++) {
      const beadAngle = (b / beads) * Math.PI * 2 + (progress * Math.PI * 2 * 0.5);
      const bx = Math.cos(beadAngle) * ringRadius;
      const by = Math.sin(beadAngle) * ringRadius;
      
      ctx.beginPath();
      ctx.arc(bx, by, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 12 * scale * config.glowIntensity;
      ctx.fill();
    }
    ctx.restore();
  }

  // 3D Stardust Particle Cloud
  for (let i = 0; i < count; i++) {
    const seed = i * 17.13;
    const baseAngle = hash(seed) * Math.PI * 2;
    const baseDist = Math.sqrt(hash(seed + 1)) * (width * 0.65);
    const orbitSpeed = (hash(seed + 2) - 0.5) * 1.8 * speed;
    const angle = baseAngle + (progress * Math.PI * 2 * orbitSpeed);
    
    const waveFreq = 1 + Math.floor(hash(seed + 3) * 3);
    const waveAmp = (hash(seed + 4) * 80 + 30) * scale;
    const yOffset = Math.sin(progress * Math.PI * 2 * waveFreq + baseAngle) * waveAmp;

    const x = cx + Math.cos(angle) * baseDist;
    const y = cy + Math.sin(angle) * (baseDist * 0.58) + yOffset;

    const shimmer = Math.sin(progress * Math.PI * 2 * 3 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 5) * config.particleSize + 1.2) * scale * (0.8 + shimmer * 0.4);
    const alpha = (hash(seed + 6) * 0.7 + 0.3) * (0.6 + shimmer * 0.4);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);

    const hue = 38 + hash(seed + 7) * 14;
    ctx.fillStyle = `hsla(${hue}, 95%, ${65 + shimmer * 25}%, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = (pSize * 4 * config.glowIntensity);
    }
    ctx.fill();

    if (hash(seed + 8) > 0.88 && shimmer > 0.6) {
      const flareLen = pSize * 4;
      ctx.strokeStyle = `rgba(255, 255, 220, ${alpha * 0.8})`;
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(x - flareLen, y);
      ctx.lineTo(x + flareLen, y);
      ctx.moveTo(x, y - flareLen);
      ctx.lineTo(x, y + flareLen);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 2: Midnight Fireworks & Stardust Bursts Loop
// ----------------------------------------------------------------------
function drawFireworksBursts(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // 4 Fireworks centers exploding periodically in phase
  const fireworks = [
    { x: width * 0.28, y: height * 0.35, phaseOffset: 0.0, hue: 45, maxR: width * 0.22 },
    { x: width * 0.72, y: height * 0.32, phaseOffset: 0.5, hue: 35, maxR: width * 0.24 },
    { x: width * 0.50, y: height * 0.25, phaseOffset: 0.25, hue: 50, maxR: width * 0.28 },
    { x: width * 0.50, y: height * 0.45, phaseOffset: 0.75, hue: 15, maxR: width * 0.20 },
  ];

  fireworks.forEach((fw, idx) => {
    const localProg = (progress * speed + fw.phaseOffset) % 1;
    const burstCount = Math.round(config.particleCount * 0.25);
    
    // Expand then fade
    const radius = Math.pow(localProg, 0.6) * fw.maxR;
    const gravity = Math.pow(localProg, 2.2) * (height * 0.12);
    const alpha = Math.sin(localProg * Math.PI) * Math.pow(1 - localProg, 0.5);

    if (alpha <= 0.01) return;

    for (let p = 0; p < burstCount; p++) {
      const seed = idx * 1000 + p * 13.7;
      const angle = (p / burstCount) * Math.PI * 2 + hash(seed) * 0.2;
      const speedMult = 0.5 + hash(seed + 1) * 0.6;
      
      const px = fw.x + Math.cos(angle) * (radius * speedMult);
      const py = fw.y + Math.sin(angle) * (radius * speedMult * 0.8) + gravity;

      const pSize = (hash(seed + 2) * config.particleSize + 1.5) * scale;
      const sparkShimmer = Math.sin(localProg * 25 + p) * 0.3 + 0.7;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${fw.hue + hash(seed + 3) * 15}, 100%, 75%, ${alpha * sparkShimmer})`;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10 * scale * config.glowIntensity;
      }
      ctx.fill();
      ctx.restore();
    }
  });

  // Background floating glitter sparks
  const ambientCount = 80;
  for (let a = 0; a < ambientCount; a++) {
    const seed = a * 41.3;
    const ax = hash(seed) * width;
    const ay = (hash(seed + 1) * height + progress * height * 0.1) % height;
    const aAlpha = Math.sin(progress * Math.PI * 4 + a) * 0.5 + 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(ax, ay, (hash(seed + 2) * 2 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 235, 180, ${aAlpha * 0.6})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 3: Opulent 24K Gold Confetti Ribbon Storm
// ----------------------------------------------------------------------
function drawChampagneConfetti(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  for (let i = 0; i < count; i++) {
    const seed = i * 29.7;
    const fallSpeed = (hash(seed + 1) * 0.8 + 0.6) * speed;
    
    const yTotal = height + 150 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 75 * scale;

    const swayFreq = 1 + Math.floor(hash(seed + 3) * 4);
    const swayAmp = (hash(seed + 4) * 60 + 20) * scale * config.turbulence;
    const x = (hash(seed + 5) * width + Math.sin(progress * Math.PI * 2 * swayFreq + seed) * swayAmp) % width;

    const rotSpeed = (hash(seed + 6) * 3 + 1) * (hash(seed + 7) > 0.5 ? 1 : -1);
    const rotX = progress * Math.PI * 2 * rotSpeed;
    const rotZ = progress * Math.PI * 2 * (rotSpeed * 0.5) + seed;

    const wConfetti = (hash(seed + 8) * config.particleSize * 2.5 + 8) * scale;
    const hConfetti = (hash(seed + 9) * config.particleSize * 1.5 + 5) * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotZ);
    ctx.scale(Math.cos(rotX), 1);

    const flipCosine = Math.abs(Math.cos(rotX));
    const metallicSheen = Math.round(50 + flipCosine * 45);
    
    ctx.fillStyle = `hsl(42, 95%, ${metallicSheen}%)`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8 * scale * config.glowIntensity;
    }

    ctx.fillRect(-wConfetti / 2, -hConfetti / 2, wConfetti, hConfetti);
    ctx.restore();
  }

  // Sparkling Champagne Light Bursts
  const sparkCount = 35;
  for (let s = 0; s < sparkCount; s++) {
    const seed = s * 73.1;
    const sx = hash(seed) * width;
    const sy = hash(seed + 1) * height;
    const sparkPhase = (progress * 4 + hash(seed + 2)) % 1;
    const sparkScale = Math.sin(sparkPhase * Math.PI);

    if (sparkScale > 0.1) {
      const sRadius = (hash(seed + 3) * 20 + 8) * scale * sparkScale;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.strokeStyle = `rgba(255, 255, 230, ${sparkScale * 0.9})`;
      ctx.lineWidth = 1.5 * scale;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 15 * scale * config.glowIntensity;

      ctx.beginPath();
      ctx.moveTo(-sRadius, 0);
      ctx.lineTo(sRadius, 0);
      ctx.moveTo(0, -sRadius);
      ctx.lineTo(0, sRadius);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 3 * scale * sparkScale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 4: Champagne Flute Rising Bubbles Effervescence
// ----------------------------------------------------------------------
function drawChampagneBubbles(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  for (let i = 0; i < count; i++) {
    const seed = i * 23.41;
    const riseSpeed = (hash(seed + 1) * 0.9 + 0.7) * speed;
    
    // Rising upwards loop
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal - (progress * yTotal * riseSpeed)) % yTotal;
    const y = rawY < -50 * scale ? rawY + yTotal : rawY;

    // Gentle zigzag wobble as bubble rises
    const wobbleFreq = 2 + Math.floor(hash(seed + 3) * 4);
    const wobbleAmp = (hash(seed + 4) * 25 + 8) * scale * config.turbulence;
    const xBase = hash(seed + 5) * width;
    const x = (xBase + Math.sin(progress * Math.PI * 2 * wobbleFreq + seed) * wobbleAmp) % width;

    const bRadius = (hash(seed + 6) * config.particleSize + 2.0) * scale;
    const alpha = (hash(seed + 7) * 0.5 + 0.4);

    ctx.save();
    ctx.translate(x, y);

    // Glowing hollow sphere gradient (Bubble look)
    const grad = ctx.createRadialGradient(-bRadius * 0.3, -bRadius * 0.3, bRadius * 0.1, 0, 0, bRadius);
    grad.addColorStop(0, 'rgba(255, 255, 230, 0.9)');
    grad.addColorStop(0.5, 'rgba(251, 191, 36, 0.4)');
    grad.addColorStop(0.9, 'rgba(217, 119, 6, 0.8)');
    grad.addColorStop(1, 'rgba(254, 240, 138, 0.95)');

    ctx.beginPath();
    ctx.arc(0, 0, bRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10 * scale * config.glowIntensity;
    }
    ctx.fill();

    // Specular highlight dot
    ctx.beginPath();
    ctx.arc(-bRadius * 0.35, -bRadius * 0.35, bRadius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 5: Sparkler Light Waterfall / Rain Curtain
// ----------------------------------------------------------------------
function drawSparklerWaterfall(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  for (let i = 0; i < count; i++) {
    const seed = i * 33.17;
    const fallSpeed = (hash(seed + 1) * 1.2 + 0.9) * speed;
    
    // Fast vertical fall loop
    const yTotal = height + 120 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 60 * scale;

    const x = (hash(seed + 3) * width + Math.sin(progress * Math.PI * 2 + seed) * 15 * scale) % width;
    const sparkLen = (hash(seed + 4) * 22 + 8) * scale * speed;
    const alpha = hash(seed + 5) * 0.6 + 0.4;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y - sparkLen);
    ctx.lineTo(x, y);
    ctx.strokeStyle = `rgba(255, 235, 160, ${alpha})`;
    ctx.lineWidth = (hash(seed + 6) * 2.2 + 1.0) * scale;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 12 * scale * config.glowIntensity;
    }
    ctx.stroke();

    // Hot white spark head
    ctx.beginPath();
    ctx.arc(x, y, 1.8 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 6: Cyberpunk Sapphire Neon 2027 Vortex
// ----------------------------------------------------------------------
function drawCyberNeonVortex(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  for (let i = 0; i < count; i++) {
    const seed = i * 19.33;
    const armIndex = Math.floor(hash(seed) * 4);
    const baseProgress = (progress * speed + (i / count)) % 1;
    
    const radius = Math.pow(baseProgress, 1.4) * (width * 0.68);
    const spiralAngle = (baseProgress * Math.PI * 6) + (armIndex * (Math.PI / 2)) + (hash(seed + 1) * 0.5);

    const x = cx + Math.cos(spiralAngle) * radius;
    const y = cy + Math.sin(spiralAngle) * radius * 0.65;

    const trailLen = (baseProgress * 25 + 6) * scale * speed;
    const angleTangent = spiralAngle + Math.PI / 2;
    const xPrev = x - Math.cos(angleTangent) * trailLen;
    const yPrev = y - Math.sin(angleTangent) * trailLen * 0.65;

    const isCyan = hash(seed + 2) > 0.45;
    const color = isCyan ? '#06b6d4' : '#ec4899';
    const alpha = Math.sin(baseProgress * Math.PI) * 0.9;

    ctx.save();
    ctx.strokeStyle = isCyan ? `rgba(6, 182, 212, ${alpha})` : `rgba(236, 72, 153, ${alpha})`;
    ctx.lineWidth = (hash(seed + 3) * config.particleSize + 1.2) * scale;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12 * scale * config.glowIntensity;

    ctx.beginPath();
    ctx.moveTo(xPrev, yPrev);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, (config.particleSize * 0.8) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 7: Christmas 2026 Emerald & Ruby Snow Flurries
// ----------------------------------------------------------------------
function drawChristmasEmeraldSnow(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  // Soft Glowing Bokeh Discs (Emerald, Ruby, Champagne)
  const bokehCount = 28;
  for (let b = 0; b < bokehCount; b++) {
    const seed = b * 31.4;
    const bx = (hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * 60 * scale) % width;
    const byBase = (hash(seed + 1) * height + progress * height * 0.15 * speed) % height;
    const by = byBase < 0 ? byBase + height : byBase;
    const bRadius = (hash(seed + 2) * 90 + 40) * scale;
    
    const isRuby = hash(seed + 3) > 0.6;
    const isEmerald = hash(seed + 3) > 0.25 && !isRuby;
    
    ctx.save();
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, bRadius);
    if (isRuby) {
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
      grad.addColorStop(0.7, 'rgba(185, 28, 28, 0.08)');
      grad.addColorStop(1, 'rgba(185, 28, 28, 0)');
    } else if (isEmerald) {
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      grad.addColorStop(0.7, 'rgba(5, 150, 105, 0.08)');
      grad.addColorStop(1, 'rgba(5, 150, 105, 0)');
    } else {
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.06)');
      grad.addColorStop(1, 'rgba(217, 119, 6, 0)');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 6-Point Geometrical Snowflakes
  for (let i = 0; i < count; i++) {
    const seed = i * 47.9;
    const driftSpeed = (hash(seed + 1) * 0.6 + 0.4) * speed;
    
    const yTotal = height + 100 * scale;
    const rawY = ((hash(seed + 2) * yTotal) + (progress * yTotal * driftSpeed)) % yTotal;
    const y = rawY - 50 * scale;
    
    const swayFreq = 1 + Math.floor(hash(seed + 3) * 3);
    const swayAmp = (hash(seed + 4) * 45 + 15) * scale * config.turbulence;
    const xBase = hash(seed + 5) * width;
    const x = (xBase + Math.sin(progress * Math.PI * 2 * swayFreq + seed) * swayAmp) % width;

    const pSize = (hash(seed + 6) * config.particleSize + 1.5) * scale;
    const isFlake = hash(seed + 7) > 0.82;

    ctx.save();
    ctx.translate(x, y);

    if (isFlake) {
      const rot = progress * Math.PI * 2 * (hash(seed + 8) > 0.5 ? 1 : -1);
      ctx.rotate(rot);

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 + Math.sin(progress * Math.PI * 2 + seed) * 0.2})`;
      ctx.lineWidth = 1.2 * scale;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#6ee7b7';
        ctx.shadowBlur = 8 * scale * config.glowIntensity;
      }
      
      const armLen = pSize * 2.8;
      for (let a = 0; a < 6; a++) {
        ctx.save();
        ctx.rotate((a * Math.PI) / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, armLen);
        ctx.moveTo(0, armLen * 0.55);
        ctx.lineTo(armLen * 0.25, armLen * 0.75);
        ctx.moveTo(0, armLen * 0.55);
        ctx.lineTo(-armLen * 0.25, armLen * 0.75);
        ctx.stroke();
        ctx.restore();
      }
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, pSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = '#6ee7b7';
      ctx.shadowBlur = 6 * scale * config.glowIntensity;
      ctx.fill();
    }
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 8: Pure White Holiday Snow Blizzard (Clean Universal)
// ----------------------------------------------------------------------
function drawPureGentleSnow(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  for (let i = 0; i < count; i++) {
    const seed = i * 29.13;
    const fallSpeed = (hash(seed + 1) * 0.8 + 0.4) * speed;
    
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 50 * scale;

    const swayFreq = 1 + Math.floor(hash(seed + 3) * 3);
    const swayAmp = (hash(seed + 4) * 50 + 15) * scale * config.turbulence;
    const x = (hash(seed + 5) * width + Math.sin(progress * Math.PI * 2 * swayFreq + seed) * swayAmp) % width;

    const pSize = (hash(seed + 6) * config.particleSize + 1.2) * scale;
    const alpha = hash(seed + 7) * 0.6 + 0.35;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#e0f2fe';
      ctx.shadowBlur = 6 * scale * config.glowIntensity;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 9: Warm Amber Christmas Fairy Lights Garland
// ----------------------------------------------------------------------
function drawChristmasFairyLights(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  // Draping wire strings across the screen (3 swooping lines)
  for (let s = 0; s < 3; s++) {
    const startY = height * (0.15 + s * 0.25);
    const dip = height * 0.15;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, startY);
    ctx.quadraticCurveTo(width / 2, startY + dip, width, startY);
    ctx.strokeStyle = 'rgba(120, 80, 20, 0.25)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 39.81;
    const lineIndex = i % 3;
    const startY = height * (0.15 + lineIndex * 0.25);
    const dip = height * 0.15;

    const normX = (i / count);
    const x = (normX * width + progress * width * 0.05 * speed) % width;
    
    // Parabolic string position
    const t = x / width;
    const wireY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * (startY + dip) + t * t * startY;
    const y = wireY + (hash(seed) * 30 - 15) * scale;

    const pulse = Math.sin(progress * Math.PI * 2 * (1 + (i % 3)) + seed) * 0.5 + 0.5;
    const bRadius = (hash(seed + 1) * config.particleSize + 3.0) * scale * (0.85 + pulse * 0.3);
    const alpha = 0.5 + pulse * 0.5;

    ctx.save();
    ctx.translate(x, y);

    // Warm Amber Fairy Light Bulb
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, bRadius * 2);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, 'rgba(251, 191, 36, 0.95)');
    grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.4)');
    grad.addColorStop(1, 'rgba(180, 83, 9, 0)');

    ctx.beginPath();
    ctx.arc(0, 0, bRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18 * scale * config.glowIntensity;
    }
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, bRadius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 10: Golden Sacred Christmas Tree Spiral 3D Helix
// ----------------------------------------------------------------------
function drawGoldenSpiralTree(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  const treeTopY = height * 0.22;
  const treeBaseY = height * 0.80;
  const treeHeight = treeBaseY - treeTopY;

  for (let i = 0; i < count; i++) {
    const seed = i * 13.87;
    const normH = (i / count);
    const y = treeTopY + normH * treeHeight;
    const coneRadius = normH * (width * 0.22);
    
    const turns = 10;
    const angle = (normH * turns * Math.PI * 2) + (progress * Math.PI * 2 * speed) + hash(seed) * 0.3;
    const depthZ = Math.sin(angle);
    const x = cx + Math.cos(angle) * coneRadius;

    const pSize = (hash(seed + 1) * config.particleSize + 1.5) * scale * (0.8 + (depthZ + 1) * 0.3);
    const alpha = (0.35 + (depthZ + 1) * 0.32) * (hash(seed + 2) * 0.4 + 0.6);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);

    const isStarlight = hash(seed + 3) > 0.85;
    ctx.fillStyle = isStarlight
      ? `rgba(255, 255, 230, ${alpha})`
      : `rgba(250, 204, 21, ${alpha})`;
    
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = (pSize * 4 * config.glowIntensity);
    }
    ctx.fill();
    ctx.restore();
  }

  // Radiant Glowing Star at the Top
  const starRot = progress * Math.PI * 2 * 0.2;
  const starRadius = 28 * scale;
  ctx.save();
  ctx.translate(cx, treeTopY - 15 * scale);
  ctx.rotate(starRot);

  ctx.shadowColor = '#fde047';
  ctx.shadowBlur = 35 * scale * config.glowIntensity;
  ctx.fillStyle = '#fef08a';

  ctx.beginPath();
  for (let s = 0; s < 16; s++) {
    const rad = s % 2 === 0 ? starRadius : starRadius * 0.4;
    const a = (s * Math.PI) / 8;
    const sx = Math.cos(a) * rad;
    const sy = Math.sin(a) * rad;
    if (s === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ----------------------------------------------------------------------
// TEMPLATE 11: Star of Bethlehem & Angelic Dust
// ----------------------------------------------------------------------
function drawStarOfBethlehem(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.32;
  const count = config.particleCount;
  const scale = width / 1920;

  // Giant God Rays Emanating from Central Sacred Star
  const rayCount = 12;
  ctx.save();
  ctx.translate(cx, cy);
  for (let r = 0; r < rayCount; r++) {
    const rayAngle = (r / rayCount) * Math.PI * 2 + (progress * Math.PI * 2 * 0.05);
    const rayLength = (width * 0.45) + Math.sin(progress * Math.PI * 4 + r) * (width * 0.05);
    
    ctx.save();
    ctx.rotate(rayAngle);
    const rayGrad = ctx.createLinearGradient(0, 0, rayLength, 0);
    rayGrad.addColorStop(0, 'rgba(255, 245, 200, 0.35)');
    rayGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.1)');
    rayGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(0, -6 * scale);
    ctx.lineTo(rayLength, -18 * scale);
    ctx.lineTo(rayLength, 18 * scale);
    ctx.lineTo(0, 6 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Sacred 8-Point Star
  const starRadius = 45 * scale;
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 40 * scale * config.glowIntensity;
  ctx.fillStyle = '#ffffff';

  ctx.beginPath();
  for (let s = 0; s < 16; s++) {
    const rad = s % 2 === 0 ? starRadius : starRadius * 0.3;
    const a = (s * Math.PI) / 8;
    const sx = Math.cos(a) * rad;
    const sy = Math.sin(a) * rad;
    if (s === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Floating Angelic Dust
  for (let i = 0; i < count; i++) {
    const seed = i * 27.81;
    const dist = (hash(seed) * width * 0.6);
    const angle = (hash(seed + 1) * Math.PI * 2) + progress * Math.PI * 2 * 0.2;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist * 0.7;

    const shimmer = Math.sin(progress * Math.PI * 4 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const alpha = (hash(seed + 3) * 0.6 + 0.3) * shimmer;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 12: Celestial Aurora Borealis
// ----------------------------------------------------------------------
function drawCelestialAurora(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;

  const layerColors = [
    ['rgba(16, 185, 129, 0.25)', 'rgba(6, 182, 212, 0.0)'],
    ['rgba(59, 130, 246, 0.22)', 'rgba(147, 51, 234, 0.0)'],
    ['rgba(139, 92, 246, 0.20)', 'rgba(16, 185, 129, 0.0)'],
  ];

  for (let l = 0; l < 3; l++) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);

    const step = width / 20;
    for (let x = 0; x <= width + step; x += step) {
      const nx = x / width;
      const wave1 = Math.sin(nx * 4 + progress * Math.PI * 2 * speed + l) * 90 * scale;
      const wave2 = Math.cos(nx * 7 - progress * Math.PI * 2 * speed * 0.8) * 45 * scale;
      const y = height * (0.35 + l * 0.12) + wave1 + wave2;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, height * 0.25, 0, height);
    grad.addColorStop(0, layerColors[l][0]);
    grad.addColorStop(0.7, layerColors[l][1]);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 37.1;
    const x = hash(seed) * width;
    const yBase = (hash(seed + 1) * height + progress * height * 0.2 * speed) % height;
    const y = yBase < 0 ? yBase + height : yBase;
    
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const shimmer = Math.sin(progress * Math.PI * 2 * 2 + seed) * 0.5 + 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224, 242, 254, ${0.4 + shimmer * 0.5})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10 * scale * config.glowIntensity;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 14: Infinite Golden Bokeh Tunnel
// ----------------------------------------------------------------------
function drawBokehTunnel(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;
  const maxDist = Math.max(width, height) * 0.75;

  for (let i = 0; i < count; i++) {
    const seed = i * 29.3;
    const angle = hash(seed) * Math.PI * 2;
    // Seamless depth progress (0 is far center, 1 is close to camera)
    const z = (progress * speed + (i / count)) % 1;
    
    // Exponential 3D perspective growth
    const dist = Math.pow(z, 1.8) * maxDist;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist * (height / width * 1.5);

    // Alpha peaks in middle, fades at spawn (center) and pass-through
    const alpha = Math.sin(z * Math.PI) * 0.85;
    const bRadius = (Math.pow(z, 2.2) * 55 + 3) * scale * (config.particleSize / 3.5);

    ctx.save();
    const grad = ctx.createRadialGradient(x, y, 0, x, y, bRadius);
    grad.addColorStop(0, `hsla(42, 100%, 85%, ${alpha * 0.9})`);
    grad.addColorStop(0.4, `hsla(38, 95%, 65%, ${alpha * 0.4})`);
    grad.addColorStop(0.85, `hsla(30, 90%, 50%, ${alpha * 0.15})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.arc(x, y, bRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = bRadius * 0.8 * config.glowIntensity;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 15: Magic Fairy Dust & Wand Wind Stream
// ----------------------------------------------------------------------
function drawFairyDustStream(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  for (let i = 0; i < count; i++) {
    const seed = i * 19.87;
    const normX = (progress * speed + (i / count)) % 1;
    const x = normX * width;

    // Sinuous S-curve waving path
    const wave1 = Math.sin(normX * Math.PI * 3 + progress * Math.PI * 2) * (height * 0.22);
    const wave2 = Math.cos(normX * Math.PI * 5) * (height * 0.08);
    const streamY = height * 0.5 + wave1 + wave2;

    // Orbit/spread around stream spine
    const orbitRadius = (hash(seed) * 90 + 10) * scale * config.turbulence;
    const orbitAngle = hash(seed + 1) * Math.PI * 2 + (progress * Math.PI * 4 * speed);
    const y = streamY + Math.sin(orbitAngle) * orbitRadius;

    const shimmer = Math.sin(progress * Math.PI * 6 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const alpha = (hash(seed + 3) * 0.6 + 0.4) * (0.5 + shimmer * 0.5);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(45, 100%, ${70 + shimmer * 25}%, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 10 * scale * config.glowIntensity;
    }
    ctx.fill();

    // Occasional star sparkles
    if (hash(seed + 4) > 0.85 && shimmer > 0.7) {
      const flareLen = pSize * 5;
      ctx.strokeStyle = `rgba(255, 255, 230, ${alpha * 0.9})`;
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(x - flareLen, y);
      ctx.lineTo(x + flareLen, y);
      ctx.moveTo(x, y - flareLen);
      ctx.lineTo(x, y + flareLen);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 16: Diamond Ice Crystal & Prism Flare Burst (SUPER DYNAMIC)
// ----------------------------------------------------------------------
// TEMPLATE 16: 3D Faceted Diamond Ice Crystal & Prismatic Stardust Loop
// ----------------------------------------------------------------------
function drawDiamondIceBurst(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  // 1. Concentric Prismatic Crystalline Halos
  const haloCount = 3;
  for (let h = 0; h < haloCount; h++) {
    const hProg = (progress * speed + h / haloCount) % 1;
    const hRad = Math.pow(hProg, 0.75) * (width * 0.45);
    const hAlpha = Math.sin(hProg * Math.PI) * 0.65;
    if (hAlpha > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, hRad, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(186, 230, 253, ${hAlpha})`;
      ctx.lineWidth = (2.5 + (1 - hProg) * 4) * scale;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18 * scale * config.glowIntensity;
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // 2. Continuous Field of 3D Orbiting Diamond Ice Shards & Hexagonal Flakes
  for (let i = 0; i < count; i++) {
    const seed = i * 29.31;
    const angle = (i / count) * Math.PI * 2 + progress * Math.PI * 2 * 0.15;
    const baseDist = (hash(seed) * width * 0.48) + 40 * scale;
    const drift = Math.sin(progress * Math.PI * 2 + seed) * (35 * scale);
    const dist = baseDist + drift;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist * 0.78 + Math.sin(progress * Math.PI * 4 + seed) * (20 * scale);

    const rot = progress * Math.PI * 4 * (hash(seed + 1) > 0.5 ? 1 : -1) + seed;
    const pSize = (hash(seed + 2) * config.particleSize + 2.2) * scale;
    const sparkle = Math.sin(progress * Math.PI * 6 + seed) * 0.5 + 0.5;
    const alpha = (hash(seed + 3) * 0.4 + 0.5) * (0.5 + sparkle * 0.5);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);

    const isDiamondShard = hash(seed + 4) > 0.4;
    if (isDiamondShard) {
      // 3D Faceted Rhomboid Diamond Shard
      ctx.beginPath();
      ctx.moveTo(0, -pSize * 2.5);
      ctx.lineTo(pSize * 1.3, 0);
      ctx.lineTo(0, pSize * 2.5);
      ctx.lineTo(-pSize * 1.3, 0);
      ctx.closePath();

      const isRainbow = hash(seed + 5) > 0.75;
      if (isRainbow) {
        ctx.fillStyle = `rgba(244, 114, 182, ${alpha * 0.9})`; // prismatic magenta glint
      } else if (hash(seed + 5) > 0.35) {
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.95})`; // frosty ice cyan
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // diamond white
      }

      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10 * scale * config.glowIntensity;
      }
      ctx.fill();

      // Inner facet reflection line
      ctx.beginPath();
      ctx.moveTo(0, -pSize * 2.5);
      ctx.lineTo(0, pSize * 2.5);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
      ctx.lineWidth = 1 * scale;
      ctx.stroke();
    } else {
      // Hexagonal Ice Prism Star
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const rad = pSize * 1.6;
        if (a === 0) ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
        else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
      ctx.fill();
    }

    ctx.restore();
  }

  // 3. Central Majestic 3D Faceted Diamond Snowflake Mandala
  const crystalBaseRad = (160 + Math.sin(progress * Math.PI * 2 * speed) * 15) * scale;
  const crystalRot = progress * Math.PI * 2 * 0.2 * speed;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(crystalRot);

  // 6 Symmetrical Main Crystalline Branches
  for (let b = 0; b < 6; b++) {
    const bAngle = (b * Math.PI) / 3;
    ctx.save();
    ctx.rotate(bAngle);

    // Spine Gradient
    const spineGrad = ctx.createLinearGradient(0, 0, crystalBaseRad, 0);
    spineGrad.addColorStop(0, '#ffffff');
    spineGrad.addColorStop(0.3, '#bae6fd');
    spineGrad.addColorStop(0.7, '#38bdf8');
    spineGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

    // Central Stem
    ctx.beginPath();
    ctx.moveTo(0, -3 * scale);
    ctx.lineTo(crystalBaseRad, 0);
    ctx.lineTo(0, 3 * scale);
    ctx.closePath();
    ctx.fillStyle = spineGrad;
    ctx.fill();

    // Secondary Diamond Needle Spurs along each branch
    const spurs = [0.35, 0.6, 0.8];
    spurs.forEach((sPos, sIdx) => {
      const sX = crystalBaseRad * sPos;
      const sLen = (40 - sIdx * 9) * scale;
      const sWidth = (14 - sIdx * 3) * scale;

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.translate(sX, 0);
        ctx.rotate((dir * Math.PI) / 3);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sLen * 0.5, -sWidth * 0.5);
        ctx.lineTo(sLen, 0);
        ctx.lineTo(sLen * 0.5, sWidth * 0.5);
        ctx.closePath();

        const facetGrad = ctx.createLinearGradient(0, 0, sLen, 0);
        facetGrad.addColorStop(0, '#ffffff');
        facetGrad.addColorStop(0.5, dir > 0 ? '#7dd3fc' : '#c084fc'); // Chromatic prism glint
        facetGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = facetGrad;
        if (config.glowIntensity > 0) {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12 * scale * config.glowIntensity;
        }
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();
        ctx.restore();
      });
    });

    // Outer Tip Diamond Gem
    ctx.save();
    ctx.translate(crystalBaseRad * 0.95, 0);
    ctx.beginPath();
    ctx.moveTo(18 * scale, 0);
    ctx.lineTo(0, -9 * scale);
    ctx.lineTo(-18 * scale, 0);
    ctx.lineTo(0, 9 * scale);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#e0f2fe';
    ctx.shadowBlur = 16 * scale;
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // 4. Central Hexagonal Faceted Gem Core
  const coreRad = 36 * scale;
  ctx.beginPath();
  for (let c = 0; c < 6; c++) {
    const ca = (c * Math.PI) / 3;
    const cxP = Math.cos(ca) * coreRad;
    const cyP = Math.sin(ca) * coreRad;
    if (c === 0) ctx.moveTo(cxP, cyP);
    else ctx.lineTo(cxP, cyP);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 30 * scale * config.glowIntensity;
  ctx.fill();

  ctx.restore();

  // 5. 8-Point Brilliant Starburst Flare on Top of Crystal
  ctx.save();
  ctx.translate(cx, cy);
  const flarePulse = Math.sin(progress * Math.PI * 4 * speed) * 0.3 + 0.7;
  const fRad = (55 * flarePulse) * scale;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(-fRad * 1.8, 0);
  ctx.lineTo(fRad * 1.8, 0);
  ctx.moveTo(0, -fRad * 1.8);
  ctx.lineTo(0, fRad * 1.8);
  const diag = fRad * 1.1;
  ctx.moveTo(-diag, -diag);
  ctx.lineTo(diag, diag);
  ctx.moveTo(-diag, diag);
  ctx.lineTo(diag, -diag);
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 20 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 10 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

// ----------------------------------------------------------------------
// TEMPLATE 17: Festive Red & 24K Gold 3D Serpentine Spiral Streamers
// ----------------------------------------------------------------------
function drawSpiralRibbons(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const ribbonCount = 14;

  for (let r = 0; r < ribbonCount; r++) {
    const seed = r * 41.77;
    const isGold = hash(seed) > 0.45;
    const fallSpeed = (hash(seed + 1) * 0.5 + 0.75) * speed;
    const ribbonLen = height * 0.85;
    const yTotal = height + ribbonLen;

    const baseX = (hash(seed + 2) * width + Math.sin(progress * Math.PI * 2 + seed) * 60 * scale) % width;
    const rawHeadY = (hash(seed + 3) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const headY = rawHeadY - ribbonLen * 0.5;

    const steps = 40;
    const segH = ribbonLen / steps;
    const ribbonW = (hash(seed + 4) * 10 + 16) * scale;
    const pitch = (hash(seed + 5) * 1.5 + 4.5) * Math.PI;

    ctx.save();
    // Render continuous 3D quad strips along the serpentine spine
    for (let s = 0; s < steps; s++) {
      const t1 = s / steps;
      const t2 = (s + 1) / steps;

      const y1 = headY + s * segH;
      const y2 = headY + (s + 1) * segH;
      if (y2 < -50 || y1 > height + 50) continue;

      // Smooth horizontal sinusoidal curl
      const curl1 = Math.sin(t1 * Math.PI * 3 + progress * Math.PI * 2 + seed) * (38 * scale);
      const curl2 = Math.sin(t2 * Math.PI * 3 + progress * Math.PI * 2 + seed) * (38 * scale);
      const x1 = baseX + curl1;
      const x2 = baseX + curl2;

      // 3D Torsion twisting angle
      const torsion1 = t1 * pitch + progress * Math.PI * 4 * speed + seed;
      const torsion2 = t2 * pitch + progress * Math.PI * 4 * speed + seed;
      const cos1 = Math.cos(torsion1);
      const cos2 = Math.cos(torsion2);

      const w1 = Math.max(2 * scale, Math.abs(cos1) * ribbonW);
      const w2 = Math.max(2 * scale, Math.abs(cos2) * ribbonW);

      const isFront = cos1 > 0;

      // Gradient for 3D metallic volume
      const grad = ctx.createLinearGradient(x1 - w1 / 2, y1, x1 + w1 / 2, y1);
      if (isGold) {
        if (isFront) {
          grad.addColorStop(0, '#d97706');
          grad.addColorStop(0.4, '#fde047');
          grad.addColorStop(0.7, '#ffffff');
          grad.addColorStop(1, '#b45309');
        } else {
          grad.addColorStop(0, '#78350f');
          grad.addColorStop(0.5, '#b45309');
          grad.addColorStop(1, '#92400e');
        }
      } else {
        if (isFront) {
          grad.addColorStop(0, '#991b1b');
          grad.addColorStop(0.4, '#f87171');
          grad.addColorStop(0.7, '#ffffff');
          grad.addColorStop(1, '#dc2626');
        } else {
          grad.addColorStop(0, '#450a0a');
          grad.addColorStop(0.5, '#7f1d1d');
          grad.addColorStop(1, '#991b1b');
        }
      }

      ctx.beginPath();
      ctx.moveTo(x1 - w1 / 2, y1);
      ctx.lineTo(x1 + w1 / 2, y1);
      ctx.lineTo(x2 + w2 / 2, y2);
      ctx.lineTo(x2 - w2 / 2, y2);
      ctx.closePath();
      ctx.fillStyle = grad;
      if (config.glowIntensity > 0 && Math.abs(cos1) > 0.7) {
        ctx.shadowColor = isGold ? '#facc15' : '#ef4444';
        ctx.shadowBlur = 8 * scale;
      }
      ctx.fill();

      // Specular sheen along outer twist edge
      if (Math.abs(cos1) > 0.85) {
        ctx.beginPath();
        ctx.moveTo(x1 + w1 / 2, y1);
        ctx.lineTo(x2 + w2 / 2, y2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.2 * scale;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Floating Stardust & Confetti Flakes around streamers
  const starsCount = 55;
  for (let st = 0; st < starsCount; st++) {
    const seed = st * 63.7;
    const sx = (hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * 35 * scale) % width;
    const sy = (hash(seed + 1) * height + progress * height * 0.3 * speed) % height;
    const stPulse = Math.sin(progress * Math.PI * 4 + seed) * 0.5 + 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(sx, sy, (hash(seed + 2) * 3 + 1.2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.5 ? '#fef08a' : '#f87171';
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8 * scale;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 18: Midnight Roman Clock Dial & Stardust Orbit
// ----------------------------------------------------------------------
function drawClockworkOrbit(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 1920;
  const dialRadius = width * 0.22;

  // Concentric Gear Rings
  ctx.save();
  ctx.translate(cx, cy);

  for (let g = 0; g < 3; g++) {
    const r = dialRadius * (0.6 + g * 0.22);
    const rot = (progress * Math.PI * 2 * (g % 2 === 0 ? 0.2 : -0.25)) + g;
    ctx.save();
    ctx.rotate(rot);

    ctx.strokeStyle = `rgba(234, 179, 8, ${0.15 + g * 0.05})`;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Dial tick marks
    for (let t = 0; t < 12; t++) {
      const ta = (t / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ta) * (r - 6 * scale), Math.sin(ta) * (r - 6 * scale));
      ctx.lineTo(Math.cos(ta) * (r + 6 * scale), Math.sin(ta) * (r + 6 * scale));
      ctx.stroke();
    }
    ctx.restore();
  }

  // Ticking Stardust Hand sweeping 360 degrees
  const handAngle = progress * Math.PI * 2;
  const handLen = dialRadius * 1.05;

  ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
  ctx.lineWidth = 3 * scale;
  if (config.glowIntensity > 0) {
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 20 * scale * config.glowIntensity;
  }
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(handAngle) * handLen, Math.sin(handAngle) * handLen);
  ctx.stroke();
  ctx.restore();

  // Orbiting Stardust Particles
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 17.51;
    const baseAngle = (i / count) * Math.PI * 2;
    const dist = dialRadius * (0.4 + hash(seed) * 1.1);
    const angle = baseAngle + (progress * Math.PI * 2 * (hash(seed + 1) * 0.6 + 0.4));

    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist * 0.75;

    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const alpha = hash(seed + 3) * 0.7 + 0.3;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8 * scale;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 19: Cozy Hearth Golden Embers & Floating Fireflies
// ----------------------------------------------------------------------
function drawWarmEmbers(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  for (let i = 0; i < count; i++) {
    const seed = i * 29.83;
    const riseSpeed = (hash(seed + 1) * 0.8 + 0.5) * speed;
    
    // Rising upward loop
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal - progress * yTotal * riseSpeed) % yTotal;
    const y = rawY < -50 * scale ? rawY + yTotal : rawY;

    // Thermal buoyancy turbulence
    const swayFreq = 1 + Math.floor(hash(seed + 3) * 3);
    const swayAmp = (hash(seed + 4) * 45 + 15) * scale * config.turbulence;
    const xBase = hash(seed + 5) * width;
    const x = (xBase + Math.sin(progress * Math.PI * 2 * swayFreq + seed) * swayAmp) % width;

    // Glow pulse (firefly breathing effect)
    const pulse = Math.sin(progress * Math.PI * 4 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 6) * config.particleSize + 1.8) * scale * (0.8 + pulse * 0.4);
    const alpha = (hash(seed + 7) * 0.4 + 0.5) * (0.4 + pulse * 0.6);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);

    // Warm ember color (amber/golden to fiery orange)
    const hue = 32 + hash(seed + 8) * 16;
    ctx.fillStyle = `hsla(${hue}, 100%, ${65 + pulse * 25}%, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14 * scale * config.glowIntensity;
    }
    ctx.fill();

    // Hot center core
    ctx.beginPath();
    ctx.arc(x, y, pSize * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 20: Celestial Golden Light Beams & Floating Dust Motes
// ----------------------------------------------------------------------
function drawCelestialGodrays(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // Diagonal Cathedral Spotlight Beams (4 beams)
  const beamCount = 4;
  for (let b = 0; b < beamCount; b++) {
    const seed = b * 61.2;
    const originX = width * (0.2 + b * 0.2);
    const sway = Math.sin(progress * Math.PI * 2 * speed * 0.5 + seed) * (width * 0.08);
    const beamW = (width * 0.14) + (b * width * 0.02);

    ctx.save();
    const grad = ctx.createLinearGradient(originX, 0, originX + sway, height);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
    grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.12)');
    grad.addColorStop(1, 'rgba(234, 179, 8, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(originX - 10 * scale, 0);
    ctx.lineTo(originX + 10 * scale, 0);
    ctx.lineTo(originX + sway + beamW, height);
    ctx.lineTo(originX + sway - beamW, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Floating illuminated dust motes
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 43.19;
    const x = (hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * 30 * scale) % width;
    const y = (hash(seed + 1) * height + progress * height * 0.08 * speed) % height;

    const shimmer = Math.sin(progress * Math.PI * 3 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const alpha = (hash(seed + 3) * 0.5 + 0.3) * (0.4 + shimmer * 0.6);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 243, 199, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 8 * scale * config.glowIntensity;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 21: Holographic Cyber Matrix Data Rain 2027
// ----------------------------------------------------------------------
function drawCyberMatrixStream(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const streamCols = 32;

  for (let c = 0; c < streamCols; c++) {
    const seed = c * 71.9;
    const x = (c / streamCols) * width + (width / streamCols * 0.5);
    const fallSpeed = (hash(seed) * 0.6 + 0.8) * speed;
    
    // Vertical stream head
    const yTotal = height + 200 * scale;
    const rawHeadY = (hash(seed + 1) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const headY = rawHeadY - 100 * scale;

    const trailNodes = 12;
    const spacing = 18 * scale;

    for (let n = 0; n < trailNodes; n++) {
      const ny = headY - n * spacing;
      if (ny < -20 || ny > height + 20) continue;

      const alpha = Math.max(0, 1 - (n / trailNodes)) * 0.85;
      const isHead = n === 0;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, ny, (isHead ? 3.5 : 2.0) * scale, 0, Math.PI * 2);
      ctx.fillStyle = isHead ? '#ffffff' : `rgba(6, 182, 212, ${alpha})`;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = isHead ? '#22d3ee' : '#0891b2';
        ctx.shadowBlur = (isHead ? 14 : 6) * scale * config.glowIntensity;
      }
      ctx.fill();
      ctx.restore();
    }
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 22: Luxury Golden Festoon Fairy Curtain & Icicle Drops Canopy 2026
// (Microstock Best-Seller: Top-hanging fairy string light drops with warm bokeh)
// ----------------------------------------------------------------------
function drawFrostedVignette(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  // 1. Hanging Top Catenary Garland Swag Wires
  const swags = 5;
  const swagWidth = width / swags;
  ctx.save();
  for (let s = 0; s < swags; s++) {
    const startX = s * swagWidth;
    const endX = (s + 1) * swagWidth;
    const midX = (startX + endX) / 2;
    const swagSag = (35 + Math.sin(progress * Math.PI * 2 * speed + s) * 5) * scale;

    ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
    ctx.lineWidth = 1.2 * scale;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.quadraticCurveTo(midX, swagSag, endX, 0);
    ctx.stroke();
  }
  ctx.restore();

  // 2. 24 Vertical Dangling Fairy Light Strands of varying lengths
  const strandCount = 26;
  for (let st = 0; st < strandCount; st++) {
    const seed = st * 31.7;
    const strandXBase = (st / strandCount) * width + (width / strandCount * 0.5);
    const strandLen = (height * 0.18) + (hash(seed) * height * 0.22);
    
    // Physics pendulum sway for each light strand
    const swayAngle = Math.sin(progress * Math.PI * 2 * speed + seed) * (0.04 * config.turbulence);
    const endX = strandXBase + Math.sin(swayAngle) * strandLen;
    const endY = Math.cos(swayAngle) * strandLen;

    ctx.save();
    // Hanging cord
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(strandXBase, 0);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // 3 to 6 light nodes along each strand
    const bulbCount = 3 + Math.floor(hash(seed + 1) * 4);
    for (let b = 0; b < bulbCount; b++) {
      const bFrac = (b + 1) / (bulbCount + 0.5);
      const bx = strandXBase + (endX - strandXBase) * bFrac;
      const by = endY * bFrac;

      const bulbSeed = seed + b * 13.9;
      const glowPulse = Math.sin(progress * Math.PI * 4 + bulbSeed) * 0.3 + 0.7;
      const bRad = (hash(bulbSeed + 1) * 3 + 3.5) * scale;
      const haloRad = bRad * (6 + glowPulse * 4);

      // Warm Amber Bokeh Radiance Halo
      const haloGrad = ctx.createRadialGradient(bx, by, 0, bx, by, haloRad);
      haloGrad.addColorStop(0, `rgba(254, 240, 138, ${0.45 * glowPulse})`);
      haloGrad.addColorStop(0.35, `rgba(245, 158, 11, ${0.2 * glowPulse})`);
      haloGrad.addColorStop(0.7, `rgba(217, 119, 6, ${0.05 * glowPulse})`);
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(bx, by, haloRad, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Glowing Golden Bulb Glass
      ctx.beginPath();
      ctx.arc(bx, by, bRad, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12 * scale * config.glowIntensity;
      }
      ctx.fill();

      // White filament core
      ctx.beginPath();
      ctx.arc(bx, by, bRad * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. Falling Shimmering Golden Icicle Droplets & Micro Stardust
  for (let i = 0; i < count; i++) {
    const seed = i * 23.41;
    const fallSpeed = (hash(seed + 1) * 0.8 + 0.4) * speed;
    const yTotal = height * 0.85; // Disperses and fades before reaching bottom
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY + height * 0.05;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (25 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + sway) % width;

    // Fades smoothly as it descends so center/bottom remains clean
    const descendAlpha = Math.max(0, 1 - (y / (height * 0.85)));
    const shimmer = Math.sin(progress * Math.PI * 4 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 4) * config.particleSize + 1.2) * scale;
    const alpha = descendAlpha * (0.4 + shimmer * 0.6);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 243, 199, ${alpha})`;
    if (config.glowIntensity > 0 && shimmer > 0.7) {
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 8 * scale;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 23: Champagne Glass Toast Clink Starburst FX
// ----------------------------------------------------------------------
function drawChampagneClinkBurst(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.48;
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // Clink burst cycle
  const burstProg = (progress * speed * 2) % 1;
  const burstScale = Math.sin(burstProg * Math.PI);
  const ringRadius = Math.pow(burstProg, 0.7) * (width * 0.38);

  // Shockwave Ring
  if (burstScale > 0.05) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(254, 240, 138, ${burstScale * 0.7})`;
    ctx.lineWidth = (4 * (1 - burstProg) + 1) * scale;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 20 * scale * config.glowIntensity;
    }
    ctx.stroke();

    // Central radiant starburst
    const rayLen = (120 * burstScale + 20) * scale;
    ctx.strokeStyle = `rgba(255, 255, 230, ${burstScale * 0.9})`;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - rayLen, cy);
    ctx.lineTo(cx + rayLen, cy);
    ctx.moveTo(cx, cy - rayLen);
    ctx.lineTo(cx, cy + rayLen);
    ctx.moveTo(cx - rayLen * 0.7, cy - rayLen * 0.7);
    ctx.lineTo(cx + rayLen * 0.7, cy + rayLen * 0.7);
    ctx.moveTo(cx - rayLen * 0.7, cy + rayLen * 0.7);
    ctx.lineTo(cx + rayLen * 0.7, cy - rayLen * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  // Radiating Sparkling Champagne Drops
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 29.53;
    const angle = (i / count) * Math.PI * 2 + hash(seed) * 0.3;
    const dropProg = (burstProg + hash(seed + 1) * 0.5) % 1;
    const dist = Math.pow(dropProg, 0.75) * (width * 0.42);
    const gravity = Math.pow(dropProg, 2.2) * (height * 0.15);

    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist * 0.8 + gravity;

    const alpha = Math.sin(dropProg * Math.PI) * 0.85;
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8 * scale;
    }
    ctx.fill();
    ctx.restore();
  }
}


// ----------------------------------------------------------------------
// TEMPLATE 24: Golden 2027 Champagne Flute Toast Bokeh Climax
// ----------------------------------------------------------------------
function drawChampagneClimax(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  // 1. Rising Carbonated Champagne Effervescence Stream
  for (let i = 0; i < count; i++) {
    const seed = i * 29.17;
    const riseSpeed = (hash(seed + 1) * 0.9 + 0.6) * speed;
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal - progress * yTotal * riseSpeed) % yTotal;
    const y = rawY < -50 * scale ? rawY + yTotal : rawY;

    const wobble = Math.sin(progress * Math.PI * 4 + seed) * (20 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + wobble) % width;

    const pSize = (hash(seed + 4) * config.particleSize + 1.5) * scale;
    const alpha = hash(seed + 5) * 0.5 + 0.45;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8 * scale * config.glowIntensity;
    }
    ctx.fill();
    ctx.restore();
  }

  // 2. Periodic Champagne Burst Shockwave at Upper Center
  const burstProg = (progress * speed * 2) % 1;
  const burstScale = Math.sin(burstProg * Math.PI);
  if (burstScale > 0.05) {
    const by = height * 0.4;
    ctx.save();
    ctx.translate(cx, by);
    ctx.beginPath();
    ctx.arc(0, 0, burstProg * (width * 0.35), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(254, 240, 138, ${burstScale * 0.6})`;
    ctx.lineWidth = (3 * (1 - burstProg) + 1) * scale;
    ctx.stroke();

    // Hot golden flash star
    ctx.beginPath();
    ctx.arc(0, 0, (20 * burstScale) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 30 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 25: Christmas Warm Glowing Candlelight Amber Orbs
// ----------------------------------------------------------------------
function drawCandlelightSanctuary(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const count = config.particleCount;
  const speed = config.particleSpeed;
  const scale = width / 1920;

  // Warm Ambient Breathing Candle Halos (5 halos across bottom)
  for (let c = 0; c < 5; c++) {
    const seed = c * 71.3;
    const cx = width * (0.15 + c * 0.175);
    const cy = height * 0.78;
    const flicker = Math.sin(progress * Math.PI * 6 + seed) * 0.15 + Math.cos(progress * Math.PI * 10 + seed * 2) * 0.08;
    const radius = (180 + flicker * 40) * scale;

    ctx.save();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.25)');
    grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Floating warm sanctuary stardust motes rising slowly
  for (let i = 0; i < count; i++) {
    const seed = i * 33.19;
    const rise = (hash(seed + 1) * 0.6 + 0.3) * speed;
    const yTotal = height + 80 * scale;
    const rawY = (hash(seed + 2) * yTotal - progress * yTotal * rise) % yTotal;
    const y = rawY < -40 * scale ? rawY + yTotal : rawY;

    const sway = Math.sin(progress * Math.PI * 2 + seed) * (30 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + sway) % width;

    const pulse = Math.sin(progress * Math.PI * 4 + seed) * 0.4 + 0.6;
    const pSize = (hash(seed + 4) * config.particleSize + 1.2) * scale * pulse;
    const alpha = (hash(seed + 5) * 0.4 + 0.4) * pulse;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 215, 170, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10 * scale * config.glowIntensity;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 26: Midnight 2027 Countdown Laser Ring Burst (3-2-1 Climax)
// ----------------------------------------------------------------------
function drawLaserCountdownRings(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // Expanding Concentric Laser Shockwaves
  const ringCount = 8;
  for (let r = 0; r < ringCount; r++) {
    const rProg = (progress * speed + (r / ringCount)) % 1;
    const radius = Math.pow(rProg, 0.7) * (width * 0.55);
    const alpha = Math.sin(rProg * Math.PI) * 0.85;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    const isCyan = r % 2 === 0;
    ctx.strokeStyle = isCyan ? `rgba(6, 182, 212, ${alpha})` : `rgba(250, 204, 21, ${alpha})`;
    ctx.lineWidth = (3 + (1 - rProg) * 5) * scale;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = isCyan ? '#22d3ee' : '#facc15';
      ctx.shadowBlur = 16 * scale * config.glowIntensity;
    }
    ctx.stroke();
    ctx.restore();
  }

  // 12 Orbital Strobe Tick Points around Center
  const dialRadius = width * 0.25;
  for (let t = 0; t < 12; t++) {
    const angle = (t / 12) * Math.PI * 2 + progress * Math.PI * 2 * 0.2;
    const tx = cx + Math.cos(angle) * dialRadius;
    const ty = cy + Math.sin(angle) * dialRadius * 0.75;
    const flash = Math.sin(progress * Math.PI * 8 + t) * 0.5 + 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(tx, ty, (4 + flash * 4) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 27: Flying Santa Sleigh Golden Dust Trail & Star Arc
// ----------------------------------------------------------------------
function drawSleighStardustTrail(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  // Arc path across sky from upper left to upper right
  const arcY = (nx: number) => height * 0.28 + Math.sin(nx * Math.PI) * (height * 0.12);

  for (let i = 0; i < count; i++) {
    const seed = i * 19.41;
    const localProg = (progress * speed + (i / count)) % 1;
    const x = localProg * width;
    const yBase = arcY(localProg);

    // Turbulence dust spray expanding behind sleigh
    const sprayRadius = (1 - localProg) * (60 * scale) + (hash(seed) * 35) * scale * config.turbulence;
    const sprayAngle = hash(seed + 1) * Math.PI * 2;
    const xPos = x + Math.cos(sprayAngle) * sprayRadius;
    const yPos = yBase + Math.sin(sprayAngle) * sprayRadius * 0.8 + Math.pow(1 - localProg, 2) * (80 * scale);

    const shimmer = Math.sin(progress * Math.PI * 6 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const alpha = Math.sin(localProg * Math.PI) * (0.5 + shimmer * 0.5);

    ctx.save();
    ctx.beginPath();
    ctx.arc(xPos, yPos, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(45, 100%, ${65 + shimmer * 30}%, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8 * scale * config.glowIntensity;
    }
    ctx.fill();
    ctx.restore();
  }

  // 8-Point Golden Lead Star
  const leadX = (progress * speed) % 1 * width;
  const leadY = arcY((progress * speed) % 1);
  const starRad = 25 * scale;

  ctx.save();
  ctx.translate(leadX, leadY);
  ctx.rotate(progress * Math.PI * 4);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 30 * scale;
  ctx.beginPath();
  for (let s = 0; s < 16; s++) {
    const rad = s % 2 === 0 ? starRad : starRad * 0.35;
    const a = (s * Math.PI) / 8;
    if (s === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ----------------------------------------------------------------------
// TEMPLATE 28: Champagne Golden Anamorphic Light Leaks & Film Flares
// ----------------------------------------------------------------------
function drawAnamorphicLightLeaks(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // 3 Large Breathing Anamorphic Optical Flares
  const flares = [
    { x: width * 0.25, y: height * 0.3, color: 'rgba(254, 240, 138, 0.35)', w: width * 0.45, h: height * 0.25 },
    { x: width * 0.75, y: height * 0.65, color: 'rgba(245, 158, 11, 0.3)', w: width * 0.5, h: height * 0.3 },
    { x: width * 0.5, y: height * 0.2, color: 'rgba(251, 191, 36, 0.25)', w: width * 0.6, h: height * 0.2 },
  ];

  flares.forEach((fl, idx) => {
    const pulse = Math.sin(progress * Math.PI * 2 * speed + idx * 2) * 0.2 + 0.8;
    const fx = fl.x + Math.sin(progress * Math.PI * 2 + idx) * (60 * scale);
    const fy = fl.y + Math.cos(progress * Math.PI * 2 + idx) * (30 * scale);

    ctx.save();
    ctx.translate(fx, fy);
    ctx.scale(1, 0.45); // Anamorphic oval stretch

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, fl.w * pulse);
    grad.addColorStop(0, fl.color);
    grad.addColorStop(0.5, 'rgba(217, 119, 6, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, fl.w * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Soft Floating Film Dust Motes
  const motesCount = 60;
  for (let m = 0; m < motesCount; m++) {
    const seed = m * 57.1;
    const mx = (hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * 40 * scale) % width;
    const my = (hash(seed + 1) * height + progress * height * 0.1) % height;
    const mSize = (hash(seed + 2) * 4 + 2) * scale;
    const mAlpha = Math.sin(progress * Math.PI * 2 + m) * 0.3 + 0.4;

    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, mSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 243, 199, ${mAlpha})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 29: Winter Holly Leaf & Ruby Berry Golden Shimmer Dust Fall
// ----------------------------------------------------------------------
function drawHolidayBotanicalFall(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  for (let i = 0; i < count; i++) {
    const seed = i * 29.77;
    const fallSpeed = (hash(seed + 1) * 0.7 + 0.5) * speed;
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 50 * scale;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (45 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + sway) % width;

    const rot = progress * Math.PI * 4 * (hash(seed + 4) > 0.5 ? 1 : -1) + seed;
    const pSize = (hash(seed + 5) * config.particleSize + 2.0) * scale;
    const isBerry = hash(seed + 6) > 0.7; // 30% are ruby berries, 70% golden leaf particles

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    if (isBerry) {
      // Glowing Ruby Berry
      ctx.beginPath();
      ctx.arc(0, 0, pSize * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 10 * scale;
      }
      ctx.fill();
      // Highlight dot
      ctx.beginPath();
      ctx.arc(-pSize * 0.3, -pSize * 0.3, pSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      // Golden Holly Leaf Flake (oval leaflet)
      ctx.beginPath();
      ctx.ellipse(0, 0, pSize * 1.8, pSize * 0.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8 * scale;
      }
      ctx.fill();
    }
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 30: Luxury 24K Liquid Gold Swirl & Molten Ribbon Vortex
// ----------------------------------------------------------------------
function drawMoltenGoldVortex(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const armCount = 6;

  for (let a = 0; a < armCount; a++) {
    const baseAngle = (a / armCount) * Math.PI * 2;
    const points = 45;

    ctx.save();
    ctx.beginPath();
    for (let p = 0; p < points; p++) {
      const pNorm = p / points;
      const radius = Math.pow(pNorm, 1.3) * (width * 0.48);
      const theta = baseAngle + (pNorm * Math.PI * 4) + (progress * Math.PI * 2 * speed);
      const px = cx + Math.cos(theta) * radius;
      const py = cy + Math.sin(theta) * radius * 0.65;

      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    const alpha = 0.7 + Math.sin(progress * Math.PI * 2 + a) * 0.25;
    ctx.strokeStyle = `rgba(250, 204, 21, ${alpha})`;
    ctx.lineWidth = (8 + a * 2) * scale;
    ctx.lineCap = 'round';
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 20 * scale * config.glowIntensity;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Floating molten gold globules
  const globCount = 80;
  for (let g = 0; g < globCount; g++) {
    const seed = g * 43.1;
    const prog = (progress * speed + g / globCount) % 1;
    const rad = Math.pow(prog, 1.2) * (width * 0.5);
    const ang = (prog * Math.PI * 5) + hash(seed) * Math.PI * 2;
    const gx = cx + Math.cos(ang) * rad;
    const gy = cy + Math.sin(ang) * rad * 0.65;

    ctx.save();
    ctx.beginPath();
    ctx.arc(gx, gy, (hash(seed + 1) * 3 + 2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 31: Holiday Glass Bauble Ornaments Reflection & Pendulum Glints
// ----------------------------------------------------------------------
function drawOrnamentGlints(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const baubleCount = 9;

  for (let b = 0; b < baubleCount; b++) {
    const seed = b * 53.9;
    const bxBase = width * (0.12 + b * 0.095);
    const swingAngle = Math.sin(progress * Math.PI * 2 * speed + seed) * 0.18; // Pendulum swing
    const stringLen = height * (0.25 + (b % 3) * 0.12);
    
    const bx = bxBase + Math.sin(swingAngle) * stringLen;
    const by = Math.cos(swingAngle) * stringLen;
    const bRadius = (28 + (b % 4) * 8) * scale;

    ctx.save();
    // Hanging String
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(bxBase, 0);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // 3D Metallic Sphere
    const isGold = b % 2 === 0;
    const sphereGrad = ctx.createRadialGradient(bx - bRadius * 0.35, by - bRadius * 0.35, bRadius * 0.1, bx, by, bRadius);
    if (isGold) {
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.4, '#facc15');
      sphereGrad.addColorStop(0.85, '#b45309');
      sphereGrad.addColorStop(1, '#78350f');
    } else {
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.4, '#ef4444');
      sphereGrad.addColorStop(0.85, '#991b1b');
      sphereGrad.addColorStop(1, '#450a0a');
    }

    ctx.beginPath();
    ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = isGold ? '#f59e0b' : '#dc2626';
      ctx.shadowBlur = 15 * scale;
    }
    ctx.fill();

    // Star glint on sphere crown
    const flash = Math.sin(progress * Math.PI * 4 + b) * 0.5 + 0.5;
    if (flash > 0.6) {
      const fx = bx - bRadius * 0.4;
      const fy = by - bRadius * 0.4;
      const fLen = 14 * scale * flash;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.moveTo(fx - fLen, fy);
      ctx.lineTo(fx + fLen, fy);
      ctx.moveTo(fx, fy - fLen);
      ctx.lineTo(fx, fy + fLen);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 32: Grand Kamuro Golden Willow Cascading Fireworks 2027
// ----------------------------------------------------------------------
function drawKamuroWillowFireworks(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const willowCenters = [
    { x: width * 0.3, y: height * 0.25, phase: 0.0 },
    { x: width * 0.7, y: height * 0.22, phase: 0.5 },
    { x: width * 0.5, y: height * 0.18, phase: 0.25 },
  ];

  willowCenters.forEach((wc, cIdx) => {
    const localProg = (progress * speed + wc.phase) % 1;
    const strandCount = 75;
    const gravity = Math.pow(localProg, 1.8) * (height * 0.65);
    const spread = Math.pow(localProg, 0.6) * (width * 0.35);
    const alpha = Math.sin(localProg * Math.PI) * Math.pow(1 - localProg, 0.2);

    for (let s = 0; s < strandCount; s++) {
      const seed = cIdx * 1000 + s * 17.3;
      const angle = (s / strandCount) * Math.PI * 2;
      const sx = wc.x + Math.cos(angle) * spread;
      const sy = wc.y + Math.sin(angle) * spread * 0.4 + gravity;

      const trailLen = (localProg * 35 + 10) * scale;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx, sy - trailLen);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.75})`;
      ctx.lineWidth = (hash(seed) * 2 + 1) * scale;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8 * scale;
      }
      ctx.stroke();

      // Golden burning ember tip
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }
  });
}

// ----------------------------------------------------------------------
// TEMPLATE 33: Retro Outrun Cyber 2027 Neon Speed Particles & Grid Rays
// ----------------------------------------------------------------------
function drawSynthwaveGrid(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.65; // Horizon
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // 1. Perspective Grid Lines converging at horizon
  const gridLines = 14;
  ctx.save();
  for (let g = 0; g <= gridLines; g++) {
    const gx = (g / gridLines) * width;
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(gx, height);
    ctx.stroke();
  }

  // Horizontal moving ground grid bars
  const hBars = 8;
  for (let b = 0; b < hBars; b++) {
    const bProg = (progress * speed + (b / hBars)) % 1;
    const by = cy + Math.pow(bProg, 2) * (height - cy);
    ctx.strokeStyle = `rgba(6, 182, 212, ${bProg * 0.7})`;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(0, by);
    ctx.lineTo(width, by);
    ctx.stroke();
  }
  ctx.restore();

  // 2. High-speed Neon Laser Beams streaking toward camera
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 29.81;
    const prog = (progress * speed * 2 + (i / count)) % 1;
    const ang = hash(seed) * Math.PI * 2;
    const dist = Math.pow(prog, 1.6) * (width * 0.65);
    const px = cx + Math.cos(ang) * dist;
    const py = cy + Math.sin(ang) * dist * 0.7;

    const trail = prog * 40 * scale;
    const isMagenta = hash(seed + 1) > 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(px - Math.cos(ang) * trail, py - Math.sin(ang) * trail);
    ctx.lineTo(px, py);
    ctx.strokeStyle = isMagenta ? `rgba(236, 72, 153, ${prog})` : `rgba(6, 182, 212, ${prog})`;
    ctx.lineWidth = (hash(seed + 2) * 2.5 + 1.2) * scale;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = isMagenta ? '#f43f5e' : '#06b6d4';
      ctx.shadowBlur = 10 * scale;
    }
    ctx.stroke();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 34: Oscars 24K Liquid Gold Silk Waves & Ambient Shimmer
// ----------------------------------------------------------------------
function drawGoldSilkCaustics(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const waveCount = 7;

  // 1. Flowing 24K Molten Silk Wave Ribbons across screen
  for (let w = 0; w < waveCount; w++) {
    const seed = w * 17.3;
    const baseNormY = 0.2 + (w / waveCount) * 0.65;
    const baseY = height * baseNormY;
    const amp = (60 + w * 12) * scale;
    const freq = 1.5 + (w % 3) * 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);

    const steps = 40;
    const dx = width / steps;
    for (let s = 0; s <= steps; s++) {
      const x = s * dx;
      const nx = x / width;
      const wave = Math.sin(nx * Math.PI * 2 * freq + progress * Math.PI * 2 * speed + seed) * amp;
      const harmonic = Math.cos(nx * Math.PI * 4 - progress * Math.PI * 2 * speed * 0.7 + seed) * (amp * 0.35);
      const y = baseY + wave + harmonic;
      if (s === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();

    const waveGrad = ctx.createLinearGradient(0, baseY - amp, 0, baseY + amp * 1.5);
    const alpha = (0.22 + (w / waveCount) * 0.18) * (Math.sin(progress * Math.PI * 2 + w) * 0.15 + 0.85);
    waveGrad.addColorStop(0, `rgba(254, 240, 138, ${alpha * 0.9})`);
    waveGrad.addColorStop(0.3, `rgba(245, 158, 11, ${alpha * 0.6})`);
    waveGrad.addColorStop(0.7, `rgba(180, 83, 9, ${alpha * 0.3})`);
    waveGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = waveGrad;
    ctx.fill();

    // Specular Silk Ridge Highlight Line
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const x = s * dx;
      const nx = x / width;
      const wave = Math.sin(nx * Math.PI * 2 * freq + progress * Math.PI * 2 * speed + seed) * amp;
      const harmonic = Math.cos(nx * Math.PI * 4 - progress * Math.PI * 2 * speed * 0.7 + seed) * (amp * 0.35);
      const y = baseY + wave + harmonic;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
    ctx.lineWidth = 1.5 * scale;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 12 * scale * config.glowIntensity;
    }
    ctx.stroke();
    ctx.restore();
  }

  // 2. Floating 24K Stardust Motes Drifting Across Caustics
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 37.19;
    const x = (hash(seed) * width + progress * width * 0.15 * speed) % width;
    const yBase = hash(seed + 1) * height;
    const ySway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (20 * scale);
    const y = yBase + ySway;

    const shimmer = Math.sin(progress * Math.PI * 4 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const alpha = (hash(seed + 3) * 0.5 + 0.3) * shimmer;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    if (config.glowIntensity > 0 && shimmer > 0.7) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10 * scale;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 35: Cathedral Sacred Stained Glass Beams & Winter Choirs 2026
// ----------------------------------------------------------------------
function drawCathedralStainedGlass(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // 1. Multifaceted Stained Glass Color Projection Beams (Ruby, Emerald, Sapphire, Gold)
  const beamCount = 8;
  const beamColors = [
    { start: 'rgba(239, 68, 68, 0.35)', mid: 'rgba(220, 38, 38, 0.15)' }, // Ruby
    { start: 'rgba(16, 185, 129, 0.35)', mid: 'rgba(5, 150, 105, 0.15)' }, // Emerald
    { start: 'rgba(59, 130, 246, 0.35)', mid: 'rgba(37, 99, 235, 0.15)' }, // Sapphire
    { start: 'rgba(245, 158, 11, 0.40)', mid: 'rgba(217, 119, 6, 0.18)' }, // Gold
  ];

  ctx.save();
  for (let b = 0; b < beamCount; b++) {
    const seed = b * 43.7;
    const col = beamColors[b % beamColors.length];
    const topX = width * (0.15 + (b / beamCount) * 0.7);
    const sway = Math.sin(progress * Math.PI * 2 * speed * 0.4 + seed) * (width * 0.06);
    const bottomX = topX + sway + (b % 2 === 0 ? 1 : -1) * (width * 0.08);
    const beamW = width * 0.09;

    const grad = ctx.createLinearGradient(topX, 0, bottomX, height);
    grad.addColorStop(0, col.start);
    grad.addColorStop(0.5, col.mid);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(topX - 10 * scale, 0);
    ctx.lineTo(topX + 10 * scale, 0);
    ctx.lineTo(bottomX + beamW, height);
    ctx.lineTo(bottomX - beamW, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 2. High-Density Angelic Dust Motes floating in church sunbeams
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 29.81;
    const x = (hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * 25 * scale) % width;
    const y = (hash(seed + 1) * height + progress * height * 0.07 * speed) % height;
    const shimmer = Math.sin(progress * Math.PI * 4 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 2) * config.particleSize + 1.2) * scale;
    const alpha = (hash(seed + 3) * 0.5 + 0.35) * shimmer;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 243, 199, ${alpha})`;
    if (config.glowIntensity > 0 && shimmer > 0.8) {
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 8 * scale;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 36: Magical Swirling Snow Globe Blizzard & Ice Dust Vortex 2026
// ----------------------------------------------------------------------
function drawSnowglobeBlizzardVortex(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;
  const maxRadius = Math.min(width, height) * 0.44;

  // 1. Soft Glass Spherical Rim Glow
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.25)';
  ctx.lineWidth = 3 * scale;
  if (config.glowIntensity > 0) {
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 25 * scale;
  }
  ctx.stroke();

  // Glass Specular Highlight Crescent
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius * 0.96, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // 2. Swirling 3D Blizzard Snowflake Vortex inside the Globe
  for (let i = 0; i < count; i++) {
    const seed = i * 31.41;
    const normDist = Math.pow(hash(seed), 0.7) * maxRadius * 0.92;
    const vortexSpeed = (1.2 - normDist / maxRadius) * 2.5 * speed;
    const baseAngle = hash(seed + 1) * Math.PI * 2;
    const angle = baseAngle + progress * Math.PI * 2 * vortexSpeed;

    // Upward turbulence draft inside dome
    const yDraft = Math.sin(angle * 2 + progress * Math.PI * 4) * (20 * scale);
    const px = cx + Math.cos(angle) * normDist;
    const py = cy + Math.sin(angle) * normDist * 0.88 + yDraft;

    const rot = progress * Math.PI * 6 + seed;
    const pSize = (hash(seed + 2) * config.particleSize + 1.5) * scale;
    const alpha = hash(seed + 3) * 0.5 + 0.4;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);

    const isFlake = hash(seed + 4) > 0.6;
    if (isFlake) {
      // 6-Pointed Micro Snowflake
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * pSize * 2, Math.sin(ang) * pSize * 2);
      }
      ctx.stroke();
    } else {
      // Glowing Ice Dust Micro Orb
      ctx.beginPath();
      ctx.arc(0, 0, pSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 37: Times Square Geodesic Crystal Ball Drop & Radiant Sunburst 2027
// ----------------------------------------------------------------------
function drawTimesSquareBallDrop(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // Ball slowly descends from top (0.2) to center (0.45) in loop
  const ballY = height * (0.22 + Math.sin(progress * Math.PI * 2 * speed * 0.5) * 0.08);
  const ballRad = 85 * scale;

  // 1. Giant Radial Sunburst Beams from the Ball
  const rayCount = 20;
  ctx.save();
  ctx.translate(cx, ballY);
  ctx.rotate(progress * Math.PI * 2 * 0.15 * speed);
  for (let r = 0; r < rayCount; r++) {
    const ra = (r / rayCount) * Math.PI * 2;
    const rLen = width * 0.48 + Math.sin(progress * Math.PI * 4 + r) * (30 * scale);
    ctx.save();
    ctx.rotate(ra);
    const rGrad = ctx.createLinearGradient(0, 0, rLen, 0);
    rGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    rGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.3)');
    rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.moveTo(0, -4 * scale);
    ctx.lineTo(rLen, 0);
    ctx.lineTo(0, 4 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 2. Geodesic Faceted 3D Crystal Ball Mesh
  ctx.save();
  ctx.translate(cx, ballY);
  ctx.rotate(progress * Math.PI * 2 * 0.1 * speed);

  // Outer Shimmer Halo
  const haloGrad = ctx.createRadialGradient(0, 0, ballRad * 0.5, 0, 0, ballRad * 1.5);
  haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
  haloGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.2)');
  haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, ballRad * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Geodesic Triangular Facets
  const latCount = 8;
  const lonCount = 14;
  for (let lat = 0; lat < latCount; lat++) {
    const phi = (lat / latCount) * Math.PI - Math.PI / 2;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const rLat = ballRad * cosPhi;
    const yLat = ballRad * sinPhi;

    for (let lon = 0; lon < lonCount; lon++) {
      const theta = (lon / lonCount) * Math.PI * 2;
      const xPt = Math.cos(theta) * rLat;
      const yPt = yLat + Math.sin(theta) * rLat * 0.3;

      const glint = Math.sin(progress * Math.PI * 8 + lat * 2 + lon) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(xPt, yPt, (3 + glint * 3) * scale, 0, Math.PI * 2);
      ctx.fillStyle = glint > 0.6 ? '#ffffff' : '#facc15';
      if (glint > 0.7 && config.glowIntensity > 0) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 12 * scale;
      }
      ctx.fill();
    }
  }
  ctx.restore();

  // 3. Falling Celebratory Confetti & Stardust around Ball
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 21.19;
    const px = (hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * 35 * scale) % width;
    const py = (hash(seed + 1) * height + progress * height * 0.3 * speed) % height;
    const pSize = (hash(seed + 2) * config.particleSize + 1.5) * scale;
    const alpha = hash(seed + 3) * 0.5 + 0.45;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 4) > 0.5 ? `rgba(254, 240, 138, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 38: Zero-Hour Minimalist Luxury Clock Hands Sweep 2027
// ----------------------------------------------------------------------
function drawZeroHourClockSweep(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const clockRadius = width * 0.24;

  // 1. Concentric Radial Shockwave at 12:00:00 (Midnight)
  // Fires when the second hand completes 360 deg clockwise rotation reaching 12:00
  const strikeProg = progress % 1;
  const strikeScale = Math.max(0, Math.sin(strikeProg * Math.PI * 2) * (1 - strikeProg));
  if (strikeProg < 0.25) {
    const expand = strikeProg / 0.25;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, expand * clockRadius * 1.6, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(250, 204, 21, ${(1 - expand) * 0.85})`;
    ctx.lineWidth = (4 * (1 - expand) + 1.5) * scale;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 24 * scale * config.glowIntensity;
    }
    ctx.stroke();
    ctx.restore();
  }

  // 2. Minimalist Gold Roman Clock Dial Ring
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, 0, clockRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 60 Second / Minute Ticks (with bold ticks for 12 hours)
  for (let s = 0; s < 60; s++) {
    const sa = (s / 60) * Math.PI * 2 - Math.PI / 2;
    const isHour = s % 5 === 0;
    const isNoon = s === 0;
    const tickLen = (isNoon ? 24 : isHour ? 15 : 7) * scale;
    const r1 = clockRadius - tickLen;
    const r2 = clockRadius;

    ctx.beginPath();
    ctx.moveTo(Math.cos(sa) * r1, Math.sin(sa) * r1);
    ctx.lineTo(Math.cos(sa) * r2, Math.sin(sa) * r2);
    ctx.strokeStyle = isNoon ? '#ffffff' : isHour ? '#facc15' : 'rgba(250, 204, 21, 0.35)';
    ctx.lineWidth = (isNoon ? 3.5 : isHour ? 2 : 1) * scale;
    ctx.stroke();
  }

  // Inner Concentric Ring
  ctx.beginPath();
  ctx.arc(0, 0, clockRadius * 0.35, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // 3. Sweeping Clock Hands - 100% CLOCKWISE ROTATION (SEARAH JARUM JAM DARI 12 KE 1, 2, 3...)
  // Hour hand: Resting majestically at 12:00 with subtle micro-sweep
  const hourAngle = -Math.PI / 2 + (progress * (Math.PI * 2 / 12));
  const hourLen = clockRadius * 0.52;
  ctx.beginPath();
  ctx.moveTo(-Math.cos(hourAngle) * (18 * scale), -Math.sin(hourAngle) * (18 * scale));
  ctx.lineTo(Math.cos(hourAngle) * hourLen, Math.sin(hourAngle) * hourLen);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4.5 * scale;
  ctx.lineCap = 'round';
  if (config.glowIntensity > 0) {
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 10 * scale;
  }
  ctx.stroke();

  // Minute hand: Reaching toward 12:00 clockwise
  const minuteAngle = -Math.PI / 2 + progress * (Math.PI * 2 * 0.2);
  const minLen = clockRadius * 0.75;
  ctx.beginPath();
  ctx.moveTo(-Math.cos(minuteAngle) * (20 * scale), -Math.sin(minuteAngle) * (20 * scale));
  ctx.lineTo(Math.cos(minuteAngle) * minLen, Math.sin(minuteAngle) * minLen);
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Second hand (Jarum Panjang Detik): Full 360-degree CLOCKWISE sweep (12 -> 3 -> 6 -> 9 -> 12)
  // Perfectly smooth and seamless loop with zero backward jumping!
  const secondAngle = -Math.PI / 2 + progress * Math.PI * 2;
  const secLen = clockRadius * 0.88;
  const tailLen = clockRadius * 0.22;

  // Jarum panjang putih mengkilap
  ctx.beginPath();
  ctx.moveTo(-Math.cos(secondAngle) * tailLen, -Math.sin(secondAngle) * tailLen);
  ctx.lineTo(Math.cos(secondAngle) * secLen, Math.sin(secondAngle) * secLen);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2 * scale;
  ctx.lineCap = 'round';
  if (config.glowIntensity > 0) {
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14 * scale;
  }
  ctx.stroke();

  // Counter-weight circle at tail
  ctx.beginPath();
  ctx.arc(-Math.cos(secondAngle) * (tailLen * 0.7), -Math.sin(secondAngle) * (tailLen * 0.7), 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();

  // Glowing tip diamond at head
  const tipX = Math.cos(secondAngle) * (secLen - 4 * scale);
  const tipY = Math.sin(secondAngle) * (secLen - 4 * scale);
  ctx.beginPath();
  ctx.arc(tipX, tipY, 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();

  // Center Axis Pin
  ctx.beginPath();
  ctx.arc(0, 0, 8 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // 4. Orbiting Stardust Clouds
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 27.13;
    const a = (i / count) * Math.PI * 2 + progress * Math.PI * 2 * 0.2;
    const r = clockRadius * (0.3 + hash(seed) * 0.9);
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, (hash(seed + 1) * 2.5 + 1.2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${hash(seed + 2) * 0.5 + 0.3})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 39: Frosted Evergreen Pine Needles & Ruby Holly Shower 2026
// ----------------------------------------------------------------------
function drawPineHollyShower(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  for (let i = 0; i < count; i++) {
    const seed = i * 39.11;
    const fallSpeed = (hash(seed + 1) * 0.6 + 0.6) * speed;
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 50 * scale;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (40 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + sway) % width;

    const rot = progress * Math.PI * 4 * (hash(seed + 4) > 0.5 ? 1 : -1) + seed;
    const pSize = (hash(seed + 5) * config.particleSize + 2.0) * scale;
    const isHollyBerry = hash(seed + 6) > 0.75;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    if (isHollyBerry) {
      // Glowing Ruby Holly Berry with snowy frost glint
      ctx.beginPath();
      ctx.arc(0, 0, pSize * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8 * scale;
      }
      ctx.fill();

      // Specular highlight
      ctx.beginPath();
      ctx.arc(-pSize * 0.35, -pSize * 0.35, pSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      // Frosted Pine Needle Cluster (3 radiating needles)
      ctx.strokeStyle = '#059669'; // Emerald pine green
      ctx.lineWidth = 1.8 * scale;
      for (let n = 0; n < 3; n++) {
        const needleAngle = (n - 1) * 0.35;
        const nLen = pSize * 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.sin(needleAngle) * nLen, Math.cos(needleAngle) * nLen);
        ctx.stroke();

        // Frosted white snow tip
        ctx.beginPath();
        ctx.arc(Math.sin(needleAngle) * nLen, Math.cos(needleAngle) * nLen, 1.2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 40: Prismatic EDM Club Laser Beam Tunnel & Strobe Pulse 2027
// ----------------------------------------------------------------------
function drawPrismaticLaserTunnel(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // 1. Perspective Hexagonal Tunnel Rings zooming forward
  const ringCount = 9;
  for (let r = 0; r < ringCount; r++) {
    const rProg = (progress * speed + r / ringCount) % 1;
    const rad = Math.pow(rProg, 1.8) * (width * 0.6);
    const alpha = Math.sin(rProg * Math.PI) * 0.85;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    for (let h = 0; h < 6; h++) {
      const ha = (h * Math.PI) / 3;
      const hx = Math.cos(ha) * rad;
      const hy = Math.sin(ha) * rad;
      if (h === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();

    const isCyan = r % 2 === 0;
    ctx.strokeStyle = isCyan ? `rgba(6, 182, 212, ${alpha})` : `rgba(236, 72, 153, ${alpha})`;
    ctx.lineWidth = (2 + (1 - rProg) * 4) * scale;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = isCyan ? '#22d3ee' : '#f43f5e';
      ctx.shadowBlur = 14 * scale * config.glowIntensity;
    }
    ctx.stroke();
    ctx.restore();
  }

  // 2. 12 High-Speed Neon Laser Streak Beams
  const laserBeams = 12;
  ctx.save();
  ctx.translate(cx, cy);
  for (let b = 0; b < laserBeams; b++) {
    const ba = (b / laserBeams) * Math.PI * 2 + progress * Math.PI * 2 * 0.2;
    const bLen = width * 0.65;
    ctx.save();
    ctx.rotate(ba);
    ctx.beginPath();
    ctx.moveTo(20 * scale, 0);
    ctx.lineTo(bLen, 0);
    ctx.strokeStyle = b % 2 === 0 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(244, 114, 182, 0.5)';
    ctx.lineWidth = 1.8 * scale;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // 3. Floating Strobe Energy Sparks
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 47.19;
    const prog = (progress * speed * 2 + i / count) % 1;
    const ang = hash(seed) * Math.PI * 2;
    const dist = Math.pow(prog, 1.5) * (width * 0.6);
    const px = cx + Math.cos(ang) * dist;
    const py = cy + Math.sin(ang) * dist;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, (hash(seed + 1) * 2.5 + 1.2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 2) > 0.5 ? '#ffffff' : '#38bdf8';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 41: Golden 2027 Numerical Typography Stardust Silhouette
// ----------------------------------------------------------------------
function drawTypographySilhouetteReveal(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.48;
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // Render glowing hollow numerical outline "2027" purely with particle stardust streams
  ctx.save();
  ctx.font = `800 ${Math.round(180 * scale)}px Cinzel, Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Hollow gold stroke
  ctx.lineWidth = 3 * scale;
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
  if (config.glowIntensity > 0) {
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 20 * scale * config.glowIntensity;
  }
  ctx.strokeText('2027', cx, cy);

  // Electrical particle sparkles tracing around text
  const sparkCount = 80;
  for (let s = 0; s < sparkCount; s++) {
    const seed = s * 23.7;
    const sparkProg = (progress * speed * 2 + s / sparkCount) % 1;
    const offsetX = (Math.sin(sparkProg * Math.PI * 4 + seed) * 320 - 160) * scale;
    const offsetY = (Math.cos(sparkProg * Math.PI * 4 + seed) * 90 - 45) * scale;

    ctx.beginPath();
    ctx.arc(cx + offsetX, cy + offsetY, (hash(seed) * 2.5 + 1.5) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 12 * scale;
    ctx.fill();
  }
  ctx.restore();

  // Dense ambient stardust orbiting the 2027 sign
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 19.33;
    const angle = (i / count) * Math.PI * 2 + progress * Math.PI * 2 * 0.15;
    const dist = (hash(seed) * width * 0.45) + 80 * scale;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist * 0.65;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, (hash(seed + 1) * 2.2 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${hash(seed + 2) * 0.5 + 0.3})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 42: Floating Holiday Lanterns & Sky Wish Embers 2026
// ----------------------------------------------------------------------
function drawSkyLanternsEmbers(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const lanternCount = 14;

  // 1. Traditional Warm Paper Sky Lanterns rising upwards
  for (let l = 0; l < lanternCount; l++) {
    const seed = l * 51.3;
    const riseSpeed = (hash(seed + 1) * 0.4 + 0.5) * speed;
    const yTotal = height + 150 * scale;
    const rawY = (hash(seed + 2) * yTotal - progress * yTotal * riseSpeed) % yTotal;
    const y = rawY < -60 * scale ? rawY + yTotal : rawY;

    const sway = Math.sin(progress * Math.PI * 2 + seed) * (35 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + sway) % width;

    const lWidth = (hash(seed + 4) * 16 + 22) * scale;
    const lHeight = lWidth * 1.35;
    const pulse = Math.sin(progress * Math.PI * 4 + seed) * 0.2 + 0.8;

    ctx.save();
    ctx.translate(x, y);

    // Warm Lantern Radiance Halo
    const halo = ctx.createRadialGradient(0, lHeight * 0.3, 0, 0, lHeight * 0.3, lWidth * 2.5);
    halo.addColorStop(0, `rgba(254, 240, 138, ${0.45 * pulse})`);
    halo.addColorStop(0.4, `rgba(245, 158, 11, ${0.2 * pulse})`);
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, lHeight * 0.3, lWidth * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Lantern Paper Silhouette
    ctx.beginPath();
    ctx.moveTo(-lWidth * 0.4, -lHeight * 0.5);
    ctx.lineTo(lWidth * 0.4, -lHeight * 0.5);
    ctx.lineTo(lWidth * 0.5, lHeight * 0.4);
    ctx.lineTo(-lWidth * 0.5, lHeight * 0.4);
    ctx.closePath();

    const paperGrad = ctx.createLinearGradient(0, -lHeight * 0.5, 0, lHeight * 0.4);
    paperGrad.addColorStop(0, '#fef08a');
    paperGrad.addColorStop(0.6, '#f59e0b');
    paperGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = paperGrad;
    ctx.fill();

    // Burning Flame Core
    ctx.beginPath();
    ctx.arc(0, lHeight * 0.2, lWidth * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }

  // 2. Rising Golden Embers from Lanterns
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 29.17;
    const rise = (hash(seed + 1) * 0.6 + 0.4) * speed;
    const yTotal = height + 60 * scale;
    const rawY = (hash(seed + 2) * yTotal - progress * yTotal * rise) % yTotal;
    const y = rawY < -30 * scale ? rawY + yTotal : rawY;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (25 * scale);
    const x = (hash(seed + 3) * width + sway) % width;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 4) * 2 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 43: Dual Champagne Flute Effervescence Vortex Columns 2027
// ----------------------------------------------------------------------
function drawChampagneFluteColumns(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  // Left and Right Columns
  const colPositions = [width * 0.16, width * 0.84];

  colPositions.forEach((cx, colIdx) => {
    for (let i = 0; i < count / 2; i++) {
      const seed = colIdx * 1000 + i * 33.1;
      const riseSpeed = (hash(seed + 1) * 0.8 + 0.5) * speed;
      const yTotal = height + 100 * scale;
      const rawY = (hash(seed + 2) * yTotal - progress * yTotal * riseSpeed) % yTotal;
      const y = rawY < -50 * scale ? rawY + yTotal : rawY;

      // Spiraling vortex column around the axis
      const theta = (progress * Math.PI * 4 * speed) + hash(seed + 3) * Math.PI * 2;
      const colRadius = (hash(seed + 4) * 60 + 20) * scale;
      const x = cx + Math.cos(theta) * colRadius;

      const pSize = (hash(seed + 5) * config.particleSize + 1.2) * scale;
      const alpha = hash(seed + 6) * 0.5 + 0.4;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, pSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      if (config.glowIntensity > 0 && hash(seed + 7) > 0.8) {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8 * scale;
      }
      ctx.fill();
      ctx.restore();
    }
  });
}

// ----------------------------------------------------------------------
// TEMPLATE 44: Gingerbread Wonderland Floating Cookie Stars & Sugar Frost
// ----------------------------------------------------------------------
function drawGingerbreadSugarFrost(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  // 1. Tumbling 3D Gingerbread Cookie Stars
  const cookieCount = 18;
  for (let c = 0; c < cookieCount; c++) {
    const seed = c * 47.3;
    const fallSpeed = (hash(seed + 1) * 0.5 + 0.6) * speed;
    const yTotal = height + 120 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 60 * scale;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (45 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + sway) % width;
    const rot = progress * Math.PI * 3 * (hash(seed + 4) > 0.5 ? 1 : -1) + seed;
    const starRadius = (hash(seed + 5) * 16 + 24) * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // Warm Gingerbread Cookie Body
    ctx.beginPath();
    for (let s = 0; s < 10; s++) {
      const rad = s % 2 === 0 ? starRadius : starRadius * 0.45;
      const a = (s * Math.PI) / 5 - Math.PI / 2;
      const sx = Math.cos(a) * rad;
      const sy = Math.sin(a) * rad;
      if (s === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fillStyle = '#b45309'; // Baked golden amber cinnamon dough
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 10 * scale;
    }
    ctx.fill();

    // White Royal Icing Outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Center Sugar Button
    ctx.beginPath();
    ctx.arc(0, 0, starRadius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Festive candy red dot
    ctx.fill();

    ctx.restore();
  }

  // 2. Sparkling White Sugar Dust & Cinnamon Flakes
  for (let i = 0; i < count; i++) {
    const seed = i * 29.83;
    const fallSpeed = (hash(seed + 1) * 0.7 + 0.5) * speed;
    const yTotal = height + 60 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 30 * scale;

    const sway = Math.sin(progress * Math.PI * 2 * 3 + seed) * (30 * scale);
    const x = (hash(seed + 3) * width + sway) % width;
    const pSize = (hash(seed + 4) * config.particleSize + 1.2) * scale;
    const alpha = hash(seed + 5) * 0.5 + 0.45;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 6) > 0.3 ? `rgba(255, 255, 255, ${alpha})` : `rgba(254, 215, 170, ${alpha})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 45: Golden Poinsettia Petals & Shimmering Botanical Drift
// ----------------------------------------------------------------------
function drawPoinsettiaPetalsDrift(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  // Falling velvet red & 24K gold poinsettia petals
  for (let i = 0; i < count; i++) {
    const seed = i * 37.11;
    const fallSpeed = (hash(seed + 1) * 0.6 + 0.5) * speed;
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal + progress * yTotal * fallSpeed) % yTotal;
    const y = rawY - 50 * scale;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (50 * scale) * config.turbulence;
    const x = (hash(seed + 3) * width + sway) % width;

    // Aerodynamic petal rotation & flip
    const rot = progress * Math.PI * 3 + seed;
    const flip = Math.sin(progress * Math.PI * 4 + seed * 2);
    const pLen = (hash(seed + 4) * 12 + 18) * scale;
    const pWidth = pLen * 0.45 * Math.abs(flip);
    const isGold = hash(seed + 5) > 0.65;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // Pointed organic petal contour
    ctx.beginPath();
    ctx.moveTo(0, -pLen);
    ctx.quadraticCurveTo(pWidth, -pLen * 0.3, 0, pLen);
    ctx.quadraticCurveTo(-pWidth, -pLen * 0.3, 0, -pLen);
    ctx.closePath();

    if (isGold) {
      const goldGrad = ctx.createLinearGradient(0, -pLen, 0, pLen);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.5, '#f59e0b');
      goldGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = goldGrad;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8 * scale;
      }
    } else {
      const rubyGrad = ctx.createLinearGradient(0, -pLen, 0, pLen);
      rubyGrad.addColorStop(0, '#f87171');
      rubyGrad.addColorStop(0.5, '#dc2626');
      rubyGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = rubyGrad;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8 * scale;
      }
    }
    ctx.fill();

    // Central vein
    ctx.beginPath();
    ctx.moveTo(0, -pLen * 0.8);
    ctx.lineTo(0, pLen * 0.8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 46: Sacred Cathedral Candle Wall Warm Luminary Votive Grid
// ----------------------------------------------------------------------
function drawCathedralCandleWall(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // Grid of glowing votive candles across lower two-thirds of screen
  const rows = 5;
  const cols = 12;
  const startY = height * 0.38;
  const dy = (height * 0.58) / rows;
  const dx = width / cols;

  for (let r = 0; r < rows; r++) {
    const y = startY + r * dy;
    const rowOffset = (r % 2) * (dx * 0.5);

    for (let c = 0; c < cols; c++) {
      const seed = r * 100 + c * 17.3;
      const x = c * dx + rowOffset + (dx * 0.25);
      const flicker = Math.sin(progress * Math.PI * 6 * speed + seed) * 0.2 + Math.cos(progress * Math.PI * 10 + seed) * 0.1;
      const flameRad = (10 + flicker * 4) * scale;

      ctx.save();
      // Candle glass container glow
      const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, flameRad * 4);
      haloGrad.addColorStop(0, `rgba(254, 240, 138, ${0.4 + flicker * 0.1})`);
      haloGrad.addColorStop(0.4, `rgba(245, 158, 11, ${0.18 + flicker * 0.05})`);
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(x, y, flameRad * 4, 0, Math.PI * 2);
      ctx.fill();

      // Flame Teardrop
      ctx.beginPath();
      ctx.moveTo(x, y - flameRad * 1.6);
      ctx.quadraticCurveTo(x + flameRad * 0.8, y, x, y + flameRad * 0.5);
      ctx.quadraticCurveTo(x - flameRad * 0.8, y, x, y - flameRad * 1.6);
      ctx.fillStyle = '#ffffff';
      if (config.glowIntensity > 0) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12 * scale * config.glowIntensity;
      }
      ctx.fill();

      ctx.restore();
    }
  }

  // Floating warm ember dust rising between candles
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 23.9;
    const rise = (hash(seed + 1) * 0.6 + 0.4) * speed;
    const yTotal = height + 80 * scale;
    const rawY = (hash(seed + 2) * yTotal - progress * yTotal * rise) % yTotal;
    const y = rawY < -40 * scale ? rawY + yTotal : rawY;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (25 * scale);
    const x = (hash(seed + 3) * width + sway) % width;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 4) * 2 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 47: North Pole Blizzard Polar Star Compass & Celestial Aurora
// ----------------------------------------------------------------------
function drawNorthPoleCompass(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.42;
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const compassRad = 150 * scale;

  // 1. Concentric Magnetic Compass Rings
  ctx.save();
  ctx.translate(cx, cy);
  for (let r = 1; r <= 3; r++) {
    const rad = (compassRad / 3) * r;
    const pulse = Math.sin(progress * Math.PI * 4 * speed + r) * 0.15 + 0.85;
    ctx.beginPath();
    ctx.arc(0, 0, rad * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 / r})`;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  // 2. 8-Point Nautical Polar Star Compass Rose
  const starRot = progress * Math.PI * 2 * 0.1 * speed;
  ctx.rotate(starRot);
  for (let p = 0; p < 8; p++) {
    const isMajor = p % 2 === 0;
    const rTip = isMajor ? compassRad : compassRad * 0.55;
    const a = (p * Math.PI) / 4;

    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rTip, 0);
    ctx.lineTo(rTip * 0.25, isMajor ? 12 * scale : 7 * scale);
    ctx.closePath();
    ctx.fillStyle = isMajor ? '#38bdf8' : '#7dd3fc';
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 15 * scale;
    }
    ctx.fill();

    // Opposite half of spear for 3D metallic bevel
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rTip, 0);
    ctx.lineTo(rTip * 0.25, isMajor ? -12 * scale : -7 * scale);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }

  // Center Compass Gem
  ctx.beginPath();
  ctx.arc(0, 0, 12 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 20 * scale;
  ctx.fill();
  ctx.restore();

  // 3. Whirling Arctic Blizzard Particles around Compass
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 31.13;
    const angle = (i / count) * Math.PI * 2 + progress * Math.PI * 4 * speed;
    const dist = (hash(seed) * width * 0.45) + 30 * scale;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist * 0.7;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, (hash(seed + 1) * config.particleSize + 1.2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224, 242, 254, ${hash(seed + 2) * 0.6 + 0.35})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 48: Nutcracker Festive Toy Soldier Golden Drumbeat Sparks
// ----------------------------------------------------------------------
function drawNutcrackerGoldenSparks(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  // 1. Floating Golden Music Notes & Marching Ribbons
  const notesCount = 14;
  for (let n = 0; n < notesCount; n++) {
    const seed = n * 53.7;
    const riseSpeed = (hash(seed + 1) * 0.6 + 0.5) * speed;
    const yTotal = height + 100 * scale;
    const rawY = (hash(seed + 2) * yTotal - progress * yTotal * riseSpeed) % yTotal;
    const y = rawY < -50 * scale ? rawY + yTotal : rawY;

    const sway = Math.sin(progress * Math.PI * 2 * 2 + seed) * (40 * scale);
    const x = (hash(seed + 3) * width + sway) % width;
    const nSize = (14 + (n % 3) * 4) * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(progress * Math.PI * 2 + seed) * 0.3);

    // Musical Note Oval Notehead
    ctx.beginPath();
    ctx.ellipse(0, 0, nSize * 0.7, nSize * 0.5, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 10 * scale;
    }
    ctx.fill();

    // Stem
    ctx.beginPath();
    ctx.moveTo(nSize * 0.5, 0);
    ctx.lineTo(nSize * 0.5, -nSize * 1.8);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    ctx.restore();
  }

  // 2. Rhythmic Drumbeat Sparkler Shockwaves (Pulsing beat)
  const beatProg = (progress * speed * 3) % 1;
  const beatScale = Math.sin(beatProg * Math.PI);
  if (beatScale > 0.1) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.6, beatProg * (width * 0.35), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(250, 204, 21, ${beatScale * 0.6})`;
    ctx.lineWidth = (3 * (1 - beatProg) + 1) * scale;
    ctx.stroke();
    ctx.restore();
  }

  // 3. Dense Festive Sparkler Flurries
  for (let i = 0; i < count; i++) {
    const seed = i * 27.41;
    const px = (hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * 30 * scale) % width;
    const py = (hash(seed + 1) * height + progress * height * 0.25 * speed) % height;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, (hash(seed + 2) * config.particleSize + 1.2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.5 ? '#fef08a' : '#ef4444';
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 49: Golden Neon Midnight 2027 Monolith & Skyline Pulse
// ----------------------------------------------------------------------
function drawSkylineMonolithPulse(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const scale = width / 1920;
  const speed = config.particleSpeed;

  // 1. Towering Golden Laser Pillars rising into the sky from horizon
  const pillarCount = 7;
  for (let p = 0; p < pillarCount; p++) {
    const px = width * (0.15 + (p / (pillarCount - 1)) * 0.7);
    const pulse = Math.sin(progress * Math.PI * 4 * speed + p) * 0.2 + 0.8;
    const pW = (12 + p * 3) * scale;

    ctx.save();
    const beamGrad = ctx.createLinearGradient(px, height, px, 0);
    beamGrad.addColorStop(0, 'rgba(250, 204, 21, 0.65)');
    beamGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.25)');
    beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(px - pW / 2, 0, pW, height);
    ctx.restore();
  }

  // 2. Center 2027 High-Tech Beacon Ring
  const beaconY = height * 0.35;
  const bPulse = Math.sin(progress * Math.PI * 2 * speed) * 0.3 + 0.7;
  ctx.save();
  ctx.translate(cx, beaconY);
  ctx.beginPath();
  ctx.arc(0, 0, (45 * bPulse) * scale, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 30 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 15 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // 3. Ambient Stardust Clouds sweeping horizontally
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 19.81;
    const px = (hash(seed) * width + progress * width * 0.2 * speed) % width;
    const py = (hash(seed + 1) * height + Math.sin(progress * Math.PI * 2 + seed) * 30 * scale) % height;

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, (hash(seed + 2) * config.particleSize + 1.2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${hash(seed + 3) * 0.5 + 0.35})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// TEMPLATE 50: 24K Gold Confetti Cannon Stadium Blast Loop 2027
// ----------------------------------------------------------------------
function drawStadiumConfettiBlast(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const scale = width / 1920;
  const speed = config.particleSpeed;
  const count = config.particleCount;

  // Dual cannons at bottom-left (0, height) and bottom-right (width, height)
  for (let i = 0; i < count; i++) {
    const seed = i * 23.67;
    const fromLeft = hash(seed) > 0.5;
    const originX = fromLeft ? -20 * scale : width + 20 * scale;
    const originY = height * 0.95;

    const blastProg = (progress * speed + (i / count)) % 1;
    // Launch trajectory: arcs up toward center then falls
    const launchAngle = fromLeft
      ? -Math.PI * 0.38 + (hash(seed + 1) - 0.5) * 0.4
      : -Math.PI * 0.62 + (hash(seed + 1) - 0.5) * 0.4;
    const launchDist = Math.pow(blastProg, 0.75) * (width * 0.75);
    const gravity = Math.pow(blastProg, 2.2) * (height * 0.6);

    const px = originX + Math.cos(launchAngle) * launchDist;
    const py = originY + Math.sin(launchAngle) * launchDist + gravity;

    const rot = blastProg * Math.PI * 8 * (hash(seed + 2) > 0.5 ? 1 : -1) + seed;
    const cW = (hash(seed + 3) * 10 + 12) * scale;
    const cH = (hash(seed + 4) * 6 + 7) * scale;
    const flip = Math.sin(blastProg * Math.PI * 6 + seed);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.scale(1, flip);

    ctx.beginPath();
    ctx.rect(-cW / 2, -cH / 2, cW, cH);
    ctx.fillStyle = hash(seed + 5) > 0.4 ? '#facc15' : '#ef4444';
    if (config.glowIntensity > 0 && Math.abs(flip) > 0.8) {
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 8 * scale;
    }
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// Custom Live Code Engine
// ----------------------------------------------------------------------
function drawCustomCode(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  if (!config.customCode) return;
  try {
    const renderFn = new Function('ctx', 't', 'progress', 'width', 'height', 'Math', config.customCode);
    renderFn(ctx, time, progress, width, height, Math);
  } catch (err) {
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.font = '20px sans-serif';
    ctx.fillText('Custom Code Error: ' + (err as Error).message, 40, 60);
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// Typography & Overlay Renderer (Only when showText is true)
// ----------------------------------------------------------------------
function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const scale = width / 1920;
  const fontFam = config.fontFamily === 'Cinzel' ? 'Cinzel, Georgia, serif' : 'Outfit, -apple-system, sans-serif';

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. Year Headline
  if (config.yearText) {
    const yearY = height * 0.47;
    const yearFontSize = Math.round(150 * scale);
    ctx.font = `800 ${yearFontSize}px ${fontFam}`;
    
    const goldGrad = ctx.createLinearGradient(cx - 300 * scale, yearY - 80 * scale, cx + 300 * scale, yearY + 80 * scale);
    if (config.colorPalette === 'cyber_neon') {
      goldGrad.addColorStop(0, '#38bdf8');
      goldGrad.addColorStop(0.5, '#ffffff');
      goldGrad.addColorStop(1, '#ec4899');
    } else {
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.25, '#f59e0b');
      goldGrad.addColorStop(0.5, '#ffffff');
      goldGrad.addColorStop(0.75, '#d97706');
      goldGrad.addColorStop(1, '#fef08a');
    }

    ctx.fillStyle = goldGrad;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = config.colorPalette === 'cyber_neon' ? '#06b6d4' : '#eab308';
      ctx.shadowBlur = 25 * scale * config.glowIntensity;
    }
    ctx.fillText(config.yearText, cx, yearY);

    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.strokeText(config.yearText, cx, yearY);
  }

  // 2. Headline
  if (config.headlineText) {
    const headY = height * 0.35;
    const headFontSize = Math.round(38 * scale);
    ctx.font = `700 ${headFontSize}px ${fontFam}`;
    ctx.letterSpacing = `${Math.round(8 * scale)}px`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10 * scale;
    ctx.fillText(config.headlineText, cx, headY);
  }

  // 3. Subtitle
  if (config.subtitleText) {
    const subY = height * 0.60;
    const subFontSize = Math.round(20 * scale);
    ctx.font = `500 ${subFontSize}px Outfit, sans-serif`;
    ctx.letterSpacing = `${Math.round(6 * scale)}px`;
    ctx.fillStyle = config.colorPalette === 'cyber_neon' ? '#7dd3fc' : '#fde68a';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 8 * scale;
    ctx.fillText(config.subtitleText, cx, subY);
  }

  ctx.restore();
}

// =========================================================================
// CINEMATIC GRAPHICS HELPERS (MULTI-TIERED VISUAL HIERARCHY)
// =========================================================================

// 4-Pointed Diamond Star Cross Glint (Specular Hollywood Flare)
function drawStarGlint4Point(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x - radius, y);
  ctx.quadraticCurveTo(x, y, x, y - radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.quadraticCurveTo(x, y, x - radius, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.shadowColor = color;
  ctx.shadowBlur = radius * 2.5;
  ctx.fill();
  ctx.restore();
}

// Soft Optical Bokeh Orb (3D Depth of Field Background Orb)
function drawBokehOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number
) {
  if (alpha <= 0.01) return;
  ctx.save();
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(0.65, color);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// =========================================================================
// REAL VECTOR / CANVAS FONT POINT SAMPLER
// Extracts precise pixel coordinates from rendered typography so particles
// form 100% LEGIBLE, RAZOR-SHARP LETTERS ("HAPPY NEW YEAR 2027", "MERRY CHRISTMAS")
// =========================================================================
interface SampledPoint {
  x: number;
  y: number;
}

const sampledTextPointsCache = new Map<string, SampledPoint[]>();

function getSampledTextPoints(
  lines: { text: string; fontSize: number; fontFamily: string; yOffsetRatio: number }[],
  width: number,
  height: number,
  targetCount: number
): SampledPoint[] {
  const cacheKey = `${lines.map((l) => `${l.text}_${l.fontSize}_${l.yOffsetRatio}`).join('|')}_${width}_${height}_${targetCount}`;
  if (sampledTextPointsCache.has(cacheKey)) {
    return sampledTextPointsCache.get(cacheKey)!;
  }

  // Use crisp offscreen canvas (1280x720) for deterministic pixel scanning
  const offW = 1280;
  const offH = 720;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = offW;
  offCanvas.height = offH;
  const offCtx = offCanvas.getContext('2d');

  if (!offCtx) {
    const fallback: SampledPoint[] = [];
    for (let i = 0; i < targetCount; i++) {
      fallback.push({ x: width / 2, y: height / 2 });
    }
    return fallback;
  }

  offCtx.fillStyle = '#ffffff';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';

  const scaleRatio = offW / 1920;
  lines.forEach((line) => {
    const size = Math.round(line.fontSize * scaleRatio);
    offCtx.font = `900 ${size}px ${line.fontFamily}, 'Cinzel', 'Outfit', sans-serif`;
    const y = offH / 2 + line.yOffsetRatio * offH;
    offCtx.fillText(line.text, offW / 2, y);
  });

  const imgData = offCtx.getImageData(0, 0, offW, offH);
  const data = imgData.data;
  const hitPixels: SampledPoint[] = [];

  const step = 2; // Step of 2px for dense, high-resolution letter sampling
  for (let y = 0; y < offH; y += step) {
    for (let x = 0; x < offW; x += step) {
      const idx = (y * offW + x) * 4;
      if (data[idx + 3] > 110) {
        hitPixels.push({
          x: (x / offW) * width,
          y: (y / offH) * height,
        });
      }
    }
  }

  if (hitPixels.length === 0) {
    const fallback: SampledPoint[] = [];
    for (let i = 0; i < targetCount; i++) {
      fallback.push({ x: width / 2, y: height / 2 });
    }
    return fallback;
  }

  const result: SampledPoint[] = [];
  for (let i = 0; i < targetCount; i++) {
    const sampleIdx = Math.floor((i / targetCount) * hitPixels.length) % hitPixels.length;
    result.push(hitPixels[sampleIdx]);
  }

  sampledTextPointsCache.set(cacheKey, result);
  return result;
}

// =========================================================================
// MASTER SILHOUETTE 1: CRYSTALLINE SNOWFLAKE MANDALA (NATAL 2026)
// Pure 6-fold mathematical fractal symmetry snowflake with diamond glints,
// crystal dendrite branching, rotating ice perspective, and starburst bloom.
// =========================================================================
function drawCrystallineSnowflakeMandala(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.50;
  const scale = width / 1920;
  const count = Math.max(500, Math.min(1000, config.particleCount || 760));
  const glow = config.glowIntensity || 1.7;

  // 1. Background Ice Crystal Twinkles & Soft Frost Bokeh
  const bokehCount = 28;
  for (let b = 0; b < bokehCount; b++) {
    const bSeed = b * 41.17;
    const bRise = (progress * 0.35 + hash(bSeed)) % 1.0;
    const bx = cx + (hash(bSeed + 1) - 0.5) * (width * 0.85);
    const by = height - bRise * height;
    const bRad = (hash(bSeed + 2) * 45 + 18) * scale;
    const bCol = hash(bSeed + 3) > 0.5 ? 'rgba(224, 242, 254, 0.35)' : 'rgba(254, 240, 138, 0.25)';
    drawBokehOrb(ctx, bx, by, bRad, bCol, 0.12);
  }

  // Slow, majestic rotating perspective
  const rotAngle = progress * Math.PI * 2 * 0.20;

  // Climax Diamond Flash at Apex Crystallization (progress 0.65 to 0.77)
  if (progress >= 0.64 && progress <= 0.78) {
    const flashT = (progress - 0.64) / (0.78 - 0.64);
    const flashAlpha = Math.sin(flashT * Math.PI);
    drawStarGlint4Point(ctx, cx, cy, (140 * scale) * flashAlpha, '#ffffff', flashAlpha * 0.95);

    // Expanding crystal ring shockwave
    const ringRadius = flashT * (width * 0.55);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1.5, (1 - flashT) * 10 * scale);
    ctx.strokeStyle = `rgba(224, 242, 254, ${flashAlpha * 0.75})`;
    if (glow > 0) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 28 * scale * glow;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Core Diamond Star Glint
  const coreTwinkle = Math.sin(progress * Math.PI * 8) * 0.15 + 0.85;
  drawStarGlint4Point(ctx, cx, cy, (45 * scale) * coreTwinkle, '#ffffff', 0.95);
  drawStarGlint4Point(ctx, cx, cy, (80 * scale) * coreTwinkle, '#fef08a', 0.55);

  // 2. 6-Fold Snowflake Mandala Particles
  const maxRadius = 350 * scale;

  for (let i = 0; i < count; i++) {
    const seed = i * 29.317;
    const pRatio = i / count;

    // Ambient Stardust Flow
    const ambAngle = hash(seed) * Math.PI * 2;
    const ambDist = (hash(seed + 1) * 0.42 + 0.08) * width;
    const ambX = cx + Math.cos(ambAngle) * ambDist;
    const ambY = cy + Math.sin(ambAngle) * (ambDist * 0.65);

    // 6-Fold Radial Dihedral Geometry
    const armIndex = Math.floor(hash(seed + 2) * 6);
    const baseArmAngle = (armIndex * Math.PI * 2) / 6 + rotAngle;

    let sx = cx;
    let sy = cy;
    let sColor = '#ffffff';
    let sSize = (hash(seed + 3) * config.particleSize + 1.8) * scale;

    if (pRatio < 0.45) {
      // 1. Six Primary Crystal Beams (Spine)
      const u = pRatio / 0.45; // 0 (center) to 1 (outer tip)
      const r = u * maxRadius;
      sx = cx + Math.cos(baseArmAngle) * r;
      sy = cy + Math.sin(baseArmAngle) * r;
      sColor = u > 0.85 ? '#ffffff' : '#fef08a';
      if (u > 0.90) sSize *= 1.4; // Tip glints
    } else if (pRatio < 0.78) {
      // 2. Symmetrical 60° Crystal Needles & Sub-Branches
      const bRatio = (pRatio - 0.45) / 0.33;
      // 3 branch levels: 0.35, 0.60, 0.82 along spine
      const branchTier = (i % 3);
      const spineU = branchTier === 0 ? 0.35 : branchTier === 1 ? 0.60 : 0.82;
      const branchMaxLen = (1 - spineU * 0.4) * (85 * scale);
      const isRightBranch = (i % 2 === 0);
      const branchAngleOffset = (isRightBranch ? 1 : -1) * (Math.PI / 3); // 60 degrees

      const subU = (bRatio * 3) % 1.0;
      const bLen = subU * branchMaxLen;

      // Spine root position
      const spineX = cx + Math.cos(baseArmAngle) * (spineU * maxRadius);
      const spineY = cy + Math.sin(baseArmAngle) * (spineU * maxRadius);

      const branchAngle = baseArmAngle + branchAngleOffset;
      sx = spineX + Math.cos(branchAngle) * bLen;
      sy = spineY + Math.sin(branchAngle) * bLen;

      sColor = isRightBranch ? '#fef08a' : '#e0f2fe';
    } else if (pRatio < 0.90) {
      // 3. Central Hexagonal Faceted Star Nucleus
      const nU = (pRatio - 0.78) / 0.12;
      const nAngle = nU * Math.PI * 2 + rotAngle;
      const nR = (35 + Math.sin(nAngle * 6) * 18) * scale;
      sx = cx + Math.cos(nAngle) * nR;
      sy = cy + Math.sin(nAngle) * nR;
      sColor = '#ffffff';
      sSize *= 1.25;
    } else {
      // 4. Concentric Halo Orbit of Diamond Frost Dust
      const oAngle = hash(seed + 4) * Math.PI * 2 - rotAngle * 1.5;
      const oR = (maxRadius * 0.68 + (hash(seed + 5) - 0.5) * 45 * scale);
      sx = cx + Math.cos(oAngle) * oR;
      sy = cy + Math.sin(oAngle) * oR;
      sColor = '#38bdf8';
    }

    // Flurry shatter vector
    const shatterAngle = hash(seed + 6) * Math.PI * 2;
    const shatterDist = (hash(seed + 7) * 0.7 + 0.3) * (width * 0.55);
    const shatterX = cx + Math.cos(shatterAngle) * shatterDist;
    const shatterY = cy + Math.sin(shatterAngle) * shatterDist;

    // Phasing
    let curX = ambX;
    let curY = ambY;
    let curAlpha = 0.85;

    if (progress < 0.22) {
      // Phase 1: Swirl in and freeze crystal mandala
      const t = progress / 0.22;
      const ease = t * t * (3 - 2 * t);
      curX = ambX + (sx - ambX) * ease;
      curY = ambY + (sy - ambY) * ease;
      curAlpha = 0.35 + ease * 0.65;
    } else if (progress < 0.65) {
      // Phase 2: Majestic rotating crystal mandala
      curX = sx;
      curY = sy;
      const shimmer = Math.sin(progress * Math.PI * 10 + seed) * 0.15 + 0.85;
      curAlpha = 0.95 * shimmer;
    } else if (progress < 0.78) {
      // Phase 3: Shatter into diamond ice dust
      const boomT = (progress - 0.65) / 0.13;
      const dragEase = 1 - Math.pow(1 - boomT, 2.8);
      curX = sx + (shatterX - sx) * dragEase;
      curY = sy + (shatterY - sy) * dragEase;
      curAlpha = 0.90 * (1 - boomT * 0.2);
    } else {
      // Phase 4: Seamless loop reset
      const resetT = (progress - 0.78) / 0.22;
      const ease = resetT * resetT * (3 - 2 * resetT);
      curX = shatterX + (ambX - shatterX) * ease;
      curY = shatterY + (ambY - shatterY) * ease;
      curAlpha = 0.85 - ease * 0.50;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(curX, curY, Math.max(0.5, sSize), 0, Math.PI * 2);
    ctx.fillStyle = sColor;
    ctx.globalAlpha = Math.max(0, Math.min(1, curAlpha));
    if (glow > 0) {
      ctx.shadowColor = sColor;
      ctx.shadowBlur = sSize * 3.5 * glow;
    }
    ctx.fill();
    ctx.restore();
  }

  // 6 Arm Tip Diamond Glints
  for (let a = 0; a < 6; a++) {
    const tipAngle = (a * Math.PI * 2) / 6 + rotAngle;
    const tipX = cx + Math.cos(tipAngle) * maxRadius;
    const tipY = cy + Math.sin(tipAngle) * maxRadius;
    const tipTwinkle = Math.sin(progress * Math.PI * 6 + a * 1.5) * 0.3 + 0.7;
    drawStarGlint4Point(ctx, tipX, tipY, (24 * scale) * tipTwinkle, '#ffffff', tipTwinkle * 0.85);
  }

  if (config.showText) {
    drawTextOverlay(ctx, config, time, progress, width, height);
  }
}

// =========================================================================
// MASTER SILHOUETTE 2: GOLDEN JINGLE BELL & VELVET RIBBON (NATAL 2026)
// Majestic swinging golden holiday bell with acoustic chime light ripples,
// tied ribbon bow with dangling streamers, and cascading stardust snowfall.
// =========================================================================
function drawGoldenJingleBellRibbonSwing(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.48;
  const scale = width / 1920;
  const count = Math.max(500, Math.min(1000, config.particleCount || 750));
  const glow = config.glowIntensity || 1.7;

  // Background Falling Holiday Embers
  const emberCount = 26;
  for (let e = 0; e < emberCount; e++) {
    const eSeed = e * 47.19;
    const eRise = (progress * 0.35 + hash(eSeed)) % 1.0;
    const ex = cx + (hash(eSeed + 1) - 0.5) * (width * 0.8);
    const ey = height - eRise * height;
    const eRad = (hash(eSeed + 2) * 35 + 15) * scale;
    drawBokehOrb(ctx, ex, ey, eRad, 'rgba(234, 179, 8, 0.3)', 0.12);
  }

  // Harmonic Pendulum Swing
  const swingPhase = progress * Math.PI * 2 * 2; // 2 full swings per loop
  const swingAngle = Math.sin(swingPhase) * 0.12;
  const cosSwing = Math.cos(swingAngle);
  const sinSwing = Math.sin(swingAngle);

  // Acoustic Chime Waves emitted at peak velocity (sin(swingPhase) ~= 0)
  const chimeTrigger = Math.abs(Math.sin(swingPhase * 2));
  if (chimeTrigger > 0.85) {
    const chimeAlpha = (chimeTrigger - 0.85) / 0.15;
    const chimeR = (1 - chimeAlpha) * (width * 0.38) + 60 * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy + 80 * scale, chimeR, 0, Math.PI * 2);
    ctx.lineWidth = 3 * scale * chimeAlpha;
    ctx.strokeStyle = `rgba(254, 240, 138, ${chimeAlpha * 0.5})`;
    if (glow > 0) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 20 * scale * glow;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Bell Top Pivot
  const pivotY = cy - 140 * scale;

  for (let i = 0; i < count; i++) {
    const seed = i * 27.531;
    const pRatio = i / count;

    // Ambient Stardust Flow
    const ambAngle = hash(seed) * Math.PI * 2;
    const ambDist = (hash(seed + 1) * 0.42 + 0.08) * width;
    const ambX = cx + Math.cos(ambAngle) * ambDist;
    const ambY = cy + Math.sin(ambAngle) * (ambDist * 0.65);

    let bx = 0;
    let by = 0;
    let bCol = '#facc15';
    let bSize = (hash(seed + 2) * config.particleSize + 1.8) * scale;

    if (pRatio < 0.42) {
      // 1. Flared Bell Body Outline (Left & Right Symmetric Curves)
      const u = (pRatio / 0.42); // 0 (dome) to 1 (lip)
      const isRight = (i % 2 === 0);
      const sideSign = isRight ? 1 : -1;

      // Parabolic flare
      const bellH = 190 * scale;
      const topW = 35 * scale;
      const bottomW = 160 * scale;
      const flareW = topW + Math.pow(u, 2.2) * (bottomW - topW);

      bx = sideSign * flareW;
      by = u * bellH;
      bCol = isRight ? '#fef08a' : '#f59e0b';
    } else if (pRatio < 0.60) {
      // 2. Bell Bottom Lip Rim Torus (Curved Oval Lip)
      const lipU = (pRatio - 0.42) / 0.18;
      const lipAngle = lipU * Math.PI * 2;
      const rimW = 160 * scale;
      const rimH = 26 * scale;

      bx = Math.cos(lipAngle) * rimW;
      by = 190 * scale + Math.sin(lipAngle) * rimH;
      bCol = '#facc15';
      bSize *= 1.15;
    } else if (pRatio < 0.70) {
      // 3. Gilded Clapper (Hanging Ball Swinging Harmonically)
      const clapU = (pRatio - 0.60) / 0.10;
      const clapAngle = clapU * Math.PI * 2;
      const clapR = (hash(seed + 3) * 22 + 4) * scale;
      const clapLag = Math.sin(swingPhase - 0.4) * (28 * scale);

      bx = clapLag + Math.cos(clapAngle) * clapR;
      by = 195 * scale + Math.sin(clapAngle) * clapR;
      bCol = '#ffffff';
      bSize *= 1.3;
    } else if (pRatio < 0.88) {
      // 4. Velvet Ribbon Bow on Top (Loop Wings & Center Knot)
      const bowRatio = (pRatio - 0.70) / 0.18;
      if (bowRatio < 0.65) {
        // Left & Right Wings (Parametric Lemniscate Loops)
        const loopU = (bowRatio / 0.65) * Math.PI * 2;
        const wingScale = 85 * scale;
        const wingX = Math.sin(loopU) * wingScale * 1.35;
        const wingY = Math.sin(loopU * 2) * (wingScale * 0.65) - 30 * scale;
        bx = wingX;
        by = wingY;
        bCol = '#ef4444'; // Festive Ruby Velvet
      } else {
        // Central Gilded Knot Ring
        const knotU = (bowRatio - 0.65) / 0.35;
        const knotAngle = knotU * Math.PI * 2;
        bx = Math.cos(knotAngle) * (18 * scale);
        by = -30 * scale + Math.sin(knotAngle) * (18 * scale);
        bCol = '#ffffff';
        bSize *= 1.3;
      }
    } else {
      // 5. Dangling Ribbon Streamers (Flowing Down Sides)
      const tailRatio = (pRatio - 0.88) / 0.12;
      const isRightTail = (i % 2 === 0);
      const tailX = (isRightTail ? 1 : -1) * (55 * scale + tailRatio * (75 * scale));
      const tailY = tailRatio * (220 * scale) - 20 * scale + Math.sin(tailRatio * 8 + swingPhase) * (15 * scale);
      bx = tailX;
      by = tailY;
      bCol = '#dc2626';
    }

    // Apply Pendulum Swing Rotation around pivot
    const finalOutlineX = cx + (bx * cosSwing - by * sinSwing);
    const finalOutlineY = pivotY + (bx * sinSwing + by * cosSwing);

    // Shatter vector
    const shatterAngle = hash(seed + 4) * Math.PI * 2;
    const shatterDist = (hash(seed + 5) * 0.7 + 0.3) * (width * 0.55);
    const shatterX = cx + Math.cos(shatterAngle) * shatterDist;
    const shatterY = cy + Math.sin(shatterAngle) * shatterDist;

    // Phasing
    let curX = ambX;
    let curY = ambY;
    let curAlpha = 0.85;

    if (progress < 0.22) {
      const t = progress / 0.22;
      const ease = t * t * (3 - 2 * t);
      curX = ambX + (finalOutlineX - ambX) * ease;
      curY = ambY + (finalOutlineY - ambY) * ease;
      curAlpha = 0.35 + ease * 0.65;
    } else if (progress < 0.65) {
      curX = finalOutlineX;
      curY = finalOutlineY;
      const shimmer = Math.sin(progress * Math.PI * 10 + seed) * 0.15 + 0.85;
      curAlpha = 0.95 * shimmer;
    } else if (progress < 0.78) {
      const boomT = (progress - 0.65) / 0.13;
      const dragEase = 1 - Math.pow(1 - boomT, 2.8);
      curX = finalOutlineX + (shatterX - finalOutlineX) * dragEase;
      curY = finalOutlineY + (shatterY - finalOutlineY) * dragEase;
      curAlpha = 0.90 * (1 - boomT * 0.2);
    } else {
      const resetT = (progress - 0.78) / 0.22;
      const ease = resetT * resetT * (3 - 2 * resetT);
      curX = shatterX + (ambX - shatterX) * ease;
      curY = shatterY + (ambY - shatterY) * ease;
      curAlpha = 0.85 - ease * 0.50;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(curX, curY, Math.max(0.5, bSize), 0, Math.PI * 2);
    ctx.fillStyle = bCol;
    ctx.globalAlpha = Math.max(0, Math.min(1, curAlpha));
    if (glow > 0) {
      ctx.shadowColor = bCol;
      ctx.shadowBlur = bSize * 3.5 * glow;
    }
    ctx.fill();
    ctx.restore();
  }

  // Bow Crown Star Glint
  drawStarGlint4Point(ctx, cx, pivotY - 30 * scale, 35 * scale, '#ffffff', 0.9);

  if (config.showText) {
    drawTextOverlay(ctx, config, time, progress, width, height);
  }
}

// =========================================================================
// MASTER SILHOUETTE 2: SACRED SPIRAL TREE TO BETHLEHEM STARBURST (NATAL 2026)
// Dual intertwined helical ribbons sketching an architectural minimalist pine,
// studded with gem baubles, topped by the radiant Star of Bethlehem.
// =========================================================================
function drawSacredSpiralTreeBethlehemStar(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const scale = width / 1920;
  const count = Math.max(500, Math.min(1000, config.particleCount || 720));
  const glow = config.glowIntensity || 1.6;

  const treeTopY = height * 0.22;
  const treeBaseY = height * 0.80;
  const treeH = treeBaseY - treeTopY;

  // 1. Rising Hearth Embers & Soft Bokeh (Background Layer)
  const emberCount = 25;
  for (let e = 0; e < emberCount; e++) {
    const eSeed = e * 37.19;
    const rise = (progress * 0.4 + hash(eSeed)) % 1.0;
    const ex = cx + (hash(eSeed + 1) - 0.5) * (width * 0.7) + Math.sin(rise * 8 + eSeed) * (25 * scale);
    const ey = height - rise * height;
    const eRad = (hash(eSeed + 2) * 35 + 20) * scale;
    drawBokehOrb(ctx, ex, ey, eRad, 'rgba(234, 179, 8, 0.3)', 0.12);
  }

  // 2. Star of Bethlehem Apex Crown (8-Pointed Divine Star & Godrays)
  const starRot = progress * Math.PI * 2 * 0.25;
  const starApexY = treeTopY - 22 * scale;
  const pulseApex = Math.sin(progress * Math.PI * 6) * 0.15 + 0.85;

  // Volumetric Godray Beams
  ctx.save();
  ctx.translate(cx, starApexY);
  ctx.rotate(starRot);
  const rayCount = 8;
  for (let r = 0; r < rayCount; r++) {
    ctx.rotate((Math.PI * 2) / rayCount);
    const rayLen = (180 + Math.sin(progress * Math.PI * 4 + r) * 40) * scale * pulseApex;
    const rayGrad = ctx.createLinearGradient(0, 0, rayLen, 0);
    rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    rayGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
    rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(0, -3 * scale);
    ctx.lineTo(rayLen, 0);
    ctx.lineTo(0, 3 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Core Star
  drawStarGlint4Point(ctx, cx, starApexY, 45 * scale * pulseApex, '#ffffff', 0.95);
  drawStarGlint4Point(ctx, cx, starApexY, 70 * scale * pulseApex, '#fef08a', 0.6);

  // 3. Dual Helical Spiral Wireframe Particles
  for (let i = 0; i < count; i++) {
    const seed = i * 21.619;
    const pRatio = i / count;

    // Ambient Stardust
    const ambAngle = hash(seed) * Math.PI * 2;
    const ambDist = (hash(seed + 1) * 0.4 + 0.1) * width;
    const ambX = cx + Math.cos(ambAngle) * ambDist;
    const ambY = starApexY + Math.sin(ambAngle) * (ambDist * 0.65);

    // Architectural Spiral Tree Contour
    let tx = cx;
    let ty = treeTopY;
    let tCol = '#facc15';
    let tSize = (hash(seed + 2) * config.particleSize + 1.8) * scale;

    if (pRatio < 0.70) {
      // Dual Intertwined Spiral Helices (Ribbon 1 & Ribbon 2)
      const u = pRatio / 0.70; // 0 (top) to 1 (base)
      const isRibbon2 = (i % 2 === 0);
      const turns = 7;
      const helixAngle = u * Math.PI * 2 * turns + (isRibbon2 ? Math.PI : 0) + progress * Math.PI * 2 * 0.5;
      const coneR = u * (width * 0.21);

      tx = cx + Math.cos(helixAngle) * coneR;
      ty = treeTopY + u * treeH;
      tCol = isRibbon2 ? '#fef08a' : '#f59e0b';
    } else if (pRatio < 0.88) {
      // Floating Gem Baubles (Ruby, Topaz, Sapphire glints)
      const bU = ((i % 18) + 1) / 19;
      const bAngle = (i % 18) * 2.39996 + progress * Math.PI * 2 * 0.3;
      const bR = bU * (width * 0.20);

      tx = cx + Math.cos(bAngle) * bR;
      ty = treeTopY + bU * treeH;

      const pick = i % 3;
      tCol = pick === 0 ? '#ef4444' : pick === 1 ? '#38bdf8' : '#eab308';
      tSize *= 1.6;
    } else {
      // Apex Star Halo Dust
      const sAngle = hash(seed + 3) * Math.PI * 2 + progress * Math.PI * 2 * 0.8;
      const sR = (hash(seed + 4) * 35 + 10) * scale;
      tx = cx + Math.cos(sAngle) * sR;
      ty = starApexY + Math.sin(sAngle) * sR;
      tCol = '#ffffff';
      tSize *= 1.3;
    }

    // Snow flurry shatter vector
    const flurryAngle = hash(seed + 5) * Math.PI * 2;
    const flurryDist = (hash(seed + 6) * 0.7 + 0.3) * (width * 0.55);
    const flurryX = cx + Math.cos(flurryAngle) * flurryDist;
    const flurryY = starApexY + Math.sin(flurryAngle) * flurryDist;

    // Eased Phasing
    let curX = ambX;
    let curY = ambY;
    let curAlpha = 0.85;

    if (progress < 0.22) {
      const t = progress / 0.22;
      const ease = t * t * (3 - 2 * t);
      curX = ambX + (tx - ambX) * ease;
      curY = ambY + (ty - ambY) * ease;
      curAlpha = 0.35 + ease * 0.65;
    } else if (progress < 0.65) {
      curX = tx;
      curY = ty;
      const shimmer = Math.sin(progress * Math.PI * 10 + seed) * 0.15 + 0.85;
      curAlpha = 0.95 * shimmer;
    } else if (progress < 0.78) {
      const boomT = (progress - 0.65) / 0.13;
      const dragEase = 1 - Math.pow(1 - boomT, 2.6);
      curX = tx + (flurryX - tx) * dragEase;
      curY = ty + (flurryY - ty) * dragEase;
      curAlpha = 0.90 * (1 - boomT * 0.2);
    } else {
      const resetT = (progress - 0.78) / 0.22;
      const ease = resetT * resetT * (3 - 2 * resetT);
      curX = flurryX + (ambX - flurryX) * ease;
      curY = flurryY + (ambY - flurryY) * ease;
      curAlpha = 0.85 - ease * 0.50;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(curX, curY, Math.max(0.5, tSize), 0, Math.PI * 2);
    ctx.fillStyle = tCol;
    ctx.globalAlpha = Math.max(0, Math.min(1, curAlpha));
    if (glow > 0) {
      ctx.shadowColor = tCol;
      ctx.shadowBlur = tSize * 3.5 * glow;
    }
    ctx.fill();
    ctx.restore();
  }

  if (config.showText) {
    drawTextOverlay(ctx, config, time, progress, width, height);
  }
}

// =========================================================================
// MASTER SILHOUETTE 3: MIDNIGHT FIREWORKS BURST TO "HAPPY NEW YEAR 2027" (TAHUN BARU 2027)
// Rising rocket shells, 360° spherical Kamuro willow canopy detonation,
// crystallizing into 100% LEGIBLE, RAZOR-SHARP "HAPPY NEW YEAR 2027" TYPOGRAPHY.
// =========================================================================
// =========================================================================
// MASTER SILHOUETTE 3: MIDNIGHT FIREWORKS BURST TO "HAPPY NEW YEAR 2027" (TAHUN BARU 2027)
// Rocket rise -> 360° Kamuro fireworks detonation -> particles naturally disperse & fade out
// -> Clean, magnificent golden typography reveals -> text dissolves with lens flare burst
// -> Cascades into golden stardust sparks that seamlessly loop back!
// =========================================================================
function drawMidnightFireworksNye2027Reveal(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.48;
  const scale = width / 1920;
  const count = Math.max(500, Math.min(1000, config.particleCount || 750));
  const glow = config.glowIntensity || 1.8;

  // 1. Layer 1: Ambient Background Champagne Bokeh & Soft Embers
  const bubbleCount = 28;
  for (let b = 0; b < bubbleCount; b++) {
    const bSeed = b * 53.71;
    const bRise = (progress * 0.4 + hash(bSeed)) % 1.0;
    const bx = cx + (hash(bSeed + 1) - 0.5) * width;
    const by = height - bRise * height;
    const bRad = (hash(bSeed + 2) * 28 + 14) * scale;
    drawBokehOrb(ctx, bx, by, bRad, 'rgba(250, 204, 21, 0.3)', 0.12);
  }

  // 2. Shockwave Ring & Starburst Flash during the BOOM (progress 0.18 to 0.38)
  if (progress >= 0.18 && progress <= 0.38) {
    const blastT = (progress - 0.18) / (0.38 - 0.18);
    const ringRadius = blastT * (width * 0.65);
    const ringAlpha = Math.sin(blastT * Math.PI);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(2, (1 - blastT) * 16 * scale);
    ctx.strokeStyle = `rgba(254, 240, 138, ${ringAlpha * 0.85})`;
    if (glow > 0) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 40 * scale * glow;
    }
    ctx.stroke();
    ctx.restore();
    drawStarGlint4Point(ctx, cx, cy, (140 * scale) * (1 - blastT), '#ffffff', ringAlpha);
  }

  // 3. Fireworks Burst Particles: Rocket Launch -> The BOOM Explosion -> Naturally Spread & Fade Out!
  for (let i = 0; i < count; i++) {
    const seed = i * 33.791;

    // Rocket launch trajectory (0.0 to 0.18)
    const rocketProg = Math.min(1, progress / 0.18);
    const rocketX = cx + (hash(seed) - 0.5) * (25 * scale);
    const rocketY = height - rocketProg * (height - cy);

    // 360° Spherical Kamuro Willow Canopy Blast
    const blastAngle = hash(seed + 1) * Math.PI * 2;
    const blastDist = (hash(seed + 2) * 0.75 + 0.25) * (width * 0.55);
    const gravityDroop = Math.pow(hash(seed + 3), 1.6) * (180 * scale);
    const willowX = cx + Math.cos(blastAngle) * blastDist;
    const willowY = cy + Math.sin(blastAngle) * (blastDist * 0.72) + gravityDroop;

    let px = cx;
    let py = cy;
    let pAlpha = 0;
    let pSize = (hash(seed + 5) * config.particleSize + 1.6) * scale;
    let pCol = (i % 3 === 0) ? '#ffffff' : (i % 2 === 0) ? '#fef08a' : '#f59e0b';

    if (progress < 0.18) {
      // Phase 1: Rising rocket sparks
      px = rocketX;
      py = rocketY;
      pAlpha = 0.85;
    } else if (progress < 0.40) {
      // Phase 2: BOOM! Detonates outward and naturally fades out
      const boomT = (progress - 0.18) / 0.22;
      const ease = 1 - Math.pow(1 - boomT, 2.5);
      px = cx + (willowX - cx) * ease;
      py = cy + (willowY - cy) * ease;
      pAlpha = (1 - boomT * 0.85); // Naturally disappears as it expands!
    } else if (progress < 0.75) {
      // Phase 3: Text is showing! Light ambient floating embers
      const ambDrift = (progress - 0.40) * 40 * scale;
      px = willowX;
      py = willowY + ambDrift;
      const twinkle = Math.sin(progress * Math.PI * 12 + seed) * 0.15 + 0.15;
      pAlpha = twinkle;
    } else {
      // Phase 4: Text shatters! Erupts into new cascade of falling golden sparks (Seamless Loop Reset)
      const resetT = (progress - 0.75) / 0.25;
      const burstR = (hash(seed + 6) * 0.6 + 0.4) * (width * 0.45);
      const shatterAngle = hash(seed + 7) * Math.PI * 2;
      const sX = cx + Math.cos(shatterAngle) * burstR * resetT;
      const sY = cy + Math.sin(shatterAngle) * burstR * resetT + resetT * resetT * (260 * scale);
      px = sX;
      py = sY;
      pAlpha = (1 - resetT) * 0.85;
      pCol = '#fde047';
      pSize *= 1.2;
    }

    if (pAlpha > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.5, pSize), 0, Math.PI * 2);
      ctx.fillStyle = pCol;
      ctx.globalAlpha = Math.max(0, Math.min(1, pAlpha));
      if (glow > 0) {
        ctx.shadowColor = pCol;
        ctx.shadowBlur = pSize * 3 * glow;
      }
      ctx.fill();
      ctx.restore();
    }
  }

  // 4. CLEAN, CINEMATIC TYPOGRAPHY REVEAL (Progress 0.30 to 0.82)
  if (progress >= 0.30 && progress <= 0.82) {
    const textT =
      progress < 0.42
        ? (progress - 0.30) / 0.12 // Fade in & scale in
        : progress > 0.72
        ? (0.82 - progress) / 0.10 // Fade out & shatter
        : 1.0;
    const textAlpha = Math.sin(Math.min(1, Math.max(0, textT)) * Math.PI * 0.5);

    // Slow cinematic drift scale (0.96 to 1.03)
    const driftScale = 0.96 + ((progress - 0.30) / 0.52) * 0.07;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(driftScale, driftScale);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top: "HAPPY NEW YEAR"
    const topFontSize = Math.round(82 * scale);
    ctx.font = `900 ${topFontSize}px 'Cinzel', 'Outfit', sans-serif`;

    // Golden metallic vertical gradient fill
    const topGrad = ctx.createLinearGradient(0, -95 * scale, 0, -35 * scale);
    topGrad.addColorStop(0, '#ffffff');
    topGrad.addColorStop(0.35, '#fef08a');
    topGrad.addColorStop(0.70, '#facc15');
    topGrad.addColorStop(1, '#ca8a04');

    ctx.fillStyle = topGrad;
    ctx.globalAlpha = textAlpha;
    if (glow > 0) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 35 * scale * glow;
    }
    ctx.fillText('HAPPY NEW YEAR', 0, -65 * scale);

    // Fine gold bevel stroke
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeText('HAPPY NEW YEAR', 0, -65 * scale);

    // Bottom: Monumental "2027"
    const numFontSize = Math.round(168 * scale);
    ctx.font = `900 ${numFontSize}px 'Outfit', 'Cinzel', sans-serif`;

    const numGrad = ctx.createLinearGradient(0, 10 * scale, 0, 120 * scale);
    numGrad.addColorStop(0, '#ffffff');
    numGrad.addColorStop(0.4, '#fef08a');
    numGrad.addColorStop(0.8, '#f59e0b');
    numGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = numGrad;
    if (glow > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 45 * scale * glow;
    }
    ctx.fillText('2027', 0, 65 * scale);

    // Fine bevel stroke
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2 * scale;
    ctx.strokeText('2027', 0, 65 * scale);

    // Specular Lens Shine Sweep (glides smoothly across text from left to right)
    const sweepProgress = (progress - 0.38) / (0.68 - 0.38);
    if (sweepProgress >= 0 && sweepProgress <= 1) {
      const sweepX = (sweepProgress * 2 - 1) * (width * 0.35);
      drawStarGlint4Point(ctx, sweepX, -65 * scale, 45 * scale, '#ffffff', textAlpha * 0.95);
      drawStarGlint4Point(ctx, sweepX + 40 * scale, 65 * scale, 55 * scale, '#ffffff', textAlpha * 0.95);
    }

    ctx.restore();
  }

  // Climax text shatter burst flash (progress 0.72 to 0.78)
  if (progress >= 0.72 && progress <= 0.78) {
    const flashT = (progress - 0.72) / (0.78 - 0.72);
    const flashAlpha = Math.sin(flashT * Math.PI);
    drawStarGlint4Point(ctx, cx, cy, (160 * scale) * flashAlpha, '#ffffff', flashAlpha);
  }

  if (config.showText) {
    drawTextOverlay(ctx, config, time, progress, width, height);
  }
}

// =========================================================================
// MASTER SILHOUETTE 4: COSMIC RIBBON WREATH TO "MERRY CHRISTMAS" (NATAL 2026)
// Ribbon wreath swirls in -> bursts outward -> particles naturally disperse & fade out
// -> Clean, magnificent "MERRY CHRISTMAS" serif typography reveals with Crown Star
// -> Dissolves into golden snowfall cascade that seamlessly loops back!
// =========================================================================
function drawCosmicRibbonMerryChristmasReveal(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.48;
  const scale = width / 1920;
  const count = Math.max(500, Math.min(1000, config.particleCount || 780));
  const glow = config.glowIntensity || 1.7;

  // 1. Ambient Background Frost Glints
  const glintCount = 28;
  for (let g = 0; g < glintCount; g++) {
    const gSeed = g * 71.39;
    const gx = hash(gSeed) * width;
    const gy = hash(gSeed + 1) * height;
    const gTwinkle = Math.sin(progress * Math.PI * 6 + gSeed) * 0.5 + 0.5;
    drawStarGlint4Point(ctx, gx, gy, (12 * scale) * gTwinkle, '#fef08a', gTwinkle * 0.6);
  }

  // 2. Cosmic Ribbon Wreath Particles: Swirls into circular wreath -> bursts outward -> dissolves naturally!
  for (let i = 0; i < count; i++) {
    const seed = i * 25.931;

    // Wreath trajectory (0.0 to 0.22)
    const wreathTurns = 2.5;
    const wreathAngle = hash(seed + 1) * Math.PI * 2 * wreathTurns + progress * Math.PI * 2 * 0.8;
    const wreathR = (220 + hash(seed + 2) * 50) * scale;
    const wx = cx + Math.cos(wreathAngle) * wreathR;
    const wy = cy + Math.sin(wreathAngle) * (wreathR * 0.55);

    // Burst outward vectors (0.22 to 0.40)
    const burstDist = (hash(seed + 3) * 0.7 + 0.3) * (width * 0.5);
    const burstAngle = hash(seed + 4) * Math.PI * 2;
    const bx = cx + Math.cos(burstAngle) * burstDist;
    const by = cy + Math.sin(burstAngle) * (burstDist * 0.6);

    let px = cx;
    let py = cy;
    let pAlpha = 0;
    let pSize = (hash(seed + 5) * config.particleSize + 1.6) * scale;
    let pCol = (i % 3 === 0) ? '#ffffff' : (i % 2 === 0) ? '#fef08a' : '#f59e0b';

    if (progress < 0.22) {
      // Phase 1: Swirling in to form luminous wreath
      const t = progress / 0.22;
      const ease = t * t * (3 - 2 * t);
      const ambX = cx + Math.cos(seed) * (width * 0.45);
      const ambY = cy + Math.sin(seed) * (height * 0.45);
      px = ambX + (wx - ambX) * ease;
      py = ambY + (wy - ambY) * ease;
      pAlpha = 0.4 + ease * 0.6;
    } else if (progress < 0.40) {
      // Phase 2: Wreath bursts outward and naturally dissolves!
      const burstT = (progress - 0.22) / 0.18;
      const ease = Math.pow(burstT, 1.6);
      px = wx + (bx - wx) * ease;
      py = wy + (by - wy) * ease;
      pAlpha = (1 - burstT * 0.85); // Naturally disappears as it spreads!
    } else if (progress < 0.75) {
      // Phase 3: Text is visible! Gentle drifting diamond stardust surrounding text
      const driftT = (progress - 0.40) * 30 * scale;
      px = bx;
      py = by + driftT;
      pAlpha = Math.sin(progress * Math.PI * 8 + seed) * 0.15 + 0.15;
    } else {
      // Phase 4: Text dissolves into golden snowfall cascade (Seamless Loop Reset)
      const resetT = (progress - 0.75) / 0.25;
      const ease = resetT * resetT;
      const snowX = cx + (hash(seed + 6) - 0.5) * (width * 0.7);
      const snowY = cy + resetT * (height * 0.55);
      px = bx + (snowX - bx) * resetT;
      py = by + (snowY - by) * ease;
      pAlpha = (1 - resetT) * 0.85;
      pCol = '#fef08a';
    }

    if (pAlpha > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.5, pSize), 0, Math.PI * 2);
      ctx.fillStyle = pCol;
      ctx.globalAlpha = Math.max(0, Math.min(1, pAlpha));
      if (glow > 0) {
        ctx.shadowColor = pCol;
        ctx.shadowBlur = pSize * 3 * glow;
      }
      ctx.fill();
      ctx.restore();
    }
  }

  // 3. Wreath Burst Flash (progress 0.22 to 0.34)
  if (progress >= 0.22 && progress <= 0.34) {
    const flashT = (progress - 0.22) / (0.34 - 0.22);
    const flashAlpha = Math.sin(flashT * Math.PI);
    drawStarGlint4Point(ctx, cx, cy, (140 * scale) * flashAlpha, '#ffffff', flashAlpha);
  }

  // 4. CLEAN, CINEMATIC "MERRY CHRISTMAS" TYPOGRAPHY REVEAL (Progress 0.30 to 0.82)
  if (progress >= 0.30 && progress <= 0.82) {
    const textT =
      progress < 0.42
        ? (progress - 0.30) / 0.12
        : progress > 0.72
        ? (0.82 - progress) / 0.10
        : 1.0;
    const textAlpha = Math.sin(Math.min(1, Math.max(0, textT)) * Math.PI * 0.5);

    // Cinematic slow scale drift (0.96 to 1.03)
    const driftScale = 0.96 + ((progress - 0.30) / 0.52) * 0.07;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(driftScale, driftScale);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Crown Star of Bethlehem Glint atop MERRY
    drawStarGlint4Point(ctx, 0, -145 * scale, 45 * scale, '#ffffff', textAlpha * 0.95);
    drawStarGlint4Point(ctx, 0, -145 * scale, 75 * scale, '#fef08a', textAlpha * 0.6);

    // Top: "MERRY" (Regal Serif)
    const topFontSize = Math.round(92 * scale);
    ctx.font = `bold ${topFontSize}px 'Cinzel', serif`;

    const merryGrad = ctx.createLinearGradient(0, -110 * scale, 0, -45 * scale);
    merryGrad.addColorStop(0, '#ffffff');
    merryGrad.addColorStop(0.35, '#fef08a');
    merryGrad.addColorStop(0.70, '#facc15');
    merryGrad.addColorStop(1, '#ca8a04');

    ctx.fillStyle = merryGrad;
    ctx.globalAlpha = textAlpha;
    if (glow > 0) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 35 * scale * glow;
    }
    ctx.fillText('MERRY', 0, -70 * scale);

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeText('MERRY', 0, -70 * scale);

    // Bottom: "CHRISTMAS" (Grand Monumental Serif)
    const botFontSize = Math.round(135 * scale);
    ctx.font = `bold ${botFontSize}px 'Cinzel', serif`;

    const xmasGrad = ctx.createLinearGradient(0, -10 * scale, 0, 90 * scale);
    xmasGrad.addColorStop(0, '#ffffff');
    xmasGrad.addColorStop(0.40, '#fef08a');
    xmasGrad.addColorStop(0.75, '#f59e0b');
    xmasGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = xmasGrad;
    if (glow > 0) {
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 45 * scale * glow;
    }
    ctx.fillText('CHRISTMAS', 0, 40 * scale);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2 * scale;
    ctx.strokeText('CHRISTMAS', 0, 40 * scale);

    // Specular Shine Sweep across letters
    const sweepProgress = (progress - 0.38) / (0.68 - 0.38);
    if (sweepProgress >= 0 && sweepProgress <= 1) {
      const sweepX = (sweepProgress * 2 - 1) * (width * 0.38);
      drawStarGlint4Point(ctx, sweepX, -70 * scale, 45 * scale, '#ffffff', textAlpha * 0.95);
      drawStarGlint4Point(ctx, sweepX + 35 * scale, 40 * scale, 60 * scale, '#ffffff', textAlpha * 0.95);
    }

    ctx.restore();
  }

  // Climax text dissolve starburst flash (progress 0.72 to 0.78)
  if (progress >= 0.72 && progress <= 0.78) {
    const flashT = (progress - 0.72) / (0.78 - 0.72);
    const flashAlpha = Math.sin(flashT * Math.PI);
    drawStarGlint4Point(ctx, cx, cy, (160 * scale) * flashAlpha, '#ffffff', flashAlpha);
  }

  if (config.showText) {
    drawTextOverlay(ctx, config, time, progress, width, height);
  }
}



