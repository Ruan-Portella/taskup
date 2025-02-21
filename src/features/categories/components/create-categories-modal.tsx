'use client';

import { ResponsiveModal } from '@/components/responsive-modal'
import React from 'react'
import { useCreateCategoryModal } from '../hooks/use-create-category.modal';
import CreateCategoryFormWrapper from './create-categories-form-wrapper';

export default function CreateCategoriesModal() {
  const { isOpen, close } = useCreateCategoryModal()

  console.log('isOpen', isOpen)

  return (
    <ResponsiveModal open={!!isOpen} onOpenChange={close}>
      {
        isOpen && (
          <CreateCategoryFormWrapper onCancel={close} />
        )
      }
    </ResponsiveModal>
  )
}
