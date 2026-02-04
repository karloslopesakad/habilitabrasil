"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { CheckCircle, LogIn, AlertCircle, Loader2 } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const client = getSupabase();
      
      if (!client || !isSupabaseConfigured()) {
        // Modo demo - simular sucesso
        setStatus("success");
        return;
      }

      try {
        // Obter os parâmetros da URL
        const tokenHash = searchParams.get("token_hash");
        const code = searchParams.get("code");
        const type = searchParams.get("type");

        // Verificar se já existe uma sessão (callback já foi processado pelo middleware)
        const { data: { session } } = await client.auth.getSession();
        
        if (session?.user) {
          // Já está autenticado, mostrar sucesso
          setStatus("success");
          return;
        }

        // Tentar verificar com token_hash
        if (tokenHash && type) {
          const { data, error } = await client.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as "email",
          });

          if (error) {
            console.error("Erro ao verificar email:", error);
            
            if (error.message.includes("expired")) {
              setStatus("error");
              setErrorMessage("Este link de confirmação expirou. Por favor, solicite um novo link de confirmação.");
            } else if (error.message.includes("already confirmed") || error.message.includes("already verified")) {
              // Se já foi confirmado, mostrar sucesso
              setStatus("success");
            } else {
              setStatus("error");
              setErrorMessage(error.message || "Erro ao confirmar o email. Por favor, tente novamente.");
            }
            return;
          }

          if (data?.user) {
            setStatus("success");
            return;
          }
        }

        // Se não há parâmetros válidos
        if (!tokenHash) {
          setStatus("error");
          setErrorMessage("Link de confirmação inválido. Parâmetros ausentes.");
          return;
        }

        // Fallback: se chegou aqui sem erro mas também sem sucesso
        setStatus("error");
        setErrorMessage("Não foi possível confirmar o email. Por favor, tente novamente.");
      } catch (err: any) {
        console.error("Erro inesperado ao processar callback:", err);
        setStatus("error");
        setErrorMessage("Ocorreu um erro inesperado. Por favor, tente novamente.");
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-neutral-light">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-medium/50 p-8 text-center">
            {status === "loading" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-blue/10 rounded-full mb-4">
                  <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary-deep mb-2">
                  Confirmando seu email...
                </h2>
                <p className="text-neutral-600 mb-6">
                  Aguarde enquanto verificamos sua confirmação de email.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success-DEFAULT rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary-deep mb-2">
                  Email confirmado com sucesso!
                </h2>
                <p className="text-neutral-600 mb-6">
                  Seu cadastro foi ativado e você já pode fazer login na plataforma.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center space-x-2 bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-deep transition-all shadow-md hover:shadow-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Ir para o Login</span>
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary-deep mb-2">
                  Erro ao confirmar email
                </h2>
                <p className="text-neutral-600 mb-6">
                  {errorMessage || "Não foi possível confirmar seu email. Por favor, tente novamente."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center space-x-2 bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-deep transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Ir para o Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center space-x-2 bg-neutral-light text-primary-blue px-6 py-3 rounded-lg font-semibold border-2 border-primary-blue hover:bg-primary-blue/5 transition-all"
                  >
                    <span>Criar nova conta</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Info Box */}
          {status === "success" && (
            <div className="mt-6 bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-4">
              <p className="text-sm text-neutral-700 text-center">
                <strong>Próximos passos:</strong> Faça login com seu email e senha para acessar seu painel personalizado e começar sua jornada para obter a CNH.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function AuthCallbackPage() {
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
      <CallbackContent />
    </Suspense>
  );
}

