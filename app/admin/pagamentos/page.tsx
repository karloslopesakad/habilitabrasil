"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Payment } from "@/types/database";

export default function PagamentosPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    try {
      // Buscar pagamentos
      let query = supabase
        .from("payments")
        .select("*, package:packages(*)")
        .order("created_at", { ascending: sortOrder === "asc" });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        let filteredData = data || [];

        // Buscar profiles para cada pagamento
        if (filteredData.length > 0) {
          const userIds = [...new Set(filteredData.map((p: Payment) => p.user_id))];
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, name")
            .in("id", userIds);

          // Criar mapa de profiles
          const profilesMap = new Map(
            (profilesData || []).map((p: any) => [p.id, p])
          );

          // Adicionar profile a cada pagamento
          filteredData = filteredData.map((payment: Payment) => ({
            ...payment,
            user: profilesMap.get(payment.user_id) || null,
          }));
        }

        // Filtrar por busca
        if (searchTerm) {
          filteredData = filteredData.filter((payment: Payment) => {
            const user = payment.user as any;
            const pkg = payment.package as any;
            const searchLower = searchTerm.toLowerCase();
            return (
              user?.name?.toLowerCase().includes(searchLower) ||
              pkg?.name?.toLowerCase().includes(searchLower) ||
              payment.mercadopago_payment_id?.toLowerCase().includes(searchLower) ||
              payment.stripe_checkout_session_id?.toLowerCase().includes(searchLower) ||
              payment.user_id?.toLowerCase().includes(searchLower)
            );
          });
        }

        // Ordenar
        if (sortBy === "amount") {
          filteredData.sort((a: Payment, b: Payment) => {
            return sortOrder === "asc"
              ? a.amount - b.amount
              : b.amount - a.amount;
          });
        }

        setPayments(filteredData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: any; color: string; label: string }> = {
      succeeded: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800",
        label: "Aprovado",
      },
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800",
        label: "Pendente",
      },
      failed: {
        icon: XCircle,
        color: "bg-red-100 text-red-800",
        label: "Falhou",
      },
      refunded: {
        icon: XCircle,
        color: "bg-neutral-100 text-neutral-800",
        label: "Reembolsado",
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">Pagamentos</h2>
          <p className="text-neutral-600">
            Gerencie e visualize todos os pagamentos realizados
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por usuário, email ou pacote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          {/* Filtro de Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
          >
            <option value="all">Todos os status</option>
            <option value="succeeded">Aprovados</option>
            <option value="pending">Pendentes</option>
            <option value="failed">Falhados</option>
            <option value="refunded">Reembolsados</option>
          </select>

          {/* Ordenação */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="date">Ordenar por data</option>
              <option value="amount">Ordenar por valor</option>
            </select>
            <button
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-neutral-600">Carregando pagamentos...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">Erro: {error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Nenhum pagamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Pacote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    ID Pagamento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {payments.map((payment) => {
                  const user = payment.user as any;
                  const pkg = payment.package as any;
                  return (
                    <tr key={payment.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-primary-deep">
                            {user?.name || "N/A"}
                          </p>
                          <p className="text-sm text-neutral-500 font-mono">
                            {payment.user_id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-primary-deep">
                          {pkg?.name || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-primary-blue">
                          {formatCurrency(payment.amount, payment.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-neutral-500 font-mono truncate max-w-xs">
                          {payment.mercadopago_payment_id || payment.stripe_checkout_session_id || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/admin/pagamentos/${payment.id}`}
                          className="inline-flex items-center space-x-1 p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Ver</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {!isLoading && payments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600 mb-1">Total de Pagamentos</p>
            <p className="text-2xl font-bold text-primary-deep">
              {payments.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600 mb-1">Aprovados</p>
            <p className="text-2xl font-bold text-green-600">
              {payments.filter((p) => p.status === "succeeded").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600 mb-1">Valor Total</p>
            <p className="text-2xl font-bold text-primary-blue">
              {formatCurrency(
                payments
                  .filter((p) => p.status === "succeeded")
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600 mb-1">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {payments.filter((p) => p.status === "pending").length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
