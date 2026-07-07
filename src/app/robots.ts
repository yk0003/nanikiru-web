import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// robots.txt（/robots.txt で配信される）
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 将来の管理画面・APIはクロール対象外にしておく
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
