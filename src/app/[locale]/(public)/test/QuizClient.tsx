"use client";

import { useState } from "react";
import Link from "next/link";

const WA_HREF = `https://wa.me/5491100000000?text=${encodeURIComponent(
  "Hola Micaela, hice el test de flexibilidad psicológica y me gustaría una sesión gratuita de 15 minutos."
)}`;

const questions = [
  {
    text: "Cuando sentís una emoción difícil (miedo, tristeza, enojo), ¿qué solés hacer?",
    options: [
      { text: "Hago todo lo posible para no sentirla", score: 1 },
      { text: "La ignoro y trato de seguir con mi día", score: 2 },
      { text: "La noto, aunque me resulte incómoda", score: 3 },
      { text: "La observo sin juzgarla y dejo que pase", score: 4 },
    ],
  },
  {
    text: 'Cuando tu mente te dice "no soy suficiente" o "voy a fracasar", ¿cómo respondés?',
    options: [
      { text: "Lo creo completamente y actúo según ese pensamiento", score: 1 },
      {
        text: "Me quedo enganchado/a en ese pensamiento por mucho tiempo",
        score: 2,
      },
      { text: "Intento convencerme de lo contrario", score: 3 },
      {
        text: "Noto que es un pensamiento, no necesariamente la realidad",
        score: 4,
      },
    ],
  },
  {
    text: "Durante el día a día, ¿cuánta atención le prestás al momento presente?",
    options: [
      {
        text: "Casi ninguna — siempre estoy pensando en el pasado o el futuro",
        score: 1,
      },
      {
        text: "A veces estoy presente, pero me distraigo fácilmente",
        score: 2,
      },
      { text: "Logro conectar con el presente cuando me lo propongo", score: 3 },
      {
        text: "Suelo estar bastante conectado/a con lo que pasa aquí y ahora",
        score: 4,
      },
    ],
  },
  {
    text: "¿Qué tan claro/a tenés lo que más te importa en la vida?",
    options: [
      {
        text: "No tengo mucha idea de qué me importa de verdad",
        score: 1,
      },
      { text: "Tengo algunas ideas, pero me cuesta definirlo", score: 2 },
      {
        text: "Sé lo que me importa, aunque no siempre actúo en línea con eso",
        score: 3,
      },
      {
        text: "Tengo bastante claros mis valores y los uso como guía",
        score: 4,
      },
    ],
  },
  {
    text: "Cuando algo te genera ansiedad o incomodidad, ¿qué hacés?",
    options: [
      { text: "Lo evito o lo postergo todo lo posible", score: 1 },
      { text: "Lo intento, pero la incomodidad suele ganar", score: 2 },
      { text: "A veces avanzo aunque no me sienta cómodo/a", score: 3 },
      { text: "Generalmente avanzo incluso si hay incomodidad", score: 4 },
    ],
  },
  {
    text: "Cuando estás pasando un momento difícil, ¿cómo te relacionás con vos mismo/a?",
    options: [
      {
        text: 'Me identifico completamente: "yo soy esto que me pasa"',
        score: 1,
      },
      { text: "Me cuesta mucho separarme de mis emociones", score: 2 },
      { text: "A veces logro tomar distancia y observar", score: 3 },
      {
        text: "Puedo observar lo que siento sin que eso me defina",
        score: 4,
      },
    ],
  },
  {
    text: "Frente a emociones como la ansiedad o la tristeza, ¿cómo solés reaccionar?",
    options: [
      { text: "Hago todo lo que pueda para que desaparezcan", score: 1 },
      { text: "Me preocupo mucho por tenerlas", score: 2 },
      { text: "Las acepto a medias, aunque me cueste", score: 3 },
      {
        text: "Las reconozco como parte de la experiencia y sigo adelante",
        score: 4,
      },
    ],
  },
  {
    text: "¿Cuánto actuás desde lo que realmente querés vs. lo que el miedo o la presión te dictan?",
    options: [
      {
        text: "Casi siempre me guío por el miedo o lo que otros esperan",
        score: 1,
      },
      { text: "A veces actúo desde mis valores, a veces no", score: 2 },
      {
        text: "Cada vez más, intento elegir desde lo que me importa",
        score: 3,
      },
      {
        text: "La mayoría del tiempo actúo desde mis valores",
        score: 4,
      },
    ],
  },
  {
    text: "Cuando cometés un error o algo sale mal, ¿cuánto le das vueltas?",
    options: [
      { text: "Mucho — puedo rumiar días o semanas", score: 1 },
      { text: "Me afecta bastante, aunque eventualmente sigo", score: 2 },
      { text: "Lo proceso e intento aprender de ello", score: 3 },
      { text: "Lo reconozco, saco lo que puedo y sigo adelante", score: 4 },
    ],
  },
  {
    text: "En general, ¿sentís que tu vida refleja lo que verdaderamente te importa?",
    options: [
      {
        text: "No mucho — siento que vivo en piloto automático",
        score: 1,
      },
      {
        text: "En algunas áreas sí, pero hay partes importantes que no",
        score: 2,
      },
      { text: "Bastante, aunque hay cosas que quisiera cambiar", score: 3 },
      {
        text: "Sí, siento que vivo bastante alineado/a con lo que valoro",
        score: 4,
      },
    ],
  },
];

