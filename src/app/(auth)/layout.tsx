import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={30} height={30} style={{width: '30px', height: '30px'}} />
            <h1 className="text-xl font-bold">TaskUp</h1>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 90px)' }}>
          {children}
        </div>
      </div>
    </main>
  );
}