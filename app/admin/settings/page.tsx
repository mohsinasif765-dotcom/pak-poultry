'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  Save, 
  Phone, 
  Loader2, 
  CheckCircle2,
  ArrowLeft,
  Download,
  Smartphone 
} from 'lucide-react'
import Link from 'next/link'

export default function AdminSettings() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  // PWA states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBtn, setShowInstallBtn] = useState(false)

  const [rates, setRates] = useState({
    selling_rate: 30,
    p1_price: 500,
    p2_price: 2500,
    p3_price: 5000,
    p4_price: 25000,
    Ubank: '',
    easypaisa: ''
  })

  useEffect(() => {
    // 1. PWA Install Logic
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBtn(true)
    })

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false)
    }

    // 2. Fetch Data
    async function fetchCurrentSettings() {
      const { data: settings } = await supabase.from('admin_settings').select('*').eq('id', 1).single()
      const { data: pkgs } = await supabase.from('hen_packages').select('name, price')
      
      if (settings && pkgs) {
        setRates({
          selling_rate: settings.egg_rate_pkr,
          Ubank: settings.Ubank_number || '',
          easypaisa: settings.easypaisa_number || '',
          p1_price: pkgs.find((p: any) => p.name === 'Starter Hen')?.price || 500,
          p2_price: pkgs.find((p: any) => p.name === 'Bronze Flock')?.price || 2500,
          p3_price: pkgs.find((p: any) => p.name === 'Golden Layer')?.price || 5000,
          p4_price: pkgs.find((p: any) => p.name === 'Diamond Farm')?.price || 25000,
        })
      }
      setLoading(false)
    }
    fetchCurrentSettings()
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowInstallBtn(false)
    setDeferredPrompt(null)
  }

  const handleUpdate = async () => {
    setUpdating(true)
    const { error } = await supabase.rpc('update_admin_rates', {
      s_rate: Number(rates.selling_rate),
      p1: Number(rates.p1_price),
      p2: Number(rates.p2_price),
      p3: Number(rates.p3_price),
      p4: Number(rates.p4_price),
      u_no: String(rates.Ubank),
      e_no: String(rates.easypaisa)
    })

    if (!error) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setUpdating(false)
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-amber-400 bg-[#022c22]">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#022c22] text-white pb-32 pt-6 px-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white/5 rounded-full border border-white/10">
            <ArrowLeft size={20} />
            </Link>
            <div>
            <h1 className="text-2xl font-black text-white">Admin Config</h1>
            <p className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-widest">Accounts & App</p>
            </div>
        </div>

        {/* PWA INSTALL BUTTON (Header) */}
        {showInstallBtn && (
            <button 
                onClick={handleInstall}
                className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-xl text-amber-400 font-bold text-[10px] uppercase tracking-wider active:scale-95 transition-all"
            >
                <Download size={14} /> Install
            </button>
        )}
      </div>

      <div className="space-y-6">

        {/* --- INSTALL APP CARD --- */}
        {showInstallBtn && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleInstall}
                className="relative overflow-hidden p-6 rounded-[32px] bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 cursor-pointer shadow-2xl shadow-amber-400/20 group"
            >
                {/* Decorative background icon */}
                <Smartphone className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-950/10 rounded-lg">
                            <Download size={20} />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-tighter opacity-70">App Installation</span>
                    </div>
                    <h3 className="text-xl font-black leading-tight mb-1">Install Admin App</h3>
                    <p className="text-[11px] font-bold opacity-80 leading-relaxed max-w-[200px]">
                        Access your dashboard directly from your home screen for faster control.
                    </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-emerald-950 rounded-full text-amber-400 shadow-xl group-hover:translate-x-1 transition-transform">
                    <Download size={20} />
                </div>
            </motion.div>
        )}
        
        {/* PAYMENT GATEWAYS CARD */}
        <div className="shiny-card p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-purple-400">
            <Phone size={18} />
            <h3 className="font-bold text-sm uppercase tracking-tight">Deposit Accounts</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] text-white/40 uppercase font-bold ml-1">Sadapay Number</label>
              <input 
                type="text"
                value={rates.Ubank}
                onChange={(e) => setRates({...rates, Ubank: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 mt-1 text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all"
                placeholder="Enter Sadapay Number"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase font-bold ml-1">Jazz Cash Number</label>
              <input 
                type="text"
                value={rates.easypaisa}
                onChange={(e) => setRates({...rates, easypaisa: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 mt-1 text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all"
                placeholder="Enter Jazz Cash Number"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpdate}
          disabled={updating}
          className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg
            ${success ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-amber-400 text-emerald-950 shadow-amber-400/20'}`}
        >
          {updating ? (
            <Loader2 className="animate-spin" size={20} />
          ) : success ? (
            <><CheckCircle2 size={20} /> Data Saved</>
          ) : (
            <><Save size={20} /> Save Settings</>
          )}
        </motion.button>

      </div>
    </div>
  )
}