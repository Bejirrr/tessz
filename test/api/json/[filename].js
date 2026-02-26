// api/json/[filename].js
// Handler untuk download file JSON dengan sistem token

const VALID_TOKENS = process.env.VALID_TOKENS
  ? process.env.VALID_TOKENS.split(",")
  : ["5PloBkNbTn4zV8YLjsVJVNweS1J2LbwU"]; // default token, ganti via env

const SOURCE_BASE = "https://storage.dimszyhub.my.id/json/";

export default async function handler(req, res) {
  const { filename } = req.query;
  const token = req.query.token;

  // Cek token
  if (!token || !VALID_TOKENS.includes(token)) {
    return res.status(403).json({
      error: "Access denied",
      message: "Token tidak valid atau tidak ditemukan.",
    });
  }

  // Validasi nama file (hanya .json)
  if (!filename || !filename.endsWith(".json")) {
    return res.status(400).json({
      error: "Bad request",
      message: "Nama file tidak valid. Harus berekstensi .json",
    });
  }

  // Cegah path traversal
  const safeName = filename.replace(/[^a-zA-Z0-9_\-\.]/g, "");
  if (safeName !== filename) {
    return res.status(400).json({ error: "Nama file mengandung karakter tidak diizinkan." });
  }

  const fileUrl = `${SOURCE_BASE}${safeName}`;

  try {
    const upstream = await fetch(fileUrl);

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: "File tidak ditemukan",
        message: `${safeName} tidak tersedia di server sumber.`,
      });
    }

    const contentLength = upstream.headers.get("content-length");
    const contentType = upstream.headers.get("content-type") || "application/json";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    res.setHeader("Cache-Control", "no-store");

    // Stream response
    const reader = upstream.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) { controller.close(); return; }
            controller.enqueue(value);
            push();
          });
        }
        push();
      },
    });

    const nodeStream = require("stream").Readable.from(
      (async function* () {
        const r = upstream.body.getReader();
        while (true) {
          const { done, value } = await r.read();
          if (done) break;
          yield value;
        }
      })()
    );

    nodeStream.pipe(res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: err.message });
  }
}
