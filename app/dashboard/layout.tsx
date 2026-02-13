'use client'

import React from 'react'
import BottomNav from '@/components/BottomNav'
import { MessageCircle } from 'lucide-react' // WhatsApp k liye Lucide icon

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Number ko international format (92) mein rakha hai taake link sahi chale
  const whatsappNumber = "923257343008"
  
  return (
    <div className="min-h-screen bg-[#022c22] text-white pb-32 relative">
      {/* Main Content */}
      <main className="px-6 pt-6">
        {children}
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-28 right-6 z-[999] bg-[#25D366] p-4 rounded-full shadow-2xl shadow-green-500/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-white/10"
      >
        <MessageCircle size={28} className="text-white fill-current" />
        
        {/* Chota sa notification dot (Optional khubsurti k liye) */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#022c22] rounded-full animate-pulse"></span>
      </a>

      {/* Navigation Bar */}
      <BottomNav />
    </div>
  )
}