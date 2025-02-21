import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CreateWorkspacesForm } from "@/features/workspaces/components/create-workspaces-form";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";
import PageLayout from "./pageLayout";
import EditTaskModal from "@/features/tasks/components/edit-task-modal";
import EditCategoriesModal from "@/features/categories/components/edit-categories-modal";
import CreateCategoriesModal from "@/features/categories/components/create-categories-modal";
import { ConfettiProvider } from "@/providers/confetti-provider";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 w-full">
          <CreateWorkspacesForm />
          <CreateProjectModal />
          <CreateTaskModal />
          <CreateCategoriesModal />
          <EditTaskModal />
          <EditCategoriesModal />
          <ConfettiProvider />
          <PageLayout>
            {children}
          </PageLayout>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}