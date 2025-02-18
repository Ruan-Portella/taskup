"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface DotLottieWCProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  autoplay?: string;
  loop?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': DotLottieWCProps;
    }
  }
}

export default function LoadingAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Aguarda 1 segundo
      router.replace("/");
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center">
      <dotlottie-wc src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie" autoplay="true" loop="true"></dotlottie-wc>
      <span className="text-muted-foreground">
        Autenticando...
      </span>
    </div>
  )
}
