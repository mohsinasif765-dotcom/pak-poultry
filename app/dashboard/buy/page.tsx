'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { 
  TrendingUp, CheckCircle2, X, Copy, Hash, Loader2, 
  Minus, Plus, ImagePlus, Egg, Clock, CreditCard
} from 'lucide-react'

export default function BuyPage() {
  const supabase = createClient()
  
  // Data States
  const [adminInfo, setAdminInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Interaction States
  const [modalOpen, setModalOpen] = useState(false)
  const [quantity, setQuantity] = useState<number>(1)
  const [method, setMethod] = useState<'Ubank' | 'EasyPaisa' | null>(null)
  const [trxId, setTrxId] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [buying, setBuying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Constants
  const HEN_PRICE = 500
  const EGG_PRICE = 50
  const totalPrice = quantity * HEN_PRICE

  useEffect(() => {
    async function loadData() {
      // Hum yahan purana RPC hi use kar rahe hain, bas us mein se admin info nikal li hai
      const { data } = await supabase.rpc('get_buy_screen_data')
      if (data && data.admin) {
        setAdminInfo(data.admin)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // --- IMAGE COMPRESSION LOGIC (Client Side) ---
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 600 // Maximum width taake size kam rahe
          const scaleSize = MAX_WIDTH / img.width
          canvas.width = MAX_WIDTH
          canvas.height = img.height * scaleSize
          
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() })
              resolve(compressedFile)
            }
          }, 'image/jpeg', 0.6) // 60% Quality (Bohat kam size hoga)
        }
      }
    })
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setScreenshot(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handlePurchaseRequest = async () => {
    if (!trxId || !method || !screenshot) {
      alert("Please fill all details and upload a screenshot.")
      return
    }
    
    setBuying(true)
    const { data: { user } } = await supabase.auth.getUser()

    let receiptUrl = ''

    // 1. Pehle Image Compress aur Upload hogi
    try {
      const compressedImage = await compressImage(screenshot)
      const fileName = `${Date.now()}-${user?.id}.jpg`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts') // Supabase mein yeh bucket banani hogi
        .upload(fileName, compressedImage)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName)
      receiptUrl = publicUrlData.publicUrl

     // 2. Uske baad Database mein entry jayegi (Ab secure RPC ke zariye)
      const { error: dbError } = await supabase.rpc('create_purchase_request', {
        p_quantity: quantity,
        p_method: method,
        p_trx_id: trxId,
        p_screenshot_url: receiptUrl
      })

      if (dbError) throw dbError

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setModalOpen(false)
        setTrxId('')
        setMethod(null)
        setScreenshot(null)
        setPreviewUrl(null)
        setQuantity(1)
      }, 3000)

    } catch (error: any) {
      alert("Error: " + error.message)
    } finally {
      setBuying(false)
    }
  }

  if (loading) return <div className="h-[60vh] flex items-center justify-center text-emerald-400"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6 pb-24 pt-4 px-1">
      {/* HEADER */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-white">Poultry Market</h1>
        <p className="text-emerald-400/60 text-xs uppercase tracking-widest">Invest & Grow Daily</p>
      </div>

      {/* MARKET TREND */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-3 mx-2">
        <div className="bg-amber-500/20 p-2 rounded-lg"><TrendingUp size={16} className="text-amber-400" /></div>
        <p className="text-xs text-amber-200/80">
          <span className="font-bold text-amber-400">Market Trend:</span> Buy high-yield hens today and start earning daily profit.
        </p>
      </div>

      {/* SINGLE HEN CARD */}
      <div className="px-2 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative shiny-card p-6 rounded-3xl overflow-hidden border border-amber-500/40 bg-gradient-to-br from-amber-900/30 to-black/80"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-white/5 border border-white/10 shadow-lg">
                🐔
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Golden Hen</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md mt-1 inline-block">
                  High Yield
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase">Price</p>
              <p className="text-2xl font-bold text-amber-400">Rs {HEN_PRICE}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-black/30 p-3 rounded-2xl text-center border border-white/5">
              <Egg className="w-5 h-5 text-white mx-auto mb-1 opacity-70" />
              <p className="text-[10px] text-white/40 uppercase">Daily Output</p>
              <p className="text-sm font-bold text-white">1 Egg</p>
            </div>
            <div className="bg-black/30 p-3 rounded-2xl text-center border border-white/5">
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1 opacity-70" />
              <p className="text-[10px] text-white/40 uppercase">Daily Profit</p>
              <p className="text-sm font-bold text-emerald-400">Rs {EGG_PRICE}</p>
            </div>
            <div className="bg-black/30 p-3 rounded-2xl text-center border border-white/5">
              <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1 opacity-70" />
              <p className="text-[10px] text-white/40 uppercase">Lifespan</p>
              <p className="text-sm font-bold text-amber-400">45 Days</p>
            </div>
          </div>

          <button onClick={() => setModalOpen(true)} className="w-full py-4 rounded-xl font-bold text-md bg-gradient-to-r from-amber-500 to-yellow-600 text-emerald-950 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            Buy Now
          </button>
        </motion.div>
      </div>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-white/40"><X size={20} /></button>

              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={50} className="text-green-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-bold text-white">Payment Submitted!</h2>
                  <p className="text-white/40 text-sm mt-2">We will verify the screenshot and add {quantity} hens to your farm.</p>
                </div>
              ) : (
                <div className="space-y-5 pt-2">
                  
                  {/* QUANTITY SELECTOR */}
                  <div>
                    <label className="text-xs text-white/40 uppercase font-bold ml-1">How many hens?</label>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-3 bg-white/5 rounded-xl text-white"><Minus size={18} /></button>
                      <input 
                        type="number" 
                        min="1"
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-center text-xl font-bold text-white outline-none"
                      />
                      <button onClick={() => setQuantity(prev => prev + 1)} className="p-3 bg-white/5 rounded-xl text-white"><Plus size={18} /></button>
                    </div>
                    {/* Quick Selectors */}
                    <div className="flex gap-2 mt-2">
                      {[10, 50, 100].map(num => (
                        <button key={num} onClick={() => setQuantity(num)} className="flex-1 bg-white/5 py-1.5 rounded-lg text-xs font-bold text-amber-400">+{num}</button>
                      ))}
                    </div>
                  </div>

                  {/* TOTAL PRICE */}
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-white/60 font-medium">Total Amount</span>
                    <span className="text-2xl font-black text-amber-400">Rs {totalPrice.toLocaleString()}</span>
                  </div>

                  {/* PAYMENT METHODS */}
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setMethod('Ubank')} className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold ${method === 'Ubank' ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}><CreditCard size={14}/> Ubank</button>
                    <button onClick={() => setMethod('EasyPaisa')} className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold ${method === 'EasyPaisa' ? 'bg-green-600 border-green-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}><CreditCard size={14}/> EasyPaisa</button>
                  </div>

                  {method && adminInfo && (
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">{method} Account</p>
                        <p className="text-lg font-bold text-white font-mono">{method === 'Ubank' ? adminInfo.ubank : adminInfo.easypaisa}</p>
                      </div>
                      <button onClick={() => handleCopy(method === 'Ubank' ? adminInfo.ubank : adminInfo.easypaisa)} className="p-2 bg-emerald-500 rounded-lg text-emerald-950">
                        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  )}

                  {/* TRX ID */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase ml-1"><Hash size={10} className="inline"/> Transaction ID</label>
                    <input type="text" placeholder="Enter TRX ID from SMS" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white font-mono outline-none" />
                  </div>

                  {/* SCREENSHOT UPLOAD */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase ml-1">Payment Screenshot</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-black/40 border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400/50 transition-colors"
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="Receipt" className="h-24 object-contain rounded-lg mb-2" />
                      ) : (
                        <ImagePlus className="text-white/20 w-8 h-8 mb-2" />
                      )}
                      <span className="text-xs text-white/40 font-bold">{previewUrl ? "Change Screenshot" : "Upload Receipt Image"}</span>
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button onClick={handlePurchaseRequest} disabled={!trxId || !method || !screenshot || buying} className="w-full bg-emerald-500 py-4 rounded-xl font-bold text-emerald-950 flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
                    {buying ? <Loader2 className="animate-spin" size={20}/> : "Confirm Purchase"}
                  </button>

                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}