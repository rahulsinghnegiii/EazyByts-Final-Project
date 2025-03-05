import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            if (err.code === 'ECONNREFUSED') {
              console.log('Backend server not running');
              res.writeHead(503, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ 
                message: 'Backend server is not running. Please start the backend server.',
                code: 'BACKEND_NOT_RUNNING'
              }));
            } else {
              console.error('Proxy error:', err);
            }
          });

          // Log both proxy requests and responses
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy Request:', {
              method: req.method,
              originalUrl: req.url,
              targetUrl: proxyReq.path,
              headers: proxyReq.getHeaders(),
            });
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy Response:', {
              method: req.method,
              originalUrl: req.url,
              status: proxyRes.statusCode,
            });
          });
        },
      },
    },
  },
}); 