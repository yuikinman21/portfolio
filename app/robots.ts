import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // ※実際のデプロイ先URLに変更してください
  const baseUrl = 'https://portfolio-yuikinman21.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}