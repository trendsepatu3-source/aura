import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import JSZip from 'jszip';
import { MotionConfig, RESOLUTION_PRESETS, ExportFormat, RenderProgress } from '../types/motion';
import { drawMotionGraphicFrame } from './motionEngine';

export interface ExportOptions {
  config: MotionConfig;
  format: ExportFormat;
  onProgress: (progress: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
}

export async function exportMotionGraphicVideo({
  config,
  format,
  onProgress,
  shouldAbort,
  loadedTextures,
}: ExportOptions): Promise<{ blob: Blob; fileName: string }> {
  const res = RESOLUTION_PRESETS[config.resolution];
  const width = res.width;
  const height = res.height;
  const fps = config.fps;
  const duration = config.durationSeconds;
  const totalFrames = Math.round(duration * fps);
  const bitrate = config.bitrateMbps * 1_000_000;

  const startTime = performance.now();

  // Create high-res offscreen rendering canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', {
    alpha: true,
    willReadFrequently: false,
    colorSpace: 'srgb',
  });

  if (!ctx) {
    throw new Error('Gagal menginisialisasi 2D Canvas context untuk resolusi 4K');
  }

  // Check if WebCodecs VideoEncoder is supported and format is MP4
  const hasWebCodecs = typeof window !== 'undefined' && 'VideoEncoder' in window && 'VideoFrame' in window;

  if (format === 'mp4' && hasWebCodecs) {
    try {
      return await renderWithWebCodecsMp4({
        canvas,
        ctx,
        config,
        width,
        height,
        fps,
        totalFrames,
        bitrate,
        startTime,
        onProgress,
        shouldAbort,
        loadedTextures,
      });
    } catch (webCodecsError) {
      if (shouldAbort()) {
        throw new Error('Render dibatalkan oleh pengguna');
      }

      console.warn(
        'WebCodecs VideoEncoder creation/runtime error. Falling back automatically to universal MediaRecorder engine:',
        webCodecsError
      );

      onProgress({
        isRendering: true,
        currentFrame: 0,
        totalFrames,
        percentage: 0,
        fps: 0,
        elapsedTime: Math.round((performance.now() - startTime) / 1000),
        estimatedRemaining: 0,
        statusText: 'Beralih ke Universal MediaRecorder Engine...',
      });

      return await renderWithMediaRecorder({
        canvas,
        ctx,
        config,
        width,
        height,
        fps,
        totalFrames,
        bitrate,
        format: 'mp4',
        startTime,
        onProgress,
        shouldAbort,
        loadedTextures,
      });
    }
  } else if (format === 'png_sequence') {
    return await renderPngSequenceZip({
      canvas,
      ctx,
      config,
      width,
      height,
      fps,
      totalFrames,
      startTime,
      onProgress,
      shouldAbort,
      loadedTextures,
    });
  } else {
    // MediaRecorder deterministic step export (MP4 or WebM)
    return await renderWithMediaRecorder({
      canvas,
      ctx,
      config,
      width,
      height,
      fps,
      totalFrames,
      bitrate,
      format,
      startTime,
      onProgress,
      shouldAbort,
      loadedTextures,
    });
  }
}

// ----------------------------------------------------------------------
// Codec Negotiation Helper for WebCodecs
// ----------------------------------------------------------------------
async function probeEncoderConfig(config: any): Promise<boolean> {
  if (typeof window === 'undefined' || !('VideoEncoder' in window)) return false;
  try {
    let hadError = false;
    const testEnc = new (window as any).VideoEncoder({
      output: () => {},
      error: () => {
        hadError = true;
      },
    });
    testEnc.configure(config);
    // Give microtask tick to catch immediate configure error
    await new Promise((r) => setTimeout(r, 10));
    if (hadError || (testEnc.state as string) === 'closed') {
      try { testEnc.close(); } catch {}
      return false;
    }
    try { testEnc.close(); } catch {}
    return true;
  } catch {
    return false;
  }
}

