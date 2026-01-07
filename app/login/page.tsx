"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const planParam = searchParams.get("plano");
  const redirectParam = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Por favor, confirme seu e-mail antes de fazer login");
      } else {
        setError(error.message);
      }
      setIsLoading(false);
      return;
    }

    // Redirecionar: priorizar redirect, depois plano, depois dashboard
    if (redirectParam) {
      router.push(decodeURIComponent(redirectParam));
    } else if (planParam) {
      router.push(`/dashboard?plano=${encodeURIComponent(planParam)}`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-deep rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-2">
              Entrar na sua conta
            </h1>
            <p className="text-neutral-600">
              Acesse seu painel e acompanhe seu processo de habilitação
            </p>
            {planParam && (
              <p className="text-sm text-primary-blue mt-2">
                Você selecionou o plano: <strong>{planParam}</strong>
              </p>
            )}
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-medium/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
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
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-primary-deep mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <Link
                  href="/esqueci-senha"
                  className="text-sm text-primary-blue hover:text-primary-deep font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full bg-primary-blue text-white py-3 rounded-lg font-semibold hover:bg-primary-deep transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading || authLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-medium"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">
                    Ainda não tem uma conta?
                  </span>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6">
              <Link
                href={planParam ? `/register?plano=${encodeURIComponent(planParam)}` : "/register"}
                className="block w-full text-center bg-neutral-light text-primary-blue py-3 rounded-lg font-semibold border-2 border-primary-blue hover:bg-primary-blue/5 transition-all"
              >
                Criar conta gratuita
              </Link>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-4">
            <p className="text-sm text-neutral-700 text-center">
              <strong>Dica:</strong> Ao criar uma conta, você terá acesso ao
              painel personalizado para acompanhar todo o seu processo de
              habilitação.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-light">
          <Navbar />
          <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">Carregando...</p>
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
