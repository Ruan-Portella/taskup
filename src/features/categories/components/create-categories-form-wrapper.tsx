import React from 'react'
import { CreateCategoriesForm } from './create-categories-form';


export default function CreateCategoryFormWrapper({onCancel}:{onCancel: () => void}) {
  return (
    <CreateCategoriesForm onCancel={onCancel} />
  );
};