async function negotiateSupportedCodec(
  width: number,
  height: number,
  fps: number,
  bitrate: number
): Promise<{ config: any; muxerCodec: 'avc' | 'vp9' | 'av1' } | null> {
  if (typeof window === 'undefined' || !('VideoEncoder' in window)) {
    return null;
  }

  const VideoEncoderClass = (window as any).VideoEncoder;
  if (!VideoEncoderClass || typeof VideoEncoderClass.isConfigSupported !== 'function') {
    return null;
  }

  const is4K = width >= 3840 || height >= 2160;

  // STRICT CODEC PROFILES:
  // For 4K UHD (3840x2160), Level 5.1 covers 4096x2304 @ 60fps cleanly.
  // Main Profile (avc1.4d...) and Baseline (avc1.42...) have near-universal hardware + OpenH264 support.
  const codecCandidates: Array<{ codec: string; muxerCodec: 'avc' | 'vp9' | 'av1' }> = is4K
    ? [
        { codec: 'avc1.4d0033', muxerCodec: 'avc' }, // Main Profile Level 5.1 (Native 4K 60fps - Highest Hardware Compatibility)
        { codec: 'avc1.640033', muxerCodec: 'avc' }, // High Profile Level 5.1 (Native 4K 60fps)
        { codec: 'avc1.420033', muxerCodec: 'avc' }, // Baseline Profile Level 5.1 (Universal 4K 60fps fallback)
        { codec: 'avc1.4d0034', muxerCodec: 'avc' }, // Main Profile Level 5.2
        { codec: 'avc1.640034', muxerCodec: 'avc' }, // High Profile Level 5.2
        { codec: 'avc1.420034', muxerCodec: 'avc' }, // Baseline Profile Level 5.2
        { codec: 'vp09.00.50.08', muxerCodec: 'vp9' }, // VP9 Profile 0 Level 5.0 (Native 4K 60fps)
        { codec: 'vp09.00.41.08', muxerCodec: 'vp9' }, // VP9 Profile 0 Level 4.1
      ]
    : [
        { codec: 'avc1.4d002a', muxerCodec: 'avc' }, // Main Profile Level 4.2 (1080p 60fps)
        { codec: 'avc1.64002a', muxerCodec: 'avc' }, // High Profile Level 4.2 (1080p 60fps)
        { codec: 'avc1.42002a', muxerCodec: 'avc' }, // Baseline Profile Level 4.2
        { codec: 'avc1.4d0033', muxerCodec: 'avc' }, // Main Profile Level 5.1
        { codec: 'avc1.640033', muxerCodec: 'avc' }, // High Profile Level 5.1
        { codec: 'vp09.00.41.08', muxerCodec: 'vp9' }, // VP9 Profile 0 Level 4.1
        { codec: 'vp09.00.10.08', muxerCodec: 'vp9' }, // VP9 Profile 0 Level 1.0
      ];

  const accelPreferences: ('no-preference' | 'prefer-hardware' | 'prefer-software')[] = [
    'no-preference',
    'prefer-hardware',
    'prefer-software',
  ];

  // Target Bitrate: pristine quality without overloading memory buffers
  const targetBitrate = Math.min(
    Math.max(bitrate, is4K ? 45_000_000 : 18_000_000),
    is4K ? 75_000_000 : 35_000_000
  );

  // PASS 1: realtime latencyMode + constant bitrate
  // CRITICAL: latencyMode: 'realtime' eliminates B-frames and ensures DTS == PTS monotonically.
  // bitrateMode: 'constant' prevents rate-control buffer collapse at second 3!
  for (const accel of accelPreferences) {
    for (const cand of codecCandidates) {
      try {
        const testConfig: any = {
          codec: cand.codec,
          width,
          height,
          bitrate: targetBitrate,
          framerate: fps,
          hardwareAcceleration: accel,
          latencyMode: 'realtime',
          bitrateMode: 'constant',
        };

        const result = await VideoEncoderClass.isConfigSupported(testConfig);
        if (result && result.supported && result.config) {
          const finalConfig = {
            ...result.config,
            bitrate: targetBitrate,
            latencyMode: 'realtime',
            bitrateMode: 'constant',
          };
          // Verify with actual live encoder probe before committing
          const canInit = await probeEncoderConfig(finalConfig);
          if (canInit) {
            return {
              config: finalConfig,
              muxerCodec: cand.muxerCodec,
            };
          }
        }
      } catch {
        // Continue searching
      }
    }
  }

  // PASS 2: realtime latencyMode + variable bitrate (if constant CBR was unsupported by hardware)
  for (const accel of accelPreferences) {
    for (const cand of codecCandidates) {
      try {
        const testConfig: any = {
          codec: cand.codec,
          width,
          height,
          bitrate: targetBitrate,
          framerate: fps,
          hardwareAcceleration: accel,
          latencyMode: 'realtime',
          bitrateMode: 'variable',
        };

        const result = await VideoEncoderClass.isConfigSupported(testConfig);
        if (result && result.supported && result.config) {
          const finalConfig = {
            ...result.config,
            bitrate: targetBitrate,
            latencyMode: 'realtime',
            bitrateMode: 'variable',
          };
          const canInit = await probeEncoderConfig(finalConfig);
          if (canInit) {
            return {
              config: finalConfig,
              muxerCodec: cand.muxerCodec,
            };
          }
        }
      } catch {
        // Continue searching
      }
    }
  }

  // PASS 3: standard fallback without explicit latencyMode/bitrateMode
  for (const accel of accelPreferences) {
    for (const cand of codecCandidates) {
      try {
        const testConfig: any = {
          codec: cand.codec,
          width,
          height,
          bitrate: targetBitrate,
          framerate: fps,
          hardwareAcceleration: accel,
        };

        const result = await VideoEncoderClass.isConfigSupported(testConfig);
        if (result && result.supported && result.config) {
          const finalConfig = {
            ...result.config,
            bitrate: targetBitrate,
          };
          const canInit = await probeEncoderConfig(finalConfig);
          if (canInit) {
            return {
              config: finalConfig,
              muxerCodec: cand.muxerCodec,
            };
          }
        }
      } catch {
        // Continue searching
      }
    }
  }

  return null;
}

