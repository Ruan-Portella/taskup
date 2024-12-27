"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DottedSeparator } from "@/components/dotted-separator";
import { useLogout } from "../api/use-logout";
import { useMe } from "../api/use-me";
import { Loader, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const UserButton = ({showName}: {showName: boolean}) => {
  const { data: user, isLoading } = useMe();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() ?? 'U';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative flex items-center gap-2">
        <Avatar className={cn('hover:opacity-75 transition border border-neutral-300 size-8')}>
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        {
          showName && <span className="text-sm font-medium">{name || 'Usuario'}</span>
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='bottom' sideOffset={10}>
        <div className='w-full py-4 px-5 gap-4 flex flex-col'>
          <div className='flex flex-row gap-4 w-full items-center'>
            <div>
              <Avatar className="size-[52px] transition border border-neutral-300">
                <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className='text-base font-medium -mb-1'>{name || 'Usuario'}</h1>
              <p className='text-sm text-gray-800'>{email}</p>
            </div>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem onClick={() => logout()} className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer">
          <LogOut className="size-4 mr-2" />
          Encerrar sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}