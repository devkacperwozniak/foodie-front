import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from "../components/Providers";
import { Toaster } from 'sonner';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
import Favicon from '../../images/logo2.png'

export const metadata: Metadata = {
  title: 'Twoja Kuchnia',
  description: 'Najlepsze posiłki serwujemy świeże, zdrowe i pyszne daniały, które pobudzają umysł i ciało',
  icons: [{ rel: 'icon', url: Favicon.src, sizes: "32x32" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
        {children}
      </Providers>
      <Toaster richColors />
      </body>
    </html>
  )
}
