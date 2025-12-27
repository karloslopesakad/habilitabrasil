"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Package } from "@/types/database";

// Dados de demo
const DEMO_PACKAGES: Package[] = [
  {
    id: "pkg-1",
    name: "Free",
    slug: "free",
    price: 0,
    description: "Plataforma com passo a passo completo",
    features: ["Passo a passo detalhado", "Etapas do processo explicadas", "Links de apoio oficiais", "Acesso à plataforma"],
    practical_hours: 0,
    theoretical_classes_included: 0,
    simulations_included: 0,
    has_whatsapp_support: false,
    has_instructor_support: false,
    is_highlighted: false,
    highlight_label: null,
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pkg-2",
    name: "Básico",
    slug: "basico",
    price: 97,
    description: "Tudo do Free + consultoria e suporte",
    features: ["Tudo do pacote Free", "Consultoria pela plataforma", "Auxílio com documentação", "Acesso a aulas gravadas", "Suporte por chat"],
    practical_hours: 0,
    theoretical_classes_included: 0,
    simulations_included: 0,
    has_whatsapp_support: true,
    has_instructor_support: true,
    is_highlighted: false,
    highlight_label: null,
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pkg-3",
    name: "B2",
    slug: "b2",
    price: 197,
    description: "Preparação completa para prova teórica",
    features: ["Tudo do pacote Básico", "1 aula agendada para prova teórica", "Simulado interativo", "1 aula de reforço", "Material de estudo exclusivo"],
    practical_hours: 0,
    theoretical_classes_included: 2,
    simulations_included: 5,
    has_whatsapp_support: true,
    has_instructor_support: true,
    is_highlighted: true,
    highlight_label: "Mais Popular",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pkg-4",
    name: "Driver",
    slug: "driver",
    price: 497,
    description: "Inclui aulas práticas obrigatórias",
    features: ["Tudo do pacote B2", "2 aulas práticas obrigatórias", "Instrutor qualificado", "Acompanhamento personalizado"],
    practical_hours: 2,
    theoretical_classes_included: 2,
    simulations_included: 5,
    has_whatsapp_support: true,
    has_instructor_support: true,
    is_highlighted: false,
    highlight_label: null,
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pkg-5",
    name: "Driver +10",
    slug: "driver-plus-10",
    price: 997,
    description: "Pacote completo com aulas extras",
    features: ["Tudo do pacote B2", "8 aulas práticas de direção", "Preparação intensiva", "Garantia de aprovação*"],
    practical_hours: 10,
    theoretical_classes_included: 2,
    simulations_included: 10,
    has_whatsapp_support: true,
    has_instructor_support: true,
    is_highlighted: false,
    highlight_label: null,
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pkg-6",
    name: "Driver Auto",
    slug: "driver-auto",
    price: 597,
    description: "Aulas práticas em carro automático",
    features: ["Tudo do pacote B2", "Aulas em veículo automático", "Instrutor especializado", "Ideal para iniciantes"],
    practical_hours: 2,
    theoretical_classes_included: 2,
    simulations_included: 5,
    has_whatsapp_support: true,
    has_instructor_support: true,
    is_highlighted: false,
    highlight_label: "Diferencial",
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setPackages(DEMO_PACKAGES);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      setError(error.message);
      setPackages(DEMO_PACKAGES);
    } else {
      setPackages(data || DEMO_PACKAGES);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    isLoading,
    error,
    refetch: fetchPackages,
  };
}

export function usePackage(id: string) {
  const [pkg, setPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  useEffect(() => {
    async function fetchPackage() {
      setIsLoading(true);
      setError(null);

      // Modo demo
      if (!isSupabaseConfigured() || !supabase) {
        const demoPkg = DEMO_PACKAGES.find(p => p.id === id);
        setPackage(demoPkg || null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPackage(data);
      }

      setIsLoading(false);
    }

    if (id) {
      fetchPackage();
    }
  }, [id, supabase]);

  return { package: pkg, isLoading, error };
}

// Hook para admin - gerenciamento de pacotes
export function usePackagesAdmin() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setPackages(DEMO_PACKAGES);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("display_order");

    if (error) {
      setError(error.message);
      setPackages(DEMO_PACKAGES);
    } else {
      setPackages(data || []);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const createPackage = async (packageData: Omit<Package, "id" | "created_at" | "updated_at">) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("packages")
      .insert(packageData)
      .select()
      .single();

    if (!error && data) {
      setPackages((prev) => [...prev, data].sort((a, b) => a.display_order - b.display_order));
    }

    return { data, error };
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("packages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? data : p)).sort((a, b) => a.display_order - b.display_order)
      );
    }

    return { data, error };
  };

  const deletePackage = async (id: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: new Error("Supabase não configurado") };
    }

    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (!error) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
    }

    return { error };
  };

  return {
    packages,
    isLoading,
    error,
    refetch: fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
  };
}
