'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Egg, 
  ShoppingBag, 
  Users, 
  Loader2,
  Filter,
  SearchX
} from 'lucide-react'

export default function HistoryPage() {
  const supabase = createClient()
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase.rpc('get_user_history')
      if (data) {
        setTransactions(data)
        setFilteredData(data)
      }
      setLoading(false)
    }
    fetchHistory()
  }, [])

  // Filter Logic
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredData(transactions)
    } else {
      setFilteredData(transactions.filter(t => t.type === activeFilter))
    }
  }, [activeFilter, transactions])

  const getIcon = (type: string) => {
    switch (type) {
      case 'profit': return <Egg className="text-amber-400" size={20} />
      case 'purchase': return <ShoppingBag className="text-blue-400" size={20} />
      case 'referral_bonus': return <Users className="text-purple-400" size={20} />
      case 'withdrawal': return <ArrowUpRight className="text-red-400" size={20} />
      default: return <History className="text-white/40" size={20} />
    }
  }

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center text-emerald-400">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )

  return (
    <div className="space-y-6 pb-24 pt-4 px-1">
      
      {/* --- HEADER --- */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-white">Farm History</h1>
        <p className="text-emerald-400/60 text-xs uppercase tracking-widest">Your Activity Ledger</p>
      </div>

      {/* --- QUICK FILTERS --- */}
      <div className="flex gap-2 px-2 overflow-x-auto no-scrollbar pb-2">
        {['all', 'profit', 'purchase', 'referral_bonus', 'withdrawal'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap border transition-all
              ${activeFilter === f 
                ? 'bg-emerald-500 border-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20' 
                : 'bg-white/5 border-white/10 text-white/40'}`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* --- TRANSACTIONS LIST --- */}
      <div className="space-y-3 px-2">
        <AnimatePresence mode='popLayout'>
          {filteredData.length > 0 ? (
            filteredData.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="shiny-card p-4 rounded-2xl flex items-center justify-between bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                    {getIcon(t.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white capitalize">{t.description || t.type}</h4>
                    <p className="text-[10px] text-white/30">
                      {new Date(t.created_at).toLocaleString('en-PK', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-sm font-black ${t.type === 'purchase' || t.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {t.type === 'purchase' || t.type === 'withdrawal' ? '-' : '+'}
                    {t.amount.toLocaleString()}
                  </p>
                  <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    t.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                    t.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-20 opacity-30"
            >
              <SearchX className="mx-auto mb-2 w-12 h-12" />
              <p className="text-sm font-bold uppercase tracking-widest">No Records Found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}