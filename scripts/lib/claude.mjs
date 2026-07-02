// Claude Code headless engine — sinh noi dung qua CLI `claude -p` (khong can API key,
// dung quota goi Claude cua ban). Yeu cau da cai & dang nhap Claude Code.
//
// Vi sao dung stdin: prompt dai (tieng Viet, nhieu dong) truyen qua argv de vo tren
// Windows (gioi han do dai + quoting), nen luon ghi prompt vao stdin.

import { spawn, spawnSync } from "node:child_process";

const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000; // bai co WebSearch co the chay vai phut

export function isClaudeAvailable() {
  try {
    const r = spawnSync("claude --version", {
      shell: true,
      encoding: "utf-8",
      timeout: 15000,
      windowsHide: true,
    });
    return r.status === 0;
  } catch {
    return false;
  }
}

export function requireClaude() {
  if (!isClaudeAvailable()) {
    throw new Error(
      "Khong tim thay Claude Code CLI ('claude'). Cai dat/dang nhap Claude Code, hoac dung --engine gemini."
    );
  }
}

/**
 * Goi Claude Code headless, tra ve chuoi ket qua (text) cua model.
 * @param {string} prompt
 * @param {{model?: string, webSearch?: boolean, timeoutMs?: number}} [opts]
 *   - model: override model (vd "opus", "sonnet"); mac dinh dung model cua phien Claude Code.
 *   - webSearch: cho phep tool WebSearch/WebFetch (grounding).
 */
export async function claudeGenerate(prompt, opts = {}) {
  const { model, webSearch = false, timeoutMs = DEFAULT_TIMEOUT_MS } = opts;
  const args = ["-p", "--output-format", "json"];
  if (model) args.push("--model", model);
  if (webSearch) args.push("--allowedTools", "WebSearch", "WebFetch");

  // Ghep thanh 1 chuoi lenh (shell: true + mang args bi Node canh bao DEP0190).
  // An toan vi args chi gom flag co dinh + ten model; prompt di qua stdin.
  const command = ["claude", ...args]
    .map((a) => (/^[\w.:=-]+$/.test(a) ? a : `"${String(a).replace(/"/g, '\\"')}"`))
    .join(" ");

  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, windowsHide: true });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const done = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const timer = setTimeout(() => {
      child.kill();
      done(reject, new Error(`Claude Code qua thoi gian (${Math.round(timeoutMs / 1000)}s).`));
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", (e) => done(reject, e));
    child.on("close", (code) => {
      if (code !== 0) {
        return done(
          reject,
          new Error(`Claude Code loi (exit ${code}): ${(stderr || stdout).trim().slice(0, 500)}`)
        );
      }
      // --output-format json -> envelope {type:"result", subtype, is_error, result, ...}
      try {
        const envelope = JSON.parse(stdout);
        if (envelope.is_error) {
          return done(reject, new Error(`Claude Code bao loi: ${String(envelope.result || stderr).slice(0, 500)}`));
        }
        return done(resolve, String(envelope.result ?? "").trim());
      } catch {
        // Phong ho: neu output khong phai envelope JSON, dung tho.
        return done(resolve, stdout.trim());
      }
    });

    child.stdin.on("error", () => {}); // tranh crash EPIPE neu process chet som
    child.stdin.write(prompt);
    child.stdin.end();
  });
}
