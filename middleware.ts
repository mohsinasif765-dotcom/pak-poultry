import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // DEBUG LOGS
  console.log('--- Middleware Trace ---')
  console.log('Path:', path)
  console.log('User ID:', user?.id || 'No User')

  if (!user && (path.startsWith('/dashboard') || path.startsWith('/admin'))) {
    console.log('Redirecting to Home: No User Session')
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role
    const isAdmin = role === 'admin'

    console.log('User Role from DB:', role)
    console.log('Is Admin?:', isAdmin)

    if (error) console.log('DB Profile Error:', error.message)

    // LOGIC 1: Non-Admin trying to access /admin
    if (path.startsWith('/admin') && !isAdmin) {
      console.log('Access Denied to Admin: Redirecting to Dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // LOGIC 2: Landing Redirect for Auth Users
    if (path === '/' || path === '/registration') {
  const target = isAdmin ? '/admin' : '/dashboard'
  console.log('Landing Redirect: Sending to', target)
  return NextResponse.redirect(new URL(target, request.url))
}
  }

  console.log('Middleware Passing Through...')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}