// ----------------------------------------------------------------------
// 1. WebCodecs + mp4-muxer Engine (Pristine 4K H.264 offline encoding)
// ----------------------------------------------------------------------
async function renderWithWebCodecsMp4({
  canvas,
  ctx,
  config,
  width,
  height,
  fps,
  totalFrames,
  bitrate,
  startTime,
  onProgress,
  shouldAbort,
  loadedTextures,
}: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  bitrate: number;
  startTime: number;
  onProgress: (p: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
}): Promise<{ blob: Blob; fileName: string }> {
  // 1. Negotiate supported codec and acceleration
  const negotiated = await negotiateSupportedCodec(width, height, fps, bitrate);
  if (!negotiated) {
    throw new Error('WebCodecs VideoEncoder tidak mendukung encoding konfigurasi ini di browser Anda.');
  }

  const target = new ArrayBufferTarget();

  const muxer = new Muxer({
    target,
    video: {
      codec: negotiated.muxerCodec,
      width,
      height,
      frameRate: fps,
    },
    fastStart: 'in-memory',
    firstTimestampBehavior: 'strict',
  });

  let encoderError: Error | null = null;

  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      try {
        muxer.addVideoChunk(chunk, meta);
      } catch (err) {
        encoderError = err as Error;
      }
    },
    error: (e) => {
      encoderError = e instanceof Error ? e : new Error(String((e as any)?.message || e));
      console.warn('VideoEncoder error callback:', e);
    },
  });

  try {
    encoder.configure(negotiated.config);
  } catch (err) {
    try {
      if (encoder.state !== 'closed') encoder.close();
    } catch {}
    throw err;
  }

  // Brief tick to detect immediate asynchronous configure failure
  await new Promise((resolve) => setTimeout(resolve, 35));
  if (encoderError) {
    try {
      if (encoder.state !== 'closed') encoder.close();
    } catch {}
    throw encoderError;
  }

  const frameDurationUs = Math.round(1_000_000 / fps);

  for (let frame = 0; frame < totalFrames; frame++) {
    if (shouldAbort()) {
      try {
        if (encoder.state !== 'closed') encoder.close();
      } catch {}
      throw new Error('Render dibatalkan oleh pengguna');
    }

    if (encoderError) {
      try {
        if (encoder.state !== 'closed') encoder.close();
      } catch {}
      throw encoderError;
    }

    if (encoder.state === 'closed') {
      throw new Error('VideoEncoder terminated unexpectedly');
    }

    const timeSec = frame / fps;
    const progress = frame / totalFrames;

    // Draw frame deterministically at exact timestamp
    drawMotionGraphicFrame({
      ctx,
      config,
      time: timeSec,
      progress,
      width,
      height,
      loadedTextures,
      isExportingOffline: true,
    });

    // Exact microsecond timestamp without drift
    const timestampUs = Math.round((frame * 1_000_000) / fps);
    const videoFrame = new VideoFrame(canvas, {
      timestamp: timestampUs,
      duration: frameDurationUs,
    });

    // Microstock Golden Standard: Keyframe every 30 frames (0.5s at 60fps, 1.0s at 30fps)
    // Refreshes the decoder's Decoded Picture Buffer (DPB), completely preventing any
    // macroblock drift, pixelation, or corruption at second 3!
    const keyFrameInterval = Math.max(15, Math.min(fps, 30));
    const keyFrame = frame % keyFrameInterval === 0;
    try {
      encoder.encode(videoFrame, { keyFrame });
    } finally {
      videoFrame.close();
    }

    // Backpressure control: keep queue flowing smoothly without stalling encoder pipeline
    while (encoder.encodeQueueSize > 6 && !encoderError && (encoder.state as string) !== 'closed') {
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 8);
        encoder.addEventListener(
          'dequeue',
          () => {
            clearTimeout(timer);
            resolve();
          },
          { once: true }
        );
      });
    }

    // Report progress
    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const framesDone = frame + 1;
    const currentFps = elapsed > 0 ? Math.round((framesDone / elapsed) * 10) / 10 : 0;
    const remainingSec = currentFps > 0 ? Math.round((totalFrames - framesDone) / currentFps) : 0;

    let previewUrl: string | undefined = undefined;
    // Only generate preview snapshot every 15 frames to conserve CPU
    if (frame % 15 === 0 || frame === totalFrames - 1) {
      previewUrl = createScaledPreview(canvas);
    }

    onProgress({
      isRendering: true,
      currentFrame: framesDone,
      totalFrames,
      percentage: Math.round((framesDone / totalFrames) * 100),
      fps: currentFps,
      elapsedTime: Math.round(elapsed),
      estimatedRemaining: remainingSec,
      previewDataUrl: previewUrl,
      statusText: `Rendering 4K H.264: Frame ${framesDone}/${totalFrames} (${currentFps} fps)`,
    });

    // Yield small tick to UI thread
    if (frame % 3 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  await encoder.flush();
  try {
    if (encoder.state !== 'closed') encoder.close();
  } catch {}
  muxer.finalize();

  const buffer = target.buffer;
  const blob = new Blob([buffer], { type: 'video/mp4' });
  const fileName = `auramotion_4k_${config.templateId}_${Date.now()}.mp4`;

  return { blob, fileName };
}

