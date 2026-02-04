"use client";

import { useState, useCallback } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { SimulationQuestion, SimulationAttempt } from "@/types/database";

export function useSimulation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  // Buscar questões balanceadas para um simulado
  const fetchQuestions = useCallback(
    async (stepId: string, count: number = 30, userId?: string) => {
      if (!isSupabaseConfigured() || !supabase) {
        setError("Supabase não configurado");
        return { data: null, error: new Error("Supabase não configurado") };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Primeiro, tentar usar a função RPC do banco
        const { data: rpcData, error: rpcError } = await supabase.rpc("get_balanced_questions", {
          p_count: count,
          p_user_id: userId || null,
        });

        // Se a função RPC funcionou e retornou dados
        if (!rpcError && rpcData && rpcData.length > 0) {
          setIsLoading(false);
          return { data: rpcData as SimulationQuestion[], error: null };
        }

        // Se a função RPC falhou ou não retornou dados, buscar diretamente da tabela
        console.log("RPC não retornou dados, buscando diretamente da tabela...");
        
        const { data: directData, error: directError } = await supabase
          .from("simulation_questions")
          .select("*")
          .limit(count)
          .order("random()", { ascending: false });

        if (directError) {
          console.error("Erro ao buscar questões diretamente:", directError);
          setError(directError.message || "Erro ao buscar questões");
          setIsLoading(false);
          return { data: null, error: directError };
        }

        if (!directData || directData.length === 0) {
          const errorMsg = "Nenhuma questão encontrada no banco de dados. Por favor, cadastre questões primeiro.";
          console.error(errorMsg);
          setError(errorMsg);
          setIsLoading(false);
          return { data: null, error: new Error(errorMsg) };
        }

        setIsLoading(false);
        return { data: directData as SimulationQuestion[], error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao buscar questões";
        setError(errorMessage);
        setIsLoading(false);
        return { data: null, error: new Error(errorMessage) };
      }
    },
    [supabase]
  );

  // Iniciar uma nova tentativa de simulado
  const startSimulation = useCallback(
    async (stepId: string, questionIds: string[]) => {
      if (!isSupabaseConfigured() || !supabase) {
        return { data: null, error: new Error("Supabase não configurado") };
      }

      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Usuário não autenticado");
          setIsLoading(false);
          return { data: null, error: new Error("Usuário não autenticado") };
        }

        const { data, error: insertError } = await supabase
          .from("simulation_attempts")
          .insert({
            user_id: user.id,
            step_id: stepId,
            question_ids: questionIds,
            score: 0,
            percentage: 0,
            passed: false,
            time_spent_seconds: 0,
            answers: {},
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          setError(insertError.message);
          setIsLoading(false);
          return { data: null, error: insertError };
        }

        // Incrementar simulations_used no user_packages (se houver pacote ativo)
        const { data: userPackage } = await supabase
          .from("user_packages")
          .select("id, simulations_included, simulations_used")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (userPackage) {
          // Só incrementar se não for ilimitado e ainda tiver disponível
          if (userPackage.simulations_included !== -1 && 
              userPackage.simulations_used < userPackage.simulations_included) {
            await supabase
              .from("user_packages")
              .update({ simulations_used: userPackage.simulations_used + 1 })
              .eq("id", userPackage.id);
          }
        }

        setIsLoading(false);
        return { data: data as SimulationAttempt, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao iniciar simulado";
        setError(errorMessage);
        setIsLoading(false);
        return { data: null, error: new Error(errorMessage) };
      }
    },
    [supabase]
  );

  // Finalizar simulado e calcular nota
  const submitSimulation = useCallback(
    async (
      attemptId: string,
      answers: Record<string, string>,
      timeSpentSeconds: number,
      questions: SimulationQuestion[]
    ) => {
      if (!isSupabaseConfigured() || !supabase) {
        return { data: null, error: new Error("Supabase não configurado") };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Calcular nota
        let score = 0;
        questions.forEach((question) => {
          if (answers[question.id] === question.correct_answer) {
            score++;
          }
        });

        const percentage = (score / questions.length) * 100;
        const passed = percentage >= 70;

        const { data, error: updateError } = await supabase
          .from("simulation_attempts")
          .update({
            score,
            percentage: Number(percentage.toFixed(2)),
            passed,
            time_spent_seconds: timeSpentSeconds,
            answers,
            completed_at: new Date().toISOString(),
          })
          .eq("id", attemptId)
          .select()
          .single();

        if (updateError) {
          setError(updateError.message);
          setIsLoading(false);
          return { data: null, error: updateError };
        }

        setIsLoading(false);
        return { data: data as SimulationAttempt, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao finalizar simulado";
        setError(errorMessage);
        setIsLoading(false);
        return { data: null, error: new Error(errorMessage) };
      }
    },
    [supabase]
  );

  // Buscar histórico de tentativas
  const getAttemptHistory = useCallback(
    async (userId: string, stepId: string, limit: number = 10) => {
      if (!isSupabaseConfigured() || !supabase) {
        return { data: null, error: new Error("Supabase não configurado") };
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("simulation_attempts")
          .select("*")
          .eq("user_id", userId)
          .eq("step_id", stepId)
          .order("completed_at", { ascending: false, nullsFirst: false })
          .limit(limit);

        if (fetchError) {
          setError(fetchError.message);
          setIsLoading(false);
          return { data: null, error: fetchError };
        }

        setIsLoading(false);
        return { data: data as SimulationAttempt[], error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao buscar histórico";
        setError(errorMessage);
        setIsLoading(false);
        return { data: null, error: new Error(errorMessage) };
      }
    },
    [supabase]
  );

  // Buscar melhor nota
  const getBestScore = useCallback(
    async (userId: string, stepId: string) => {
      if (!isSupabaseConfigured() || !supabase) {
        return { data: null, error: new Error("Supabase não configurado") };
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("simulation_attempts")
          .select("score, percentage, passed, completed_at")
          .eq("user_id", userId)
          .eq("step_id", stepId)
          .not("completed_at", "is", null)
          .order("score", { ascending: false })
          .order("percentage", { ascending: false })
          .limit(1)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          setError(fetchError.message);
          setIsLoading(false);
          return { data: null, error: fetchError };
        }

        setIsLoading(false);
        return { data: data as SimulationAttempt | null, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao buscar melhor nota";
        setError(errorMessage);
        setIsLoading(false);
        return { data: null, error: new Error(errorMessage) };
      }
    },
    [supabase]
  );

  return {
    isLoading,
    error,
    fetchQuestions,
    startSimulation,
    submitSimulation,
    getAttemptHistory,
    getBestScore,
  };
}

