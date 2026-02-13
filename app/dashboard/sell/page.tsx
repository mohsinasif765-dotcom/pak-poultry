'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  ShieldCheck, Star, Clock, Banknote, 
  CheckCircle2, X, User, Hash, AlertCircle, Loader2 
} from 'lucide-react'

export default function SellPage() {
  const supabase = createClient()
  
  // States
  const [buyers, setBuyers] = useState<any[]>([])
  const [myEggs, setMyEggs] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null)
  const [quantity, setQuantity] = useState<string>('')
  const [walletName, setWalletName] = useState('')
  const [walletNumber, setWalletNumber] = useState('')
  const [walletMethod, setWalletMethod] = useState('Ubank')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  // Load Data
  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.rpc('get_sell_screen_data')
      if (data) {
        setBuyers(data.buyers || [])
        setMyEggs(data.my_eggs || 0)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Calculate Total
  const totalAmount = quantity ? (parseInt(quantity) * (selectedBuyer?.rate || 0)).toFixed(2) : 0
  const isOverLimit = parseInt(quantity) > myEggs

  const handleSell = async () => {
    if (!quantity || isOverLimit || !walletName || !walletNumber) return
    setProcessing(true)
    
    // Naya Secure RPC Call
    const { error } = await supabase.rpc('submit_sell_request', {
      p_quantity: parseInt(quantity),
      p_buyer_name: selectedBuyer.name,
      p_rate: selectedBuyer.rate,
      p_total_amount: parseFloat(totalAmount as string),
      p_wallet_name: walletName,
      p_wallet_number: walletNumber,
      p_method: walletMethod
    })

    if (!error) {
      setProcessing(false)
      setSuccess(true)
      
      // Local state update kar den taake user ko balance kam nazar aaye
      setMyEggs(prev => prev - parseInt(quantity))

      setTimeout(() => {
        setSuccess(false)
        setSelectedBuyer(null)
        setQuantity('')
        setWalletName('')
        setWalletNumber('')
      }, 2500)
    } else {
      alert("Error: " + error.message)
      setProcessing(false)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-400"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6 pb-24 pt-4 px-1">
      
      {/* --- HEADER & INVENTORY --- */}
      <div className="px-2">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Sell Zone</h1>
            <p className="text-emerald-400/60 text-xs uppercase tracking-widest">Instant Cashout</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-white/40 uppercase">Your Inventory</p>
             <p className="text-xl font-bold text-amber-400 flex items-center justify-end gap-1">
               {myEggs} <span className="text-sm text-white/60">Eggs</span>
             </p>
          </div>
        </div>
        
        {/* Ticker */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs text-white/60">Live Market Rates</p>
          </div>
          <p className="text-xs font-mono text-emerald-400">Updates every 30s</p>
        </div>
      </div>

      {/* --- BUYERS LIST (Original UI) --- */}
      <div className="grid gap-4 px-1">
        {buyers.map((buyer, idx) => (
          <motion.div
            key={buyer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="shiny-card relative bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-colors"
          >
            {buyer.tag && (
               <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10">
                 {buyer.tag}
               </div>
            )}

            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white border border-white/10">
                  {buyer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-white text-sm">{buyer.name}</h3>
                    {buyer.is_verified && <ShieldCheck size={14} className="text-blue-400" />}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/50">
                    <span className="text-emerald-400">{buyer.completion_rate} completion</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star size={10} fill="currentColor" /> {buyer.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase">Price</p>
                <h2 className="text-xl font-bold text-emerald-400">Rs {buyer.rate}</h2>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 bg-black/20 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                 <Clock size={12} className="text-white/40" />
                 <span className="text-xs text-white/60">{buyer.time_limit}</span>
              </div>
              <div className="text-xs text-white/60">
                Limit: <span className="text-white font-medium">{buyer.min_limit} - {buyer.max_limit}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {buyer.methods.map((m: string, i: number) => (
                  <span key={i} className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/40 border border-white/5">
                    {m}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => setSelectedBuyer(buyer)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2 rounded-lg shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
              >
                Sell
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- SELL MODAL --- */}
      <AnimatePresence>
        {selectedBuyer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 relative overflow-hidden">
              <button onClick={() => setSelectedBuyer(null)} className="absolute top-4 right-4 text-white/40"><X size={20} /></button>

              {success ? (
                <div className="text-center py-10">
                  <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Request Sent!</h2>
                  <p className="text-white/60 text-sm">Admin will transfer funds after verification.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-white text-xl">{selectedBuyer.name.charAt(0)}</div>
                    <div>
                      <p className="text-xs text-white/40 uppercase">Selling to</p>
                      <h3 className="font-bold text-white text-lg">{selectedBuyer.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      <span className="text-sm text-emerald-300">Rate</span>
                      <span className="font-bold text-emerald-400">Rs {selectedBuyer.rate}</span>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] text-white/40 uppercase ml-1">Quantity</label>
                       <div className="relative">
                         <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={`w-full bg-white/5 border ${isOverLimit ? 'border-red-500' : 'border-white/10'} rounded-xl p-4 text-white font-bold outline-none`} placeholder="0" />
                         <button onClick={() => setQuantity(myEggs.toString())} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-amber-400 font-bold">MAX</button>
                       </div>
                       {isOverLimit && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> Aapke paas sirf {myEggs} eggs hain.</p>}
                    </div>

                    {/* NEW: Wallet Info Fields */}
                    <div className="space-y-2">
                       <div className="flex gap-2 mb-2">
                         {['Ubank', 'EasyPaisa'].map(m => (
                           <button key={m} onClick={() => setWalletMethod(m)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border ${walletMethod === m ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>{m}</button>
                         ))}
                       </div>
                       <div className="relative">
                         <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                         <input type="text" placeholder="Account Name" value={walletName} onChange={(e) => setWalletName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white text-sm outline-none" />
                       </div>
                       <div className="relative">
                         <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                         <input type="text" placeholder="Wallet Number" value={walletNumber} onChange={(e) => setWalletNumber(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white text-sm font-mono outline-none" />
                       </div>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                       <p className="text-xs text-white/40">Receiving</p>
                       <p className="text-2xl font-black text-white"><span className="text-sm text-amber-400 mr-1">PKR</span>{totalAmount}</p>
                    </div>

                    <button onClick={handleSell} disabled={!quantity || isOverLimit || !walletName || !walletNumber || processing} className="w-full py-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center gap-2 btn-gold disabled:opacity-50 transition-all">
                      {processing ? <Loader2 className="animate-spin" size={20}/> : <><Banknote size={20} /> Sell Now</>}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}