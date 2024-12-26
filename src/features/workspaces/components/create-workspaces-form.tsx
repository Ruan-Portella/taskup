'use client';

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateForm } from "./create-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export const CreateWorkspacesForm = () => {
  const {isOpen, setIsOpen, close} = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateForm onCancel={close} />
    </ResponsiveModal>
  );
};