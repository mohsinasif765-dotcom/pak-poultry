import { Suspense } from "react";
import Image from "next/image";
import RegisterForm from "@/components/RegisterForm";


export const viewport = {
  themeColor: "#022c22",
  width: "device-width",
  initialScale: 1,
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#022c22] font-sans selection:bg-amber-500/30">
      <main className="flex w-full max-w-lg flex-col items-center p-6">
        
        {/* Logo Section */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 p-1 shadow-lg shadow-amber-500/20">
             <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#022c22]">
                <span className="text-3xl font-bold text-amber-400">PP</span>
             </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Pak <span className="text-amber-400">Poultry</span> Business
            </h1>
            <p className="text-sm text-emerald-200/60 uppercase tracking-widest mt-1">
              Investment & Growth
            </p>
          </div>
        </div>

        {/* Registration Form Component wrapped in Suspense */}
        <div className="w-full">
          <Suspense fallback={
            <div className="flex items-center justify-center p-10 text-amber-400">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
              <span className="ml-3">Loading Form...</span>
            </div>
          }>
            <RegisterForm />
          </Suspense>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-emerald-500/50">
          © 2026 Pak Poultry Business. Secure & Encrypted.
        </p>
      </main>
    </div>
  );
}