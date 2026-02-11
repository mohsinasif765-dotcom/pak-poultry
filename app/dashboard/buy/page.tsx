'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  ShoppingBag, TrendingUp, Clock, CheckCircle2, 
  AlertCircle, X, Copy, Hash, Loader2 
} from 'lucide-react'

export default function BuyPage() {
  const supabase = createClient()
  
  // Data States
  const [packages, setPackages] = useState<any[]>([])
  const [adminInfo, setAdminInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Interaction States
  const [selectedPkg, setSelectedPkg] = useState<any>(null)
  const [method, setMethod] = useState<'Ubank' | 'EasyPaisa' | null>(null)
  const [trxId, setTrxId] = useState('')
  const [buying, setBuying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.rpc('get_buy_screen_data')
      if (data) {
        setPackages(data.packages)
        setAdminInfo(data.admin)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePurchaseRequest = async () => {
    if (!trxId || !method) return
    setBuying(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('hen_purchase_requests').insert({
      user_id: user?.id,
      package_id: selectedPkg.id,
      amount: selectedPkg.price,
      method: method,
      trx_id: trxId
    })

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setSelectedPkg(null)
        setTrxId('')
        setMethod(null)
      }, 3000)
    } else {
      alert(error.message)
    }
    setBuying(false)
  }

  if (loading) return <div className="h-[60vh] flex items-center justify-center text-emerald-400"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6 pb-24 pt-4 px-1">
      
      {/* --- HEADER --- */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-white">Poultry Market</h1>
        <p className="text-emerald-400/60 text-xs uppercase tracking-widest">Invest & Grow Daily</p>
      </div>

      {/* --- MARKET INFO TICKER --- */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-3 mx-2">
        <div className="bg-amber-500/20 p-2 rounded-lg"><TrendingUp size={16} className="text-amber-400" /></div>
        <p className="text-xs text-amber-200/80">
          <span className="font-bold text-amber-400">Market Trend:</span> Egg prices are stable. Buy hens now to secure future profits.
        </p>
      </div>

      {/* --- PACKAGES GRID (Dynamic) --- */}
      <div className="grid grid-cols-1 gap-4 px-1">
        {packages.map((pkg, idx) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative shiny-card p-5 rounded-3xl overflow-hidden group border
              ${pkg.type === 'gold' ? 'border-amber-500/40 bg-gradient-to-br from-amber-900/20 to-black' : 
                pkg.type === 'diamond' ? 'border-blue-400/40 bg-gradient-to-br from-blue-900/20 to-black' : 
                'border-white/10 bg-white/5'}`}
          >
            {pkg.is_hot && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">HOT</div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-white/5 border border-white/10">
                  {pkg.image_emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-md">ROI: {pkg.roi_text}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-black/20 p-2 rounded-xl text-center">
                <p className="text-[10px] text-white/40 uppercase">Price</p>
                <p className="text-sm font-bold text-white">Rs {pkg.price}</p>
              </div>
              <div className="bg-black/20 p-2 rounded-xl text-center">
                <p className="text-[10px] text-white/40 uppercase">Daily</p>
                <p className="text-sm font-bold text-emerald-400">Rs {pkg.daily_profit}</p>
              </div>
              <div className="bg-black/20 p-2 rounded-xl text-center">
                <p className="text-[10px] text-white/40 uppercase">Days</p>
                <p className="text-sm font-bold text-amber-400">{pkg.duration}</p>
              </div>
            </div>

            <button onClick={() => setSelectedPkg(pkg)} className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> Buy Now
            </button>
          </motion.div>
        ))}
      </div>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {selectedPkg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative overflow-hidden">
              <button onClick={() => setSelectedPkg(null)} className="absolute top-4 right-4 text-white/40"><X size={20} /></button>

              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={50} className="text-green-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-bold text-white">Request Sent!</h2>
                  <p className="text-white/40 text-sm">Hens will be added after TRX verification.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white">Pay PKR {selectedPkg.price}</h2>
                    <p className="text-xs text-white/40 mt-1">Send payment to one of these accounts:</p>
                  </div>

                  {/* Method Selector & Copy Numbers */}
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setMethod('Ubank')} className={`p-3 rounded-2xl border text-[10px] font-bold ${method === 'Ubank' ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>Ubank</button>
                    <button onClick={() => setMethod('EasyPaisa')} className={`p-3 rounded-2xl border text-[10px] font-bold ${method === 'EasyPaisa' ? 'bg-green-600 border-green-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}>EasyPaisa</button>
                  </div>

                  {method && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">{method} Number</p>
                        <p className="text-lg font-bold text-white font-mono">{method === 'Ubank' ? adminInfo.ubank : adminInfo.easypaisa}</p>
                      </div>
                      <button onClick={() => handleCopy(method === 'Ubank' ? adminInfo.Ubank : adminInfo.easypaisa)} className="p-2 bg-emerald-500 rounded-lg text-emerald-950">
                        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      </button>
                    </motion.div>
                  )}

                  {/* TRX ID Input */}
                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] text-white/40 uppercase ml-1 flex items-center gap-1"><Hash size={10}/> Transaction ID (TRX)</label>
                    <input type="text" placeholder="Enter TRX ID" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-mono outline-none focus:border-emerald-500" />
                  </div>

                  <button onClick={handlePurchaseRequest} disabled={!trxId || !method || buying} className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    {buying ? <Loader2 className="animate-spin" size={20}/> : "Submit Payment"}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}