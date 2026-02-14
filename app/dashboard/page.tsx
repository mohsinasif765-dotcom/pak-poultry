'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { 
  Egg, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  ArrowUpRight, 
  Copy, 
  CheckCircle2, 
  Zap,
  Loader2,
  ShoppingBag,
  ArrowDownCircle,
  Timer
} from 'lucide-react'

export default function Dashboard() {
  const supabase = createClient()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [stats, setStats] = useState({
    eggs: 0,
    hens: 0,
    team_count: 0,
    total_roi: 0,
    username: '',
    recent_activity: [] as any[]
  })

  // Dynamic origin state
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }

    async function fetchStats() {
      try {
        const { data, error } = await supabase.rpc('get_dashboard_stats')
        if (error) throw error
        if (data) setStats(data)
      } catch (error) {
        console.error('Dashboard Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMins < 1) return 'Just now'
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  // Ab yahan hardcoded link ki jagah dynamic origin use ho raha hai
  const referralLink = `${origin}/?ref=${stats.username || 'user'}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-emerald-400">
      <Loader2 className="animate-spin w-10 h-10 mb-2" />
      <p className="text-xs uppercase tracking-widest opacity-70 font-bold">Syncing Farm Data...</p>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 pb-12 pt-4 px-1"
    >
      {/* --- REWARD ZONE OPTION --- */}
      <div className="px-2 mb-[-12px] flex justify-end">
        <Link href="/dashboard/rewards">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-full cursor-pointer group"
          >
            <Timer size={14} className="text-amber-400 animate-pulse" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              Check Rewards Timer
            </span>
          </motion.div>
        </Link>
      </div>

      {/* --- SECTION 1: MAIN EGG INVENTORY --- */}
      <div className="relative group px-2">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl blur opacity-20 transition duration-1000"></div>
        <div className="relative shiny-card p-6 bg-emerald-950/40 border-white/10 backdrop-blur-xl rounded-3xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest">Available Eggs</p>
              <h1 className="text-5xl font-black text-white mt-1 flex items-baseline gap-2">
                {stats.eggs.toLocaleString()} <span className="text-amber-400 text-lg">Eggs</span>
              </h1>
            </div>
            <div className="bg-amber-400/10 p-3 rounded-2xl border border-amber-400/20">
              <Egg className="text-amber-400 w-8 h-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/buy">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all">
                <ShoppingCart size={18} /> BUY HENS
              </button>
            </Link>
            <Link href="/dashboard/sell">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-emerald-950 font-bold py-4 rounded-2xl active:scale-95 transition-all">
                <ArrowUpRight size={18} /> SELL NOW
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: STATS GRID --- */}
      <div className="grid grid-cols-2 gap-4 px-2">
        {[
          { label: 'Total Hens', value: stats.hens.toString(), icon: Zap, color: 'text-blue-400' },
          { label: 'Team Members', value: stats.team_count.toString(), icon: Users, color: 'text-purple-400' },
          { label: 'Total ROI', value: `${stats.total_roi}`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Farm Status', value: 'Active', icon: CheckCircle2, color: 'text-emerald-400' },
        ].map((stat, idx) => (
          <div key={idx} className="shiny-card p-4 bg-white/5 border-white/5 rounded-2xl">
            <stat.icon className={`${stat.color} mb-2 w-5 h-5`} />
            <p className="text-emerald-100/40 text-[10px] uppercase font-bold tracking-tighter">{stat.label}</p>
            <h3 className="text-lg font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* --- SECTION 3: REFERRAL CARD --- */}
      <div className="px-2">
        <div className="shiny-card p-5 bg-gradient-to-br from-emerald-900/40 to-black/20 border-emerald-500/20 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><Users className="text-emerald-400 w-5 h-5" /></div>
            <h3 className="text-white font-bold">Invite Friends</h3>
          </div>
          <div className="relative">
            <input 
              type="text" 
              readOnly 
              value={referralLink}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] text-emerald-400/80 outline-none"
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-2 bottom-2 bg-emerald-500 text-emerald-950 px-4 rounded-lg font-bold text-xs"
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: RECENT ACTIVITY --- */}
      <div className="space-y-3 px-2">
        <h3 className="text-white font-bold text-sm px-1 flex justify-between items-center">
          Recent Activity
          <span className="text-[10px] text-white/20 font-normal">Last 5 actions</span>
        </h3>
        
        {stats.recent_activity.length > 0 ? (
          stats.recent_activity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${activity.type === 'profit' ? 'bg-amber-500/10 text-amber-400' : 
                    activity.type === 'purchase' ? 'bg-blue-500/10 text-blue-400' : 
                    'bg-emerald-500/10 text-emerald-400'}`}
                >
                  {activity.type === 'profit' ? <Egg size={18} /> : 
                   activity.type === 'purchase' ? <ShoppingBag size={18} /> : 
                   <ArrowDownCircle size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white capitalize">{activity.description || activity.type}</p>
                  <p className="text-[10px] text-white/30">{formatTime(activity.created_at)}</p>
                </div>
              </div>
              <p className={`font-bold ${activity.type === 'profit' ? 'text-amber-400' : 'text-white/60'}`}>
                {activity.type === 'profit' ? '+' : ''}{activity.amount}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-xs text-white/20 italic">No recent transactions found.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}