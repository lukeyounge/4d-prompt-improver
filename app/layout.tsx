import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Fluency Tool - Bring Your Expertise to AI',
  description: 'Use the 4D Framework to enhance your AI prompts with professional expertise and make AI work for you.',
  keywords: ['AI', 'prompts', 'expertise', 'professional development', '4D framework'],
  authors: [{ name: 'AI Fluency' }],
  openGraph: {
    title: 'AI Fluency Tool - Bring Your Expertise to AI',
    description: 'Transform basic prompts into expertise-enhanced AI collaborations using the 4D Framework.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Fluency Tool - Bring Your Expertise to AI',
    description: 'Transform basic prompts into expertise-enhanced AI collaborations using the 4D Framework.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}