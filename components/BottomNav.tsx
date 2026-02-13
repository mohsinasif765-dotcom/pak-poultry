'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, ShoppingBasket, Wallet, Users, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const navItems = [
  { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Team', icon: Users, path: '/dashboard/team' },
  { name: 'Buy', icon: ShoppingBasket, path: '/dashboard/buy', isCenter: true },
  { name: 'Wallet', icon: Wallet, path: '/dashboard/wallet' },
  { name: 'Profile', icon: User, path: '/dashboard/profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
      {/* Main Glassy Bar */}
      <div className="relative flex items-center justify-around bg-emerald-950/90 backdrop-blur-2xl border border-white/10 px-2 py-3 rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          // --- Central Floating Button (Buy Hen) ---
          if (item.isCenter) {
            return (
              <div key={item.name} className="relative w-16 h-12 flex justify-center">
                <Link href={item.path} className="absolute -top-12">
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-4 rounded-full shadow-[0_10px_25px_rgba(251,191,36,0.5)] border-[6px] border-[#022c22] flex items-center justify-center"
                  >
                    <Icon className="w-7 h-7 text-emerald-950" strokeWidth={2.5} />
                  </motion.div>
                  <span className={`absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-tighter text-center w-max ${isActive ? 'text-amber-400' : 'text-emerald-500/50'}`}>
                    Buy Hen
                  </span>
                </Link>
              </div>
            )
          }

          // --- Standard Buttons ---
          return (
            <Link
              key={item.name}
              href={item.path}
              className="flex flex-col items-center justify-center w-12 gap-1 group"
            >
              <motion.div
                animate={isActive ? { y: -8, scale: 1.2 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`${isActive ? 'text-amber-400' : 'text-emerald-500/40 group-hover:text-emerald-400/80'}`}
              >
                <Icon className="w-6 h-6" />
                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" 
                  />
                )}
              </motion.div>
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-white' : 'text-emerald-500/40'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}