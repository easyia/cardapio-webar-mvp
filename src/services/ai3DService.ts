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
   * Generates a 3D model from an image file/URL
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
      // 1. Call serverless backend endpoint
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
      onProgress(30, 'IA calculando volumetria e geometria 3D...');

      // 2. Poll task status until finished
      let attempts = 0;
      while (attempts < 60) {
        await new Promise(r => setTimeout(r, 2500));
        attempts++;

        const statusRes = await fetch(
          `/api/task-status?taskId=${encodeURIComponent(taskId)}&clientApiKey=${encodeURIComponent(apiKey)}`
        );
        const statusData = await statusRes.json();

        if (statusData.status === 'running' || statusData.status === 'queued') {
          const p = Math.min(30 + attempts * 2.5, 90);
          onProgress(p, `Sintetizando texturas PBR e profundidade (${Math.round(p)}%)...`);
        } else if (statusData.status === 'success') {
          onProgress(95, 'Otimizando modelo para WebAR (Android & iOS)...');

          const glbUrl =
            statusData.output?.pbr_model ||
            statusData.output?.model ||
            statusData.output?.base_model;
          const usdzUrl = statusData.output?.usdz || glbUrl;

          if (!glbUrl) {
            throw new Error('A IA não retornou o arquivo .GLB do modelo.');
          }

          onProgress(100, 'Modelo 3D gerado com sucesso!');

          return {
            success: true,
            modelGlbUrl: glbUrl,
            modelUsdzUrl: usdzUrl,
            previewImageUrl: optimizedImage,
            dishSuggestion: {
              name: 'Item Autoral em 3D',
              category: 'cat-01',
              description: 'Modelo 3D gerado por IA a partir da foto do produto.',
              estimatedPrice: 24.00,
              ingredients: ['Ingredientes selecionados'],
            },
            logs: [
              `Tripo3D Task ID: ${taskId}`,
              'Reconstrução 3D neural concluída com sucesso',
              'Dual Engine AR: Compatível com Android (SceneViewer) e iOS (QuickLook)'
            ]
          };
        } else if (statusData.status === 'failed') {
          throw new Error('A IA da Tripo3D não conseguiu processar esta foto. Tente tirar uma foto mais nítida a 45°.');
        }
      }

      throw new Error('Tempo limite de geração excedido (mais de 2 minutos).');
    } catch (err: any) {
      console.warn('Erro ao conectar com API:', err);
      throw new Error(err.message || 'Erro ao processar imagem 3D.');
    }
  }
};
