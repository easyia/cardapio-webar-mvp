// Vercel Serverless Function: Proxy 3D model files with correct MIME types and CORS headers
// This ensures iOS Quick Look and Android Scene Viewer open files inline in AR instead of downloading them.

export const config = {
  maxDuration: 30,
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, format, name } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL do modelo não fornecida' });
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const modelRes = await fetch(targetUrl);

    if (!modelRes.ok) {
      return res.status(modelRes.status).json({
        error: `Erro ao buscar modelo remoto: ${modelRes.statusText}`,
      });
    }

    const fileFormat = (format as string) || (targetUrl.endsWith('.usdz') ? 'usdz' : 'glb');
    const fileName = (name as string) || `model.${fileFormat}`;

    // Critical MIME Types for Native WebAR:
    if (fileFormat.toLowerCase() === 'usdz') {
      res.setHeader('Content-Type', 'model/vnd.usdz+zip');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    } else if (fileFormat.toLowerCase() === 'glb') {
      res.setHeader('Content-Type', 'model/gltf-binary');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    }

    // Cache control for fast loading
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const arrayBuffer = await modelRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('API /proxy-model Error:', error);
    return res.status(500).json({
      error: error.message || 'Erro ao retransmitir modelo 3D',
    });
  }
}
