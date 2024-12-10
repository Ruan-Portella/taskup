'use client';

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/api/use-logout";
import { useMe } from "@/features/auth/api/use-me";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useMe();
  const {mutate} = useLogout();

  useEffect(() => {
    if (!isLoading && !data) {
      router.push('/sign-in');
    }
  }, [data, isLoading, router]);

  return (
    <div>
      <h1>Home</h1>
      <p>
        Apenas usuários autenticados podem acessar essa página.
      </p>
      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  );
}
