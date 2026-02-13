'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { requestForToken } from '@/lib/firebase'
import { 
  Phone, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Headphones, 
  FileText,
  Copy,
  CheckCircle2,
  Crown,
  Wallet,
  History,
  Loader2,
  Fingerprint,
  Scale,
  BellRing,
  Download,
  Smartphone // Naya icon card k liye
} from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [fetching, setFetching] = useState(true)

  // --- PWA INSTALL LOGIC ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false);
    }

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const token = await requestForToken()
        if (token) {
          await supabase
            .from('profiles')
            .update({ fcm_token: token })
            .eq('id', user.id)
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        const { data: investments } = await supabase
          .from('investments')
          .select('package_name')
          .eq('user_id', user.id)
          .eq('status', 'active')

        let level = 'Beginner'
        const packages = investments?.map(i => i.package_name) || []
        
        if (packages.includes('Diamond Farm')) level = 'Diamond Investor'
        else if (packages.includes('Golden Layer')) level = 'Golden Investor'
        else if (packages.includes('Bronze Flock')) level = 'Bronze Investor'
        else if (packages.includes('Starter Hen')) level = 'Basic Investor'

        setProfile({
          ...profileData,
          level: level,
          displayId: user.id.slice(0, 8).toUpperCase()
        })
      }
      setFetching(false)
    }
    getProfile()
  }, [])

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const handleCopyID = () => {
    if (!profile) return
    navigator.clipboard.writeText(profile.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.replace('/') 
  }

  if (fetching) return (
    <div className="h-[80vh] flex items-center justify-center text-amber-400">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )

  return (
    <div className="space-y-6 pb-24 pt-4 px-1">
      
      {/* --- HEADER & AVATAR --- */}
      <div className="relative flex flex-col items-center justify-center py-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-500 to-amber-600 p-[3px] shadow-[0_0_30px_rgba(251,191,36,0.3)]">
          <div className="w-full h-full bg-[#022c22] rounded-full flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-yellow-600">
              {profile?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {profile?.level === 'Diamond Investor' && (
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-[#022c22] flex items-center gap-1 shadow-lg">
              <Crown size={12} className="text-yellow-300" fill="currentColor" />
              <span>PRO</span>
            </div>
          )}
        </div>

        <div className="text-center mt-4 z-10">
          <h1 className="text-2xl font-bold text-white">@{profile?.username}</h1>
          <p className="text-emerald-400/60 text-sm font-medium">Verified Poultry Partner</p>
        </div>

        <button 
          onClick={handleCopyID}
          className="mt-3 flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono italic">ID: {profile?.displayId}</span>
          {copied ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} className="text-emerald-400" />}
        </button>
      </div>

      {/* --- INSTALL APP CARD (NEW) --- */}
      {showInstallBtn && (
        <div className="px-2">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleInstallApp}
                className="relative overflow-hidden p-6 rounded-[32px] bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 cursor-pointer shadow-2xl shadow-amber-400/20 group"
            >
                <Smartphone className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-950/10 rounded-lg">
                            <Download size={20} />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-tighter opacity-70">App Installation</span>
                    </div>
                    <h3 className="text-xl font-black leading-tight mb-1">Install Pak Poultry App</h3>
                    <p className="text-[11px] font-bold opacity-80 leading-relaxed max-w-[220px]">
                        Get a smoother experience by adding the app to your home screen.
                    </p>
                </div>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-emerald-950 rounded-full text-amber-400 shadow-xl group-hover:translate-x-1 transition-transform">
                    <Download size={20} />
                </div>
            </motion.div>
        </div>
      )}

      {/* --- INFO CARDS --- */}
      <div className="space-y-4 px-2">
        <div className="space-y-2">
          <p className="text-[10px] text-emerald-400/50 uppercase tracking-widest font-black ml-4">Security & Identity</p>
          <div className="shiny-card rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl">
            <ProfileItem icon={Phone} label="Phone Number" value={profile?.phone_number || 'Not Linked'} />
            <div className="h-[1px] bg-white/5 mx-4" />
            <ProfileItem icon={Shield} label="Account Level" value={profile?.level} highlight />
            <div className="h-[1px] bg-white/5 mx-4" />
            <ProfileItem icon={Fingerprint} label="Member Status" value="Active Account" />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-[10px] text-emerald-400/50 uppercase tracking-widest font-black ml-4">Quick Actions</p>
          <div className="shiny-card rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl">
            <ActionItem 
              icon={Wallet} 
              label="My Wallet" 
              onClick={() => router.push('/dashboard/wallet')}
            />
            <div className="h-[1px] bg-white/5 mx-4" />
            <ActionItem 
              icon={History} 
              label="Transaction History" 
              onClick={() => router.push('/dashboard/history')}
            />
           
            {showInstallBtn && (
              <>
                <div className="h-[1px] bg-white/5 mx-4" />
                <ActionItem 
                  icon={Download} 
                  label="Install Pak Poultry App" 
                  onClick={handleInstallApp}
                  highlighted
                />
              </>
            )}
            <div className="h-[1px] bg-white/5 mx-4" />
            <ActionItem 
              icon={Headphones} 
              label="Help & Support" 
              onClick={() => router.push('/dashboard/profile/help')}
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-[10px] text-emerald-400/50 uppercase tracking-widest font-black ml-4">Legal & Policies</p>
          <div className="shiny-card rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl">
            <ActionItem 
              icon={Scale} 
              label="Terms & Conditions" 
              onClick={() => router.push('/dashboard/profile/terms')}
            />
            <div className="h-[1px] bg-white/5 mx-4" />
            <ActionItem 
              icon={BellRing} 
              label="App Notifications" 
              value="Enable push alerts"
              onClick={async () => {
                const token = await requestForToken();
                if(token) alert("Notifications Enabled Successfully!");
              }}
            />
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full mt-6 flex items-center justify-center gap-2 py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <LogOut size={18} />
              <span>Secure Logout</span>
            </>
          )}
        </motion.button>

        <p className="text-center text-[9px] text-emerald-400/20 pt-4 pb-8 font-mono">
          Pak Poultry Secure Session • 1.0.4-STABLE
        </p>
      </div>
    </div>
  )
}

function ProfileItem({ icon: Icon, label, value, highlight = false }: any) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
          <Icon size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-[9px] text-white/30 uppercase font-black tracking-tighter">{label}</p>
          <p className={`text-sm font-black ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</p>
        </div>
      </div>
    </div>
  )
}

function ActionItem({ icon: Icon, label, onClick, highlighted = false }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group ${highlighted ? 'bg-amber-400/5' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors border border-white/5 ${highlighted ? 'border-amber-400/20' : ''}`}>
          <Icon size={18} className={`${highlighted ? 'text-amber-400' : 'text-white'} group-hover:text-amber-400 transition-colors`} />
        </div>
        <p className={`text-sm font-bold ${highlighted ? 'text-amber-400' : 'text-white/80'} group-hover:text-white transition-colors tracking-tight`}>{label}</p>
      </div>
      <ChevronRight size={18} className="text-white/10 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
    </button>
  )
}