// 作者：黄煜涵
// 建立时间：2026-11-13
// 使用大模型：Trae AI Assistant
// 功能名称：诗词数据服务器（端口3004），提供 HTML 页面 + db.json 接口 + 静态图片服务

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3004;
const DB_DIR = __dirname;  // webhyh/db/（server.js 所在目录）
const PROJECT_ROOT = path.join(DB_DIR, '..', '..');  // 网页设计/（项目根，包含 index/ 目录）
const DB_FILE = path.join(DB_DIR, 'db.json');  // webhyh/db/db.json
const IMAGES_DIR = path.join(DB_DIR, 'images');  // webhyh/db/images/
const HTML_FILE = path.join(DB_DIR, 'hyh_poems.html');  // webhyh/db/hyh_poems.html

// 常用 MIME 类型映射（黄煜涵）
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

// 处理跨域请求（黄煜涵）
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 读取 db.json 并返回指定字段（黄煜涵）
function sendDBField(res, fieldName) {
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('读取 db.json 失败：' + err.message);
      return;
    }
    const jsonData = JSON.parse(data);
    const fieldData = jsonData[fieldName];
    if (!fieldData) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`db.json 中没有 ${fieldName} 字段`);
      return;
    }
    setCORS(res);
    res.writeHead(200, { 'Content-Type': MIME_TYPES['.json'] });
    res.end(JSON.stringify(fieldData));
  });
}

// 读取 db.json 并返回完整数据（黄煜涵）
function sendDBData(res) {
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('读取 db.json 失败：' + err.message);
      return;
    }
    setCORS(res);
    res.writeHead(200, { 'Content-Type': MIME_TYPES['.json'] });
    res.end(data);
  });
}

// 提供静态文件服务（从 DB_DIR 读取，用于 /images/ 和 db 内部资源）（黄煜涵）
function sendDBStyledFile(reqPath, res) {
  const relativePath = reqPath.replace(/^\/+/, '');
  const filePath = path.join(DB_DIR, relativePath);

  if (!filePath.startsWith(DB_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('禁止访问');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('文件未找到：' + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    setCORS(res);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// 提供 HTML 页面服务：根路径 / 返回 hyh_poems.html，其他静态文件从 DB_DIR 读（黄煜涵）
// 扩展：/index/* 路径从项目根目录查找，用于"返回首页"跳转到 index/index.html（黄煜涵）
function sendProjectFile(reqPath, res) {
  // 根路径或空路径直接返回 hyh_poems.html
  const relativePath = reqPath.replace(/^\/+/, '');
  let filePath;

  if (relativePath === '' || relativePath === 'index.html') {
    filePath = HTML_FILE;
  } else if (relativePath.startsWith('index/')) {
    // 请求 /index/xxx → 从项目根目录查找（如 /index/index.html → 网页设计/index/index.html）
    filePath = path.join(PROJECT_ROOT, relativePath);
    // 安全检查：确保文件在 PROJECT_ROOT 内
    if (!filePath.startsWith(PROJECT_ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('禁止访问');
      return;
    }
  } else {
    filePath = path.join(DB_DIR, relativePath);
    // 安全检查：确保文件在 DB_DIR 内，防止路径穿越
    if (!filePath.startsWith(DB_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('禁止访问');
      return;
    }
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('文件未找到：' + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    setCORS(res);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// 创建 HTTP 服务器（黄煜涵）
const server = http.createServer((req, res) => {
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    setCORS(res);
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // 路由分发
  if (pathname === '/api/poems') {
    // 诗词数据接口（返回 poems 数组）
    sendDBField(res, 'poems');
  } else if (pathname === '/api/authors') {
    // 作者数据接口（返回 authors 数组）
    sendDBField(res, 'authors');
  } else if (pathname.startsWith('/images/')) {
    // 静态图片（从 db/images/ 读）
    sendDBStyledFile(pathname, res);
  } else {
    // 其他所有请求 → 从项目根目录找 HTML/CSS/JS
    // 包括 / 根路径（返回 hyh_poems.html）
    sendProjectFile(pathname, res);
  }
});

// 启动服务器（黄煜涵）
server.listen(PORT, () => {
  console.log(`🎯 诗词数据服务器已启动：http://localhost:${PORT}`);
  console.log(`📜 诗词页面：http://localhost:${PORT}/`);
  console.log(`📊 数据接口：http://localhost:${PORT}/api/poems`);
  console.log(`🖼️  图片目录：http://localhost:${PORT}/images/`);
});
