"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // O Mercado Pago envia preference_id e payment_id como query parameters
  const preferenceId = searchParams.get("preference_id");
  const paymentId = searchParams.get("payment_id") || searchParams.get("payment_id");
  
  // Também pode vir como collection_id (ID do pagamento)
  const collectionId = searchParams.get("collection_id");
  const collectionStatus = searchParams.get("collection_status");
  const status = searchParams.get("status");
  const { user, refreshUserPackage, refreshProfile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    // Aguardar um pouco para o webhook processar
    const timer = setTimeout(async () => {
      if (user) {
        await Promise.all([
          refreshUserPackage(),
          refreshProfile(),
        ]);
      }
      setIsRefreshing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, refreshUserPackage, refreshProfile]);

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-primary-deep mb-4">
              Pagamento Confirmado!
            </h1>

            <p className="text-lg text-neutral-600 mb-8">
              Seu pagamento foi processado com sucesso. Seu pacote já está ativo e você pode começar a usar todas as funcionalidades.
            </p>

            {isRefreshing ? (
              <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                <p className="text-neutral-600">Atualizando seu pacote...</p>
              </div>
            ) : (
              <div className="bg-primary-blue/10 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <Package className="w-6 h-6 text-primary-blue" />
                  <h2 className="text-xl font-semibold text-primary-deep">
                    Pacote Ativado
                  </h2>
                </div>
                <p className="text-neutral-600">
                  Acesse seu dashboard para começar a usar todas as funcionalidades do seu pacote.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center space-x-2 bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-deep transition-colors"
              >
                <span>Ir para Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pacotes"
                className="inline-flex items-center justify-center space-x-2 bg-neutral-100 text-primary-deep px-6 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
              >
                <span>Ver Outros Pacotes</span>
              </Link>
            </div>

            {(preferenceId || paymentId || collectionId) && (
              <p className="text-xs text-neutral-500 mt-6">
                {preferenceId && `Preferência: ${preferenceId}`}
                {(paymentId || collectionId) && ` | Pagamento: ${paymentId || collectionId}`}
                {status && ` | Status: ${status}`}
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-light">
          <Navbar />
          <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-neutral-600">Carregando...</p>
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
