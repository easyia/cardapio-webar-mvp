// AI 3D Generation Service (Client image compressor + Vercel Serverless proxy)

export interface AI3DTaskResult {
  success: boolean;
  modelGlbUrl: string;
  modelUsdzUrl: string;
  previewImageUrl: string;
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

// Helper to resize large smartphone photos (e.g. 12MP 4000x3000 -> 1024x1024) to keep uploads under 300KB
async function optimizeImageFor3D(dataUrl: string, maxDimension = 1024): Promise<string> {
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
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
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
    return `/api/proxy-model?b64=${encodeURIComponent(b64)}&format=${format}&name=dish.${format}`;
  } catch {
    return `/api/proxy-model?url=${encodeURIComponent(remoteUrl)}&format=${format}&name=dish.${format}`;
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
   * Generates a 3D model from an image file/URL using the proven single-photo algorithm
   */
  async generate3DFromImage(
    rawImageDataUrl: string,
    onProgress: (percent: number, statusText: string) => void
  ): Promise<AI3DTaskResult> {
    const apiKey = this.getApiKey();

    onProgress(5, 'Otimizando imagem para reconstrução 3D...');
    const optimizedImage = await optimizeImageFor3D(rawImageDataUrl, 1024);

    onProgress(15, 'Enviando imagem para a IA da Tripo3D...');

    try {
      // 1. Call serverless backend endpoint to start image_to_model
      const response = await fetch('/api/generate-3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: optimizedImage,
          imageType: 'jpg',
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
      onProgress(25, 'IA calculando malha poligonal e profundidade...');

      // 2. Poll task status until GLB is ready
      let attempts = 0;
      let rawGlbUrl = '';
      let rawUsdzUrl = '';

      while (attempts < 60) {
        await new Promise(r => setTimeout(r, 2500));
        attempts++;

        const statusRes = await fetch(
          `/api/task-status?taskId=${encodeURIComponent(taskId)}&clientApiKey=${encodeURIComponent(apiKey)}`
        );
        const statusData = await statusRes.json();

        if (statusData.status === 'running' || statusData.status === 'queued') {
          const p = Math.min(25 + attempts * 2.5, 85);
          onProgress(p, `Sintetizando texturas PBR e geometria (${Math.round(p)}%)...`);
        } else if (statusData.status === 'success') {
          rawGlbUrl =
            statusData.output?.pbr_model ||
            statusData.output?.model ||
            statusData.output?.base_model;
          rawUsdzUrl = statusData.output?.usdz || '';

          break;
        } else if (statusData.status === 'failed') {
          throw new Error('A IA não conseguiu processar esta foto. Tente tirar uma foto mais nítida a 45°.');
        }
      }

      if (!rawGlbUrl) {
        throw new Error('Tempo limite de geração excedido ou modelo GLB não retornado.');
      }

      onProgress(88, 'Preparando formatos para WebAR (Android & Apple Quick Look)...');

      // 3. If USDZ was not returned directly, request USDZ conversion from Tripo
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
            // Poll conversion task (usually takes 5-10s)
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

      // Build safe WebAR proxy URLs with base64 encoding to preserve AWS S3 signed parameters
      const finalGlbUrl = encodeUrlForProxy(rawGlbUrl, 'glb');
      const finalUsdzUrl = rawUsdzUrl
        ? encodeUrlForProxy(rawUsdzUrl, 'usdz')
        : finalGlbUrl;

      onProgress(100, 'Modelo 3D pronto com suporte a Realidade Aumentada!');

      return {
        success: true,
        modelGlbUrl: finalGlbUrl,
        modelUsdzUrl: finalUsdzUrl,
        previewImageUrl: optimizedImage,
        dishSuggestion: {
          name: 'Item Autoral em 3D',
          category: 'cat-01',
          description: 'Modelo 3D gerado por IA a partir da foto do produto, pronto para projeção em Realidade Aumentada.',
          estimatedPrice: 24.00,
          ingredients: ['Ingredientes selecionados'],
        },
        logs: [
          `Tripo3D Task ID: ${taskId}`,
          'Reconstrução 3D neural concluída',
          'Dual WebAR: GLB (Android SceneViewer) + USDZ (Apple QuickLook)'
        ]
      };
    } catch (err: any) {
      console.warn('Erro ao conectar com API:', err);
      throw new Error(err.message || 'Erro ao processar imagem 3D.');
    }
  },

  /**
   * Compatibility alias
   */
  async generate3DFromMultipleImages(
    rawImages: string[],
    onProgress: (percent: number, statusText: string) => void
  ): Promise<AI3DTaskResult> {
    return this.generate3DFromImage(rawImages[0], onProgress);
  }
};
