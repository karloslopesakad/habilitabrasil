"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Step, UserProgress, ProgressStatus } from "@/types/database";

// Dados de demo
const DEMO_STEPS: Step[] = [
  {
    id: "step-1",
    type: "link",
    title: "Documentação Inicial",
    subtitle: "Reúna os documentos necessários",
    description: "Primeira etapa do processo é garantir que você tenha toda a documentação em ordem.",
    instructions: "Você precisará dos seguintes documentos:\n\n• RG original e cópia\n• CPF\n• Comprovante de residência atualizado (últimos 3 meses)\n• Foto 3x4 recente com fundo branco",
    external_link: "https://www.gov.br/denatran/pt-br",
    whatsapp_message: "Olá! Preciso de ajuda com a documentação inicial.",
    icon: "FileText",
    display_order: 1,
    is_active: true,
    requires_payment: false,
    min_package_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "step-2",
    type: "link",
    title: "Exames Médicos e Psicológicos",
    subtitle: "Agende seus exames em clínica credenciada",
    description: "Os exames médicos e psicológicos são obrigatórios para iniciar o processo.",
    instructions: "Passos para realizar os exames:\n\n1. Busque uma clínica credenciada pelo DETRAN\n2. Agende o exame médico\n3. Agende o exame psicológico\n4. Guarde os laudos - validade de 90 dias",
    external_link: "https://www.gov.br/denatran/pt-br",
    whatsapp_message: "Olá! Preciso de ajuda com os exames médicos.",
    icon: "Stethoscope",
    display_order: 2,
    is_active: true,
    requires_payment: false,
    min_package_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "step-3",
    type: "theoretical_class",
    title: "Curso Teórico",
    subtitle: "45 horas de aulas obrigatórias",
    description: "Complete o curso teórico de 45 horas/aula com foco na prova.",
    instructions: "O curso teórico aborda:\n\n• Legislação de Trânsito (18h)\n• Direção Defensiva (16h)\n• Primeiros Socorros (4h)\n• Meio Ambiente (4h)\n• Noções de Mecânica (3h)",
    external_link: null,
    whatsapp_message: "Olá! Gostaria de agendar aulas teóricas.",
    icon: "BookOpen",
    display_order: 3,
    is_active: true,
    requires_payment: true,
    min_package_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "step-4",
    type: "simulation",
    title: "Simulados Preparatórios",
    subtitle: "Teste seus conhecimentos",
    description: "Realize simulados no formato oficial do DETRAN.",
    instructions: "Como usar os simulados:\n\n1. Acesse nossa plataforma\n2. Escolha o tipo de prova\n3. Responda as 30 questões\n4. Confira seu resultado\n\nAprovação: mínimo 21 acertos (70%)",
    external_link: "/simulados",
    whatsapp_message: "Olá! Tenho dúvidas sobre os simulados.",
    icon: "FileCheck",
    display_order: 4,
    is_active: true,
    requires_payment: true,
    min_package_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "step-5",
    type: "practical",
    title: "Aulas Práticas",
    subtitle: "Aprenda a dirigir com instrutores licenciados",
    description: "Após aprovação na prova teórica, inicie as aulas práticas.",
    instructions: "Sobre as aulas práticas:\n\n• Mínimo obrigatório: 2 aulas\n• Instrutores licenciados\n• Veículos manual ou automático\n• Horários flexíveis",
    external_link: null,
    whatsapp_message: "Olá! Gostaria de agendar aulas práticas.",
    icon: "Car",
    display_order: 5,
    is_active: true,
    requires_payment: true,
    min_package_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useSteps() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchSteps = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setSteps(DEMO_STEPS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("steps")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        setError(error.message);
        // Fallback para demo em caso de erro
        setSteps(DEMO_STEPS);
      } else {
        setSteps(data || DEMO_STEPS);
      }
    } catch (err) {
      console.error("Erro ao buscar etapas:", err);
      setSteps(DEMO_STEPS);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removido supabase da dependência

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  return {
    steps,
    isLoading,
    error,
    refetch: fetchSteps,
  };
}

export function useStep(id: string) {
  const [step, setStep] = useState<Step | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  useEffect(() => {
    async function fetchStep() {
      setIsLoading(true);
      setError(null);

      // Modo demo
      if (!isSupabaseConfigured() || !supabase) {
        const demoStep = DEMO_STEPS.find(s => s.id === id);
        setStep(demoStep || null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("steps")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setStep(data);
      }

      setIsLoading(false);
    }

    if (id) {
      fetchStep();
    }
  }, [id, supabase]);

  return { step, isLoading, error };
}

export function useUserProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchProgress = useCallback(async () => {
    if (!userId) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      // Retornar progresso demo do localStorage
      const savedProgress = typeof window !== 'undefined' 
        ? localStorage.getItem("demo_progress") 
        : null;
      
      if (savedProgress) {
        try {
          setProgress(JSON.parse(savedProgress));
        } catch {
          setProgress([]);
        }
      } else {
        setProgress([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*, step:steps(*)")
        .eq("user_id", userId);

      if (error) {
        setError(error.message);
        setProgress([]);
      } else {
        setProgress(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar progresso:", err);
      setProgress([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // Removido supabase da dependência

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateProgress = async (stepId: string, status: ProgressStatus, notes?: string) => {
    if (!userId) return { error: new Error("User not logged in") };

    const updates: Partial<UserProgress> = {
      status,
      notes,
    };

    if (status === "in_progress" && !progress.find((p) => p.step_id === stepId)?.started_at) {
      updates.started_at = new Date().toISOString();
    }

    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      const newProgress: UserProgress = {
        id: `progress-${stepId}`,
        user_id: userId,
        step_id: stepId,
        status,
        started_at: updates.started_at || null,
        completed_at: updates.completed_at || null,
        notes: notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProgress((prev) => {
        const existing = prev.findIndex((p) => p.step_id === stepId);
        let updated;
        if (existing >= 0) {
          updated = [...prev];
          updated[existing] = { ...updated[existing], ...newProgress };
        } else {
          updated = [...prev, newProgress];
        }
        
        // Salvar no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("demo_progress", JSON.stringify(updated));
        }
        
        return updated;
      });

      return { data: newProgress, error: null };
    }

    // Upsert - create or update
    const { data, error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: userId,
          step_id: stepId,
          ...updates,
        },
        {
          onConflict: "user_id,step_id",
        }
      )
      .select("*, step:steps(*)")
      .single();

    if (!error && data) {
      setProgress((prev) => {
        const existing = prev.findIndex((p) => p.step_id === stepId);
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

  const getStepProgress = (stepId: string): UserProgress | undefined => {
    return progress.find((p) => p.step_id === stepId);
  };

  const getStepStatus = (stepId: string): ProgressStatus => {
    return getStepProgress(stepId)?.status || "not_started";
  };

  return {
    progress,
    isLoading,
    error,
    refetch: fetchProgress,
    updateProgress,
    getStepProgress,
    getStepStatus,
  };
}

// Hook para admin - gerenciamento de etapas
export function useStepsAdmin() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchSteps = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Modo demo
    if (!isSupabaseConfigured() || !supabase) {
      setSteps(DEMO_STEPS);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("steps")
      .select("*")
      .order("display_order");

    if (error) {
      setError(error.message);
      setSteps(DEMO_STEPS);
    } else {
      setSteps(data || []);
    }

    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const createStep = async (stepData: Omit<Step, "id" | "created_at" | "updated_at">) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("steps")
      .insert(stepData)
      .select()
      .single();

    if (!error && data) {
      setSteps((prev) => [...prev, data].sort((a, b) => a.display_order - b.display_order));
    }

    return { data, error };
  };

  const updateStep = async (id: string, updates: Partial<Step>) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: null, error: new Error("Supabase não configurado") };
    }

    const { data, error } = await supabase
      .from("steps")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setSteps((prev) =>
        prev.map((s) => (s.id === id ? data : s)).sort((a, b) => a.display_order - b.display_order)
      );
    }

    return { data, error };
  };

  const deleteStep = async (id: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { error: new Error("Supabase não configurado") };
    }

    const { error } = await supabase.from("steps").delete().eq("id", id);

    if (!error) {
      setSteps((prev) => prev.filter((s) => s.id !== id));
    }

    return { error };
  };

  return {
    steps,
    isLoading,
    error,
    refetch: fetchSteps,
    createStep,
    updateStep,
    deleteStep,
  };
}
