import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-client@2"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

serve(async (req) => {
  const payload = await req.json()
  const { record, old_record } = payload

  // Sirf tab jab status 'pending' se 'active' ho
  if (record.status !== 'active' || old_record?.status === 'active') {
    return new Response('Status not changed to active', { status: 200 })
  }

  // 1. Secret se JSON uthana
  const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 2. User ka token lena
  const { data: profile } = await supabase
    .from('profiles')
    .select('fcm_token')
    .eq('id', record.user_id)
    .single()

  if (!profile?.fcm_token) return new Response('No FCM token found')

  // 3. Access Token hasil karna
  const accessToken = await getAccessToken(serviceAccount)

  // 4. Firebase ko request bhejna
  const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`
  
  const fcmMessage = {
    message: {
      token: profile.fcm_token,
      notification: {
        title: "Investment Approved! 🎉",
        body: `Mubarak ho! Aapka ${record.package_name} package ab active hai.`
      },
      webpush: {
        fcm_options: {
          link: "https://pak-poultry.vercel.app/dashboard/history"
        }
      }
    }
  }

  const res = await fetch(fcmUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fcmMessage),
  })

  return new Response(await res.text(), { status: 200 })
})

// Helper: Google Auth with Service Account JSON
async function getAccessToken(serviceAccount: any) {
  const header = { alg: "RS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
    scope: "https://www.googleapis.com/auth/cloud-platform"
  }

  const pemContents = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "")
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const jwt = await create(header, payload, cryptoKey)

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  })

  const data = await response.json()
  return data.access_token
}