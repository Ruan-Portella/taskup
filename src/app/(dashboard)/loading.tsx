import { Loader2 } from 'lucide-react'
import React from 'react'

export default function DashboardLoading() {
  return (
    <div className='h-full flex items-center justify-center'>
      <Loader2 className='size-6 animate-spin text-muted-foreground' />
    </div>
  )
}