interface ResultConfig {
  min: number;
  max: number;
  label: string;
  badgeClasses: string;
  cardClasses: string;
  message: string;
  ctaNote: string;
}

const resultConfigs: ResultConfig[] = [
  {
    min: 35,
    max: 40,
    label: "Alta flexibilidad",
    badgeClasses: "bg-brand-100 text-brand-700",
    cardClasses: "bg-brand-50 border-brand-200",
    message:
      "Tu manera de relacionarte con tus emociones y de actuar desde lo que te importa es genuinamente valiosa. Eso no significa que todo esté perfecto — significa que tenés herramientas reales. Seguí cultivando esa conexión con vos mismo/a.",
    ctaNote: "¿Querés seguir creciendo? Puedo acompañarte.",
  },
  {
    min: 25,
    max: 34,
    label: "Flexibilidad moderada",
    badgeClasses: "bg-lilac-100 text-lilac-700",
    cardClasses: "bg-lilac-50 border-lilac-200",
    message:
      "Tenés recursos reales para afrontar los desafíos, y también hay espacio para crecer. Las áreas donde sentís más rigidez son exactamente donde la terapia ACT puede hacer la diferencia — no porque algo esté mal en vos, sino porque podés vivir con más libertad.",
    ctaNote: "Hablemos y encontremos esas áreas juntos.",
  },
  {
    min: 15,
    max: 24,
    label: "Flexibilidad baja",
    badgeClasses: "bg-cream-100 text-cream-700",
    cardClasses: "bg-cream-50 border-cream-200",
    message:
      "Los resultados muestran que estás lidiando con algunas dificultades en cómo te relacionás con tus pensamientos y emociones. Eso es completamente humano — y tiene camino. La terapia ACT está diseñada específicamente para esto.",
    ctaNote: "La terapia ACT puede ayudarte mucho.",
  },
  {
    min: 10,
    max: 14,
    label: "Flexibilidad muy baja",
    badgeClasses: "bg-warm-200 text-warm-800",
    cardClasses: "bg-warm-100 border-warm-300",
    message:
      "Parece que estás en un momento difícil, y quiero que sepas que no tenés que atravesarlo solo/a. Lo que te está pasando tiene nombre y tiene camino. Una conversación puede ser el primer paso hacia sentirse diferente.",
    ctaNote: "Sería muy valioso que hablemos. Estoy acá.",
  },
];

function getResult(score: number): ResultConfig {
  return (
    resultConfigs.find((r) => score >= r.min && score <= r.max) ??
    resultConfigs[2]
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-6">
        <span className="text-3xl">🌿</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold text-warm-900 mb-3">
        Test de Flexibilidad Psicológica
      </h1>
      <p className="text-warm-600 text-lg mb-8 max-w-sm mx-auto">
        Descubrí cómo te relacionás con tus pensamientos, emociones y lo que te
        importa.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {["10 preguntas", "~3 minutos", "Sin diagnósticos", "Sin juicios"].map(
          (pill) => (
            <span
              key={pill}
              className="px-3 py-1 rounded-full bg-warm-100 text-warm-600 text-sm"
            >
              {pill}
            </span>
          )
        )}
      </div>
      <button
        onClick={onStart}
        className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium text-lg transition-colors duration-200 cursor-pointer"
      >
        Empezar el test
      </button>
      <p className="mt-4 text-warm-400 text-sm">
        Este test no reemplaza una evaluación profesional.
      </p>
    </div>
  );
}

