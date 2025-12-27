"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const planParam = searchParams.get("plano");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError("Você precisa aceitar os termos de uso");
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.name,
      formData.phone
    );

    if (error) {
      if (error.message.includes("User already registered")) {
        setError("Este e-mail já está cadastrado");
      } else {
        setError(error.message);
      }
      setIsLoading(false);
      return;
    }

    setSuccess(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (success) {
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
                Conta criada com sucesso!
              </h2>
              <p className="text-neutral-600 mb-6">
                Enviamos um e-mail de confirmação para <strong>{formData.email}</strong>.
                Por favor, verifique sua caixa de entrada e confirme seu cadastro.
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-deep transition-all"
              >
                Ir para o Login
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-deep rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-deep mb-2">
              Criar conta
            </h1>
            <p className="text-neutral-600">
              Comece sua jornada para obter a CNH
            </p>
            {planParam && (
              <p className="text-sm text-primary-blue mt-2">
                Você selecionou o plano: <strong>{planParam}</strong>
              </p>
            )}
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-medium/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-primary-deep mb-2"
                >
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

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

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-primary-deep mb-2"
                >
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="(00) 00000-0000"
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-primary-deep mb-2"
                >
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-neutral-medium/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="Digite a senha novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-neutral-medium rounded mt-1"
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 block text-sm text-neutral-600"
                >
                  Eu aceito os{" "}
                  <Link
                    href="/termos"
                    className="text-primary-blue hover:text-primary-deep font-medium"
                  >
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="/privacidade"
                    className="text-primary-blue hover:text-primary-deep font-medium"
                  >
                    política de privacidade
                  </Link>
                </label>
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
                    <span>Criando conta...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Criar conta</span>
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
                    Já tem uma conta?
                  </span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <Link
                href={planParam ? `/login?plano=${encodeURIComponent(planParam)}` : "/login"}
                className="block w-full text-center bg-neutral-light text-primary-blue py-3 rounded-lg font-semibold border-2 border-primary-blue hover:bg-primary-blue/5 transition-all"
              >
                Fazer login
              </Link>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-4">
            <p className="text-sm text-neutral-700 text-center">
              <strong>Benefícios:</strong> Ao criar uma conta, você terá acesso
              ao painel personalizado, acompanhamento do processo, histórico
              de aulas e muito mais.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
