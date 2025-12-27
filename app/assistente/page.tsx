"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Send, Sparkles, Bot, User } from "lucide-react";

interface Message {
  id: number;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const quickSuggestions = [
  "Quais são as novas regras para CNH?",
  "Quais documentos preciso?",
  "Quanto custa tirar a CNH?",
  "Como agendar a prova teórica?",
];

const responses: { [key: string]: string } = {
  "novas regras": "As novas regras de 2025 incluem: curso teórico de 45 horas, mínimo de 2 aulas práticas obrigatórias, prova teórica com 30 questões (precisa acertar 21), e processo mais digitalizado. Quer saber mais sobre alguma regra específica?",
  "documentos": "Os documentos necessários são: RG original, CPF, comprovante de residência atualizado, foto 3x4 recente, e laudos de exame médico e psicológico. Todos devem estar em dia e legíveis. Precisa de ajuda para obter algum documento específico?",
  "custo": "Os custos variam por estado, mas geralmente incluem: taxas do DETRAN (cerca de R$ 200-400), exames médicos e psicológicos (R$ 150-300), curso teórico (R$ 300-600), e aulas práticas (R$ 50-100 por aula). O total costuma ficar entre R$ 1.500 e R$ 3.000. Quer ver nossos pacotes que podem ajudar a economizar?",
  "agendar prova": "Para agendar a prova teórica, você precisa: 1) Ter completado o curso teórico, 2) Estar com os exames médicos aprovados, 3) Acessar o portal do DETRAN do seu estado, 4) Escolher data e local disponíveis. Posso te ajudar a entender melhor algum passo?",
};

export default function AssistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant",
      text: "Olá! Nossos instrutores especializados estão aqui para ajudar você a entender o processo de obtenção da CNH, explicar as novas regras, orientar sobre documentação e muito mais. Por onde você gostaria de começar?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      let response = "Entendo sua dúvida! ";

      if (lowerText.includes("regra") || lowerText.includes("novo")) {
        response = responses["novas regras"];
      } else if (
        lowerText.includes("documento") ||
        lowerText.includes("papel")
      ) {
        response = responses["documentos"];
      } else if (lowerText.includes("custo") || lowerText.includes("preço")) {
        response = responses["custo"];
      } else if (
        lowerText.includes("agendar") ||
        lowerText.includes("prova") ||
        lowerText.includes("marcar")
      ) {
        response = responses["agendar prova"];
      } else {
        response +=
          "Posso ajudar com informações sobre: novas regras, documentos necessários, custos, agendamento de provas, aulas práticas e muito mais. O que você gostaria de saber?";
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        type: "assistant",
        text: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-deep rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-2">
              Suporte e Orientação
            </h1>
            <p className="text-neutral-600">
              Tire suas dúvidas sobre o processo de obtenção da CNH com nossos instrutores
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-medium/50 overflow-hidden">
            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-blue" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.type === "user"
                        ? "bg-primary-blue text-white"
                        : "bg-neutral-light text-neutral-700"
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-blue" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-blue" />
                  </div>
                  <div className="bg-neutral-light rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4 border-t border-neutral-medium/50 pt-4">
                <p className="text-sm text-neutral-600 mb-3">
                  Sugestões rápidas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className="bg-neutral-light hover:bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-primary-blue/20"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-neutral-medium/50 p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-4 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary-blue text-white p-3 rounded-lg hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Box */}
            <div className="mt-8 bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-6">
            <p className="text-sm text-neutral-700 text-center">
              <strong>Dica:</strong> Este é um sistema de suporte de demonstração.
              Para acompanhamento completo e personalizado com instrutores especializados, considere nossos{" "}
              <a href="/pacotes" className="text-primary-blue font-semibold hover:underline">
                planos de auxílio
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

