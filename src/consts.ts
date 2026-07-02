// =============================================================
//  CẤU HÌNH TRANG WEB — chỉnh các giá trị dưới đây cho phù hợp
// =============================================================

/** Tên miền chính thức (KHÔNG có dấu / ở cuối). Dùng cho canonical, OG, sitemap. */
export const SITE_URL = "https://cu-dem.pages.dev";

/** Tên thương hiệu / tên trang — hiển thị ở header và og:site_name */
export const SITE_NAME = "Cú Đêm";

/** Mô tả mặc định của trang (dùng khi bài viết không có description) */
export const SITE_DESCRIPTION =
  "Cú Đêm soi kỹ và so sánh công cụ AI & SaaS cho developer và doanh nghiệp nhỏ — review thẳng thắn, dựa trên dữ liệu thực tế, để bạn chọn đúng công cụ đáng tiền.";

/** Ngôn ngữ trang */
export const SITE_LANG = "vi";

/** Tác giả mặc định (dùng cho JSON-LD) */
export const DEFAULT_AUTHOR = "Cú Đêm";

/** Link Fanpage Facebook (dùng cho nút "Theo dõi" và footer). Đổi thành trang của bạn. */
export const FACEBOOK_URL = "";

/** Kênh YouTube liên kết (dùng cho sameAs + cross-promote). Để trống nếu chưa có. */
export const YOUTUBE_URL = "";

/** @username Twitter/X cho thẻ twitter:site (vd "@gxgblog"). Để trống nếu chưa có. */
export const TWITTER_HANDLE = "";

/** Hồ sơ mạng xã hội của trang -> JSON-LD Organization.sameAs (giúp Google liên kết thực thể). */
export const SOCIAL_LINKS = [FACEBOOK_URL, YOUTUBE_URL].filter(
  (u) => u && !u.endsWith("facebook.com/")
);

/** Logo trang (PNG, dùng cho JSON-LD publisher). Đặt trong /public. */
export const SITE_LOGO = "/logo.png";

/** Analytics (để trống = tắt). Plausible: điền domain (vd "gxg.com").
 *  GA4: điền Measurement ID (vd "G-XXXXXXX"). Có thể bật cả hai. */
export const PLAUSIBLE_DOMAIN = "";
export const GA4_ID = "";

/** Bình luận giscus (GitHub Discussions). Để trống repo = tắt.
 *  Lấy thông số tại https://giscus.app (repo phải bật Discussions + cài app giscus). */
export const GISCUS = {
  repo: "", // "tuhuudev/cu-dem"
  repoId: "",
  category: "Announcements",
  categoryId: "",
};

/** Ảnh OG mặc định khi bài viết không khai báo ogImage (PNG 1200×630, tự sinh ở build).
 *  KHÔNG dùng SVG: Facebook không render SVG cho thẻ preview. */
export const DEFAULT_OG_IMAGE = "/og-default.png";

/** Username Buttondown cho form đăng ký nhận bản tin (để trống = ẩn form).
 *  Lấy tại buttondown.com → Settings. Đã kiểm tra 2026-07-03: slug "tuhuudev" không tồn tại (404)
 *  -> để trống để ẩn form, tránh người đọc đăng ký fail âm thầm. Điền lại khi có tài khoản. */
export const BUTTONDOWN_USERNAME = "";

/** Câu chốt giá trị hiển thị ở hero trang chủ (above-the-fold). */
export const SITE_TAGLINE =
  "Soi kỹ công cụ AI & SaaS — review thẳng thắn, so sánh dựa trên dữ liệu, để bạn chọn đúng, không tốn thời gian thử sai.";
