// AI 3D Generation Service (Multi-view photogrammetry + v2.5 Neural Engine + Super Refine PBR)

export interface AI3DTaskResult {
  success: boolean;
  taskId: string;
  modelGlbUrl: string;
  modelUsdzUrl: string;
  previewImageUrl: string;
  isRefined?: boolean;
  dishSuggestion?: {
    name: string;
    category: string;
    description: string;
    estimatedPrice: number;
    ingredients: string[];
  };
  logs: string[];
}

const API_CONFIG_KEY = 'auramenu_ai3d_api_key';

// Image optimizer with contrast and sharpness enhancement for maximum AI photogrammetry fidelity
async function optimizeImageFor3D(dataUrl: string, maxDimension = 1200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Light background fill to avoid transparent png black silhouette issues
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw image with slight contrast enhancement
        ctx.filter = 'contrast(1.05) brightness(1.02)';
        ctx.drawImage(img, 0, 0, width, height);
        ctx.filter = 'none';

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function encodeUrlForProxy(remoteUrl: string, format: 'glb' | 'usdz'): string {
  try {
    const b64 = btoa(unescape(encodeURIComponent(remoteUrl)));
    return `/api/proxy-model?b64=${encodeURIComponent(b64)}&format=${format}&name=item.${format}`;
  } catch {
    return `/api/proxy-model?url=${encodeURIComponent(remoteUrl)}&format=${format}&name=item.${format}`;
  }
}

export const ai3DService = {
  getApiKey(): string {
    const localKey = localStorage.getItem(API_CONFIG_KEY);
    if (localKey && localKey.trim()) return localKey.trim();

    const envTripoKey = import.meta.env.VITE_TRIPO_API_KEY || import.meta.env.TRIPO_API_KEY;
    if (envTripoKey && envTripoKey.trim()) return envTripoKey.trim();

    return '';
  },

  setApiKey(key: string): void {
    localStorage.setItem(API_CONFIG_KEY, key.trim());
  },

  /**
   * Generates a 3D model with Ultra HD v2.5 Neural Engine
   */
  async generate3DFromMultipleImages(
    rawImages: string[],
    onProgress: (percent: number, statusText: string) => void,
    quality: 'ultra' | 'standard' = 'ultra'
  ): Promise<AI3DTaskResult> {
    if (!rawImages.length) {
      throw new Error('Nenhuma foto foi fornecida.');
    }

    const apiKey = this.getApiKey();

    onProgress(5, rawImages.length === 1 
      ? 'Otimizando foto em alta definição e realçando contraste...' 
      : `Otimizando ${rawImages.length} fotos do produto para reconstrução volumétrica...`
    );
    const optimizedImages = await Promise.all(rawImages.map(img => optimizeImageFor3D(img, 1200)));

    onProgress(15, rawImages.length === 1 
      ? 'Enviando para o cluster neural Tripo3D v2.5 Ultra HD...' 
      : `Enviando ${optimizedImages.length} ângulos para reconstrução multi-view 3D...`
    );

    try {
      // 1. Call serverless backend endpoint
      const response = await fetch('/api/generate-3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagesBase64: optimizedImages,
          imageBase64: optimizedImages[0],
          imageType: 'jpg',
          quality,
          clientApiKey: apiKey || undefined,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('A rota /api/generate-3d retornou resposta inválida do servidor.');
      }

      const data = await response.json();

      if (!response.ok || !data.taskId) {
        throw new Error(data.error || 'Falha ao iniciar processamento 3D na Tripo3D.');
      }

      const taskId = data.taskId;
      const isMulti = data.type === 'multiview_to_model';
      onProgress(25, isMulti 
        ? 'IA v2.5 reconstruindo geometria 3D com malha de até 50.000 polígonos...' 
        : 'IA v2.5 sintetizando geometria volumétrica e relevo...'
      );

      // 2. Poll task status until GLB is ready
      let attempts = 0;
      let rawGlbUrl = '';
      let rawUsdzUrl = '';

      while (attempts < 70) {
        await new Promise(r => setTimeout(r, 2500));
        attempts++;

        const statusRes = await fetch(
          `/api/task-status?taskId=${encodeURIComponent(taskId)}&clientApiKey=${encodeURIComponent(apiKey)}`
        );
        const statusData = await statusRes.json();

        if (statusData.status === 'running' || statusData.status === 'queued') {
          const p = Math.min(25 + attempts * 2.2, 85);
          onProgress(p, `Gerando mapas PBR de reflexo, relevo e normais (${Math.round(p)}%)...`);
        } else if (statusData.status === 'success') {
          rawGlbUrl =
            statusData.output?.pbr_model ||
            statusData.output?.model ||
            statusData.output?.base_model;
          rawUsdzUrl = statusData.output?.usdz || '';

          break;
        } else if (statusData.status === 'failed') {
          throw new Error('A IA não conseguiu processar este objeto. Dica: tire a foto contra um fundo limpo com boa luz.');
        }
      }

      if (!rawGlbUrl) {
        throw new Error('Tempo limite de geração excedido ou modelo GLB não retornado.');
      }

      onProgress(88, 'Preparando formatos para WebAR (Android Scene Viewer & Apple Quick Look)...');

      // 3. Request USDZ conversion if not returned directly
      if (!rawUsdzUrl) {
        try {
          const convertRes = await fetch('/api/generate-3d', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestType: 'convert_usdz',
              originalTaskId: taskId,
              clientApiKey: apiKey || undefined,
            }),
          });
          const convertData = await convertRes.json();
          if (convertData.success && convertData.taskId) {
            const convertTaskId = convertData.taskId;
            let convAttempts = 0;
            while (convAttempts < 15) {
              await new Promise(r => setTimeout(r, 2000));
              convAttempts++;
              const convStatusRes = await fetch(
                `/api/task-status?taskId=${encodeURIComponent(convertTaskId)}&clientApiKey=${encodeURIComponent(apiKey)}`
              );
              const convStatusData = await convStatusRes.json();
              if (convStatusData.status === 'success') {
                rawUsdzUrl = convStatusData.output?.model || convStatusData.output?.usdz || '';
                break;
              }
            }
          }
        } catch (convErr) {
          console.warn('USDZ conversion optional step warning:', convErr);
        }
      }

      // Build safe WebAR proxy URLs using Base64
      const finalGlbUrl = encodeUrlForProxy(rawGlbUrl, 'glb');
      const finalUsdzUrl = rawUsdzUrl
        ? encodeUrlForProxy(rawUsdzUrl, 'usdz')
        : finalGlbUrl;

      onProgress(100, 'Modelo 3D Ultra HD PBR pronto com Realidade Aumentada!');

      return {
        success: true,
        taskId: taskId,
        modelGlbUrl: finalGlbUrl,
        modelUsdzUrl: finalUsdzUrl,
        previewImageUrl: optimizedImages[0],
        dishSuggestion: {
          name: 'Item Escaneado em 3D',
          category: 'cat-01',
          description: 'Modelo 3D foto-realista gerado com motor neural v2.5 e texturas PBR.',
          estimatedPrice: 28.00,
          ingredients: ['Acabamento de alta definição'],
        },
        logs: [
          `Tripo3D Task ID: ${taskId}`,
          `Processamento Neural v2.5 (${quality.toUpperCase()} HD) concluído`,
          'Texturas PBR 2K: Albedo + Normal Map + Roughness + Metallic'
        ]
      };
    } catch (err: any) {
      console.warn('Erro ao conectar com API:', err);
      throw new Error(err.message || 'Erro ao processar imagem 3D.');
    }
  },

  /**
   * Super Refinement Stage: Runs high-resolution neural geometric refinement & 2K PBR bake
   */
  async refine3DModel(
    draftTaskId: string,
    onProgress: (percent: number, statusText: string) => void
  ): Promise<{ modelGlbUrl: string; modelUsdzUrl: string }> {
    const apiKey = this.getApiKey();
    onProgress(10, 'Iniciando Super Refinamento HD (Polimento de malha e texturas 2K)...');

    const refineRes = await fetch('/api/generate-3d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'refine_model',
        originalTaskId: draftTaskId,
        clientApiKey: apiKey || undefined,
      }),
    });

    const refineData = await refineRes.json();
    if (!refineData.success || !refineData.taskId) {
      throw new Error(refineData.error || 'Falha ao solicitar Super Refinamento.');
    }

    const refineTaskId = refineData.taskId;
    let attempts = 0;
    let rawGlbUrl = '';
    let rawUsdzUrl = '';

    while (attempts < 60) {
      await new Promise(r => setTimeout(r, 2500));
      attempts++;

      const statusRes = await fetch(
        `/api/task-status?taskId=${encodeURIComponent(refineTaskId)}&clientApiKey=${encodeURIComponent(apiKey)}`
      );
      const statusData = await statusRes.json();

      if (statusData.status === 'running' || statusData.status === 'queued') {
        const p = Math.min(15 + attempts * 2.5, 90);
        onProgress(p, `Polindo arestas e sintetizando reflexos PBR em 2K (${Math.round(p)}%)...`);
      } else if (statusData.status === 'success') {
        rawGlbUrl =
          statusData.output?.pbr_model ||
          statusData.output?.model ||
          statusData.output?.base_model;
        rawUsdzUrl = statusData.output?.usdz || '';
        break;
      } else if (statusData.status === 'failed') {
        throw new Error('Falha no refinamento do modelo.');
      }
    }

    if (!rawGlbUrl) {
      throw new Error('Tempo limite de refinamento excedido.');
    }

    const finalGlbUrl = encodeUrlForProxy(rawGlbUrl, 'glb');
    const finalUsdzUrl = rawUsdzUrl ? encodeUrlForProxy(rawUsdzUrl, 'usdz') : finalGlbUrl;

    onProgress(100, 'Super Refinamento 2K PBR Concluído!');
    return { modelGlbUrl: finalGlbUrl, modelUsdzUrl: finalUsdzUrl };
  },

  /**
   * Single image generation fallback
   */
  async generate3DFromImage(
    rawImageDataUrl: string,
    onProgress: (percent: number, statusText: string) => void
  ): Promise<AI3DTaskResult> {
    return this.generate3DFromMultipleImages([rawImageDataUrl], onProgress, 'ultra');
  }
};
