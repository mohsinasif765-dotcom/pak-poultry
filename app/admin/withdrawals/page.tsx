'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Loader2,
  SearchX,
  ArrowLeft,
  Wallet,
  Egg,
  Phone
} from 'lucide-react'
import Link from 'next/link'

export default function AdminWithdrawals() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('pending')
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const fetchRequests = async (status: string) => {
    setLoading(true)
    const { data } = await supabase.rpc('get_admin_sell_requests', { req_status: status })
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests(activeTab)
  }, [activeTab])

  const handleAction = async (id: number, newStatus: 'approved' | 'rejected') => {
    setProcessingId(id)
    
    // Status update logic
    const { error } = await supabase
      .from('sell_requests')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setRequests(prev => prev.filter(r => r.id !== id))
    } else {
      alert("Error: " + error.message)
    }
    setProcessingId(null)
  }

  return (
    <div className="min-h-screen bg-[#022c22] text-white pb-32 pt-6 px-4">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 bg-white/5 rounded-full border border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black">Sell Requests</h1>
          <p className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-widest">Withdrawal Approval</p>
        </div>
      </div>

      {/* --- VIP TABS --- */}
      <div className="flex p-1 bg-black/40 rounded-2xl mb-6 border border-white/5">
        {['pending', 'approved', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-tighter rounded-xl transition-all
              ${activeTab === tab ? 'bg-amber-400 text-emerald-950 shadow-lg' : 'text-white/40'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- LIST --- */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-400" /></div>
        ) : requests.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="shiny-card p-5 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                      <UserIcon size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{req.user_name}</h4>
                      <p className="text-[10px] text-white/40">Requested: {new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase">Total PKR</p>
                    <p className="text-lg font-black text-emerald-400">Rs {req.total_amount}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-white/40 uppercase font-bold flex items-center gap-1"><Egg size={10}/> Eggs Sold</p>
                    <p className="text-sm font-bold text-white">{req.quantity}</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-white/40 uppercase font-bold flex items-center gap-1"><Wallet size={10}/> Method</p>
                    <p className="text-sm font-bold text-white">{req.method}</p>
                  </div>
                </div>

                {/* Account Info Box */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2 mb-5">
                   <div className="flex justify-between">
                     <span className="text-[10px] text-white/40 font-bold uppercase">A/C Name:</span>
                     <span className="text-xs font-bold text-white">{req.wallet_name}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] text-white/40 font-bold uppercase">Number:</span>
                     <button 
                        onClick={() => navigator.clipboard.writeText(req.wallet_number)}
                        className="flex items-center gap-2 text-amber-400 font-mono text-xs bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20"
                     >
                       {req.wallet_number} <Copy size={12} />
                     </button>
                   </div>
                </div>

                {/* Actions */}
                {activeTab === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'rejected')}
                      className="py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold text-xs active:scale-95 transition-all"
                    >
                      Reject
                    </button>
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'approved')}
                      className="py-3 bg-emerald-500 text-emerald-950 rounded-xl font-bold text-xs active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      {processingId === req.id ? <Loader2 className="animate-spin" size={16} /> : "Approve & Paid"}
                    </button>
                  </div>
                )}
                
                {activeTab !== 'pending' && (
                   <div className={`text-center py-2 rounded-xl text-[10px] font-black uppercase border
                    ${activeTab === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                  >
                    Status: {activeTab}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-20 opacity-20">
            <SearchX size={40} className="mx-auto mb-4" />
            <p className="text-sm font-bold uppercase">No {activeTab} withdrawals</p>
          </div>
        )}
      </div>
    </div>
  )
}

function UserIcon({ size, className }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}