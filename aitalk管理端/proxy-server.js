import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';

const app = express();
const proxy = httpProxy.createProxyServer({});

// 处理代理错误
proxy.on('error', (err, req, res) => {
  console.error('代理错误:', err);
  res.status(500).json({ error: '代理请求失败' });
});

// CORS 中间件
app.use(cors());

// 解析 JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 代理所有 /api 请求到后端服务器
app.use('/api', (req, res) => {
  // 后端服务器地址
  const backendUrl = 'http://159.75.169.224:1235';
  
  console.log(`转发请求: ${req.method} ${req.url} -> ${backendUrl}${req.url}`);
  
  proxy.web(req, res, {
    target: backendUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '' // 移除 /api 前缀后转发
    }
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
  console.log(`后端地址: http://159.75.169.224:1235`);
});