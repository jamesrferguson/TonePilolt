import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Song Smith',
  description: 'Strumming your way to stardom, the Song Smith app is your pocket-sized maestro for turning guitar grooves into compositional gold!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  )
}
