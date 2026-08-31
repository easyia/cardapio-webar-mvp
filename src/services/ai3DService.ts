// AI 3D Generation Service (Gastronomy Optimized + Multi-view Photogrammetry + Tripo3D v2.5 PBR Engine)

export type GastronomyCategory = 
  | 'coffee_drink' 
  | 'pizza_pie' 
  | 'burger_sandwich' 
  | 'bowl_pasta' 
  | 'dessert_pastry' 
  | 'general_dish';

export interface GastronomyPreset {
  id: GastronomyCategory;
  name: string;
  icon: string;
  prompt: string;
  defaultScale: number;
  tips: string;
  defaultCategoryName: string;
  defaultPrice: number;
}

export const GASTRONOMY_PRESETS: Record<GastronomyCategory, GastronomyPreset> = {
  coffee_drink: {
    id: 'coffee_drink',
    name: 'Cafés & Bebidas',
    icon: '☕',
    prompt: 'artisanal specialty coffee cup, smooth ceramic mug, saucer, rich espresso crema and latte art, specular glaze, beverage photography',
    defaultScale: 0.25,
    tips: 'Enquadre a xícara a 45° mostrando a espuma/crema no topo e a altura da xícara com o pires.',
    defaultCategoryName: 'Cafés Especiais',
    defaultPrice: 14.00,
  },
  pizza_pie: {
    id: 'pizza_pie',
    name: 'Pizzas & Porções',
    icon: '🍕',
    prompt: 'delicious hot artisan pizza pie on wooden peel or round plate, crispy golden crust, melted mozzarella cheese, fresh basil, realistic culinary scan',
    defaultScale: 0.48,
    tips: 'Posicione a câmera a 45° a 60° para capturar a borda dourada e os recheios brilhantes.',
    defaultCategoryName: 'Pizzas Artesanais',
    defaultPrice: 58.00,
  },
  burger_sandwich: {
    id: 'burger_sandwich',
    name: 'Burgers & Merendas',
    icon: '🍔',
    prompt: 'gourmet artisan burger on rustic board, toasted brioche bun with sesame seeds, juicy beef patty, melted cheddar cheese, crispy bacon, layered sandwich',
    defaultScale: 0.32,
    tips: 'Tire a foto na altura dos olhos (30° a 45°) para mostrar todas as camadas do sanduíche e o pão.',
    defaultCategoryName: 'Sanduíches & Burgers',
    defaultPrice: 38.00,
  },
  bowl_pasta: {
    id: 'bowl_pasta',
    name: 'Massas & Bowls',
    icon: '🍝',
    prompt: 'gourmet pasta dish in restaurant ceramic bowl, rich sauce with glossy sheen, grated parmesan, fresh herbs, Italian culinary plating',
    defaultScale: 0.38,
    tips: 'Foque no centro do prato a 45°, destacando o molho brilhante e as ervas frescas.',
    defaultCategoryName: 'Pratos Principais',
    defaultPrice: 48.00,
  },
  dessert_pastry: {
    id: 'dessert_pastry',
    name: 'Sobremesas & Doces',
    icon: '🍰',
    prompt: 'fine dining pastry dessert on elegant plate, glossy chocolate glaze, powdered sugar, delicate fruit garnish, French bakery confectionery',
    defaultScale: 0.28,
    tips: 'Ilumine bem para destacar o brilho da calda e o formato delicado do doce.',
    defaultCategoryName: 'Sobremesas Autorais',
    defaultPrice: 22.00,
  },
  general_dish: {
    id: 'general_dish',
    name: 'Prato Geral / Outros',
    icon: '🍽️',
    prompt: 'appetizing gourmet restaurant dish on clean tableware, realistic food photography, culinary art plating',
    defaultScale: 0.38,
    tips: 'Coloque o prato em local bem iluminado e enquadre a 45° sem objetos soltos na mesa.',
    defaultCategoryName: 'Pratos Especiais',
    defaultPrice: 35.00,
  },
};

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
    suggestedScale: number;
  };
  logs: string[];
}

const API_CONFIG_KEY = 'auramenu_ai3d_api_key';

