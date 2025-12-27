import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Verificar se as variáveis de ambiente estão configuradas
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxxxxxxxxxx.supabase.co'
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se o Supabase não está configurado, permitir acesso livre (modo demo)
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser();

  // Proteger rotas do dashboard
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proteger rotas do admin
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .maybeSingle();
    
    // Log para debug (remover em produção)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware Admin]', {
        userId: user.id,
        userEmail: user.email,
        profileRole: profile?.role,
        profileError: profileError?.message,
        hasProfile: !!profile,
      });
    }
    
    if (profileError) {
      console.error('[Middleware Admin] Erro ao buscar profile:', profileError);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (!profile || profile.role !== 'admin') {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Middleware Admin] Acesso negado - role:', profile?.role || 'null');
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

// Matcher - apenas rotas protegidas
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
