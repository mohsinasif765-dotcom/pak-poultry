'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
// Note: Ab hum 'createClient' import kar rahe hain, direct 'supabase' nahi
import { createClient } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthForm() {
  const supabase = createClient() // Yahan client initiate karein (Cookie support ke sath)
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const referralCode = searchParams.get('ref')

  const checkUsername = async () => {
    if (isLogin || username.length < 3) return
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single()

    setIsAvailable(error && error.code === 'PGRST116' ? true : false)
    setLoading(false)
  }

  const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault()
  setErrorMsg('')
  setAuthLoading(true)

  const dummyEmail = `${phone}@pakpoultry.com`

  try {
    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({
          email: dummyEmail,
          password: password,
        })
      : await supabase.auth.signUp({
          email: dummyEmail,
          password: password,
          options: {
            data: {
              username: username.toLowerCase(),
              phone_number: phone,
              referred_by: referralCode || null,
            },
          },
        })

    if (error) throw error

    // --- NAYA LOGIC YAHAN SE SHURU HOTA HAI ---
    const user = data.user
    if (user) {
      // Profile se role nikalain
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.role === 'admin'
      
      router.refresh()
      
      setTimeout(() => {
        // Role ke mutabiq rasta tay karein
        const target = isAdmin ? '/admin' : '/dashboard'
        console.log("Redirecting to:", target)
        router.push(target)
      }, 500)
    }
    // --- NAYA LOGIC KHATAM ---

  } catch (error: any) {
    setErrorMsg(error.message || "Authentication failed")
    setAuthLoading(false)
  }
}

  return (
    <div className="w-full min-h-[500px] flex items-center justify-center px-4 sm:px-0">
      <div className="w-full max-w-sm perspective-1000">
        <motion.div
          initial={false}
          animate={{ rotateY: isLogin ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full h-full"
        >
          {/* --- SIGN UP SIDE --- */}
          <div 
            className="shiny-card p-6 sm:p-8 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create Account</h2>
              <p className="text-emerald-400/70 text-xs sm:text-sm mt-1 uppercase tracking-widest font-medium">Pak Poultry Business</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1">
                <label className="text-emerald-100/50 text-[10px] uppercase tracking-tighter ml-1">Username</label>
                <input
                  type="text"
                  required
                  className={`w-full p-4 rounded-2xl bg-white/5 border ${isAvailable === true ? 'border-green-500/50' : isAvailable === false ? 'border-red-500/50' : 'border-white/10'} text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-white/10`}
                  placeholder="Unique Username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value.replace(/\s+/g, '')); setIsAvailable(null) }}
                  onBlur={checkUsername}
                />
              </div>

              <div className="space-y-1">
                <label className="text-emerald-100/50 text-[10px] uppercase tracking-tighter ml-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-white/10"
                  placeholder="03xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-emerald-100/50 text-[10px] uppercase tracking-tighter ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-white/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errorMsg && <div className="text-red-400 text-[11px] text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{errorMsg}</div>}

              <button type="submit" disabled={authLoading || (isAvailable === false && !isLogin)} className="btn-gold w-full mt-2 py-4 text-base font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-transform">
                {authLoading ? 'Processing...' : 'Join Now'}
              </button>
            </form>

            <button type="button" onClick={() => { setIsLogin(true); setErrorMsg('') }} className="w-full mt-6 text-emerald-400/80 text-xs font-medium hover:text-amber-400 transition-colors">
              Already have an account? <span className="underline underline-offset-4">Sign In</span>
            </button>
          </div>

          {/* --- SIGN IN SIDE --- */}
          <div 
            className="shiny-card p-6 sm:p-8 absolute top-0 left-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-emerald-400/70 text-xs sm:text-sm mt-1 uppercase tracking-widest font-medium">Pak Poultry Business</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1">
                <label className="text-emerald-100/50 text-[10px] uppercase tracking-tighter ml-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-white/10"
                  placeholder="03xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-emerald-100/50 text-[10px] uppercase tracking-tighter ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-white/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errorMsg && <div className="text-red-400 text-[11px] text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{errorMsg}</div>}

              <button type="submit" disabled={authLoading} className="btn-gold w-full mt-2 py-4 text-base font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-transform">
                {authLoading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>

            <button type="button" onClick={() => { setIsLogin(false); setErrorMsg('') }} className="w-full mt-6 text-emerald-400/80 text-xs font-medium hover:text-amber-400 transition-colors">
              New to the farm? <span className="underline underline-offset-4">Create Account</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}