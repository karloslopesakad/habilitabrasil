"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-neutral-light via-white to-primary-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Instrutores Especializados
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-deep mb-6 leading-tight">
              Seu caminho para a{" "}
              <span className="text-primary-blue">CNH começa aqui</span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-600 mb-8 leading-relaxed">
              Entenda as novas regras e conquiste sua habilitação com apoio
              completo
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/#pacotes"
                className="group bg-primary-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-deep transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Começar agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/como-funciona"
                className="bg-white text-primary-blue px-8 py-4 rounded-lg font-semibold text-lg border-2 border-primary-blue hover:bg-primary-blue/5 transition-all flex items-center justify-center"
              >
                Saiba mais
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-neutral-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-success-DEFAULT" />
                <span>100% Confiável</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary-blue" />
                <span>Atualizado 2025</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-blue to-primary-deep rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-deep">
                      Suporte Personalizado
                    </h3>
                    <p className="text-sm text-neutral-600">Instrutores disponíveis</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-neutral-light rounded-lg p-4">
                    <p className="text-sm text-neutral-700">
                      Nossos instrutores especializados estão prontos para acompanhar você em cada etapa do processo de habilitação.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-blue/20 transition-colors">
                      Novas regras
                    </button>
                    <button className="bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-blue/20 transition-colors">
                      Documentos
                    </button>
                    <button className="bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-blue/20 transition-colors">
                      Custos
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-success-light/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-purple/20 rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

