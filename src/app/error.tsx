'use client';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react"
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <AlertTriangle />
      <p className="text-sm text-muted-foreground mb-4">
        Ocorreu um erro ao tentar carregar a página.
      </p>
      <Button variant='secondary' size='sm' asChild>
        <Link href="/">
          Voltar para a página inicial
        </Link>
      </Button>
    </div>
  )
}

export default ErrorPage