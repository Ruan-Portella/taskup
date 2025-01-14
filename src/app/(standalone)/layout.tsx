import { UserButton } from '@/features/auth/components/user-button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface StandaloneLayoutProps {
  children: React.ReactNode
}

export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className='bg-neutral-100 min-h-screen'>
      <div className='mx-auto max-w-screen-2xl p-4'>
        <nav className='flex justify-between items-center'>
          <Link href='/'>
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Logo" width={30} height={30} style={{ width: '30px', height: '30px' }} />
              <h1 className="text-2xl font-bold">TaskUp</h1>
            </div>
          </Link>
          <UserButton showName={false} />
        </nav>
        <div className='mt-4 flex flex-col items-center justify-center'>
          {children}
        </div>
      </div>
    </main>
  )
}
