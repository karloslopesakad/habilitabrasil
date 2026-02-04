"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Timer from "@/components/simulado/Timer";
import QuestionCard from "@/components/simulado/QuestionCard";
import ResultCard from "@/components/simulado/ResultCard";
import { useSimulation } from "@/hooks/useSimulation";
import { useAuth } from "@/hooks/useAuth";
import { SimulationQuestion, SimulationAttempt } from "@/types/database";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type SimulationState = "loading" | "ready" | "in_progress" | "completed";

function SimulationContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepId = params.stepId as string;
  const attemptId = searchParams.get("attempt");

  const { user, isLoading: authLoading } = useAuth();
  const {
    fetchQuestions,
    startSimulation,
    submitSimulation,
    isLoading,
    error,
  } = useSimulation();

  const [state, setState] = useState<SimulationState>("loading");
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);
  const [attempt, setAttempt] = useState<SimulationAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  // Carregar tentativa existente ou iniciar nova
  useEffect(() => {
    const initializeSimulation = async () => {
      // Aguardar autenticação carregar antes de verificar
      if (authLoading) {
        return;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      // Se há attemptId, carregar tentativa existente (para gabarito)
      if (attemptId) {
        // TODO: Implementar carregamento de tentativa existente para visualizar gabarito
        // Por enquanto, redireciona para iniciar novo simulado
        router.push(`/simulado/${stepId}`);
        return;
      }

      // Buscar questões
      console.log("Buscando questões para stepId:", stepId, "userId:", user.id);
      const { data: fetchedQuestions, error: questionsError } = await fetchQuestions(
        stepId,
        30,
        user.id
      );

      if (questionsError) {
        console.error("Erro ao buscar questões:", questionsError);
        setLocalError(questionsError.message || "Erro ao carregar questões");
        setState("ready");
        return;
      }

      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        console.warn("Nenhuma questão retornada");
        setLocalError("Nenhuma questão disponível no momento. Por favor, verifique se há questões cadastradas no banco de dados.");
        setState("ready");
        return;
      }

      console.log("Questões carregadas:", fetchedQuestions.length);

      setQuestions(fetchedQuestions);
      setState("ready");
    };

    initializeSimulation();
  }, [user, authLoading, stepId, attemptId, fetchQuestions, router]);

  const handleStartSimulation = async () => {
    console.log("handleStartSimulation chamado", { user: !!user, questionsCount: questions.length });
    
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (questions.length === 0) {
      console.error("Nenhuma questão disponível");
      return;
    }

    setState("loading"); // Mostrar loading ao iniciar

    const questionIds = questions.map((q) => q.id);
    console.log("Iniciando simulado com", questionIds.length, "questões");
    
    const { data: newAttempt, error: startError } = await startSimulation(
      stepId,
      questionIds
    );

    if (startError) {
      console.error("Erro ao iniciar simulado:", startError);
      setLocalError(startError.message || "Erro ao iniciar simulado. Tente novamente.");
      setState("ready"); // Voltar ao estado ready para mostrar erro
      return;
    }

    if (!newAttempt) {
      console.error("Nenhuma tentativa retornada");
      setLocalError("Não foi possível iniciar o simulado. Tente novamente.");
      setState("ready");
      return;
    }

    setLocalError(null); // Limpar erro anterior se sucesso

    console.log("Simulado iniciado com sucesso:", newAttempt.id);
    setAttempt(newAttempt);
    setStartTime(Date.now());
    setState("in_progress");
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    if (!attempt || !window.confirm("Tem certeza que deseja finalizar o simulado?")) {
      return;
    }

    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
    setTimeSpent(timeSpentSeconds);

    const { data: completedAttempt, error: submitError } = await submitSimulation(
      attempt.id,
      answers,
      timeSpentSeconds,
      questions
    );

    if (submitError || !completedAttempt) {
      return;
    }

    setAttempt(completedAttempt);
    setState("completed");
  };

  const handleTimeUp = async () => {
    if (!attempt) return;

    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
    setTimeSpent(timeSpentSeconds);

    const { data: completedAttempt, error: submitError } = await submitSimulation(
      attempt.id,
      answers,
      timeSpentSeconds,
      questions
    );

    if (submitError || !completedAttempt) {
      return;
    }

    setAttempt(completedAttempt);
    setState("completed");
  };

  const handleTick = (remainingSeconds: number) => {
    if (startTime > 0) {
      const elapsed = 3600 - remainingSeconds;
      setTimeSpent(elapsed);
    }
  };

  // Question navigation
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] || null : null;
  const answeredCount = Object.keys(answers).length;
  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < questions.length - 1;

  // Mostrar loading enquanto autenticação está carregando ou estado é loading
  if (authLoading || state === "loading") {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">
                {authLoading ? "Verificando autenticação..." : "Carregando simulado..."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (state === "ready") {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl border-2 border-neutral-200 p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-primary-deep mb-2">
                  Simulado de Prova Teórica
                </h1>
                <p className="text-neutral-600">
                  Prepare-se para a prova oficial do DETRAN
                </p>
              </div>

              <div className="bg-primary-blue/10 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-primary-deep mb-4">
                  Informações do Simulado
                </h2>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>30 questões de múltipla escolha</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>60 minutos para conclusão</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>70% de acertos para aprovação (21 questões)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Questões balanceadas por categoria</span>
                  </li>
                </ul>
              </div>

              {(error || localError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error || localError}</span>
                </div>
              )}

              {questions.length === 0 && !error && !localError && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Nenhuma questão disponível. Por favor, tente novamente mais tarde.</span>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Botão clicado");
                  handleStartSimulation();
                }}
                disabled={isLoading || questions.length === 0}
                className="w-full bg-primary-blue text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Iniciando..." : "Iniciar Simulado"}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (state === "completed" && attempt) {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ResultCard attempt={attempt} questions={questions} stepId={stepId} />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (state === "in_progress" && currentQuestion) {
    return (
      <main className="min-h-screen bg-neutral-light">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Timer and Progress */}
            <div className="space-y-4">
              <Timer
                initialSeconds={3600 - timeSpent}
                onTimeUp={handleTimeUp}
                onTick={handleTick}
              />
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700">
                    Progresso
                  </span>
                  <span className="text-sm text-neutral-600">
                    {answeredCount} de {questions.length} respondidas
                  </span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-blue rounded-full transition-all"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              onPrevious={handlePrevious}
              onNext={handleNext}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
            />

            {/* Finish Button */}
            <div className="flex justify-end">
              <button
                onClick={handleFinish}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Finalizar Prova
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return null;
}

export default function SimulationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-light">
          <Navbar />
          <div className="pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-600">Carregando...</p>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <SimulationContent />
    </Suspense>
  );
}

