'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  Save, 
  TrendingUp, 
  ShoppingBag, 
  Phone, 
  Loader2, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface PriceInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export default function AdminSettings() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

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

  const handleUpdate = async () => {
  setUpdating(true)
  
  // ORDER MATTERS: Jis tarteeb mein SQL mein hain, usi mein bhejain
  const { error } = await supabase.rpc('update_admin_rates', {
    s_rate: Number(rates.selling_rate),
    p1: Number(rates.p1_price),
    p2: Number(rates.p2_price),
    p3: Number(rates.p3_price),
    p4: Number(rates.p4_price),
    u_no: String(rates.Ubank),
    e_no: String(rates.easypaisa)
  })

  if (error) {
    console.error("RPC Error:", error)
    alert("Error: " + error.message)
  } else {
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
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 bg-white/5 rounded-full border border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">Rates & Config</h1>
          <p className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-widest">Global Farm Settings</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="shiny-card p-6 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <TrendingUp size={18} />
            <h3 className="font-bold text-sm uppercase tracking-tight">Market Selling Rate</h3>
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase font-bold">User Sells 1 Egg For (PKR)</label>
            <input 
              type="number"
              value={rates.selling_rate}
              onChange={(e) => setRates({...rates, selling_rate: Number(e.target.value)})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 mt-1 text-xl font-black text-emerald-400 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="shiny-card p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <ShoppingBag size={18} />
            <h3 className="font-bold text-sm uppercase tracking-tight">Hen Buying Prices</h3>
          </div>
          <div className="space-y-4">
            <PriceInput label="Starter Hen" value={rates.p1_price} onChange={(val) => setRates({...rates, p1_price: val})} />
            <PriceInput label="Bronze Flock" value={rates.p2_price} onChange={(val) => setRates({...rates, p2_price: val})} />
            <PriceInput label="Golden Layer" value={rates.p3_price} onChange={(val) => setRates({...rates, p3_price: val})} />
            <PriceInput label="Diamond Farm" value={rates.p4_price} onChange={(val) => setRates({...rates, p4_price: val})} />
          </div>
        </div>

        <div className="shiny-card p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-purple-400">
            <Phone size={18} />
            <h3 className="font-bold text-sm uppercase tracking-tight">Payment Gateways</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 uppercase font-bold">Ubank Number</label>
              <input 
                type="text"
                value={rates.Ubank}
                onChange={(e) => setRates({...rates, Ubank: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mt-1 text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase font-bold">EasyPaisa Number</label>
              <input 
                type="text"
                value={rates.easypaisa}
                onChange={(e) => setRates({...rates, easypaisa: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 mt-1 text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpdate}
          disabled={updating}
          className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg
            ${success ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-amber-400 text-emerald-950 shadow-amber-400/20'}`}
        >
          {updating ? <Loader2 className="animate-spin" size={20} /> : success ? <><CheckCircle2 size={20} /> Updated Successfully</> : <><Save size={20} /> Save Settings</>}
        </motion.button>
      </div>
    </div>
  )
}

function PriceInput({ label, value, onChange }: PriceInputProps) {
  return (
    <div className="flex items-center justify-between gap-4 group">
      <label className="text-[11px] text-white/60 font-bold w-1/2 group-hover:text-white transition-colors">{label}</label>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20">PKR</span>
        <input 
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-3 text-sm font-bold text-white text-right focus:border-amber-400/50 outline-none transition-all"
        />
      </div>
    </div>
  )
}