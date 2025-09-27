import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'ShopLux - Online Shopping for Fashion & Electronics',
  description: 'Discover premium fashion items and cutting-edge electronics at ShopLux. Shop the latest trends in clothing, accessories, and technology.',
  keywords: 'online shopping, fashion, electronics, clothing, accessories, technology',
  openGraph: {
    title: 'ShopLux - Online Shopping for Fashion & Electronics',
    description: 'Discover premium fashion items and cutting-edge electronics at ShopLux.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopLux Online Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopLux - Online Shopping',
    description: 'Premium fashion and electronics store',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
