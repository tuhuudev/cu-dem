// Sinh bai MONEY (bottom-funnel) tu hang doi scripts/data/money-queue.json.
// Mac dinh dung engine claude (Claude Code, khong ton API key) va luu bai DRAFT de duyet.
//
// Usage:
//   npm run ai:money                    # sinh 1 bai tu entry "todo" dau tien
//   npm run ai:money -- --count 2       # sinh 2 bai
//   npm run ai:money -- --list          # xem hang doi
//   npm run ai:money -- --engine gemini # dung Gemini API thay Claude Code

import fs from "node:fs/promises";
import path from "node:path";
import {
  ROOT,
  loadDotEnv,
  requireApiKey,
  resolveEngine,
  generatePostBundle,
  writePostFile,
} from "./lib/ai-post.mjs";
import { requireClaude } from "./lib/claude.mjs";

const QUEUE_PATH = path.join(ROOT, "scripts", "data", "money-queue.json");

function parseArgs(argv) {
  const opts = { count: 1, draft: true, image: true, engine: process.env.AI_ENGINE || "claude" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--count") opts.count = parseInt(argv[++i], 10) || opts.count;
    else if (arg === "--list") opts.list = true;
    else if (arg === "--publish") opts.draft = false;
    else if (arg === "--no-image") opts.image = false;
    else if (arg === "--engine") opts.engine = argv[++i] || opts.engine;
    else if (arg === "--claude") opts.engine = "claude";
    else if (arg === "--claude-model") opts.claudeModel = argv[++i] || "";
    else if (arg === "--help" || arg === "-h") opts.help = true;
  }
  return opts;
}

async function loadQueue() {
  const json = JSON.parse(await fs.readFile(QUEUE_PATH, "utf-8"));
  if (!Array.isArray(json.queue)) throw new Error("money-queue.json: thieu mang 'queue'.");
  return json;
}

async function main() {
  await loadDotEnv();
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(`
Sinh bai MONEY (bottom-funnel, co hop CTA affiliate) tu hang doi money-queue.json.
  npm run ai:money                    Sinh 1 bai draft tu entry "todo" dau tien
  npm run ai:money -- --count 2       Sinh 2 bai
  npm run ai:money -- --list          Xem hang doi
  npm run ai:money -- --engine gemini Dung Gemini API (mac dinh: claude)
`);
    return;
  }

  const data = await loadQueue();
  const todo = data.queue.filter((q) => q.status === "todo");

  if (opts.list) {
    console.log(`[money] Hang doi: ${todo.length} todo / ${data.queue.length} tong.`);
    data.queue.forEach((q, i) =>
      console.log(`  ${i + 1}. [${q.status}] ${q.topic}${q.doneFile ? ` -> ${q.doneFile}` : ""}`)
    );
    return;
  }

  if (todo.length === 0) {
    console.log("[money] Hang doi trong — them de bai moi vao scripts/data/money-queue.json.");
    return;
  }

  const engine = resolveEngine(opts);
  let apiKey = "";
  if (engine === "claude") requireClaude();
  else apiKey = requireApiKey();

  const picked = todo.slice(0, opts.count);
  console.log(`[money] Se sinh ${picked.length} bai (engine: ${engine}, ${opts.draft ? "draft" : "DANG THANG"}):`);
  picked.forEach((q, i) => console.log(`  ${i + 1}. ${q.topic}`));

  let ok = 0;
  for (const entry of picked) {
    try {
      const postOpts = {
        topic: entry.topic,
        category: entry.category || "",
        tags: entry.tags || "",
        context:
          (entry.context || "") +
          "\nDay la bai bottom-funnel giup nguoi doc RA QUYET DINH mua/dung. Bat buoc co muc '## Gia va cach dang ky'.",
        author: "Soi Tool",
        draft: opts.draft,
        image: opts.image,
        engine,
        claudeModel: opts.claudeModel,
        ctaTool: entry.ctaTool || "",
        words: process.env.AI_POST_WORDS || "1100-1600",
      };
      const { post, slug, ogImage } = await generatePostBundle(postOpts, apiKey);
      const outPath = await writePostFile(post, postOpts, ogImage, slug);
      entry.status = "done";
      entry.doneFile = path.relative(ROOT, outPath).replaceAll("\\", "/");
      entry.doneDate = new Date().toISOString().slice(0, 10);
      await fs.writeFile(QUEUE_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
      console.log(`[money] OK: ${entry.doneFile}`);
      ok++;
    } catch (err) {
      console.warn(`[money] Loi voi "${entry.topic}": ${err.message}`);
    }
  }

  console.log(`\n[money] Xong ${ok}/${picked.length} bai.${opts.draft ? " Duyet bai roi xoa 'draft: true'." : ""}`);
}

main().catch((err) => {
  console.error("[money] Error:", err.message);
  process.exit(1);
});
