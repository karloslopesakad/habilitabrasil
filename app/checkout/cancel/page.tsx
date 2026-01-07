"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { XCircle, ArrowLeft, ArrowRight } from "lucide-react";

function CancelContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("package_id");

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-orange-600" />
            </div>

            <h1 className="text-3xl font-bold text-primary-deep mb-4">
              Pagamento Cancelado
            </h1>

            <p className="text-lg text-neutral-600 mb-8">
              Seu pagamento foi cancelado. Nenhuma cobrança foi realizada. Você pode tentar novamente quando estiver pronto.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {packageId && (
                <Link
                  href={`/checkout?package_id=${packageId}`}
                  className="inline-flex items-center justify-center space-x-2 bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-deep transition-colors"
                >
                  <span>Tentar Novamente</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link
                href="/pacotes"
                className="inline-flex items-center justify-center space-x-2 bg-neutral-100 text-primary-deep px-6 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar para Pacotes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function CancelPage() {
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
      <CancelContent />
    </Suspense>
  );
}
