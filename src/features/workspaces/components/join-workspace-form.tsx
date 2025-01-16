"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { UseInviteCode } from "../hooks/use-invite-code";
import { useWorkspacesId } from "../hooks/use-workspaces-id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  }
};

export const JoinWorkspaceForm = ({
  initialValues
}: JoinWorkspaceFormProps) => {
  const workspaceId = useWorkspacesId()
  const inviteCode = UseInviteCode();
  const {mutate, isPending} = useJoinWorkspace();
  const router = useRouter();

  const onSubmit = async () => {
    mutate({
      param: {workspaceId},
      json: {code: inviteCode}
    },{
      onSuccess: ({data}) => {
        router.push(`/workspaces/${data.$id}`);
      }
    })
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">
          Entrar na Área de Trabalho
        </CardTitle>
        <CardDescription>
          Você foi convidado para entrar na área de trabalho <strong>{initialValues.name}</strong>.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-y-2 items-center justify-between">
          <Button variant='secondary' disabled={isPending} size='lg' type="button" asChild className="w-full lg:w-fit">
            <Link href='/'>
              Cancelar
            </Link>
          </Button>
          <Button onClick={onSubmit} disabled={isPending} variant='primary' size='lg' type="button" className="w-full lg:w-fit">
            Entrar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
};