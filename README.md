# Soi Tool — blog affiliate review công cụ AI & SaaS

Blog tĩnh tiếng Việt **soi kỹ và so sánh công cụ AI/SaaS** cho dev và doanh nghiệp nhỏ, thiết kế để **kiếm tiền affiliate**: pipeline sinh bài bằng AI (Claude Code/Gemini), hạ tầng link `/go/` đo được click, hộp CTA chuyển đổi. Build bằng [Astro 5](https://astro.build), deploy Cloudflare Pages.

## Mô hình kiếm tiền (đọc trước)

```
Bài MONEY (review/so sánh tool có affiliate)  ──►  Người đọc bấm /go/<tool>
        ▲                                                    │
  npm run ai:money                                           ▼
  (hàng đợi money-queue.json)                      Link affiliate thật (điền trong
                                                   affiliate-map.json khi được duyệt)
Bài TREND (kéo traffic, ai:auto)  ──► internal link ──► bài money      ──► HOA HỒNG
```

- **Mọi link tool trong bài đều là `/go/<slug>`** → đổi link trong `scripts/data/affiliate-map.json` là toàn bộ bài cũ tự trỏ đích mới, không sửa bài. Mỗi click = 1 pageview `/go/*` trên Cloudflare Web Analytics → đo được tool nào ra click.
- **Trạng thái tool trong map**: `active` (có link thật, đang kiếm tiền) / `pending` (chương trình mở, chờ bạn đăng ký — có sẵn link `signup`) / `closed` / `none`.

## Checklist kích hoạt kiếm tiền (việc của bạn, làm 1 lần)

1. **Tạo PayPal hoặc Payoneer** để nhận hoa hồng.
2. **Đăng ký các chương trình** (link `signup` trong `scripts/data/affiliate-map.json`): ưu tiên PartnerStack (Jasper + nhiều tool), ElevenLabs, Impact (Semrush), GetResponse. Khai báo website: `https://soitool.pages.dev` — site đã live + có bài nên dễ duyệt.
3. Được duyệt → dán link affiliate vào trường `url`, đổi `status: "active"` → chạy `npm run deploy`.
4. **Bật Cloudflare Web Analytics** (2 phút): dash.cloudflare.com → Web Analytics → Add site → copy token → dán vào `CF_ANALYTICS_TOKEN` trong `src/consts.ts` → deploy. Xem click affiliate: lọc pageview theo path `/go/`.
5. **Google Search Console**: thêm site, submit `https://soitool.pages.dev/sitemap-index.xml`.
6. (Khuyến nghị) Mua domain riêng `soitool.com`/`.vn` (~300k/năm) càng sớm càng tốt — đổi `SITE_URL` + gắn vào Pages project.

## Nhịp vận hành hàng tuần

```bash
npm run ai:money               # 2 bài money/tuần (bottom-funnel, có CTA affiliate)
npm run ai:auto -- --claude    # 1 bài trend/tuần (kéo traffic)
# → duyệt bài trong src/content/posts, xóa "draft: true"
npm run deploy                 # build + đưa lên web
npm run index:ping             # báo Google/Bing index
```

**Trước khi xóa `draft: true` (quan trọng cho SEO 2026):** Google core update 2026 đánh tụt
hạng mạnh review AI không có dấu hiệu dùng thật (71% site affiliate mất hạng). Mỗi bài money
nên thêm ít nhất 1-2 **ảnh chụp màn hình tự chụp** khi dùng thử tool (trial miễn phí là đủ)
kèm 1-2 câu nhận xét từ chính trải nghiệm đó — 15 phút/bài nhưng là khác biệt giữa được
xếp hạng và không.

SEO cần 3-6 tháng tích luỹ — kiên trì đăng đều quan trọng hơn đăng nhiều.

## Kênh video & audio (tái dùng pipeline `D:\youtube-tiktok-research`)

Dây chuyền video của dự án Mystery Box được dùng chung cho Soi Tool (chi tiết trong
CLAUDE.md của dự án đó). **Không đăng lên kênh Mystery Box** — cần kênh YouTube/Page FB
riêng mang thương hiệu Soi Tool.

**Lệnh trọn gói:** gõ `/money-pack` trong Claude Code → sinh 4 asset từ 1 đề tài trong
hàng đợi: bài viết draft + audio bản đọc + video short (lint 7/7) + caption đăng bài.

```bash
# Từng phần thủ công:
cd ../youtube-tiktok-research && python src/blog_audio.py --all --blog ../ai-tool-review
$env:BRAND_NAME="SOI TOOL"; python src/auto_video.py scripts/short-<slug>.json
```

- **Podcast**: bài có audio tự vào feed `/podcast.xml` — submit 1 lần lên Spotify
  (podcasters.spotify.com) là mỗi bài mới thành 1 tập podcast, thêm kênh phân phối miễn phí.
- ⚠️ **Link trong mô tả/comment YouTube Shorts KHÔNG bấm được** (YouTube chặn chống spam).
  Phễu đúng: video nói "link trong bio" → **bio kênh chứa tối đa 14 link bấm được**
  (đặt: trang chủ, /top-cong-cu, các bài money chủ lực). FB Reels/feed post thì link
  trong caption hoạt động bình thường.
- Video demo tool đồng thời là bằng chứng trải nghiệm thực (E-E-A-T) — nhúng lại vào bài viết.

## Lệnh đầy đủ

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run check` | Typecheck (`astro check`) |
| `npm run build` | Build đầy đủ ra `dist/` |
| `npm run deploy` | Build + đẩy lên Cloudflare Pages (https://soitool.pages.dev) |
| `npm run ai:money` | Sinh bài money từ hàng đợi (`-- --list` xem hàng đợi) |
| `npm run ai:auto` | Dò trend → tạo bài draft (`-- --claude` dùng Claude Code) |
| `npm run ai:post -- "Chủ đề"` | Viết bài từ chủ đề tự chọn |
| `npm run ai:trends` | Dò trend, gợi ý đề tài |
| `npm run index:ping` | Ping IndexNow sau khi deploy |

## Engine sinh bài: Claude Code hoặc Gemini

| | `claude` | `gemini` |
|---|---|---|
| Cần gì | Đã cài + đăng nhập Claude Code CLI (gói Pro/Max) | `GEMINI_API_KEY` |
| Chi phí | Trừ quota gói trả phí — 0 đồng thêm | Free tier / theo API |
| Grounding | Tự WebSearch/WebFetch, trả nguồn thật | Google Search grounding |

- `ai:money` mặc định engine **claude**; `ai:auto`/`ai:post` mặc định gemini (đổi bằng `--engine claude`, `--claude`, hoặc `AI_ENGINE=claude` trong `.env`).
- `CLAUDE_MODEL` (env) hoặc `--claude-model` để override model.

## Biến môi trường (`.env`)

- `GEMINI_API_KEY` — cần khi dùng engine gemini.
- `AI_ENGINE` — `claude` hoặc `gemini` (mặc định toàn cục).
- `YOUTUBE_API_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY` — tùy chọn (video, ảnh stock).
- `R2_*` — tùy chọn, lưu ảnh Cloudflare R2 (xem `HUONG-DAN-LUU-TRU-R2-SHEET.md`).
- `INDEXNOW_KEY` — tùy chọn.

**Không commit `.env`** (đã ignore).

## Deploy (Cloudflare Pages — project `soitool`)

```bash
npm run deploy   # direct upload; git push KHÔNG tự deploy
```

Muốn push-là-deploy: dash.cloudflare.com → Pages → soitool → Settings → nối repo GitHub.

## Tự động đăng bài theo lịch (GitHub Actions)

Workflow `.github/workflows/auto-post.yml` chạy `ai:auto` (engine gemini) thứ 2 & 5 hằng tuần, commit bài draft. Kích hoạt (1 lần):

```bash
gh secret set GEMINI_API_KEY -R tuhuudev/soitool
gh api -X PUT repos/tuhuudev/soitool/actions/permissions/workflow -f default_workflow_permissions=write
```

## Cấu hình còn treo (trong `src/consts.ts`)

- [ ] `CF_ANALYTICS_TOKEN` — bật đo click (bước 4 checklist trên).
- [ ] `BUTTONDOWN_USERNAME` — bật form email khi có tài khoản Buttondown thật.
- [ ] `GISCUS` — bật bình luận (repo public đã sẵn sàng, lấy thông số tại giscus.app).
- [ ] `FACEBOOK_URL`, `YOUTUBE_URL`, `TWITTER_HANDLE` — điền khi có kênh.

## Tài liệu khác

- `DEPLOY.md` — deploy chi tiết; `HUONG-DAN-TAO-BAI-BANG-GEMINI.md` — pipeline sinh bài; `HUONG-DAN-LUU-TRU-R2-SHEET.md` — ảnh R2.