function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = (current / total) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-warm-500 mb-2">
        <span>
          Pregunta {current + 1} de {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function QuizScreen({
  question,
  questionIndex,
  total,
  selectedOption,
  fading,
  onAnswer,
}: {
  question: (typeof questions)[number];
  questionIndex: number;
  total: number;
  selectedOption: number | null;
  fading: boolean;
  onAnswer: (score: number, idx: number) => void;
}) {
  return (
    <div>
      <ProgressBar current={questionIndex} total={total} />
      <div
        className={`transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6 sm:p-8">
          <p className="text-xl sm:text-2xl font-semibold text-warm-900 mb-6 leading-snug">
            {question.text}
          </p>
          <div className="flex flex-col gap-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => onAnswer(opt.score, idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left px-4 py-3 sm:py-4 rounded-xl border text-warm-800 text-base transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? "border-brand-500 bg-brand-50 text-brand-800"
                        : "border-warm-200 bg-white hover:border-brand-400 hover:bg-brand-50"
                    }
                    disabled:cursor-not-allowed`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailScreen({
  email,
  onEmailChange,
  onSubmit,
  onSkip,
}: {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6 sm:p-8 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lilac-100 mb-4">
        <span className="text-2xl">✉️</span>
      </div>
      <h2 className="text-2xl font-semibold text-warm-900 mb-2">
        ¡Casi llegás!
      </h2>
      <p className="text-warm-600 mb-6">
        Si querés, dejá tu email y te envío tips de ACT y recursos de bienestar
        para seguir creciendo.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="tu@email.com"
          className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-warm-50 text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={!email.trim()}
          className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-warm-200 disabled:text-warm-400 text-white rounded-xl font-medium transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          Recibir tips y ver mi resultado
        </button>
      </form>
      <button
        onClick={onSkip}
        className="mt-4 text-warm-500 hover:text-warm-700 text-sm underline underline-offset-2 transition-colors cursor-pointer"
      >
        Prefiero no, ver mi resultado directamente
      </button>
    </div>
  );
}

function ResultScreen({
  score,
  result,
  onRestart,
}: {
  score: number;
  result: ResultConfig;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Score card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 text-center ${result.cardClasses}`}
      >
        <p className="text-warm-600 text-sm mb-3">Tu puntuación</p>
        <div className="text-6xl font-bold text-warm-900 mb-1">
          {score}
          <span className="text-2xl font-normal text-warm-400">/40</span>
        </div>
        <span
          className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${result.badgeClasses}`}
        >
          {result.label}
        </span>
      </div>

      {/* Message card */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6 sm:p-8">
        <p className="text-warm-700 text-lg leading-relaxed mb-4">
          {result.message}
        </p>
        <p className="text-warm-500 text-base italic">{result.ctaNote}</p>
      </div>

      {/* WhatsApp CTA */}
      <Link
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-medium text-lg transition-colors duration-200 shadow-sm"
      >
        <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Quiero una sesión gratuita de 15 minutos
      </Link>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="text-warm-400 hover:text-warm-600 text-sm underline underline-offset-2 transition-colors cursor-pointer"
      >
        Retomar el test
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuizClient() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "email" | "result">(
    "intro"
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [email, setEmail] = useState("");

  const score = answers.reduce((sum, a) => sum + a, 0);
  const result = getResult(score);

  const handleAnswer = (answerScore: number, idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setFading(true);
    setTimeout(() => {
      const next = [...answers, answerScore];
      setAnswers(next);
      setFading(false);
      setSelectedOption(null);
      if (next.length >= questions.length) {
        setPhase("email");
      } else {
        setCurrentQuestion((q) => q + 1);
      }
    }, 350);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with email marketing service (Mailchimp, ConvertKit, etc.)
    setPhase("result");
  };

  const handleRestart = () => {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setFading(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-warm-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {phase === "intro" && (
          <IntroScreen onStart={() => setPhase("quiz")} />
        )}
        {phase === "quiz" && (
          <QuizScreen
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            total={questions.length}
            selectedOption={selectedOption}
            fading={fading}
            onAnswer={handleAnswer}
          />
        )}
        {phase === "email" && (
          <EmailScreen
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleEmailSubmit}
            onSkip={() => setPhase("result")}
          />
        )}
        {phase === "result" && (
          <ResultScreen
            score={score}
            result={result}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
