'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body>
      <ChakraProvider>
        {children}
      </ChakraProvider>
      <SpeedInsights />      
      </body>

    </html>
  );
}
