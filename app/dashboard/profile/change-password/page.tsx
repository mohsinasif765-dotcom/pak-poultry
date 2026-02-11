'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2,
  KeyRound
} from 'lucide-react'

export default function ChangePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Password Update Logic
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic Validation
    if (newPass.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    if (newPass !== confirmPass) {
      setError('New passwords do not match.')
      setLoading(false)
      return
    }

    try {
      // Supabase Update Call
      const { error } = await supabase.auth.updateUser({ 
        password: newPass 
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.back() // Wapis Profile par
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Strength Meter Calculation
  const getStrength = (pass: string) => {
    if (pass.length === 0) return 0
    if (pass.length < 6) return 1
    if (pass.length < 10) return 2
    return 3
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
        <h1 className="text-xl font-bold text-white">Security</h1>
      </div>

      {/* --- HERO ICON --- */}
      <div className="flex justify-center py-6">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-800 to-black rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
            <div className="absolute -bottom-2 -right-2 bg-amber-500 p-1.5 rounded-full border-2 border-black">
              <KeyRound size={14} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Change Password</h2>
        <p className="text-emerald-400/60 text-xs mt-1">
          Create a strong password to protect your assets.
        </p>
      </div>

      {/* --- FORM --- */}
      <form onSubmit={handleUpdate} className="space-y-4">
        
        {/* Helper Component for Inputs (Defined below) */}
        <PasswordInput 
          label="Current Password" 
          value={currentPass} 
          onChange={setCurrentPass} 
          placeholder="Enter current password"
        />

        <div className="relative">
          <PasswordInput 
            label="New Password" 
            value={newPass} 
            onChange={setNewPass} 
            placeholder="Min 6 characters"
          />
          
          {/* Strength Meter */}
          <div className="flex gap-1 mt-2 px-1">
            {[1, 2, 3].map((level) => (
              <div 
                key={level}
                className={`h-1 flex-1 rounded-full transition-all duration-500
                  ${getStrength(newPass) >= level 
                    ? (level === 1 ? 'bg-red-500' : level === 2 ? 'bg-yellow-500' : 'bg-green-500') 
                    : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>

        <PasswordInput 
          label="Confirm New Password" 
          value={confirmPass} 
          onChange={setConfirmPass} 
          placeholder="Re-enter new password"
        />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3"
            >
              <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
              <p className="text-xs text-red-200">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading || !currentPass || !newPass || !confirmPass}
          className={`w-full py-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center gap-2 transition-all
            ${loading 
              ? 'bg-white/5 text-white/20 cursor-not-allowed' 
              : 'btn-gold shadow-lg shadow-amber-500/20 active:scale-95'}`}
        >
          {loading ? (
            <span className="animate-pulse">Updating...</span>
          ) : (
            'Update Password'
          )}
        </button>

      </form>

      {/* --- SUCCESS MODAL --- */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0f172a] border border-white/10 w-full max-w-xs rounded-3xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password Updated!</h2>
              <p className="text-white/60 text-sm">Your account is now secure with the new password.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- REUSABLE PASSWORD INPUT COMPONENT ---
function PasswordInput({ label, value, onChange, placeholder }: any) {
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-1">
      <label className="text-emerald-400/60 text-[10px] uppercase tracking-widest ml-1 font-bold">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock size={16} className="text-white/40" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-xl py-4 pl-10 pr-12 text-white placeholder:text-white/20 focus:outline-none transition-all"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}