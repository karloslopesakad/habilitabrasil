"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { PracticalClass, Instructor, ClassStatus, VehicleType } from "@/types/database";

// Dados de demo
const DEMO_INSTRUCTORS: Instructor[] = [
  {
    id: "inst-1",
    user_id: null,
    name: "Carlos Silva",
    phone: "11999999991",
    whatsapp: "5511999999991",
    email: "carlos@fastcnh.com",
    specialization: "Aulas práticas - Manual e Automático",
    vehicle_types: ["manual", "automatic"],
    bio: "Instrutor certificado com mais de 10 anos de experiência.",
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "inst-2",
    user_id: null,
    name: "Maria Santos",
    phone: "11999999992",
    whatsapp: "5511999999992",
    email: "maria@fastcnh.com",
    specialization: "Aulas teóricas e práticas",
    vehicle_types: ["manual"],
    bio: "Instrutora e professora de legislação de trânsito.",
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useUserPracticalClasses(userId: string | undefined) {
  const [classes, setClasses] = useState<PracticalClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchClasses = useCallback(async () => {
    if (!userId) {
      setClasses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      const saved = typeof window !== 'undefined' 
        ? localStorage.getItem("demo_practical_classes") 
        : null;
      
      if (saved) {
        try {
          setClasses(JSON.parse(saved));
        } catch {
          setClasses([]);
        }
      } else {
        setClasses([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("practical_classes")
        .select("*, instructor:instructors(*)")
        .eq("user_id", userId)
        .order("scheduled_at", { ascending: false });

      if (error) {
        setError(error.message);
        setClasses([]);
      } else {
        setClasses(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar aulas práticas:", err);
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // Removido supabase da dependência

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const scheduleClass = async (data: {
    instructor_id: string;
    scheduled_at: string;
    duration_minutes?: number;
    vehicle_type?: VehicleType;
    location?: string;
    step_id?: string;
  }) => {
    if (!userId) return { error: new Error("User not logged in") };

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      const instructor = DEMO_INSTRUCTORS.find(i => i.id === data.instructor_id);
      const newClass: PracticalClass = {
        id: `prac-${Date.now()}`,
        step_id: data.step_id || null,
        instructor_id: data.instructor_id,
        user_id: userId,
        scheduled_at: data.scheduled_at,
        duration_minutes: data.duration_minutes || 50,
        vehicle_type: data.vehicle_type || "manual",
        location: data.location || null,
        status: "scheduled",
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        instructor,
      };
      
      setClasses(prev => {
        const updated = [newClass, ...prev];
        if (typeof window !== 'undefined') {
          localStorage.setItem("demo_practical_classes", JSON.stringify(updated));
        }
        return updated;
      });
      
      return { data: newClass, error: null };
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
      const durationHours = (data.duration_minutes || 50) / 60;
      const hoursAvailable =
        (userPackage.package?.practical_hours || 0) -
        (userPackage.practical_hours_used || 0);

      if (hoursAvailable < durationHours) {
        return {
          error: new Error(
            `Você não tem horas suficientes no seu pacote. Disponíveis: ${hoursAvailable.toFixed(2)}h, Necessárias: ${durationHours.toFixed(2)}h`
          ),
        };
      }
    }

    const { data: newClass, error } = await supabase
      .from("practical_classes")
      .insert({
        user_id: userId,
        ...data,
      })
      .select("*, instructor:instructors(*)")
      .single();

    if (!error && newClass) {
      setClasses((prev) => [newClass, ...prev]);
    }

    return { data: newClass, error };
  };

  const cancelClass = async (classId: string) => {
    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setClasses(prev => {
        const updated = prev.map(c => 
          c.id === classId ? { ...c, status: "cancelled" as ClassStatus } : c
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem("demo_practical_classes", JSON.stringify(updated));
        }
        return updated;
      });
      return { data: null, error: null };
    }

    const { data, error } = await supabase
      .from("practical_classes")
      .update({ status: "cancelled" as ClassStatus })
      .eq("id", classId)
      .select("*, instructor:instructors(*)")
      .single();

    if (!error && data) {
      setClasses((prev) => prev.map((c) => (c.id === classId ? data : c)));
    }

    return { data, error };
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    return classes.filter(
      (c) => new Date(c.scheduled_at) > now && c.status === "scheduled"
    );
  };

  const getCompletedClasses = () => {
    return classes.filter((c) => c.status === "completed");
  };

  const getTotalHoursUsed = () => {
    return getCompletedClasses().reduce(
      (total, c) => total + c.duration_minutes / 60,
      0
    );
  };

  return {
    classes,
    isLoading,
    error,
    refetch: fetchClasses,
    scheduleClass,
    cancelClass,
    getUpcomingClasses,
    getCompletedClasses,
    getTotalHoursUsed,
  };
}

export function useInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchInstructors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setInstructors(DEMO_INSTRUCTORS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("instructors")
        .select("*")
        .eq("is_active", true);

      if (error) {
        setError(error.message);
        setInstructors(DEMO_INSTRUCTORS);
      } else {
        setInstructors(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar instrutores:", err);
      setInstructors(DEMO_INSTRUCTORS);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removido supabase da dependência

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const getInstructorsByVehicleType = (type: VehicleType) => {
    return instructors.filter((i) => i.vehicle_types.includes(type));
  };

  return {
    instructors,
    isLoading,
    error,
    refetch: fetchInstructors,
    getInstructorsByVehicleType,
  };
}

// Hook para admin
export function usePracticalClassesAdmin() {
  const [classes, setClasses] = useState<PracticalClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setClasses([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("practical_classes")
      .select("*, instructor:instructors(*)")
      .order("scheduled_at", { ascending: false });

    // Buscar profiles dos usuários separadamente
    if (!error && data && data.length > 0) {
      const userIds = [...new Set(data.map((c: PracticalClass) => c.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);

      // Criar mapa de profiles (sem email, pois não está na tabela profiles)
      const profilesMap = new Map(
        (profilesData || []).map((p: any) => [p.id, { ...p, email: null }])
      );

      // Adicionar profile a cada aula
      data.forEach((cls: any) => {
        cls.user = profilesMap.get(cls.user_id) || null;
      });
    }

    if (error) {
      setError(error.message);
    } else {
      setClasses(data || []);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const createClass = async (data: {
    user_id: string;
    step_id?: string | null;
    instructor_id: string | null;
    scheduled_at: string;
    duration_minutes: number;
    vehicle_type: VehicleType;
    location?: string | null;
    status?: ClassStatus;
    notes?: string | null;
  }) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data: newClass, error } = await supabase
      .from("practical_classes")
      .insert({
        ...data,
        status: data.status || "scheduled",
      })
      .select("*, instructor:instructors(*)")
      .single();

    if (!error && newClass) {
      setClasses((prev) => [newClass, ...prev]);
    }

    return { data: newClass, error };
  };

  const updateClassStatus = async (id: string, status: ClassStatus, notes?: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("practical_classes")
      .update({ status, notes })
      .eq("id", id)
      .select("*, instructor:instructors(*)")
      .single();

    if (!error && data) {
      setClasses((prev) => prev.map((c) => (c.id === id ? data : c)));
    }

    return { data, error };
  };

  return {
    classes,
    isLoading,
    error,
    refetch: fetchClasses,
    createClass,
    updateClassStatus,
  };
}

// Hook para admin - gerenciamento de instrutores
export function useInstructorsAdmin() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchInstructors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setInstructors(DEMO_INSTRUCTORS);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("instructors")
      .select("*")
      .order("name");

    if (error) {
      setError(error.message);
      setInstructors(DEMO_INSTRUCTORS);
    } else {
      setInstructors(data || []);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const createInstructor = async (
    instructorData: Omit<Instructor, "id" | "created_at" | "updated_at">
  ) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("instructors")
      .insert(instructorData)
      .select()
      .single();

    if (!error && data) {
      setInstructors((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    }

    return { data, error };
  };

  const updateInstructor = async (id: string, updates: Partial<Instructor>) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("instructors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setInstructors((prev) =>
        prev.map((i) => (i.id === id ? data : i)).sort((a, b) => a.name.localeCompare(b.name))
      );
    }

    return { data, error };
  };

  const deleteInstructor = async (id: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: new Error("Supabase não configurado") };
    }

    const { error } = await supabase.from("instructors").delete().eq("id", id);

    if (!error) {
      setInstructors((prev) => prev.filter((i) => i.id !== id));
    }

    return { error };
  };

  return {
    instructors,
    isLoading,
    error,
    refetch: fetchInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor,
  };
}
