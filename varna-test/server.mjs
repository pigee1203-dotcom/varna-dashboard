import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const publicRoot = path.resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const port = 3100;
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/') {
      response.writeHead(302, { Location: '/verre.html', 'Cache-Control': 'no-store' });
      response.end();
      return;
    }
    const target = path.resolve(publicRoot, '.' + pathname);
    if (!target.startsWith(publicRoot + path.sep)) { response.writeHead(404); response.end('Introuvable'); return; }
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(404); response.end('Introuvable'); }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? 'Le port 3100 est occupé. Le serveur existant reste inchangé.' : error.message);
  process.exitCode = 1;
});
server.listen(port, '0.0.0.0', () => console.log(`VARNA VERRE — VERSION DE TEST : http://localhost:${port}/verre.html`));
