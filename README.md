# Cú Đêm — blog review công cụ AI & SaaS

Blog tĩnh tiếng Việt đánh giá & so sánh công cụ AI/SaaS cho dev và doanh nghiệp nhỏ, kèm pipeline sinh bài tự động bằng Gemini. Build bằng [Astro 5](https://astro.build), deploy Cloudflare Pages.

## Kiến trúc

```
Dò trend (RSS miễn phí) ──► Gemini chọn đề tài ──► Viết bài (grounding Google Search,
                                                    kèm nguồn, chống bịa số liệu)
        │                                                    │
        ▼                                                    ▼
  scripts/fetch-trends.mjs                        Ảnh cover (bài nguồn / stock / AI)
                                                    → WebP → R2 hoặc public/ai-images
                                                             │
                                                             ▼
                                              Nhúng video YouTube + chèn affiliate
                                                             │
                                                             ▼
                                             File .md trong src/content/posts (draft)
                                                             │
                                              npm run build: OG image (satori)
                                              → astro build → pagefind (tìm kiếm)
```

## Lệnh thường dùng

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run check` | Typecheck (`astro check`) |
| `npm run build` | Build đầy đủ (OG image → astro → pagefind) ra `dist/` |
| `npm run ai:trends` | Dò trend, gợi ý đề tài |
| `npm run ai:auto` | Dò trend → tự tạo 1 bài **draft** (thêm `-- --count 3` để tạo 3 bài) |
| `npm run ai:post -- "Chủ đề"` | Viết bài từ chủ đề tự chọn |
| `npm run index:ping` | Ping IndexNow sau khi deploy |

Duyệt bài draft: mở file `.md` trong `src/content/posts/`, đọc/sửa nội dung, xóa dòng `draft: true`, commit + push.

## Engine sinh bài: Gemini API hoặc Claude Code

Pipeline hỗ trợ 2 engine, chọn bằng flag `--engine claude|gemini` (hoặc `--claude`), hoặc đặt `AI_ENGINE=claude` trong `.env` để làm mặc định:

| | `gemini` (mặc định) | `claude` |
|---|---|---|
| Cần gì | `GEMINI_API_KEY` | Đã cài + đăng nhập Claude Code CLI (gói Pro/Max) |
| Chi phí | Free tier / theo API | Trừ vào quota gói trả phí — 0 đồng thêm |
| Grounding | Google Search grounding | Claude tự WebSearch/WebFetch, trả nguồn thật |
| Ảnh AI | Có (`--ai-image`) | Không — tự hạ về ảnh bài nguồn/stock |

```bash
npm run ai:auto -- --claude              # dò trend + viết 1 bài draft bằng Claude Code
npm run ai:post -- "Chủ đề" --claude     # viết bài từ chủ đề tự chọn
npm run ai:trends -- --claude            # chỉ dò + xếp hạng đề tài
```

- `CLAUDE_MODEL` (env) hoặc `--claude-model` để override model (vd `opus`, `sonnet`); mặc định dùng model của phiên Claude Code.
- Engine `claude` chỉ chạy **local** (dùng đăng nhập của bạn). GitHub Actions vẫn chạy engine `gemini` — muốn chạy claude trên CI cần thêm `CLAUDE_CODE_OAUTH_TOKEN`, chưa cấu hình sẵn.

## Biến môi trường (`.env`, xem `.env.example`)

- `GEMINI_API_KEY` — **bắt buộc** cho pipeline sinh bài.
- `YOUTUBE_API_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY` — tùy chọn (nhúng video, ảnh stock); thiếu thì script tự bỏ qua.
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE` — tùy chọn, lưu ảnh lên Cloudflare R2 (xem `HUONG-DAN-LUU-TRU-R2-SHEET.md`).
- `INDEXNOW_KEY`, `DEPLOY_HOOK_URL` — tùy chọn.

**Không commit `.env`** (đã có trong `.gitignore`).

## Tự động đăng bài theo lịch (GitHub Actions)

Workflow `.github/workflows/auto-post.yml` chạy `npm run ai:auto` thứ 2 & thứ 5 hằng tuần, commit bài **draft** vào repo. Để kích hoạt:

1. Tạo repo GitHub, push code lên (xem `DEPLOY.md`).
2. **Settings → Secrets and variables → Actions**: thêm `GEMINI_API_KEY` (và các key tùy chọn ở trên).
3. **Settings → Actions → General → Workflow permissions**: chọn *Read and write permissions*.
4. Có thể chạy tay từ tab **Actions → Auto trend post → Run workflow**.

## Việc cần cấu hình trước khi vận hành thật (trong `src/consts.ts`)

- [ ] `SITE_URL` — đổi sang domain riêng khi có (đang là `cudem.pages.dev`); nhớ sửa cả `Sitemap:` trong `public/robots.txt`.
- [ ] `BUTTONDOWN_USERNAME` — **xác nhận đúng slug** trên buttondown.com; sai slug thì form đăng ký fail âm thầm. Để trống nếu chưa dùng.
- [ ] `PLAUSIBLE_DOMAIN` hoặc `GA4_ID` — bật analytics (hoặc bật Cloudflare Web Analytics trong dashboard, không cần sửa code).
- [ ] `GISCUS` — bật bình luận (repo GitHub public + bật Discussions, lấy thông số tại giscus.app).
- [ ] `FACEBOOK_URL`, `YOUTUBE_URL`, `TWITTER_HANDLE` — điền khi có kênh.
- [ ] `scripts/data/affiliate-map.json` — điền link affiliate **thật** và đổi `network` khác `"placeholder"` (entry `placeholder` bị bỏ qua, không được chèn vào bài).

## Tài liệu khác

- `DEPLOY.md` — deploy Cloudflare Pages / Vercel / Netlify.
- `HUONG-DAN-TAO-BAI-BANG-GEMINI.md` — chi tiết pipeline sinh bài.
- `HUONG-DAN-LUU-TRU-R2-SHEET.md` — cấu hình lưu ảnh R2.
