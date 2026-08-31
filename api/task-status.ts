// Vercel Serverless Function: Check Tripo3D Task Status
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { taskId, clientApiKey } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ error: 'taskId é obrigatório' });
  }

  const apiKey = 
    process.env.TRIPO_API_KEY || 
    process.env.VITE_TRIPO_API_KEY || 
    (typeof clientApiKey === 'string' ? clientApiKey : '');

  if (!apiKey) {
    return res.status(400).json({ error: 'Chave de API não encontrada' });
  }

  try {
    const tripoRes = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
    });

    const tripoData = await tripoRes.json();

    if (tripoData.code !== 0) {
      return res.status(400).json({
        error: tripoData.message || 'Erro ao consultar status na Tripo3D',
        details: tripoData,
      });
    }

    const taskData = tripoData.data;

    return res.status(200).json({
      success: true,
      status: taskData.status, // 'queued' | 'running' | 'success' | 'failed'
      progress: taskData.progress || 0,
      output: taskData.output || {},
    });
  } catch (error: any) {
    console.error('API /task-status Error:', error);
    return res.status(500).json({
      error: error.message || 'Erro ao consultar status da tarefa',
    });
  }
}
