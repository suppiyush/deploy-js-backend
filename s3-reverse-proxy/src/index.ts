import dotenv from "dotenv";
dotenv.config();

import express, { type Request, type Response } from "express";
import httpProxy from "http-proxy";
import path from "path";
import { renderNotFoundPage } from "./page/renderNotFound.js";

const app = express();
const PORT = process.env.PORT;
const proxy = httpProxy.createProxy();

app.use((req: Request, res: Response) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  const S3_BUCKET_URL = process.env.S3_BUCKET_URL;

  if (!S3_BUCKET_URL) {
    res.status(503).json({
      message: "Missing required configuration: S3_BUCKET_URL",
    });
    return;
  }

  const BASE_PATH = `${S3_BUCKET_URL}/__output`;
  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req) => {
  const url = req.url;

  // Root request
  if (url === "/") {
    proxyReq.path += "index.html";
    return;
  }

  // SPA fallback
  if (!path.extname(url)) {
    const currentPath = proxyReq.path;
    const projectBase = currentPath.split("/").slice(0, 3).join("/");
    proxyReq.path = `${projectBase}/index.html`;
  }
});

proxy.on("proxyRes", (proxyRes, req, res) => {
  if (proxyRes.statusCode === 403 || proxyRes.statusCode === 404) {
    const hostname = req.headers.host || "";
    const projectId = hostname.split(".")[0];

    // Drain the S3 response stream
    proxyRes.resume();

    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(renderNotFoundPage(projectId));
  }
});

app.listen(PORT, () => {
  console.log(`Reverse Proxy is running on port ${PORT}`);
});
