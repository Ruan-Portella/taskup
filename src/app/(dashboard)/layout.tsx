import { AppSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CreateWorkspacesForm } from "@/features/workspaces/components/create-workspaces-form";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";
import PageLayout from "./pageLayout";
import EditTaskModal from "@/features/tasks/components/edit-task-modal";

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
          <EditTaskModal />
          <PageLayout>
            {children}
          </PageLayout>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}