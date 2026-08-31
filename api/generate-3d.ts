// Vercel Serverless Function: Proxy to Tripo3D API (Supports Gastronomy Presets, Ultra HD v2.5 Neural Engine, Multi-View, Refinement and PBR Textures)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  maxDuration: 60,
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { 
      imageBase64, 
      imagesBase64, // Array of base64 photos for multi-view photogrammetry
      imageType, 
      clientApiKey, 
      requestType, 
      originalTaskId,
      quality = 'ultra',
      gastronomyPrompt,
      gastronomyCategory
    } = req.body || {};

    // Get Tripo API Key
    const apiKey = 
      process.env.TRIPO_API_KEY || 
      process.env.VITE_TRIPO_API_KEY || 
      clientApiKey;

    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({ 
        error: 'Chave da Tripo3D não encontrada. Configure TRIPO_API_KEY nas variáveis de ambiente da Vercel.' 
      });
    }

    // 1. If this is a USDZ conversion task request
    if (requestType === 'convert_usdz' && originalTaskId) {
      const convertRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          type: 'convert_model',
          format: 'USDZ',
          original_model_task_id: originalTaskId,
        }),
      });

      const convertData = await convertRes.json();
      if (convertData.code === 0 && convertData.data?.task_id) {
        return res.status(200).json({
          success: true,
          taskId: convertData.data.task_id,
          type: 'convert_usdz',
        });
      }
    }

    // 2. If this is a Model Refinement task request (Refine Mesh & 2K PBR Textures)
    if (requestType === 'refine_model' && originalTaskId) {
      const refineRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          type: 'refine_model',
          draft_model_task_id: originalTaskId,
        }),
      });

      const refineData = await refineRes.json();
      if (refineData.code === 0 && refineData.data?.task_id) {
        return res.status(200).json({
          success: true,
          taskId: refineData.data.task_id,
          type: 'refine_model',
        });
      }
    }

    // 3. Multi-view Photogrammetry (Multi-photo for high-fidelity food dishes)
    if (Array.isArray(imagesBase64) && imagesBase64.length > 1) {
      const formattedFiles = imagesBase64.map((b64: string) => {
        const cleanB64 = b64.includes('base64,') ? b64.split('base64,')[1] : b64;
        return {
          type: 'jpg',
          data: cleanB64,
        };
      });

      const tripoMultiPayload: any = {
        type: 'multiview_to_model',
        model_version: 'v2.5-20250123',
        files: formattedFiles,
        prompt: gastronomyPrompt || undefined,
        params: {
          texture: true,
          pbr: true,
          face_limit: quality === 'ultra' ? 50000 : 35000,
          texture_resolution: 2048,
          texture_quality: 'detailed',
        }
      };

      const tripoMultiRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(tripoMultiPayload),
      });

      const tripoMultiData = await tripoMultiRes.json();

      if (tripoMultiData.code === 0 && tripoMultiData.data?.task_id) {
        return res.status(200).json({
          success: true,
          taskId: tripoMultiData.data.task_id,
          type: 'multiview_to_model',
          viewsCount: imagesBase64.length,
          gastronomyCategory,
        });
      }

      console.warn('Multiview fallback to single image:', tripoMultiData);
    }

    // 4. Single Image to 3D Model Task with Gastronomy Neural Optimization
    const primaryImage = imageBase64 || (Array.isArray(imagesBase64) ? imagesBase64[0] : null);

    if (!primaryImage) {
      return res.status(400).json({ error: 'Nenhuma foto enviada para geração 3D.' });
    }

    const base64Data = primaryImage.includes('base64,')
      ? primaryImage.split('base64,')[1]
      : primaryImage;

    const fileFormat = imageType === 'image/jpeg' ? 'jpg' : (imageType || 'png');

    const singleImagePayload: any = {
      type: 'image_to_model',
      model_version: 'v2.5-20250123',
      file: {
        type: fileFormat,
        data: base64Data,
      },
      prompt: gastronomyPrompt || undefined,
      params: {
        texture: true,
        pbr: true,
        face_limit: quality === 'ultra' ? 48000 : 32000,
        texture_resolution: 2048,
        texture_quality: 'detailed',
      }
    };

    const tripoRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify(singleImagePayload),
    });

    const tripoData = await tripoRes.json();

    if (tripoData.code !== 0 || !tripoData.data?.task_id) {
      // Fallback without model_version if restricted
      const fallbackRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          type: 'image_to_model',
          file: {
            type: fileFormat,
            data: base64Data,
          },
        }),
      });

      const fallbackData = await fallbackRes.json();
      if (fallbackData.code !== 0 || !fallbackData.data?.task_id) {
        return res.status(400).json({
          error: fallbackData.message || tripoData.message || 'Erro ao processar imagem na Tripo3D',
          details: fallbackData,
        });
      }

      return res.status(200).json({
        success: true,
        taskId: fallbackData.data.task_id,
        type: 'image_to_model',
        gastronomyCategory,
      });
    }

    return res.status(200).json({
      success: true,
      taskId: tripoData.data.task_id,
      type: 'image_to_model',
      gastronomyCategory,
    });
  } catch (error: any) {
    console.error('API /generate-3d Error:', error);
    return res.status(500).json({
      error: error.message || 'Erro interno no servidor ao processar 3D',
    });
  }
}
