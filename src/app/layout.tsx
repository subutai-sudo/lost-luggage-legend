import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lost Luggage Legend | Premium Travel Guides & Gear Reviews',
  description: 'Expert guides and honest reviews for business travelers who refuse to compromise on quality. From luggage recovery to carry-on recommendations.',
  keywords: 'travel, lost luggage, business travel, luggage reviews, travel gear, carry-on bags',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
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
