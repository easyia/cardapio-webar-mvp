// Vercel Serverless Function: Proxy to Tripo3D API
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
    const { imageBase64, imageType, clientApiKey, requestType, originalTaskId } = req.body || {};

    // Get Tripo API Key from environment or client
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

    // 2. Standard image_to_model task request
    if (!imageBase64) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    const base64Data = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    const fileFormat = imageType === 'image/jpeg' ? 'jpg' : (imageType || 'png');

    const tripoRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
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

    const tripoData = await tripoRes.json();

    if (tripoData.code !== 0 || !tripoData.data?.task_id) {
      return res.status(400).json({
        error: tripoData.message || 'Erro ao processar imagem na Tripo3D',
        details: tripoData,
      });
    }

    return res.status(200).json({
      success: true,
      taskId: tripoData.data.task_id,
      type: 'image_to_model',
    });
  } catch (error: any) {
    console.error('API /generate-3d Error:', error);
    return res.status(500).json({
      error: error.message || 'Erro interno no servidor ao processar 3D',
    });
  }
}
