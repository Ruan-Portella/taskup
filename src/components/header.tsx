'use client';

import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

const pathnameMap = {
  'tasks': {
    title: 'Minhas Tarefas',
    description: 'Veja todas as suas tarefas.',
  },
  'projects': {
    title: 'Projetos',
    description: 'Monitore todos os seus projetos e tarefas.',
  },
  'categories': {
    title: 'Categorias',
    description: 'Crie e gerencie categorias.',
  },
}

const defaultMap = {
  title: 'Início',
  description: 'Monitore todos os seus projetos e tarefas.',
}

export const Header = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex-col">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>
    </header>
  )
};