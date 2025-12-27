"use client";

import { Check, Star } from "lucide-react";
import { usePackages } from "@/hooks/usePackages";
import PlanButton from "@/components/ui/PlanButton";

export default function Packages() {
  const { packages, isLoading, error } = usePackages();

  if (isLoading) {
    return (
      <section id="pacotes" className="py-20 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
              Pacotes Disponíveis
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Carregando pacotes...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 animate-pulse border border-neutral-medium/50"
              >
                <div className="h-8 bg-neutral-200 rounded w-2/3 mb-4"></div>
                <div className="h-12 bg-neutral-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pacotes" className="py-20 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Erro ao carregar pacotes: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pacotes" className="py-20 bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Planos e Preços
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
            Escolha o melhor plano para você
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Do básico ao completo, temos o pacote ideal para cada etapa da sua
            jornada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                pkg.is_highlighted
                  ? "border-primary-blue scale-105"
                  : "border-neutral-medium/50"
              }`}
            >
              {pkg.is_highlighted && pkg.highlight_label && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-blue text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{pkg.highlight_label}</span>
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-display font-bold text-primary-deep mb-2">
                  {pkg.name}
                </h3>
                <p className="text-neutral-600 mb-4">{pkg.description}</p>

                <div className="flex items-baseline mb-6">
                  {pkg.price === 0 ? (
                    <span className="text-4xl font-bold text-success-DEFAULT">
                      Grátis
                    </span>
                  ) : (
                    <>
                      <span className="text-sm text-neutral-500">R$</span>
                      <span className="text-4xl font-bold text-primary-deep mx-1">
                        {pkg.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </span>
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {(pkg.features as string[]).map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-success-DEFAULT flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <PlanButton
                  planName={pkg.name}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    pkg.is_highlighted
                      ? "bg-primary-blue text-white hover:bg-primary-deep shadow-lg hover:shadow-xl"
                      : "bg-neutral-light text-primary-deep border-2 border-primary-deep hover:bg-primary-deep hover:text-white"
                  }`}
                >
                  {pkg.price === 0 ? "Começar Grátis" : "Escolher Plano"}
                </PlanButton>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-500 text-sm">
            * Todos os planos incluem acesso à plataforma. Planos pagos incluem
            suporte via WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