// ----------------------------------------------------------------------
// 2. MediaRecorder Deterministic Stepper Engine (Fallback & WebM)
// ----------------------------------------------------------------------
async function renderWithMediaRecorder({
  canvas,
  ctx,
  config,
  width,
  height,
  fps,
  totalFrames,
  bitrate,
  format,
  startTime,
  onProgress,
  shouldAbort,
  loadedTextures,
}: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  bitrate: number;
  format: ExportFormat;
  startTime: number;
  onProgress: (p: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
}): Promise<{ blob: Blob; fileName: string }> {
  // Determine best mimeType
  const mimeType = getOptimalMimeType(format);

  // Use captureStream(0) for manual deterministic frame triggering via requestFrame()
  // Passing a positive FPS forces real-time timer capturing which tears half-drawn 4K frames
  const stream = typeof canvas.captureStream === 'function' ? canvas.captureStream(0) : (canvas as any).captureStream();
  const videoTrack = stream.getVideoTracks()[0];

  const is4K = width >= 3840 || height >= 2160;
  const targetMediaBitrate = Math.min(bitrate, is4K ? 30_000_000 : 15_000_000);

  let recorder: MediaRecorder;
  try {
    recorder = mimeType
      ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: targetMediaBitrate })
      : new MediaRecorder(stream);
  } catch {
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      recorder = new MediaRecorder(stream);
    }
  }

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const actualMime = recorder.mimeType || mimeType || 'video/mp4';
      const blob = new Blob(chunks, { type: actualMime });
      resolve(blob);
    };
    recorder.onerror = (e) => reject(e);
  });

  // Start continuous recording (avoid micro-timeslice fragmentation)
  recorder.start();

  const frameIntervalMs = 1000 / fps;

  for (let frame = 0; frame < totalFrames; frame++) {
    if (shouldAbort()) {
      if (recorder.state === 'recording') {
        try { recorder.stop(); } catch {}
      }
      throw new Error('Render dibatalkan oleh pengguna');
    }

    const timeSec = frame / fps;
    const progress = frame / totalFrames;

    drawMotionGraphicFrame({
      ctx,
      config,
      time: timeSec,
      progress,
      width,
      height,
      loadedTextures,
      isExportingOffline: true,
    });

    // Request frame on track deterministically only after drawing is 100% complete
    if (videoTrack && typeof (videoTrack as any).requestFrame === 'function') {
      try {
        (videoTrack as any).requestFrame();
      } catch {}
    }

    // Wait frame duration for deterministic capture
    await new Promise((r) => setTimeout(r, Math.max(16, frameIntervalMs * 0.95)));

    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const framesDone = frame + 1;
    const currentFps = elapsed > 0 ? Math.round((framesDone / elapsed) * 10) / 10 : 0;
    const remainingSec = currentFps > 0 ? Math.round((totalFrames - framesDone) / currentFps) : 0;

    let previewUrl: string | undefined = undefined;
    if (frame % 15 === 0 || frame === totalFrames - 1) {
      previewUrl = createScaledPreview(canvas);
    }

    onProgress({
      isRendering: true,
      currentFrame: framesDone,
      totalFrames,
      percentage: Math.round((framesDone / totalFrames) * 100),
      fps: currentFps,
      elapsedTime: Math.round(elapsed),
      estimatedRemaining: remainingSec,
      previewDataUrl: previewUrl,
      statusText: `Recording 4K Video: Frame ${framesDone}/${totalFrames}`,
    });
  }

  if (recorder.state === 'recording') {
    try {
      recorder.requestData();
    } catch {}
    recorder.stop();
  }

  const blob = await recordingPromise;
  const actualMime = recorder.mimeType || mimeType || '';
  const ext = actualMime.includes('mp4') ? 'mp4' : 'webm';
  const fileName = `auramotion_4k_${config.templateId}_${Date.now()}.${ext}`;

  return { blob, fileName };
}

