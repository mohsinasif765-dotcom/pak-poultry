'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  FileText, 
  ShieldAlert, 
  DollarSign, 
  UserX, 
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react'

const termsData = [
  {
    icon: UserX,
    title: "Account Rules",
    content: "One user can create only ONE account. Creating multiple accounts on the same device or IP address will result in a permanent ban without refund."
  },
  {
    icon: DollarSign,
    title: "Deposits & Withdrawals",
    content: "All deposits must be verified via screenshot. Withdrawals are processed within 24 hours. A standard 2% service fee applies to all cashouts."
  },
  {
    icon: ShieldAlert,
    title: "Anti-Fraud Policy",
    content: "Uploading fake payment screenshots or attempting to exploit the referral system will lead to immediate account suspension and freezing of assets."
  },
  {
    icon: Clock,
    title: "Package Duration",
    content: "Once a hen package is purchased, it cannot be cancelled. Daily profits will be credited automatically for the duration of the plan (30-60 days)."
  },
  {
    icon: Lock,
    title: "Privacy & Data",
    content: "Your phone number and payment details are encrypted. We do not share your personal data with any third-party advertisers."
  }
]

export default function TermsPage() {
  const router = useRouter()

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-[#022c22] space-y-6 pb-24 pt-4 px-4">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 pt-2">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="text-white w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white">Terms of Service</h1>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="text-center py-6 border-b border-white/5">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-800 to-black rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <FileText className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Usage Policy</h2>
        <p className="text-white/40 text-xs mt-1">Please read these rules carefully.</p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Last Updated: Feb 2026</span>
        </div>
      </div>

      {/* --- TERMS LIST --- */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {termsData.map((term, idx) => (
          <motion.div 
            key={idx} 
            variants={item}
            className="shiny-card p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-2 bg-black/20 rounded-lg border border-white/5">
                <term.icon size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                  {idx + 1}. {term.title}
                </h3>
                <p className="text-xs text-emerald-100/60 leading-relaxed">
                  {term.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- ACCEPTANCE FOOTER --- */}
      <div className="pt-4">
        <div className="flex items-start gap-3 p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
          <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
          <p className="text-[10px] text-emerald-200/70">
            By using Pak Poultry Business, you acknowledge that you have read and agreed to the terms listed above.
          </p>
        </div>
        
        <p className="text-center text-[10px] text-white/20 mt-6">
          © 2026 Pak Poultry Business. All rights reserved.
        </p>
      </div>

    </div>
  )
}