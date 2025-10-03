const { createServer } = require("http");
const next = require("next");

// نقرأ المتغيرات البيئية
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

// نجهز تطبيق Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready on port ${port} [${dev ? "development" : "production"}]`);
  });
});
