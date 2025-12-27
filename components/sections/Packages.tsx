"use client";

import { Check, Star } from "lucide-react";
import PlanButton from "@/components/ui/PlanButton";

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  highlight?: string;
}

const packages: Package[] = [
  {
    name: "Free",
    price: "Grátis",
    description: "Plataforma com passo a passo completo",
    features: [
      "Passo a passo detalhado",
      "Etapas do processo explicadas",
      "Links de apoio oficiais",
      "Acesso à plataforma",
    ],
  },
  {
    name: "Básico",
    price: "R$ 97",
    description: "Tudo do Free + consultoria e suporte",
    features: [
      "Tudo do pacote Free",
      "Consultoria pela plataforma",
      "Auxílio com documentação",
      "Acesso a aulas gravadas",
      "Suporte por chat",
    ],
  },
  {
    name: "B2",
    price: "R$ 197",
    description: "Preparação completa para prova teórica",
    popular: true,
    features: [
      "Tudo do pacote Básico",
      "1 aula agendada para prova teórica",
      "Simulado interativo",
      "1 aula de reforço",
      "Material de estudo exclusivo",
    ],
  },
  {
    name: "Driver",
    price: "R$ 497",
    description: "Inclui aulas práticas obrigatórias",
    features: [
      "Tudo do pacote B2",
      "2 aulas práticas obrigatórias",
      "Instrutor qualificado",
      "Acompanhamento personalizado",
    ],
  },
  {
    name: "Driver +10",
    price: "R$ 997",
    description: "Pacote completo com aulas extras",
    features: [
      "Tudo do pacote B2",
      "8 aulas práticas de direção",
      "Preparação intensiva",
      "Garantia de aprovação*",
    ],
  },
  {
    name: "Driver Auto",
    price: "R$ 597",
    description: "Aulas práticas em carro automático",
    highlight: "Diferencial",
    features: [
      "Tudo do pacote B2",
      "Aulas em veículo automático",
      "Instrutor especializado",
      "Ideal para iniciantes",
    ],
  },
];

export default function Packages() {
  return (
    <section id="pacotes" className="py-16 md:py-24 bg-gradient-to-br from-neutral-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Oferecemos diferentes níveis de suporte para atender suas
            necessidades
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 border-2 transition-all hover:shadow-xl ${
                pkg.popular
                  ? "border-primary-blue shadow-lg scale-105"
                  : "border-neutral-medium/50 hover:border-primary-blue/50"
              }`}
            >
              {pkg.popular && (
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-primary-blue text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Mais Popular</span>
                  </span>
                </div>
              )}

              {pkg.highlight && (
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-accent-teal text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {pkg.highlight}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-primary-deep mb-2">
                {pkg.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary-blue">
                  {pkg.price}
                </span>
                {pkg.price !== "Grátis" && (
                  <span className="text-neutral-600 ml-2">/único</span>
                )}
              </div>
              <p className="text-neutral-600 mb-6">{pkg.description}</p>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-success-DEFAULT flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <PlanButton
                planName={pkg.name}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  pkg.popular
                    ? "bg-primary-blue text-white hover:bg-primary-deep shadow-md hover:shadow-lg"
                    : "bg-neutral-light text-primary-blue hover:bg-primary-blue/10 border border-primary-blue"
                }`}
              >
                Escolher plano
              </PlanButton>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-600">
            *Garantia de aprovação sujeita aos termos e condições. Consulte
            detalhes no momento da contratação.
          </p>
        </div>
      </div>
    </section>
  );
}

