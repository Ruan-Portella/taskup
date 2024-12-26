"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import {RiAddCircleFill} from "react-icons/ri";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { WorkspacesAvatar } from "@/features/workspaces/components/workspaces-avatar";

export const WorkspaceSwitcher = () => {
  const {data} = useGetWorkspaces();

  return (
    <div className="flex flex-col gap-y-2 mx-3 my-2 group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <p className='text-xs uppercase text-neutral-500'>Áreas de Trabalho</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>

      <Select>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="Sem área de trabalho" />
        </SelectTrigger>
        <SelectContent>
          {
            data?.documents.map(workspace => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex justify-start items-center gap-x-3 font-medium">
                  <WorkspacesAvatar name={workspace.name} image={workspace.imageUrl} />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>

    </div>
  )
};