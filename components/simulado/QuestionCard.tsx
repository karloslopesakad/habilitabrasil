"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { SimulationQuestion } from "@/types/database";

interface QuestionCardProps {
  question: SimulationQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: QuestionCardProps) {
  const options = ["A", "B", "C", "D"];

  return (
    <div className="bg-white rounded-xl border-2 border-neutral-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-neutral-600">
            Questão {questionNumber} de {totalQuestions}
          </span>
          <span className="px-2 py-1 bg-primary-blue/10 text-primary-blue text-xs font-medium rounded">
            {question.category === "legislacao" && "Legislação"}
            {question.category === "direcao_defensiva" && "Direção Defensiva"}
            {question.category === "primeiros_socorros" && "Primeiros Socorros"}
            {question.category === "meio_ambiente" && "Meio Ambiente"}
            {question.category === "mecanica" && "Mecânica"}
          </span>
        </div>
        {selectedAnswer && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Respondida</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-primary-deep leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const optionText = question.options[index];
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={option}
              onClick={() => onAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-primary-blue bg-primary-blue/5"
                  : "border-neutral-200 hover:border-primary-blue/50 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "border-primary-blue bg-primary-blue text-white"
                      : "border-neutral-300 text-neutral-600"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-primary-deep mr-2">
                    {option})
                  </span>
                  <span className="text-neutral-700">{optionText}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            canGoPrevious
              ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              : "bg-neutral-50 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Anterior</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            canGoNext
              ? "bg-primary-blue text-white hover:bg-primary-deep"
              : "bg-neutral-50 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <span>Próxima</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

