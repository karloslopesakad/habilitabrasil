"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { TheoreticalClass, ClassRegistration } from "@/types/database";

// Dados de demo
const DEMO_CLASSES: TheoreticalClass[] = [
  {
    id: "class-1",
    step_id: "step-3",
    instructor_id: "inst-1",
    title: "Legislação de Trânsito - Módulo 1",
    description: "Introdução às leis de trânsito e código brasileiro",
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias
    duration_minutes: 60,
    meeting_link: "https://meet.google.com/demo",
    max_participants: 50,
    is_recorded: true,
    recording_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    instructor: {
      id: "inst-1",
      user_id: null,
      name: "Carlos Silva",
      phone: "11999999991",
      whatsapp: "5511999999991",
      email: "carlos@fastcnh.com",
      specialization: "Aulas teóricas",
      vehicle_types: ["manual"],
      bio: "Instrutor certificado com mais de 10 anos de experiência.",
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "class-2",
    step_id: "step-3",
    instructor_id: "inst-2",
    title: "Direção Defensiva",
    description: "Técnicas para direção segura e preventiva",
    scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias
    duration_minutes: 90,
    meeting_link: "https://meet.google.com/demo2",
    max_participants: 30,
    is_recorded: false,
    recording_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    instructor: {
      id: "inst-2",
      user_id: null,
      name: "Maria Santos",
      phone: "11999999992",
      whatsapp: "5511999999992",
      email: "maria@fastcnh.com",
      specialization: "Aulas teóricas e práticas",
      vehicle_types: ["manual", "automatic"],
      bio: "Instrutora e professora de legislação de trânsito.",
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export function useTheoreticalClasses() {
  const [classes, setClasses] = useState<TheoreticalClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setClasses(DEMO_CLASSES);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("theoretical_classes")
        .select("*, instructor:instructors(*)")
        .eq("is_active", true)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at");

      if (error) {
        setError(error.message);
        setClasses(DEMO_CLASSES);
      } else {
        setClasses(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar aulas teóricas:", err);
      setClasses(DEMO_CLASSES);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removido supabase da dependência

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    isLoading,
    error,
    refetch: fetchClasses,
  };
}

export function useUserClassRegistrations(userId: string | undefined) {
  const [registrations, setRegistrations] = useState<ClassRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchRegistrations = useCallback(async () => {
    if (!userId) {
      setRegistrations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      const saved = typeof window !== 'undefined' 
        ? localStorage.getItem("demo_registrations") 
        : null;
      
      if (saved) {
        try {
          setRegistrations(JSON.parse(saved));
        } catch {
          setRegistrations([]);
        }
      } else {
        setRegistrations([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("class_registrations")
        .select("*, theoretical_class:theoretical_classes(*, instructor:instructors(*))")
        .eq("user_id", userId);

      if (error) {
        setError(error.message);
        setRegistrations([]);
      } else {
        setRegistrations(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar registros de aulas:", err);
      setRegistrations([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // Removido supabase da dependência

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const registerForClass = async (classId: string) => {
    if (!userId) return { error: new Error("User not logged in") };

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      const newReg: ClassRegistration = {
        id: `reg-${Date.now()}`,
        user_id: userId,
        theoretical_class_id: classId,
        registered_at: new Date().toISOString(),
        attended: false,
        feedback: null,
        rating: null,
      };
      
      setRegistrations(prev => {
        const updated = [...prev, newReg];
        if (typeof window !== 'undefined') {
          localStorage.setItem("demo_registrations", JSON.stringify(updated));
        }
        return updated;
      });
      
      return { data: newReg, error: null };
    }

    // Validação de limites será feita pelo trigger no banco
    // Mas podemos fazer uma validação prévia para melhor UX
    const { data: userPackage } = await supabase
      .from("user_packages")
      .select("*, package:packages(*)")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (userPackage) {
      const classesAvailable =
        (userPackage.package?.theoretical_classes_included || 0) -
        (userPackage.theoretical_classes_used || 0);

      if (classesAvailable <= 0) {
        return {
          error: new Error(
            "Você não tem aulas teóricas disponíveis no seu pacote."
          ),
        };
      }
    }

    const { data, error } = await supabase
      .from("class_registrations")
      .insert({
        user_id: userId,
        theoretical_class_id: classId,
      })
      .select("*, theoretical_class:theoretical_classes(*, instructor:instructors(*))")
      .single();

    if (!error && data) {
      setRegistrations((prev) => [...prev, data]);
    }

    return { data, error };
  };

  const cancelRegistration = async (registrationId: string) => {
    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setRegistrations(prev => {
        const updated = prev.filter(r => r.id !== registrationId);
        if (typeof window !== 'undefined') {
          localStorage.setItem("demo_registrations", JSON.stringify(updated));
        }
        return updated;
      });
      return { error: null };
    }

    const { error } = await supabase
      .from("class_registrations")
      .delete()
      .eq("id", registrationId);

    if (!error) {
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
    }

    return { error };
  };

  const isRegisteredForClass = (classId: string): boolean => {
    return registrations.some((r) => r.theoretical_class_id === classId);
  };

  return {
    registrations,
    isLoading,
    error,
    refetch: fetchRegistrations,
    registerForClass,
    cancelRegistration,
    isRegisteredForClass,
  };
}

// Hook para admin
export function useTheoreticalClassesAdmin() {
  const [classes, setClasses] = useState<TheoreticalClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setClasses(DEMO_CLASSES);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("theoretical_classes")
      .select("*, instructor:instructors(*)")
      .order("scheduled_at", { ascending: false });

    if (error) {
      setError(error.message);
      setClasses(DEMO_CLASSES);
    } else {
      setClasses(data || []);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const createClass = async (
    classData: Omit<TheoreticalClass, "id" | "created_at" | "instructor" | "step" | "registrations_count">
  ) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("theoretical_classes")
      .insert(classData)
      .select("*, instructor:instructors(*)")
      .single();

    if (!error && data) {
      setClasses((prev) => [data, ...prev]);
    }

    return { data, error };
  };

  const updateClass = async (id: string, updates: Partial<TheoreticalClass>) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("theoretical_classes")
      .update(updates)
      .eq("id", id)
      .select("*, instructor:instructors(*)")
      .single();

    if (!error && data) {
      setClasses((prev) => prev.map((c) => (c.id === id ? data : c)));
    }

    return { data, error };
  };

  const deleteClass = async (id: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: new Error("Supabase não configurado") };
    }

    const { error } = await supabase.from("theoretical_classes").delete().eq("id", id);

    if (!error) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }

    return { error };
  };

  return {
    classes,
    isLoading,
    error,
    refetch: fetchClasses,
    createClass,
    updateClass,
    deleteClass,
  };
}
