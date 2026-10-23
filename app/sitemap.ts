import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yuiki.dev'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly', // 更新頻度
      priority: 1.0, // ページの重要度
    },
    // 複数ページ（例: /about や /projects）を作る場合は、ここに追加していきます
  ]
}