"use client";

import { useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Payment } from "@/types/database";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (packageId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ package_id: packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar sessão de pagamento");
      }

      return { url: data.url, error: null };
    } catch (err: any) {
      setError(err.message);
      return { url: null, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    isLoading,
    error,
  };
}

export function usePayments(userId: string | undefined) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchPayments = async () => {
    if (!userId) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured() || !supabase) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*, package:packages(*), user:profiles(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPayments(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    payments,
    isLoading,
    error,
    refetch: fetchPayments,
  };
}
