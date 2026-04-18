export default async (req, res) => {
  // 后端服务器地址
  const backendUrl = 'http://159.75.169.224:1235';
  
  // 获取请求路径（移除 /api 前缀）
  const path = req.url.replace(/^\/api/, '');
  
  try {
    // 构建完整的后端URL
    const targetUrl = new URL(path, backendUrl).toString();
    
    console.log(`[代理] ${req.method} ${req.url} -> ${targetUrl}`);
    
    // 转发请求到后端
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(backendUrl).host,
        // 移除可能导致问题的headers
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        'x-forwarded-proto': 'https',
        'x-forwarded-host': req.headers.host,
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    });
    
    // 获取响应头
    const headers = {};
    response.headers.forEach((value, key) => {
      // 跳过某些头
      if (!['connection', 'transfer-encoding', 'content-encoding'].includes(key)) {
        headers[key] = value;
      }
    });
    
    // 设置CORS头
    headers['access-control-allow-origin'] = '*';
    headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    headers['access-control-allow-headers'] = 'Content-Type, Authorization';
    
    // 转发响应
    res.status(response.status);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.end(await response.text());
  } catch (error) {
    console.error('[代理错误]', error);
    res.status(500).json({ 
      error: '代理请求失败',
      message: error.message 
    });
  }
};
