'use client'
import { Header } from '@/components/header'
import { useSidebar } from '@/components/ui/sidebar'
import React from 'react'

export default function PageLayout({children}: {children: React.ReactNode}) {
  const sidebar = useSidebar()
  return (
    <>
      {
        sidebar.state === 'collapsed' ? (
          <div className="transition-all duration-200 mx-2 flex-1 w-full max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-5rem)]">
            <Header />
            <main className="py-4 px-4 flex flex-col h-[calc(100vh-5rem)]">
              {children}
            </main>
          </div>
        ) : (
          <div className="transition-all duration-200 mx-2 flex-1 w-full max-w-[calc(100vw-2.032rem)] md:max-w-[calc(100vw-18.032rem)]">
            <Header />
            <main className="py-4 px-4 max-sm:pr-[0rem] pr-[0.35rem] xl:pr-[0.35rem] flex flex-col">
              {children}
            </main>
          </div>
        )
      }
    </>
  )
}
