# /money-pack — Sinh TRỌN GÓI content cho 1 đề tài money (bài + audio + video short + caption)

Quy trình chuẩn hóa "1 đề tài → 4 asset". Chạy từ repo `D:\ai-tool-review`. Dự án video
nằm ở `D:\youtube-tiktok-research` (xem CLAUDE.md ở đó, mục "Dùng chung dây chuyền cho blog Soi Tool").

## Các bước (làm tuần tự, dừng báo lỗi nếu bước nào fail)

1. **Bài viết**: `npm run ai:money` (engine claude mặc định; entry "todo" đầu tiên trong
   `scripts/data/money-queue.json` → bài draft). Đọc file bài vừa sinh, ghi nhớ `<slug>` và title.

2. **Audio bản đọc**:
   `cd ../youtube-tiktok-research && python src/blog_audio.py ../ai-tool-review/src/content/posts/<file>.md --blog ../ai-tool-review`
   → mp3 vào `public/audio/<slug>.mp3` (nút "Nghe bài" + tập podcast tự xuất hiện khi bài publish).

3. **Kịch bản short**: TỰ VIẾT (không dùng Gemini) file `../youtube-tiktok-research/scripts/short-<slug-ngắn>.json`
   theo schema post_to_short.py. Quy tắc BẮT BUỘC (GATE):
   - 7–9 cảnh thoại + 1 brand card cuối; tổng ≤ ~75 từ (≈34s); mỗi câu ≤12 từ.
   - Cảnh 1 = hook chứa tên tool; cảnh 2 mở vòng tò mò (câu hỏi); CẢNH THOẠI CUỐI vọng lại
     chữ của hook (lint so token >2 ký tự, hoặc keyword nằm ở cả 2 câu).
   - `"keyword"` = tên tool thường (vd "jasper ai"); voice `vi-VN-NamMinhNeural`, rate `+8%`.
   - Chạy `python src/retention_lint.py scripts/short-<...>.json` — phải đạt 7/7 mới render.

4. **Render video**: `$env:BRAND_NAME="SOI TOOL"; python src/auto_video.py scripts/short-<...>.json`
   → mp4 trong `reports/`. Chạy nền nếu lâu.

5. **Caption đăng bài**: viết `scripts/short-<...>.caption.txt` = 1-2 câu mồi + `👉 Đọc đầy đủ: <link bài>`
   + 4-6 hashtag (#SoiTool + tool). LƯU Ý: link trong mô tả/comment YouTube Shorts KHÔNG bấm được —
   caption phải nói "link trong bio"; link thật đặt ở bio kênh (tối đa 14 link) + description (cho desktop/SEO).

6. **Báo cáo cuối**: liệt kê 4 asset + checklist việc user làm:
   - [ ] Dùng thử tool, chụp 1-2 screenshot, chèn vào bài, xóa `draft: true`
   - [ ] `npm run deploy` + `npm run index:ping`
   - [ ] Đăng mp4: YouTube Shorts (yt_manage upload, nhãn AI tự bật) + FB Reels (fb_manage reel) — kênh SOI TOOL, KHÔNG phải Mystery Box
   - [ ] Cập nhật bio kênh nếu bài mới đáng vào top link

## Không làm
- KHÔNG publish bài (bỏ draft) hay đăng video công khai — user duyệt.
- KHÔNG đăng lên kênh/Page Mystery Box.
