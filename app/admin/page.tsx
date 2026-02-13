'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation' 
import { 
  Users, 
  TrendingUp, 
  Loader2,
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck,
  LayoutDashboard 
} from 'lucide-react'

export default function AdminDashboard() {
  const supabase = createClient()
  const router = useRouter() 
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function fetchAdminData() {
      const { data } = await supabase.rpc('get_admin_dashboard_stats')
      if (data) setStats(data)
      setLoading(false)
    }
    fetchAdminData()
  }, [])

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-amber-400 bg-[#022c22]">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )

  return (
    <div className="pt-6 px-4">
      {/* --- HEADER --- */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Console</h1>
          <p className="text-emerald-400/60 text-xs uppercase tracking-[0.2em] font-bold">Manage Farm Operations</p>
        </div>
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="text-emerald-400" size={20} />
        </div>
      </div>

      {/* --- SWITCH TO USER VIEW BUTTON --- */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="w-full mb-8 flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 active:scale-95 transition-all duration-200 group"
      >
        <LayoutDashboard size={20} className="text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest text-white/80">Switch to User View</span>
      </button>

      {/* --- QUICK STATS GRID --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard 
          label="Total Users" 
          value={stats?.total_users || 0} 
          icon={Users} 
          color="text-blue-400" 
        />
        <StatCard 
          label="Total Eggs" 
          value={stats?.total_eggs || 0} 
          icon={TrendingUp} 
          color="text-amber-400" 
        />
        <StatCard 
          label="Pending Buy" 
          value={stats?.pending_deposits || 0} 
          icon={ArrowDownLeft} 
          color="text-emerald-400" 
          highlight={(stats?.pending_deposits || 0) > 0}
        />
        <StatCard 
          label="Pending Sell" 
          value={stats?.pending_withdrawals || 0} 
          icon={ArrowUpRight} 
          color="text-red-400" 
          highlight={(stats?.pending_withdrawals || 0) > 0}
        />
      </div>

      {/* --- FINANCE OVERVIEW --- */}
      <div className="shiny-card p-6 rounded-3xl bg-white/5 border border-white/10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <p className="text-white/40 text-[10px] uppercase font-bold mb-1 tracking-widest">Total Revenue (Approved)</p>
        <h2 className="text-4xl font-black text-white mb-4">
          <span className="text-amber-400 text-xl mr-2 font-bold">PKR</span>
          {stats?.total_investment_pkr?.toLocaleString() || 0}
        </h2>
        <div className="h-[1px] bg-white/5 w-full mb-4" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-xs text-white/60">Live Egg Rate</p>
          </div>
          <p className="text-lg font-bold text-emerald-400">Rs {stats?.current_rate || 0}</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, highlight = false }: any) {
  return (
    <div className={`shiny-card p-4 rounded-2xl bg-white/5 border transition-all duration-500 ${highlight ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'}`}>
      <Icon size={18} className={`${color} mb-2`} />
      <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">{label}</p>
      <h3 className="text-xl font-bold text-white">{value}</h3>
    </div>
  )
}