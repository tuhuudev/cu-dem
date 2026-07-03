import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Content Collection cho bài viết — đọc tất cả file .md trong src/content/posts
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Ảnh OG/thumbnail — nên 1200x630 để Facebook hiển thị đẹp
    ogImage: z.string().optional(),
    category: z.string().default("Khác"),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
    draft: z.boolean().default(false),
    // Tóm tắt nhanh (gạch đầu dòng) hiện ở đầu bài — hợp tin trending, giúp đọc nhanh.
    takeaways: z.array(z.string()).default([]),
    // Bài tin/thời sự -> dùng schema NewsArticle (thay vì BlogPosting) cho freshness.
    news: z.boolean().default(false),
    // Câu hỏi thường gặp -> render accordion + FAQPage JSON-LD (rich result).
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    // Bài có link tiếp thị liên kết -> hiện banner công khai (minh bạch + đạt yêu cầu affiliate).
    affiliateDisclosure: z.boolean().default(true),
    // Điểm đánh giá biên tập (0-5) cho bài REVIEW 1 công cụ -> hiện sao + Review JSON-LD (rich result sao).
    // Để trống với bài so sánh nhiều công cụ.
    rating: z.number().min(0).max(5).optional(),
    ratingTool: z.string().optional(), // tên công cụ được chấm điểm (itemReviewed)
    ratingSummary: z.string().optional(), // 1 câu nhận xét tổng (hiện cạnh sao)
    // Slug tool trong scripts/data/affiliate-map.json -> hiện hộp CTA "verdict" cuối bài
    // với nút /go/<slug>. Dùng cho bài money (review/so sánh có tool thắng cuộc).
    ctaTool: z.string().optional(),
    // 2-3 gạch đầu dòng "hợp với ai" hiện trong hộp CTA.
    ctaFor: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
