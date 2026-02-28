'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { Timer, Egg, ChevronLeft, Loader2, Info } from 'lucide-react'
import Link from 'next/link'

export default function RewardZone() {
  // Supabase client ko stable rakhne ke liye useMemo
  const supabase = useMemo(() => createClient(), [])
  
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Hydration mismatch se bachne ke liye initial state null rakhi hai
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    // Client-side par time set karein
    setNow(new Date())

    async function fetchInvestments() {
      try {
        const { data, error } = await supabase.rpc('get_user_investments')
        if (error) {
          console.error("RPC Error:", error.message)
        }
        setInvestments(data || [])
      } catch (err) {
        console.error("Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInvestments()

    const timerId = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timerId)
  }, [supabase])

  // Timer Calculation with Safety Checks
  const getTimeRemaining = (nextRewardAt: string) => {
    if (!now || !nextRewardAt) return "00:00:00"
    
    try {
      const target = new Date(nextRewardAt).getTime()
      const diff = target - now.getTime()

      if (isNaN(target) || diff <= 0) return "Processing..."

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } catch (e) {
      return "00:00:00"
    }
  }

  // Progress bar calculation (Visual Only)
  const getProgress = (nextRewardAt: string) => {
    if (!now || !nextRewardAt) return 0
    const target = new Date(nextRewardAt).getTime()
    const start = target - (24 * 60 * 60 * 1000) // 24 hours ago
    const total = target - start
    const current = now.getTime() - start
    const pct = (current / total) * 100
    return Math.min(Math.max(pct, 0), 100)
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-emerald-400 bg-[#022c22]">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#022c22] text-white pb-32 pt-6 px-4">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-transform">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter">Reward Zone</h1>
          <p className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-widest">Track Your Production</p>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-4 mb-6 flex gap-3 items-start">
        <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-400/80 leading-relaxed font-medium">
          Har murgi har 24 ghante baad 1 anda (egg) deti hai. Timer khatam hote hi anday aapke balance mein khud-ba-khud jama ho jayenge.
        </p>
      </div>

      {/* CARDS LIST */}
      <div className="space-y-4">
        {investments && investments.length > 0 ? (
          investments.map((inv, idx) => (
            <motion.div
              key={inv?.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-2xl">
                    🐔
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{inv?.package_name || 'Golden Hen'}</h3>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">
                      Production: {inv?.quantity || 0} Eggs / Day
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-white/40 uppercase font-bold">Status</p>
                   <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">Active</span>
                </div>
              </div>

              {/* Progress Bar & Timer */}
              <div className="mt-6 space-y-3 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Timer size={14} />
                    <span className="text-lg font-mono font-black">
                      {getTimeRemaining(inv?.next_reward_at)}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 font-bold uppercase">Next Drop</p>
                </div>

                {/* Visual Progress Bar - Dynamic width based on time */}
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${getProgress(inv?.next_reward_at)}%` }}
                  />
                </div>
              </div>

              {/* Detail Info */}
              <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-1.5">
                    <Egg size={12} className="text-amber-400" />
                    <span className="text-xs font-bold text-white/60">
                      Batch ID: #{inv?.id ? inv.id.toString().slice(-4) : '0000'}
                    </span>
                 </div>
                 <p className="text-[10px] text-white/40 font-mono italic">
                   Expires: {inv?.ends_at ? new Date(inv.ends_at).toLocaleDateString() : '---'}
                 </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 opacity-20">
            <Egg size={40} className="mx-auto mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No Active Hens Found</p>
          </div>
        )}
      </div>
    </div>
  )
}