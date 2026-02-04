"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Setting, WhatsAppSettings, SiteSettings } from "@/types/database";

// Dados de demo
const DEMO_SETTINGS: Setting[] = [
  {
    id: "setting-1",
    key: "whatsapp_support",
    value: {
      number: "5511999999999",
      default_message: "Olá! Preciso de ajuda com meu processo de habilitação no FastCNH.",
    },
    description: "Configurações do WhatsApp de suporte",
    updated_at: new Date().toISOString(),
  },
  {
    id: "setting-2",
    key: "site_info",
    value: {
      name: "FastCNH",
      tagline: "Seu caminho para a CNH começa aqui",
      support_email: "suporte@fastcnh.com",
    },
    description: "Informações gerais do site",
    updated_at: new Date().toISOString(),
  },
];

export function useSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setSettings(DEMO_SETTINGS);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.from("settings").select("*");

    if (error) {
      setError(error.message);
      setSettings(DEMO_SETTINGS);
    } else {
      setSettings(data || DEMO_SETTINGS);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getSetting = <T>(key: string): T | null => {
    const setting = settings.find((s) => s.key === key);
    return setting ? (setting.value as T) : null;
  };

  const getWhatsAppSettings = (): WhatsAppSettings | null => {
    return getSetting<WhatsAppSettings>("whatsapp_support");
  };

  const getSiteSettings = (): SiteSettings | null => {
    return getSetting<SiteSettings>("site_info");
  };

  const getWhatsAppLink = (customMessage?: string): string => {
    const whatsapp = getWhatsAppSettings();
    if (!whatsapp) return "#";

    const message = customMessage || whatsapp.default_message;
    return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;
  };

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
    getSetting,
    getWhatsAppSettings,
    getSiteSettings,
    getWhatsAppLink,
  };
}

// Hook para admin
export function useSettingsAdmin() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setSettings(DEMO_SETTINGS);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.from("settings").select("*");

    if (error) {
      setError(error.message);
      setSettings(DEMO_SETTINGS);
    } else {
      setSettings(data || []);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = async (key: string, value: Record<string, unknown>) => {
    if (!isSupabaseConfigured() || !supabase) {
      // Modo demo - atualizar local
      setSettings((prev) => {
        const existing = prev.findIndex((s) => s.key === key);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], value };
          return updated;
        }
        return prev;
      });
      return { data: null, error: null };
    }

    const { data, error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" })
      .select()
      .single();

    if (!error && data) {
      setSettings((prev) => {
        const existing = prev.findIndex((s) => s.key === key);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data;
          return updated;
        }
        return [...prev, data];
      });
    }

    return { data, error };
  };

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
    updateSetting,
  };
}
