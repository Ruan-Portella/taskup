import { AppSidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex w-full">
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