// Specialized Gastronomy Image Pre-Processor (Appetite Color Tuning + Background Soft Edge Cleaning)
async function optimizeFoodImage(dataUrl: string, category: GastronomyCategory = 'general_dish', maxDimension = 1280): Promise<string> {
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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 1. Clean background fill
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // 2. Gastronomy Appetite Color Calibration by category
        const filterStr = category === 'coffee_drink'
          ? 'contrast(1.10) saturate(1.20) brightness(1.03)'
          : category === 'pizza_pie'
          ? 'contrast(1.12) saturate(1.18) brightness(1.02)'
          : 'contrast(1.08) saturate(1.15) brightness(1.02)';

        ctx.filter = filterStr;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.filter = 'none';

        // 3. Soft Radial Vignette Clearing on outer edges to neutralize messy table backgrounds
        const radius = Math.min(width, height) * 0.48;
        const centerX = width / 2;
        const centerY = height / 2;
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.75, centerX, centerY, radius * 1.2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.45)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.94));
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
   * Generates a 3D model with Gastronomy Neural Optimization
   */
  async generate3DFromMultipleImages(
    rawImages: string[],
    onProgress: (percent: number, statusText: string) => void,
    category: GastronomyCategory = 'general_dish',
    quality: 'ultra' | 'standard' = 'ultra'
  ): Promise<AI3DTaskResult> {
    if (!rawImages.length) {
      throw new Error('Nenhuma foto foi fornecida.');
    }

    const apiKey = this.getApiKey();
    const preset = GASTRONOMY_PRESETS[category] || GASTRONOMY_PRESETS.general_dish;

    onProgress(5, rawImages.length === 1 
      ? `Calibrando cores apetitosas e isolando ${preset.name.toLowerCase()}...` 
      : `Otimizando ${rawImages.length} fotos gastronômicas (${preset.name})...`
    );
    const optimizedImages = await Promise.all(rawImages.map(img => optimizeFoodImage(img, category, 1280)));

    onProgress(15, rawImages.length === 1 
      ? `Enviando para o cluster neural Tripo3D v2.5 com perfil de ${preset.name}...` 
      : `Enviando ${optimizedImages.length} ângulos gastronômicos para reconstrução 3D...`
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
          gastronomyCategory: category,
          gastronomyPrompt: preset.prompt,
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
        ? `IA reconstruindo malha PBR de até 50.000 polígonos para ${preset.name}...` 
        : `IA sintetizando relevo, volume e brilho para ${preset.name}...`
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
          onProgress(p, `Gerando texturas PBR realistas de alimentos (${Math.round(p)}%)...`);
        } else if (statusData.status === 'success') {
          rawGlbUrl =
            statusData.output?.pbr_model ||
            statusData.output?.model ||
            statusData.output?.base_model;
          rawUsdzUrl = statusData.output?.usdz || '';

          break;
        } else if (statusData.status === 'failed') {
          throw new Error('A IA não conseguiu processar este prato. Dica: tire a foto contra um fundo limpo com boa luz.');
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

      onProgress(100, `Prato 3D (${preset.name}) pronto com Realidade Aumentada!`);

      return {
        success: true,
        taskId: taskId,
        modelGlbUrl: finalGlbUrl,
        modelUsdzUrl: finalUsdzUrl,
        previewImageUrl: optimizedImages[0],
        dishSuggestion: {
          name: `${preset.name.split('&')[0].trim()} Autoral`,
          category: 'cat-01',
          description: `Delicioso ${preset.name.toLowerCase()} preparado artesanalmente com apresentação em 3D e Realidade Aumentada.`,
          estimatedPrice: preset.defaultPrice,
          ingredients: ['Ingredientes frescos selecionados'],
          suggestedScale: preset.defaultScale,
        },
        logs: [
          `Tripo3D Task ID: ${taskId}`,
          `Perfil Gastronômico: ${preset.name}`,
          `Processamento Neural v2.5 (${quality.toUpperCase()} HD) concluído`,
          'Texturas PBR 2K: Albedo + Normal Map + Roughness + Specular'
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
    onProgress(10, 'Iniciando Super Refinamento Gastronômico HD (Alisando bordas e gerando texturas 2K)...');

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
        onProgress(p, `Polindo geometria e sintetizando texturas apetitosas 2K (${Math.round(p)}%)...`);
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

    onProgress(100, 'Super Refinamento Gastronômico 2K PBR Concluído!');
    return { modelGlbUrl: finalGlbUrl, modelUsdzUrl: finalUsdzUrl };
  },

  /**
   * Single image generation fallback
   */
  async generate3DFromImage(
    rawImageDataUrl: string,
    onProgress: (percent: number, statusText: string) => void,
    category: GastronomyCategory = 'general_dish'
  ): Promise<AI3DTaskResult> {
    return this.generate3DFromMultipleImages([rawImageDataUrl], onProgress, category, 'ultra');
  }
};
