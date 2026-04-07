import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Lost Luggage Legend | Premium Destination Travel Guides',
    template: '%s | Lost Luggage Legend',
  },
  description:
    'In-depth travel destination guides for the discerning traveler. Live price comparisons, flight time estimates, and honest editorial — no sponsored content.',
  keywords: 'travel guides, destination guides, travel tips, best time to visit, travel comparison',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lostluggagelegend.com',
    siteName: 'Lost Luggage Legend',
    title: 'Lost Luggage Legend | Premium Destination Travel Guides',
    description:
      'In-depth travel destination guides for the discerning traveler. Live price comparisons, flight time estimates, and honest editorial.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Lost Luggage Legend — Premium Travel Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lost Luggage Legend | Premium Destination Travel Guides',
    description:
      'In-depth travel destination guides for the discerning traveler. Live price comparisons, flight time estimates.',
    images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85'],
  },
  alternates: {
    canonical: 'https://lostluggagelegend.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,700;1,8..60,300&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s,t,a,y22){s.Stay22=s.Stay22||{};s.Stay22.params={lmaID:'69d481c8e570ac3a76202d74'};var twenty=t.createElement(a);var two=t.getElementsByTagName(a)[0];twenty.async=1;twenty.src='https://scripts.stay22.com/letmeallez.js';two.parentNode.insertBefore(twenty,two)})(window,document,'script')`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧳</text></svg>" />
        <link rel="canonical" href="https://lostluggagelegend.com" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
