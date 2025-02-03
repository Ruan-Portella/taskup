'use client';
import { useWorkspacesId } from '@/features/workspaces/hooks/use-workspaces-id';
import React, { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { DottedSeparator } from './dotted-separator';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberRole } from '@/features/members/types/member-roles';
import { useConfirm } from '@/hooks/use-confirm';

export default function MembersList() {
  const workspaceId = useWorkspacesId();
  const [ConfirmDialog, confirm] = useConfirm('Remover Membro', 'Tem certeza que deseja remover este membro?', 'destructive');
  const { data } = useGetMembers({ workspaceId });

  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember({ param: { memberId } }, {
      onSuccess: () => {
        window.location.reload();
      }
    });
  };

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <ConfirmDialog />
      <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
        <Button asChild variant='secondary' size='sm'>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className='size-4 mr-2' />
            Voltar
          </Link>
        </Button>
        <CardTitle className='text-xl font-bold'>
          Membros
        </CardTitle>
      </CardHeader>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='p-7'>
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className='flex items-center gap-2'>
              <MemberAvatar name={member.name} className='size-10' fallbackClassname='text-lg' />
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>{member.name}</p>
                <p className='text-xs font-muted-foreground'>{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='ml-auto' variant='secondary' size='icon'>
                    <MoreVerticalIcon className='size-4 text-muted-foreground' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='end'>
                  <DropdownMenuItem
                    onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)} disabled={isUpdatingMember}
                    className='font-medium'>
                    Setar como administrador
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)} disabled={isUpdatingMember}
                    className='font-medium'>
                    Setar como membro
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMember(member.$id)} disabled={isDeletingMember}
                    className='font-medium text-amber-700'>
                    Remover {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {
              index < data.documents.length - 1 && (
                <Separator className='my-2.5' />
              )
            }
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}
