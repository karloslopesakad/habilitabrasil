"use client";

import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Profile, UserPackage, UserContext } from "@/types/database";

// Dados de demo para quando o Supabase não está configurado
const DEMO_USER = {
  id: "demo-user-id",
  email: "demo@fastcnh.com",
};

const DEMO_PROFILE: Profile = {
  id: "demo-user-id",
  name: "Usuário Demo",
  phone: "(11) 99999-9999",
  role: "user",
  avatar_url: null,
  state_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchProfile = useCallback(async (userId: string, forceRefresh = false) => {
    const client = getSupabase();
    if (!client || !isSupabaseConfigured()) return;
    
    try {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
      }
      
      if (data) {
        setProfile(data);
        // Log para debug
        if (process.env.NODE_ENV === 'development') {
          console.log('[useAuth] Profile carregado:', { id: data.id, role: data.role, name: data.name });
        }
      } else if (error?.code === 'PGRST116') {
        // Profile não existe ainda
        setProfile(null);
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    }
  }, []); // Removido supabase da dependência para evitar loops

  const fetchUserPackage = useCallback(async (userId: string) => {
    const client = getSupabase();
    if (!client || !isSupabaseConfigured()) return;
    
    try {
      const { data, error } = await client
        .from("user_packages")
        .select("*, package:packages(*)")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar pacote do usuário:', error);
      }
      
      // Se não tem pacote, define como null (usuário no plano free)
      setUserPackage(data || null);
    } catch (err) {
      console.error('Erro ao buscar pacote do usuário:', err);
      setUserPackage(null);
    }
  }, []); // Removido supabase da dependência para evitar loops

  useEffect(() => {
    const client = getSupabase();
    
    // Se o Supabase não está configurado, usar modo demo
    if (!isSupabaseConfigured() || !client) {
      setIsDemoMode(true);
      
      // Verificar se há um "login" no localStorage (simulação)
      const demoLoggedIn = typeof window !== 'undefined' && localStorage.getItem("demo_logged_in");
      
      if (demoLoggedIn) {
        setUser(DEMO_USER as unknown as User);
        setProfile(DEMO_PROFILE);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setUserPackage(null);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    let authInitialized = false;

    // Timeout de segurança - se demorar mais de 5s, parar o loading
    const timeoutId = setTimeout(() => {
      if (mounted && !authInitialized) {
        console.warn('Timeout ao carregar autenticação - continuando sem dados');
        setIsLoading(false);
      }
    }, 5000);

    // Verificar sessão atual
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        
        if (!mounted) return;
        
        authInitialized = true;
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          setIsLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch em paralelo para ser mais rápido, mas não bloquear o loading
          Promise.all([
            fetchProfile(session.user.id),
            fetchUserPackage(session.user.id),
          ]).catch(console.error);
        } else {
          setProfile(null);
          setUserPackage(null);
        }
      } catch (err) {
        console.error('Erro na autenticação:', err);
        if (mounted) {
          setIsLoading(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Ignorar eventos durante a inicialização
        if (!authInitialized && event === 'INITIAL_SESSION') {
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Não bloquear o loading para atualizações de estado
          Promise.all([
            fetchProfile(session.user.id),
            fetchUserPackage(session.user.id),
          ]).catch(console.error);
        } else {
          setProfile(null);
          setUserPackage(null);
        }
        
        // Só atualizar loading se não estiver inicializando
        if (authInitialized) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []); // Removidas todas as dependências para evitar loops

  const signIn = async (email: string, password: string) => {
    const client = getSupabase();
    
    // Modo demo
    if (isDemoMode || !client || !isSupabaseConfigured()) {
      // Simular login bem-sucedido
      if (typeof window !== 'undefined') {
        localStorage.setItem("demo_logged_in", "true");
      }
      setUser(DEMO_USER as unknown as User);
      setProfile(DEMO_PROFILE);
      return { data: { user: DEMO_USER }, error: null };
    }

    setIsLoading(true);
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    return { data, error };
  };

  const signUp = async (email: string, password: string, name: string, phone: string, stateId?: string) => {
    const client = getSupabase();
    
    // Modo demo
    if (isDemoMode || !client || !isSupabaseConfigured()) {
      return { 
        data: { user: { ...DEMO_USER, email } }, 
        error: null 
      };
    }

    setIsLoading(true);
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          state_id: stateId || null,
        },
      },
    });
    setIsLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    const client = getSupabase();
    
    // Modo demo
    if (isDemoMode || !client || !isSupabaseConfigured()) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("demo_logged_in");
      }
      setUser(null);
      setProfile(null);
      setUserPackage(null);
      return { error: null };
    }

    setIsLoading(true);
    const { error } = await client.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserPackage(null);
    setIsLoading(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    const client = getSupabase();
    
    // Modo demo
    if (isDemoMode || !client || !isSupabaseConfigured()) {
      return { data: {}, error: null };
    }

    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") };

    const client = getSupabase();
    
    // Modo demo
    if (isDemoMode || !client || !isSupabaseConfigured()) {
      setProfile({ ...DEMO_PROFILE, ...updates });
      return { data: { ...DEMO_PROFILE, ...updates }, error: null };
    }

    const { data, error } = await client
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (data) {
      setProfile(data);
    }

    return { data, error };
  };

  // Computed properties
  const isPaying = userPackage !== null && (userPackage.package?.price ?? 0) > 0;
  const hasWhatsappSupport = userPackage?.package?.has_whatsapp_support ?? false;
  const hasInstructorSupport = userPackage?.package?.has_instructor_support ?? false;
  
  const practicalHoursRemaining = 
    (userPackage?.package?.practical_hours ?? 0) - (userPackage?.practical_hours_used ?? 0);
  
  const theoreticalClassesRemaining = 
    (userPackage?.package?.theoretical_classes_included ?? 0) - (userPackage?.theoretical_classes_used ?? 0);
  
  const simulationsRemaining = 
    (userPackage?.package?.simulations_included ?? 0) === -1
      ? Infinity
      : (userPackage?.package?.simulations_included ?? 0) - (userPackage?.simulations_used ?? 0);

  const userContext: UserContext = {
    user: user ? { id: user.id, email: user.email! } : null,
    profile,
    userPackage,
    isLoading,
    isPaying,
    hasWhatsappSupport,
    hasInstructorSupport,
    practicalHoursRemaining,
    theoreticalClassesRemaining,
    simulationsRemaining,
  };

  // Memoizar refreshProfile para evitar loops infinitos
  const refreshProfile = useCallback(() => {
    if (user && !isDemoMode && isSupabaseConfigured()) {
      fetchProfile(user.id, true);
    }
  }, [user, isDemoMode, fetchProfile]);

  const refreshUserPackage = useCallback(() => {
    if (user && !isDemoMode && isSupabaseConfigured()) {
      fetchUserPackage(user.id);
    }
  }, [user, isDemoMode, fetchUserPackage]);

  return {
    user,
    session,
    profile,
    userPackage,
    userContext,
    isLoading,
    isDemoMode,
    isPaying,
    hasWhatsappSupport,
    hasInstructorSupport,
    practicalHoursRemaining,
    theoreticalClassesRemaining,
    simulationsRemaining,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
    refreshUserPackage,
  };
}
