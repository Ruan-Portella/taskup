'use client';

import { ResponsiveModal } from '@/components/responsive-modal'
import React from 'react'
import { useEditCategoriesModal } from '../hooks/use-edit-categories.modal';
import EditCategoryFormWrapper from './edit-categories-form-wrapper';

export default function DeleteCategoriesModal() {
  const { categoryId, close } = useEditCategoriesModal()

  return (
    <ResponsiveModal open={!!categoryId} onOpenChange={close}>
      {
        categoryId && (
          <EditCategoryFormWrapper categoryId={categoryId} onCancel={close} />
        )
      }
    </ResponsiveModal>
  )
}
