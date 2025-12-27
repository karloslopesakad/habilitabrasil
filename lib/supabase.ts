import { createBrowserClient } from '@supabase/ssr';

// Verificar se as variáveis de ambiente estão configuradas
export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxxxxxxxxxx.supabase.co'
  );
};

export function createClient() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase não está configurado. Usando modo demo.');
    return null;
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Cliente singleton para uso no browser
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  // Sempre criar novo se não existe ou se Supabase não está configurado
  // Isso evita problemas quando as variáveis de ambiente mudam
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

