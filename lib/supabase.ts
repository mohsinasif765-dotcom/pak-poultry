import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Agar variables missing hain to crash karne ki bajaye error dikhaye
  if (!url || !anonKey) {
    console.error("Supabase environment variables missing! Check Vercel Settings.")
    // Testing ke liye empty strings return karega taake app bilkul dead na ho jaye
    return createBrowserClient(url || '', anonKey || '')
  }

  return createBrowserClient(url, anonKey)
}