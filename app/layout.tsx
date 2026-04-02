import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'サウナログ',
  description: 'サウナ・整い情報メディア',
  keywords: 'サウナログ,サウナ・整い情報メディア',
  openGraph: {
    title: 'サウナログ',
    description: 'サウナ・整い情報メディア',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'サウナログ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'サウナログ',
    description: 'サウナ・整い情報メディア',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SVQXY5C3PW"></script>
        <script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SVQXY5C3PW');`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:`{"@context": "https://schema.org", "@type": "WebSite", "name": "サウナログ", "description": "サウナ・整い情報メディア", "url": "https://sauna-log-jp.vercel.app", "publisher": {"@type": "Organization", "name": "AOKAE合同会社", "url": "https://colorpass-web.vercel.app"}, "potentialAction": {"@type": "SearchAction", "target": "https://sauna-log-jp.vercel.app/blog/{search_term_string}", "query-input": "required name=search_term_string"}}`}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
