'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LayoutDashboard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Settings,
  Loader2 
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log("No user found in Layout, redirecting to login");
        router.push('/')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      console.log("Layout Check - Role:", profile?.role);

      
      if (profile?.role !== 'admin') {
        console.log("Not an admin, kicking to dashboard");
        router.push('/dashboard')
      } else {
        
        console.log("Admin confirmed, staying on admin path");
        setIsAuthorized(true)
      }
    }
    checkAdmin()
  }, [router, supabase])

  
  if (isAuthorized === null) {
    return (
      <div className="h-screen flex items-center justify-center text-amber-400 bg-[#022c22]">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#022c22] text-white">
      <main className="pb-32">
        {children}
      </main>

      {/* Admin Nav Bar */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <NavBtn 
            icon={LayoutDashboard} 
            label="Home" 
            active={pathname === '/admin'} 
            onClick={() => router.push('/admin')} 
          />
          <NavBtn 
            icon={ArrowDownLeft} 
            label="Deposits" 
            active={pathname === '/admin/deposits'} 
            onClick={() => router.push('/admin/deposits')} 
          />
          <NavBtn 
            icon={ArrowUpRight} 
            label="Withdraws" 
            active={pathname === '/admin/withdrawals'} 
            onClick={() => router.push('/admin/withdrawals')} 
          />
          <NavBtn 
            icon={Settings} 
            label="Rates" 
            active={pathname === '/admin/settings'} 
            onClick={() => router.push('/admin/settings')} 
          />
        </div>
      </div>
    </div>
  )
}

function NavBtn({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-5 py-3 rounded-[1.8rem] transition-all duration-300 ${
        active 
          ? 'bg-amber-400 text-emerald-950 scale-105 shadow-lg shadow-amber-400/20' 
          : 'text-white/30 hover:text-white/60'
      }`}
    >
      <Icon size={20} strokeWidth={active ? 3 : 2} />
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  )
}
