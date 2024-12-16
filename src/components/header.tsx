import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex-col">
          <h1 className="text-xl font-semibold">Início</h1>
          <p className="text-sm text-text-muted">Monitore todos os seus projetos e tarefas.</p>
        </div>
      </div>
    </header>
  )
};