import type { Metadata } from 'next'
import { Creepster, Julee } from 'next/font/google'
import './globals.css'
import { TaskProvider } from '@/contexts/TaskContext'

const creepster = Creepster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-creepster',
})

const julee = Julee({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Marley's Ledger",
  description: 'A spooky Christmas Carol-themed todo app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${julee.className} ${creepster.variable} m-0 p-0 min-h-screen`}
      >
        <TaskProvider>{children}</TaskProvider>
      </body>
    </html>
  )
}
