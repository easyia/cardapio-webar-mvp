// Vercel Serverless Function: Proxy 3D model files with correct MIME types and CORS headers
// Supports base64 encoded URLs to prevent S3 signature query parameter truncation.

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

  const { url, b64, format, name } = req.query;

  let targetUrl = '';
  if (b64 && typeof b64 === 'string') {
    try {
      targetUrl = Buffer.from(b64, 'base64').toString('utf-8');
    } catch {
      targetUrl = '';
    }
  }

  if (!targetUrl && url && typeof url === 'string') {
    targetUrl = decodeURIComponent(url);
  }

  if (!targetUrl) {
    return res.status(400).json({ error: 'URL do modelo 3D não fornecida' });
  }

  try {
    const modelRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AuraMenuWebAR/3.0)',
      },
    });

    if (!modelRes.ok) {
      console.error(`proxy-model error fetching targetUrl: ${modelRes.status} ${modelRes.statusText}`);
      return res.status(modelRes.status).json({
        error: `Erro ao buscar modelo remoto: ${modelRes.statusText}`,
      });
    }

    const fileFormat = (format as string) || (targetUrl.toLowerCase().includes('.usdz') ? 'usdz' : 'glb');
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

    // Cache control
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const arrayBuffer = await modelRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('API /proxy-model Exception:', error);
    return res.status(500).json({
      error: error.message || 'Erro ao retransmitir modelo 3D',
    });
  }
}
