import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const formationItems = [
    { year: t("formation.0.year"), title: t("formation.0.title"), place: t("formation.0.place"), active: true },
    { year: t("formation.1.year"), title: t("formation.1.title"), place: t("formation.1.place"), active: false },
    { year: t("formation.2.year"), title: t("formation.2.title"), place: t("formation.2.place"), active: false },
    { year: t("formation.3.year"), title: t("formation.3.title"), place: t("formation.3.place"), active: false },
  ];

  const experienceItems = [
    { year: t("experience.0.year"), title: t("experience.0.title"), place: t("experience.0.place"), active: true },
    { year: t("experience.1.year"), title: t("experience.1.title"), place: t("experience.1.place"), active: true },
  ];

  const actPillars = [
    { title: t("act.pillars.0.title"), desc: t("act.pillars.0.desc"), color: t("act.pillars.0.color") },
    { title: t("act.pillars.1.title"), desc: t("act.pillars.1.desc"), color: t("act.pillars.1.color") },
    { title: t("act.pillars.2.title"), desc: t("act.pillars.2.desc"), color: t("act.pillars.2.color") },
    { title: t("act.pillars.3.title"), desc: t("act.pillars.3.desc"), color: t("act.pillars.3.color") },
    { title: t("act.pillars.4.title"), desc: t("act.pillars.4.desc"), color: t("act.pillars.4.color") },
    { title: t("act.pillars.5.title"), desc: t("act.pillars.5.desc"), color: t("act.pillars.5.color") },
  ];

  const approachItems = [
    { icon: t("approach.0.icon"), title: t("approach.0.title"), desc: t("approach.0.desc") },
    { icon: t("approach.1.icon"), title: t("approach.1.title"), desc: t("approach.1.desc") },
    { icon: t("approach.2.icon"), title: t("approach.2.title"), desc: t("approach.2.desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sage-50 to-warm-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-sage-200 to-lilac-200 flex items-center justify-center shadow-xl">
                <Image
                  src="/images/mica-2.jpeg"
                  alt="Micaela Vulcano"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
            {/* Text */}
            <div>
              <span className="inline-block bg-sage-100 text-sage-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
                {t("hero.badge")}
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 mb-5">
                {t("hero.title")}
              </h1>
              <p className="text-warm-600 leading-relaxed mb-4">{t("hero.p1")}</p>
              <p className="text-warm-600 leading-relaxed mb-4">{t("hero.p2")}</p>
              <p className="text-warm-600 leading-relaxed">{t("hero.p3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formation & Experience */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="border-t border-warm-100 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1px_1fr] gap-8">
            {/* Formación */}
            <div>
              <span className="block mb-6 text-[11px] uppercase tracking-widest text-warm-400 font-medium">
                {t("formation.label")}
              </span>
              <div className="relative">
                <div className="absolute left-0.75 top-2 bottom-2 w-px bg-warm-100" />
                <div className="space-y-7">
                  {formationItems.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="relative shrink-0 mt-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.active ? "#7F77DD" : "#d1ccc4" }}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-warm-400 font-medium">{item.year}</span>
                        <h3 className="font-semibold text-warm-800 text-sm leading-snug mt-0.5">{item.title}</h3>
                        <p className="text-warm-500 text-xs mt-0.5">{item.place}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="bg-warm-100 hidden sm:block" />

            {/* Experiencia */}
            <div className="sm:pl-2">
              <span className="block mb-6 text-[11px] uppercase tracking-widest text-warm-400 font-medium">
                {t("experience.label")}
              </span>
              <div className="relative">
                <div className="absolute left-0.75 top-2 bottom-2 w-px bg-warm-100" />
                <div className="space-y-7">
                  {experienceItems.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="relative shrink-0 mt-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.active ? "#7F77DD" : "#d1ccc4" }}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-warm-400 font-medium">{item.year}</span>
                        <h3 className="font-semibold text-warm-800 text-sm leading-snug mt-0.5">{item.title}</h3>
                        <p className="text-warm-500 text-xs mt-0.5">{item.place}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is ACT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-warm-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-900 mb-4">{t("act.title")}</h2>
            <p className="text-warm-500 max-w-2xl mx-auto leading-relaxed">
              {t("act.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {actPillars.map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-2xl p-6 border border-warm-100 hover:shadow-sm transition-shadow">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${pillar.color}`}>
                  {pillar.title}
                </span>
                <p className="text-warm-600 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-sage-500 rounded-2xl p-8 text-white text-center">
            <p className="text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
              {t("act.quote")}
            </p>
            <Link
              href="/blog/que-es-la-terapia-act"
              className="inline-flex items-center gap-2 bg-white text-sage-700 hover:bg-sage-50 font-medium px-6 py-3 rounded-full transition-colors text-sm"
            >
              {t("act.blogLink")}
            </Link>
          </div>
        </div>
      </section>

      {/* My approach */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-warm-900 mb-6">{t("approach.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {approachItems.map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-warm-50 border border-warm-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-warm-800 mb-2 text-sm">{item.title}</h3>
                <p className="text-warm-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-medium px-7 py-3.5 rounded-full transition-colors shadow-md"
            >
              {t("approach.cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
