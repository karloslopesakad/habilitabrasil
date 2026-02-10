"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { usePackage } from "@/hooks/usePackages";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("package_id");
  const { user, isLoading: authLoading } = useAuth();
  const { package: packageData, isLoading: packageLoading } = usePackage(packageId || "");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/checkout?package_id=${packageId}`);
    }
  }, [authLoading, user, router, packageId]);

  const handleCheckout = async () => {
    if (!packageId) {
      setError("Pacote não especificado");
      return;
    }

    setIsCreatingSession(true);
    setError("");

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

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento");
      setIsCreatingSession(false);
    }
  };

  if (authLoading || packageLoading) {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Carregando...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (!packageData) {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary-deep mb-2">Pacote não encontrado</h2>
              <p className="text-neutral-600 mb-6">O pacote solicitado não existe ou está inativo.</p>
              <Link
                href="/pacotes"
                className="inline-flex items-center space-x-2 text-primary-blue hover:text-primary-deep"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para pacotes</span>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/pacotes"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-blue mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para pacotes</span>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
            <h1 className="text-3xl font-bold text-primary-deep mb-6">Finalizar Compra</h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Resumo do Pacote */}
            <div className="bg-neutral-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-primary-deep mb-4">{packageData.name}</h2>
              {packageData.description && (
                <p className="text-neutral-600 mb-4">{packageData.description}</p>
              )}

              <div className="space-y-2 mb-6">
                {packageData.practical_hours > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{packageData.practical_hours} horas de aulas práticas</span>
                  </div>
                )}
                {packageData.theoretical_classes_included > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{packageData.theoretical_classes_included} aulas teóricas</span>
                  </div>
                )}
                {(packageData.simulations_included > 0 || packageData.simulations_included === -1) && (
                  <div className="flex items-center space-x-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>
                      {packageData.simulations_included === -1 
                        ? "Simulados ilimitados" 
                        : `${packageData.simulations_included} simulados`}
                    </span>
                  </div>
                )}
                {packageData.has_whatsapp_support && (
                  <div className="flex items-center space-x-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Suporte via WhatsApp</span>
                  </div>
                )}
                {packageData.has_instructor_support && (
                  <div className="flex items-center space-x-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Acompanhamento com instrutor</span>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary-deep">Total</span>
                  <span className="text-3xl font-bold text-primary-blue">
                    {packageData.price === 0 ? (
                      "Grátis"
                    ) : (
                      `R$ ${packageData.price.toFixed(2).replace(".", ",")}`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            {packageData.price > 0 && (
              <div className="bg-primary-blue/5 border border-primary-blue/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary-deep mb-4">
                  Métodos de Pagamento Disponíveis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Cartão de Crédito</p>
                      <p className="text-sm text-neutral-600">
                        Parcelamento em até 12x sem juros (conforme disponibilidade da bandeira).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">PIX</p>
                      <p className="text-sm text-neutral-600">
                        Pagamento instantâneo com QR Code. Aprovação imediata.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Boleto Bancário</p>
                      <p className="text-sm text-neutral-600">
                        Gere um boleto e pague em qualquer banco ou lotérica. Vencimento em até 3 dias úteis.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  Você será redirecionado para a página segura do Mercado Pago para finalizar o pagamento.
                </p>
              </div>
            )}

            {/* Botão de Pagamento */}
            {packageData.price > 0 ? (
              <button
                onClick={handleCheckout}
                disabled={isCreatingSession}
                className="w-full bg-primary-blue text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isCreatingSession ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>Finalizar Pagamento</span>
                )}
              </button>
            ) : (
              <div className="text-center py-4">
                <p className="text-neutral-600 mb-4">Este é um pacote gratuito.</p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-deep transition-colors"
                >
                  Acessar Dashboard
                </Link>
              </div>
            )}

            <p className="text-xs text-neutral-500 text-center mt-4">
              Ao continuar, você será redirecionado para a página de pagamento seguro do Mercado Pago.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-light">
          <Navbar />
          <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto mb-4" />
              <p className="text-neutral-600">Carregando...</p>
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
