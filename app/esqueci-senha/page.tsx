"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de envio mockado
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
    }, 1500);
  };

  if (isSent) {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-medium/50 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-DEFAULT rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-primary-deep mb-2">
                E-mail enviado!
              </h2>
              <p className="text-neutral-600 mb-6">
                Enviamos um link de recuperação de senha para{" "}
                <strong>{email}</strong>. Verifique sua caixa de entrada.
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-deep transition-all"
              >
                Voltar para login
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
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-2">
              Esqueceu sua senha?
            </h1>
            <p className="text-neutral-600">
              Digite seu e-mail e enviaremos um link para redefinir sua senha
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-medium/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-primary-deep mb-2"
                >
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-blue text-white py-3 rounded-lg font-semibold hover:bg-primary-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
              </button>
            </form>

            <div className="mt-6">
              <Link
                href="/login"
                className="flex items-center justify-center space-x-2 text-primary-blue hover:text-primary-deep font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para login</span>
              </Link>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-4">
            <p className="text-sm text-neutral-700 text-center">
              <strong>Dica:</strong> Se não receber o e-mail em alguns minutos,
              verifique sua pasta de spam ou entre em contato com nosso
              suporte.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

