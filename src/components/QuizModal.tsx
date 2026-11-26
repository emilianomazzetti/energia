import { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, X, XCircle } from 'lucide-react';
import { ENERGY_QUIZ } from '../data/energyData';

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuizModal({ open, onClose }: QuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!open) return null;

  const currentQuestion = ENERGY_QUIZ[currentIdx];
  const isAnswered = selectedIdx !== null;
  const isCorrect = selectedIdx === currentQuestion.correctIndex;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < ENERGY_QUIZ.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedIdx(null);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-medium text-sky-700">Sfida degli Scienziati</div>
            <h3 id="quiz-modal-title" className="mt-0.5 text-xl font-bold text-slate-900">
              {finished ? 'Risultato Finale' : `Domanda ${currentIdx + 1} di ${ENERGY_QUIZ.length}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Chiudi quiz"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {finished ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Award className="h-9 w-9" />
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900 tabular-nums">
              {score} / {ENERGY_QUIZ.length}
            </div>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              {score >= 6
                ? 'Fantastico! Sei un vero Ingegnere dell’Energia e conosci tutte le grandi scoperte!'
                : score >= 4
                ? 'Ottimo lavoro! Prova a cliccare ancora sui macchinari nei laboratori per scoprire altri segreti.'
                : 'Buon inizio! Esplora i laboratori interattivi e clicca sugli oggetti per leggere le storie degli inventori.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Gioca di nuovo</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                Torna ai laboratori
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-base font-semibold leading-snug text-slate-900">
              {currentQuestion.question}
            </p>

            <div className="mt-4 space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedIdx === idx;
                const isOptionCorrect = idx === currentQuestion.correctIndex;
                let btnStyle =
                  'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';

                if (isAnswered) {
                  if (isOptionCorrect) {
                    btnStyle = 'border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'border-red-300 bg-red-50 text-red-900';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isOptionCorrect && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    )}
                    {isAnswered && isSelected && !isOptionCorrect && (
                      <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div
                className={`mt-4 rounded-xl border p-3.5 text-sm ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-amber-200 bg-amber-50 text-amber-950'
                }`}
              >
                <div className="font-semibold">{isCorrect ? 'Risposta esatta!' : 'Quasi! Ecco la risposta:'}</div>
                <p className="mt-1 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="text-xs font-medium text-slate-500 tabular-nums">
                Punteggio attuale: {score}
              </div>
              {isAnswered && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  {currentIdx + 1 < ENERGY_QUIZ.length ? 'Prossima domanda' : 'Vedi risultato'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
