'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  Users, 
  Copy, 
  CheckCircle2, 
  Trophy, 
  Share2, 
  UserX,
  Loader2,
  Egg,
  TrendingUp
} from 'lucide-react'

export default function TeamPage() {
  const supabase = createClient()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [teamData, setTeamData] = useState<any>(null)

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase.rpc('get_team_data')
        if (error) throw error
        if (data) setTeamData(data)
      } catch (err) {
        console.error("Team Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

 
  const directMembers = teamData?.members || []
  const referralLink = `https://pakpoultry.com/register?ref=${teamData?.username || 'user'}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center text-emerald-400">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )

  return (
    <div className="space-y-6 pb-24 pt-4 px-1">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-black text-white italic">My Poultry Team</h1>
          <p className="text-emerald-400/60 text-[10px] uppercase tracking-[0.3em] font-bold">Network Stats</p>
        </div>
        <div className="p-2 bg-amber-400/10 rounded-xl border border-amber-400/20">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      {/* --- STATS CARD --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 border border-white/10 p-8 shadow-2xl mx-1 group"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        
        <div className="relative z-10 text-center">
          <p className="text-emerald-300/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Total Team Eggs Earned</p>
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
               <Egg className="text-amber-400 w-8 h-8" />
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter">
              {teamData?.total_commission || 0}
            </h2>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-black/40 rounded-3xl p-4 border border-white/5">
              <p className="text-[9px] text-emerald-400/50 uppercase font-black mb-1">Direct Team</p>
              <p className="text-2xl font-black text-white">{teamData?.direct_count || 0}</p>
            </div>
            <div className="bg-black/40 rounded-3xl p-4 border border-white/5">
              <p className="text-[9px] text-emerald-400/50 uppercase font-black mb-1">Team Status</p>
              <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- INVITE SECTION --- */}
      <div className="shiny-card p-3 rounded-[2rem] bg-white/5 border border-white/10 flex items-center gap-3 mx-1">
        <div className="flex-1 bg-black/40 rounded-2xl px-4 py-4 border border-white/5 overflow-hidden">
          <p className="text-[10px] text-emerald-400/50 font-mono truncate">{referralLink}</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={copyToClipboard}
          className={`p-4 rounded-2xl transition-all shadow-lg ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-400 text-emerald-950 shadow-amber-400/20'}`}
        >
          {copied ? <CheckCircle2 size={24} /> : <Share2 size={24} />}
        </motion.button>
      </div>

      {/* --- DIRECT MEMBERS LIST --- */}
      <div className="px-1 mt-8">
        <div className="flex items-center justify-between mb-4 px-3">
          <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Users size={14} className="text-emerald-400" />
            Member Directory
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold">
            {directMembers.length} Joined
          </span>
        </div>

        <div className="space-y-3">
          {directMembers.length > 0 ? (
            directMembers.map((member: any, index: number) => (
              <motion.div 
                key={member.id} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="shiny-card p-4 rounded-3xl flex items-center justify-between bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border
                    ${member.status === 'active' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white/20'}`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold tracking-tight">{member.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${member.status === 'active' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                      <p className={`text-[9px] font-black uppercase tracking-widest ${member.status === 'active' ? 'text-emerald-400/60' : 'text-white/20'}`}>
                        {member.status}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right bg-black/20 p-3 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/30 uppercase font-bold mb-1">Bonus</p>
                  <p className="font-black text-amber-400 flex items-center justify-end gap-1 text-sm">
                    <Egg size={12} /> +{member.profit}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/2 rounded-[3rem] border border-dashed border-white/10">
              <UserX className="w-12 h-12 mx-auto mb-3 text-white/10" />
              <p className="text-xs font-black uppercase tracking-widest text-white/20">Empty Nest</p>
              <p className="text-[10px] mt-2 text-emerald-400/40 max-w-[150px] mx-auto leading-relaxed">Your team members will appear here once they join.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}