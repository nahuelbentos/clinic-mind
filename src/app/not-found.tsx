import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🌿</div>
      <h1 className="text-4xl font-bold text-warm-900 mb-3">Página no encontrada</h1>
      <p className="text-warm-500 mb-8 max-w-md">
        Parece que esta página no existe. Pero podés volver al inicio o ir a otra sección.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-sage-500 hover:bg-sage-600 text-white font-medium px-6 py-3 rounded-full transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          href="/contacto"
          className="bg-white hover:bg-warm-50 text-warm-700 font-medium px-6 py-3 rounded-full border border-warm-200 transition-colors"
        >
          Contacto
        </Link>
      </div>
    </div>
  );
}