// ----------------------------------------------------------------------
// 3. PNG Sequence ZIP (Lossless 4K with Alpha Transparency)
// ----------------------------------------------------------------------
async function renderPngSequenceZip({
  canvas,
  ctx,
  config,
  width,
  height,
  fps,
  totalFrames,
  startTime,
  onProgress,
  shouldAbort,
  loadedTextures,
}: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  startTime: number;
  onProgress: (p: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
}): Promise<{ blob: Blob; fileName: string }> {
  const zip = new JSZip();
  const framesFolder = zip.folder('4k_frames');

  for (let frame = 0; frame < totalFrames; frame++) {
    if (shouldAbort()) {
      throw new Error('Render dibatalkan oleh pengguna');
    }

    const timeSec = frame / fps;
    const progress = frame / totalFrames;

    drawMotionGraphicFrame({
      ctx,
      config,
      time: timeSec,
      progress,
      width,
      height,
      loadedTextures,
      isExportingOffline: true,
    });

    const frameBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (frameBlob && framesFolder) {
      const paddedIndex = String(frame).padStart(5, '0');
      framesFolder.file(`frame_${paddedIndex}.png`, frameBlob);
    }

    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const framesDone = frame + 1;
    const currentFps = elapsed > 0 ? Math.round((framesDone / elapsed) * 10) / 10 : 0;
    const remainingSec = currentFps > 0 ? Math.round((totalFrames - framesDone) / currentFps) : 0;

    let previewUrl: string | undefined = undefined;
    if (frame % 15 === 0 || frame === totalFrames - 1) {
      previewUrl = createScaledPreview(canvas);
    }

    onProgress({
      isRendering: true,
      currentFrame: framesDone,
      totalFrames,
      percentage: Math.round((framesDone / totalFrames) * 100),
      fps: currentFps,
      elapsedTime: Math.round(elapsed),
      estimatedRemaining: remainingSec,
      previewDataUrl: previewUrl,
      statusText: `Packaging 4K PNG Sequence: Frame ${framesDone}/${totalFrames}`,
    });

    if (frame % 3 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  onProgress({
    isRendering: true,
    currentFrame: totalFrames,
    totalFrames,
    percentage: 99,
    fps: 0,
    elapsedTime: Math.round((performance.now() - startTime) / 1000),
    estimatedRemaining: 1,
    statusText: 'Mengompresi arsip ZIP 4K kualitas tinggi...',
  });

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const fileName = `auramotion_4k_sequence_${config.templateId}_${Date.now()}.zip`;

  return { blob: zipBlob, fileName };
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
function getOptimalMimeType(preferred: ExportFormat): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }

  const supported = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];

  if (preferred === 'mp4') {
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) return 'video/mp4;codecs=avc1';
    if (MediaRecorder.isTypeSupported('video/mp4')) return 'video/mp4';
  }

  for (const mime of supported) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return 'video/webm';
}

function createScaledPreview(canvas: HTMLCanvasElement): string {
  try {
    const thumb = document.createElement('canvas');
    const scale = 240 / canvas.width;
    thumb.width = 240;
    thumb.height = Math.round(canvas.height * scale);
    const thumbCtx = thumb.getContext('2d');
    if (thumbCtx) {
      thumbCtx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
      return thumb.toDataURL('image/jpeg', 0.85);
    }
  } catch (e) {
    // Ignore preview creation error
  }
  return '';
}
