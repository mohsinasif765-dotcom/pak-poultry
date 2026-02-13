'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Headphones, 
  MessageCircle, 
  Mail, 
  ChevronDown, 
  Clock,
  HelpCircle,
  Users
} from 'lucide-react'

// Support Data
const supportContact = {
  whatsapp: "923257343008", // Updated number without + for URL
  communityLink: "https://whatsapp.com/channel/0029VbCBme959PwNIGWW6q1J",
  email: "support@pakpoultry.com",
  timing: "10:00 AM - 10:00 PM"
}

// Frequently Asked Questions
const faqs = [
  {
    question: "Deposit verify hone mein kitna waqt lagta hai?",
    answer: "Aam taur par 10 se 30 minute lagte hain. Agar 1 ghantay se zyada ho jaye to payment screenshot ke sath WhatsApp par rabta karein."
  },
  {
    question: "Withdrawal fees kitni hai?",
    answer: "Har withdrawal par sirf 2% processing fee kat'ti hai. Minimum withdrawal limit 500 PKR hai."
  },
  {
    question: "Kya main multiple accounts bana sakta hun?",
    answer: "Nahi, aik mobile aur aik IP par sirf aik account allowed hai. Multiple accounts banane par dono block ho jayen ge."
  },
  {
    question: "Referral bonus kab milta hai?",
    answer: "Jab aapka friend pehli hen (package) buy karta hai, to aapko foran 10% commission wallet mein mil jata hai."
  }
]

export default function HelpPage() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const openWhatsApp = () => {
    window.open(`https://wa.me/${supportContact.whatsapp}?text=Hello! Mujhe Pak Poultry app mein help chahiye.`, '_blank')
  }

  const openCommunity = () => {
    window.open(supportContact.communityLink, '_blank')
  }

  return (
    <div className="min-h-screen space-y-6 pb-24 pt-4 px-4 bg-[#022c22]">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 pt-2">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="text-white w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white">Help Center</h1>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="text-center py-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-black rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl">
            <Headphones className="w-10 h-10 text-blue-400" />
            <div className="absolute -top-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-black animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">How can we help?</h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-emerald-400/60 text-xs">
          <Clock size={12} />
          <span>Support Active: {supportContact.timing}</span>
        </div>
      </div>

      {/* --- DIRECT SUPPORT CARDS --- */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* WhatsApp Button */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={openWhatsApp}
          className="shiny-card bg-green-600/20 border-green-500/30 p-4 rounded-2xl flex flex-col items-center gap-3 group hover:bg-green-600/30 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
            <MessageCircle className="text-white w-6 h-6 fill-white" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">WhatsApp</p>
            <p className="text-[10px] text-green-300">Contact Admin</p>
          </div>
        </motion.button>

        {/* Community Button */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={openCommunity}
          className="shiny-card bg-amber-600/20 border-amber-500/30 p-4 rounded-2xl flex flex-col items-center gap-3 group hover:bg-amber-600/30 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <Users className="text-white w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">whatsaap Channel</p>
            <p className="text-[10px] text-amber-300">Join Group</p>
          </div>
        </motion.button>
      </div>

      {/* --- EMAIL SUPPORT (FULL WIDTH) --- */}
      <motion.button 
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
          <Mail className="text-white w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-white font-bold text-sm">Email Us</p>
          <p className="text-[10px] text-white/40">{supportContact.email}</p>
        </div>
      </motion.button>

      {/* --- FAQ SECTION --- */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-white mb-4 px-1 flex items-center gap-2">
          <HelpCircle size={18} className="text-amber-400" />
          Common Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden"
            >
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-white/40 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-amber-400' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-xs text-emerald-100/60 leading-relaxed border-t border-white/5 bg-black/20">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER NOTE --- */}
      <div className="text-center pt-8 pb-4">
        <p className="text-[10px] text-white/20">
          Ticket ID: <span className="text-white/40 font-mono">#SUP-{Math.floor(Math.random() * 9000) + 1000}</span>
        </p>
      </div>

    </div>
  )
}