"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserButton } from "@/features/auth/components/user-button"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "./navigation"
import { DottedSeparator } from "./dotted-separator"
import { WorkspaceSwitcher } from "./workspace-switcher"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, openMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="flex">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Image src="/logo.svg" alt="Logo" width={30} height={30} style={{ width: '30px', height: '30px' }} />
                  <h1 className="text-2xl font-bold">TaskUp</h1>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DottedSeparator className="group-data-[collapsible=icon]:hidden" />
        <WorkspaceSwitcher />
        <DottedSeparator className="group-data-[collapsible=icon]:hidden" />
        <Navigation />
      </SidebarContent>
      <SidebarFooter>
        <DottedSeparator className="group-data-[collapsible=icon]:hidden" />
        <UserButton showName={open || openMobile} />
      </SidebarFooter>
    </Sidebar>
  )
}
