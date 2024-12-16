"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';

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
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {routes.map((item) => {
          const isActive = item.label === 'Inicio';
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild className={cn('', isActive && 'bg-white shadow-sm font-bold text-primary')}>
                <Link href={item.href}>
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
