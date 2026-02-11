'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  ExternalLink, 
  Loader2,
  SearchX,
  User,
  Hash,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDeposits() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('pending')
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  // Data Fetch karne ka function
  const fetchRequests = async (status: string) => {
    setLoading(true)
    const { data } = await supabase.rpc('get_admin_deposit_requests', { req_status: status })
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests(activeTab)
  }, [activeTab])

  // Approval/Rejection Logic
  const handleAction = async (id: number, newStatus: 'approved' | 'rejected') => {
    setProcessingId(id)
    
    // Status update karna (SQL trigger baki kaam khud kar dega)
    const { error } = await supabase
      .from('hen_purchase_requests')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      // List se hata dena foran
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
          <h1 className="text-2xl font-black">Deposits</h1>
          <p className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-widest">Verify TRX IDs</p>
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

      {/* --- REQUESTS LIST --- */}
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
                className="shiny-card p-5 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-2xl border border-white/5">
                      {req.image_emoji}
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{req.package_name}</h4>
                      <p className="text-[10px] text-white/40 font-mono">By {req.user_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase">Amount</p>
                    <p className="text-lg font-black text-emerald-400">Rs {req.amount}</p>
                  </div>
                </div>

                {/* Payment Info Box */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-3 mb-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white/40"><Hash size={12}/> <span className="text-[10px] font-bold uppercase">TRX ID</span></div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(req.trx_id)}
                      className="flex items-center gap-2 text-amber-400 font-mono text-xs bg-amber-400/10 px-2 py-1 rounded-lg"
                    >
                      {req.trx_id} <Copy size={12} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white/40"><CreditCardIcon size={12}/> <span className="text-[10px] font-bold uppercase">Method</span></div>
                    <span className="text-xs font-bold text-white">{req.method}</span>
                  </div>
                </div>

                {/* Action Buttons (Sirf Pending Tab mein) */}
                {activeTab === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'rejected')}
                      className="flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold text-xs active:scale-95 transition-all disabled:opacity-50"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, 'approved')}
                      className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-emerald-950 rounded-xl font-bold text-xs active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {processingId === req.id ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle2 size={16} /> Approve</>}
                    </button>
                  </div>
                )}

                {/* Status Badges (Approved/Rejected Tab mein) */}
                {activeTab !== 'pending' && (
                  <div className={`text-center py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border
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
            <p className="text-sm font-bold uppercase tracking-widest">No {activeTab} requests</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Chota sa helper icon
function CreditCardIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}