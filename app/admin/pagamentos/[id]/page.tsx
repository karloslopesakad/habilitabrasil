"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  User,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Payment } from "@/types/database";

function PaymentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  const fetchPayment = async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase não configurado");
      setIsLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError("Erro ao conectar com banco de dados");
      setIsLoading(false);
      return;
    }

    try {
      // Buscar pagamento
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select("*, package:packages(*)")
        .eq("id", paymentId)
        .single();

      if (paymentError) {
        setError(paymentError.message);
        setIsLoading(false);
        return;
      }

      // Buscar profile do usuário
      let userData = null;
      if (paymentData?.user_id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", paymentData.user_id)
          .single();
        userData = profileData;
      }

      if (paymentData) {
        setPayment({ ...paymentData, user: userData });
      } else {
        setError("Pagamento não encontrado");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { icon: any; color: string; label: string; bgColor: string }
    > = {
      succeeded: {
        icon: CheckCircle,
        color: "text-green-600",
        label: "Aprovado",
        bgColor: "bg-green-100",
      },
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        label: "Pendente",
        bgColor: "bg-yellow-100",
      },
      failed: {
        icon: XCircle,
        color: "text-red-600",
        label: "Falhou",
        bgColor: "bg-red-100",
      },
      refunded: {
        icon: XCircle,
        color: "text-neutral-600",
        label: "Reembolsado",
        bgColor: "bg-neutral-100",
      },
    };

    return configs[status] || configs.pending;
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/pagamentos"
            className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-primary-deep">
              Carregando...
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-neutral-600">Carregando detalhes do pagamento...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/pagamentos"
            className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-primary-deep">
              Erro ao carregar pagamento
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
          <p className="text-red-500">{error || "Pagamento não encontrado"}</p>
        </div>
      </div>
    );
  }

  const user = payment.user as any;
  const pkg = payment.package as any;
  const statusConfig = getStatusConfig(payment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/pagamentos"
          className="p-2 text-neutral-600 hover:text-primary-blue hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-primary-deep">
            Detalhes do Pagamento
          </h2>
          <p className="text-neutral-600">ID: {payment.id}</p>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-16 h-16 ${statusConfig.bgColor} rounded-full flex items-center justify-center`}
            >
              <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Status</p>
              <p className={`text-2xl font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Valor</p>
            <p className="text-3xl font-bold text-primary-blue">
              {formatCurrency(payment.amount, payment.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Usuário */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-primary-blue" />
            <h3 className="text-lg font-semibold text-primary-deep">
              Usuário
            </h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-neutral-600">Nome</p>
              <p className="font-medium text-primary-deep">
                {user?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">ID do Usuário</p>
              <p className="font-mono text-sm text-primary-deep">
                {payment.user_id}
              </p>
            </div>
          </div>
        </div>

        {/* Informações do Pacote */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-5 h-5 text-primary-blue" />
            <h3 className="text-lg font-semibold text-primary-deep">Pacote</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-neutral-600">Nome</p>
              <p className="font-medium text-primary-deep">
                {pkg?.name || "N/A"}
              </p>
            </div>
            {pkg?.description && (
              <div>
                <p className="text-sm text-neutral-600">Descrição</p>
                <p className="text-sm text-neutral-700">{pkg.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-neutral-600">ID do Pacote</p>
              <p className="font-mono text-sm text-neutral-500">
                {payment.package_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Stripe */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CreditCard className="w-5 h-5 text-primary-blue" />
          <h3 className="text-lg font-semibold text-primary-deep">
            Informações do Stripe
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600 mb-1">
              Checkout Session ID
            </p>
            <div className="flex items-center space-x-2">
              <p className="font-mono text-sm text-neutral-700 break-all">
                {payment.stripe_checkout_session_id || "N/A"}
              </p>
              {payment.stripe_checkout_session_id && (
                <a
                  href={`https://dashboard.stripe.com/test/checkout/sessions/${payment.stripe_checkout_session_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:text-primary-deep"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-neutral-600 mb-1">Payment Intent ID</p>
            <div className="flex items-center space-x-2">
              <p className="font-mono text-sm text-neutral-700 break-all">
                {payment.stripe_payment_intent_id || "N/A"}
              </p>
              {payment.stripe_payment_intent_id && (
                <a
                  href={`https://dashboard.stripe.com/test/payments/${payment.stripe_payment_intent_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:text-primary-deep"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Datas e Metadados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-primary-blue" />
            <h3 className="text-lg font-semibold text-primary-deep">Datas</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-neutral-600">Criado em</p>
              <p className="font-medium text-primary-deep">
                {formatDate(payment.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Atualizado em</p>
              <p className="font-medium text-primary-deep">
                {formatDate(payment.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {payment.metadata && Object.keys(payment.metadata).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-primary-deep mb-4">
              Metadados
            </h3>
            <div className="space-y-2">
              {Object.entries(payment.metadata).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-neutral-600">{key}</p>
                  <p className="font-mono text-sm text-neutral-700">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 text-neutral-600">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-deep">
                Carregando...
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <PaymentDetailContent />
    </Suspense>
  );
}
