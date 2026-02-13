'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, History, 
  CreditCard, MoreHorizontal, ShieldCheck, Loader2, SearchX
} from 'lucide-react'

export default function WalletPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    async function fetchWallet() {
      const { data: walletData, error } = await supabase.rpc('get_wallet_data')
      if (walletData) {
        setData(walletData)
      }
      setLoading(false)
    }
    fetchWallet()
  }, [])

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center text-emerald-400">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )

  
  const pkrBalance = ((data?.eggs_balance || 0) * (data?.current_rate || 0)).toFixed(2)

  
  const filteredTransactions = data?.transactions?.filter((t: any) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Deposits') return t.type === 'deposit'
    if (activeFilter === 'Withdrawals') return t.type === 'withdrawal'
    if (activeFilter === 'Profits') return t.type === 'profit'
    return true
  }) || []

  return (
    <div className="space-y-6 pb-24 pt-4 px-1">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-white">My Wallet</h1>
          <div className="flex items-center gap-1 text-emerald-400/60 text-xs mt-1">
            <ShieldCheck size={12} />
            <span className="uppercase tracking-widest">Secure & Encrypted</span>
          </div>
        </div>
      </div>

      {/* --- PREMIUM ATM CARD --- */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative h-56 w-full rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/40"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-900 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
        
        <div className="relative z-20 p-6 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/10">
              <CreditCard className="text-white w-6 h-6" />
            </div>
            <p className="text-white/60 font-mono tracking-widest text-sm">**** {data?.username?.slice(-4) || '8842'}</p>
          </div>

          <div>
            <p className="text-emerald-200/80 text-xs uppercase tracking-widest mb-1 font-bold">Total PKR Value</p>
            <h2 className="text-4xl font-black text-white tracking-tight flex items-baseline gap-2">
              <span className="text-2xl text-amber-400">Rs</span>
              {pkrBalance}
            </h2>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-white/40 uppercase">Card Holder</p>
              <p className="text-sm font-bold text-white tracking-wide uppercase">{data?.full_name || 'Valued Member'}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase">Inventory</p>
                <p className="text-xs font-bold text-amber-400">{data?.eggs_balance || 0} Eggs</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- ACTION BUTTONS --- */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard/buy')}
          className="shiny-card bg-emerald-600/20 border-emerald-500/30 p-5 rounded-3xl flex flex-col items-center gap-2 group transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-bold text-sm">Deposit</span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard/sell')}
          className="shiny-card bg-amber-600/20 border-amber-500/30 p-5 rounded-3xl flex flex-col items-center gap-2 group transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="text-emerald-950 w-6 h-6" />
          </div>
          <span className="text-white font-bold text-sm">Withdraw</span>
        </motion.button>
      </div>

      {/* --- HISTORY SECTION --- */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <button onClick={() => router.push('/dashboard/history')} className="text-emerald-400 text-xs font-bold">SEE ALL</button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 px-1 no-scrollbar">
          {['All', 'Deposits', 'Withdrawals', 'Profits'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap
              ${activeFilter === filter ? 'bg-white text-emerald-950 border-white' : 'bg-white/5 text-white/40 border-white/5'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3 px-1">
          {/* FIX: Added safe length check */}
          {(filteredTransactions?.length || 0) > 0 ? filteredTransactions.map((txn: any) => (
            <div key={txn.id} className="shiny-card p-4 rounded-2xl flex items-center justify-between bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10
                  ${txn.type === 'deposit' || txn.type === 'profit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                `}>
                  {txn.type === 'deposit' || txn.type === 'profit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm capitalize">{txn.type}</h4>
                  <p className="text-[10px] text-white/30">{txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-bold text-sm ${txn.type === 'withdrawal' ? 'text-white' : 'text-amber-400'}`}>
                  {txn.type === 'withdrawal' ? '-' : '+'} PKR {txn.amount}
                </p>
                <p className={`text-[9px] font-black mt-1 uppercase tracking-wider
                  ${txn.status === 'completed' ? 'text-green-500' : txn.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}
                `}>
                  {txn.status}
                </p>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 opacity-20">
              <SearchX className="mx-auto mb-2" />
              <p className="text-xs">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}