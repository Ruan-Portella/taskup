"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { usePathname } from "next/navigation";

import { SettingsIcon, UsersIcon } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: 'Inicio',
    href: '',
    icon: GoHome,
    activeIcon: GoHomeFill
  },
  {
    label: 'Minhas Tarefas',
    href: '/tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill
  },
  {
    label: 'Configurações',
    href: '/settings',
    icon: SettingsIcon,
    activeIcon: SettingsIcon
  },
  {
    label: 'Membros',
    href: '/members',
    icon: UsersIcon,
    activeIcon: UsersIcon
  }
];

export function Navigation() {
  const workspaceId = useWorkspacesId();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((item) => {
          const fullHref = `/workspaces/${workspaceId}${item.href}`;
          const isActive = pathname === fullHref;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <SidebarMenuItem key={fullHref}>
              <SidebarMenuButton asChild className={cn('', isActive && 'bg-white shadow-sm font-bold text-primary')}>
                <Link href={fullHref}>
                  <Icon className="size-5 text-neutral-500" />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
