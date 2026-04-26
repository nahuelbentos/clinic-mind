import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Test de Flexibilidad Psicológica",
  description:
    "Descubrí cómo te relacionás con tus pensamientos, emociones y lo que te importa. 10 preguntas basadas en terapia ACT, sin diagnósticos, sin juicios.",
};

export default function TestPage() {
  return <QuizClient />;
}
