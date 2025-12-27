"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Quais são as novas regras para tirar CNH em 2025?",
    answer:
      "As principais mudanças incluem: curso teórico de 45 horas/aula (podendo ser online), mínimo de 2 aulas práticas obrigatórias, prova teórica com 30 questões (precisa acertar 21 para aprovação), processo mais digitalizado com menos papelada, e possibilidade de fazer parte do processo online. O tempo total do processo pode variar de 3 a 6 meses dependendo do estado.",
  },
  {
    question: "Quais documentos são necessários para iniciar o processo?",
    answer:
      "Você precisa de: RG original e cópia, CPF, comprovante de residência atualizado (últimos 3 meses), foto 3x4 recente com fundo branco, laudo de exame médico (oftalmológico e clínico geral), e laudo de exame psicológico. Todos os documentos devem estar em dia e legíveis. Alguns estados podem exigir documentos adicionais.",
  },
  {
    question: "Quanto custa tirar a CNH?",
    answer:
      "Os custos variam por estado, mas geralmente incluem: taxas do DETRAN (R$ 200-400), exames médicos e psicológicos (R$ 150-300), curso teórico (R$ 300-600), e aulas práticas (R$ 50-100 por aula). O total costuma ficar entre R$ 1.500 e R$ 3.000. Nossos pacotes podem ajudar a economizar e organizar esses custos.",
  },
  {
    question: "Posso fazer o curso teórico online?",
    answer:
      "Sim! Desde 2020, é permitido fazer o curso teórico totalmente online. Você precisa completar as 45 horas/aula exigidas e obter o certificado de conclusão antes de agendar a prova teórica. Nossos pacotes incluem acesso a aulas gravadas e simulados para facilitar seu aprendizado.",
  },
  {
    question: "Quantas aulas práticas são obrigatórias?",
    answer:
      "O mínimo obrigatório são 2 aulas práticas, mas recomendamos fazer mais aulas se você não se sentir confiante. Muitas pessoas fazem entre 5 e 10 aulas práticas antes da prova. Nossos pacotes Driver incluem aulas práticas com instrutores qualificados.",
  },
  {
    question: "O que acontece se eu reprovar na prova teórica?",
    answer:
      "Se você reprovar na prova teórica (acertar menos de 21 questões), você pode refazer a prova após 15 dias. Não há limite de tentativas, mas cada nova prova tem uma taxa adicional. Recomendamos usar nossos simulados e materiais de estudo para se preparar bem antes da primeira tentativa.",
  },
  {
    question: "O que acontece se eu reprovar na prova prática?",
    answer:
      "Se reprovar na prova prática, você pode refazer após 15 dias. Recomendamos fazer aulas de reforço antes de tentar novamente. Nossos pacotes incluem aulas adicionais para aumentar suas chances de aprovação na primeira tentativa.",
  },
  {
    question: "Quanto tempo leva para receber a CNH definitiva?",
    answer:
      "Após ser aprovado na prova prática, você recebe a CNH provisória (PPD - Permissão para Dirigir) que tem validade de 1 ano. Durante esse período, você não pode cometer infrações graves ou gravíssimas. Após 1 ano sem problemas, você recebe a CNH definitiva automaticamente.",
  },
  {
    question: "Posso tirar CNH em carro automático?",
    answer:
      "Sim! Você pode fazer as aulas práticas e a prova em carro automático. Nossa CNH será válida apenas para veículos automáticos. Se quiser dirigir carros manuais no futuro, precisará fazer um curso de adaptação. Oferecemos o pacote Driver Auto especialmente para isso.",
  },
  {
    question: "O HabilitaBrasil é um órgão oficial?",
    answer:
      "Não, o HabilitaBrasil não é um órgão oficial. Somos uma plataforma de apoio e orientação que ajuda pessoas a entenderem e navegarem pelo processo de obtenção da CNH. Para informações oficiais, sempre consulte o DETRAN do seu estado. Nossos serviços são de consultoria e suporte educacional.",
  },
  {
    question: "Como funciona o suporte do HabilitaBrasil?",
    answer:
      "Oferecemos diferentes níveis de suporte através de nossos pacotes. Desde orientações básicas gratuitas até consultoria personalizada, aulas preparatórias e suporte completo durante todo o processo. Você pode escolher o pacote que melhor se adequa às suas necessidades.",
  },
  {
    question: "Posso mudar de pacote depois de começar?",
    answer:
      "Sim! Você pode fazer upgrade do seu pacote a qualquer momento. A diferença de valor será calculada proporcionalmente. Entre em contato conosco para mais informações sobre upgrades e mudanças de plano.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-deep text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-white/90">
              Tire suas dúvidas sobre o processo de obtenção da CNH e nossas
              soluções
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-neutral-light rounded-xl border border-neutral-medium/50 overflow-hidden transition-all hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-colors"
                  >
                    <span className="font-semibold text-primary-deep pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary-blue flex-shrink-0 transition-transform ${
                        openIndex === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-neutral-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-neutral-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-xl text-neutral-600 mb-8">
              Fale com nossos instrutores ou escolha um de nossos planos de auxílio para suporte completo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/assistente"
                className="inline-block bg-primary-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-deep transition-all shadow-md hover:shadow-lg"
              >
                Falar com Assistente
              </a>
              <a
                href="/pacotes"
                className="inline-block bg-white text-primary-blue px-8 py-4 rounded-lg font-semibold text-lg border-2 border-primary-blue hover:bg-primary-blue/5 transition-all"
              >
                Ver Pacotes
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

