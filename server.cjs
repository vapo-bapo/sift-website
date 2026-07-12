var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var cachedVideoUrl = null;
var lastSuccessUrl = null;
var cacheTimestamp = 0;
var CACHE_DURATION = 15 * 60 * 1e3;
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.get("/api/video-src", async (req, res) => {
    const forceRefresh = req.query.refresh === "true";
    const now = Date.now();
    if (cachedVideoUrl && !forceRefresh && now - cacheTimestamp < CACHE_DURATION) {
      console.log(`[API] Serving Higgsfield video URL from cache (expires in ${Math.round((CACHE_DURATION - (now - cacheTimestamp)) / 1e3)}s)`);
      return res.json({ url: cachedVideoUrl, fromCache: true });
    }
    try {
      const shareUrl = "https://higgsfield.ai/s/m2bff4xsS6I";
      console.log(`[API] Scraping Higgsfield video URL: ${shareUrl}`);
      const response = await fetch(shareUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        // Avoid hanging forever on timeout
        signal: AbortSignal.timeout(8e3)
      });
      if (!response.ok) {
        throw new Error(`Failed to load share page. Status: ${response.status}`);
      }
      const html = await response.text();
      console.log(`[API] Share page HTML loaded. Length: ${html.length} bytes`);
      let directUrl = null;
      const ogVideoMeta = html.match(/<meta[^>]*property=["']og:video(?::secure_url)?["'][^>]*content=["'](.*?)["']/i) || html.match(/<meta[^>]*content=["'](.*?)["'][^>]*property=["']og:video(?::secure_url)?["']/i);
      if (ogVideoMeta && ogVideoMeta[1]) {
        directUrl = ogVideoMeta[1].replace(/&amp;/g, "&");
      }
      if (!directUrl) {
        const sourceTag = html.match(/<source[^>]*src=["'](.*?)["']/i) || html.match(/<video[^>]*src=["'](.*?)["']/i);
        if (sourceTag && sourceTag[1]) {
          directUrl = sourceTag[1].replace(/&amp;/g, "&");
        }
      }
      if (!directUrl) {
        const quoteMatches = html.match(/"([^"]+?\.mp4(?:\?[^"]+?)?)"/i) || html.match(/'([^']+?\.mp4(?:\?[^']+?)?)'/i);
        if (quoteMatches && quoteMatches[1]) {
          directUrl = quoteMatches[1].replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
        }
      }
      if (!directUrl) {
        const rawMp4 = html.match(/(https:\/\/[^\s"'`<>\\\{\}\[\]]+?\.mp4[^\s"'`<>\\\{\}\[\]]*)/i);
        if (rawMp4 && rawMp4[1]) {
          directUrl = rawMp4[1].replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
        }
      }
      if (directUrl) {
        console.log(`[API] Success! Extracted direct video URL: ${directUrl}`);
        cachedVideoUrl = directUrl;
        lastSuccessUrl = directUrl;
        cacheTimestamp = now;
        return res.json({ url: directUrl, cached: false });
      }
      if (lastSuccessUrl) {
        console.warn("[API] Extraction failed, returning last successful URL as fallback.");
        return res.json({ url: lastSuccessUrl, isFallback: true });
      }
      console.warn("[API] Could not extract direct video url patterns. Returning original shareUrl as fallback.");
      return res.json({ url: shareUrl, isFallback: true });
    } catch (error) {
      console.error("[API] Error fetching or parsing Higgsfield share page:", error);
      if (lastSuccessUrl) {
        console.log("[API] Critical error: returning last successful URL from memory cache to avoid page crash.");
        return res.json({ url: lastSuccessUrl, isFallback: true, error: error.message });
      }
      const staticFallback = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-digital-neural-network-interface-41712-large.mp4";
      console.log(`[API] Returning high-quality neural background fallback: ${staticFallback}`);
      return res.json({ url: staticFallback, isStaticFallback: true, error: error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
