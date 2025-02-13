import { AppSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CreateWorkspacesForm } from "@/features/workspaces/components/create-workspaces-form";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex w-full">
          <CreateWorkspacesForm />
          <CreateProjectModal />
          <CreateTaskModal />
          <div className="mx-2 max-w-screen-2xl w-full">
            <Header />
            <main className="py-4 px-4 flex flex-col h-[calc(100vh-5rem)]">
              {children}
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}