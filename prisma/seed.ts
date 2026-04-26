import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.featureFlag.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.clinicalProfile.deleteMany();
  await prisma.document.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // ─── Usuario 1: Demo ────────────────────────────────────────────────────────
  const demoPassword = await hash("demo1234", 12);
  const demoUser = await prisma.user.create({
    data: {
      name: "Dra. Demo García",
      email: "demo@ejemplo.com",
      password: demoPassword,
      profession: "Psicóloga",
      licenseNumber: "MN 12345",
      role: "THERAPIST",
    },
  });

  const patient1 = await prisma.patient.create({
    data: {
      userId: demoUser.id,
      firstName: "María",
      lastName: "López",
      email: "maria.lopez@email.com",
      phone: "+54 11 2345-6789",
      birthDate: new Date("1990-03-15"),
      gender: "female",
      status: "ACTIVE",
      clinicalProfile: {
        create: {
          consultationReason: "Ansiedad generalizada y dificultad para tomar decisiones",
          background: "Sin antecedentes psiquiátricos previos. Historial de estrés laboral.",
          currentMedication: "Ninguna",
          previousTherapy: "Terapia cognitivo-conductual por 6 meses en 2022",
          actValues: "Familia, crecimiento personal, creatividad",
        },
      },
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      userId: demoUser.id,
      firstName: "Juan",
      lastName: "Martínez",
      email: "juan.martinez@email.com",
      phone: "+54 11 9876-5432",
      birthDate: new Date("1985-07-22"),
      gender: "male",
      status: "ACTIVE",
      clinicalProfile: {
        create: {
          consultationReason: "Duelo por pérdida familiar reciente",
          background: "Episodio depresivo hace 3 años, tratado con medicación.",
          currentMedication: "Sertralina 50mg",
          previousTherapy: "Psicoanálisis por 2 años",
          actValues: "Conexión, trabajo significativo, salud",
        },
      },
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      userId: demoUser.id,
      firstName: "Lucía",
      lastName: "Fernández",
      email: "lucia.fernandez@email.com",
      phone: "+54 11 5555-1234",
      birthDate: new Date("2001-11-08"),
      gender: "female",
      status: "PAUSED",
      clinicalProfile: {
        create: {
          consultationReason: "Dificultades de adaptación a la vida universitaria",
          background: "Sin antecedentes relevantes.",
          currentMedication: "Ninguna",
          previousTherapy: "Primera vez en terapia",
          actValues: "Amistad, aprendizaje, autenticidad",
        },
      },
    },
  });

  const now = new Date();

  await prisma.session.createMany({
    data: [
      {
        patientId: patient1.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28),
        sessionNumber: 1,
        duration: 50,
        status: "COMPLETED",
        notes: `## Primera sesión\n\nMaría llega con **alto nivel de ansiedad**. Reporta dificultad para dormir y preocupación constante por el futuro.\n\n### Intervenciones\n- Psicoeducación sobre el modelo ACT\n- Ejercicio de defusión: "Estoy teniendo el pensamiento de que..."\n- Metáfora de los pasajeros del autobús\n\n### Observaciones\nBuena apertura al tratamiento. Se mostró receptiva a los conceptos de ACT.`,
        nextSessionGoal: "Trabajar con la matriz ACT para identificar patrones de evitación",
        paymentStatus: "PAID",
        paymentAmount: 8000,
      },
      {
        patientId: patient1.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 21),
        sessionNumber: 2,
        duration: 50,
        status: "COMPLETED",
        notes: `## Sesión 2 — Matriz ACT\n\nTrabajamos con la **matriz de punto de elección**.\n\n### Lo que apareció\n- Evitación: cancelar planes sociales, postergar decisiones laborales\n- Hacia valores: pasar tiempo con familia, escribir\n\n### Tarea\nRegistro diario de acciones hacia/contra valores.`,
        nextSessionGoal: "Revisar registro y profundizar en valores",
        paymentStatus: "PAID",
        paymentAmount: 8000,
      },
      {
        patientId: patient1.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        sessionNumber: 3,
        duration: 50,
        status: "COMPLETED",
        notes: `## Sesión 3 — Valores y compromiso\n\n### Avances\n- Completó el registro diario de forma consistente\n- Identificó 3 acciones comprometidas para esta semana\n- Reporta leve mejora en calidad de sueño\n\n### Trabajo en sesión\n- Ejercicio de *mindfulness* de 10 minutos\n- Exploración profunda del valor "creatividad"`,
        nextSessionGoal: "Abordar situación laboral específica que genera evitación",
        paymentStatus: "PENDING",
        paymentAmount: 8000,
      },
      {
        patientId: patient2.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14),
        sessionNumber: 1,
        duration: 50,
        status: "COMPLETED",
        notes: `## Primera sesión — Evaluación inicial\n\nJuan consulta por **duelo reciente** (pérdida de su padre hace 2 meses).\n\n### Presentación\n- Ánimo bajo, llanto frecuente\n- Dificultad para concentrarse en el trabajo\n- Distanciamiento social\n\n### Plan\nIniciar trabajo de aceptación del dolor emocional desde ACT. Coordinación con psiquiatra por medicación actual.`,
        nextSessionGoal: "Ejercicios de disposición emocional",
        paymentStatus: "PAID",
        paymentAmount: 8000,
      },
      {
        patientId: patient2.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        sessionNumber: 2,
        duration: 60,
        status: "COMPLETED",
        notes: `## Sesión 2 — Disposición y aceptación\n\n### Trabajo realizado\n- Ejercicio de expansión emocional\n- Metáfora de la lucha con el monstruo\n- Práctica de *mindfulness* centrada en sensaciones corporales\n\n### Observaciones\nJuan mostró gran disposición. Momento emotivo significativo al trabajar con recuerdos de su padre.`,
        nextSessionGoal: "Explorar valores vinculados al legado familiar",
        paymentStatus: "PENDING",
        paymentAmount: 10000,
      },
    ],
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient1.id,
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0),
        status: "CONFIRMED",
      },
      {
        patientId: patient2.id,
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 14, 30),
        status: "CONFIRMED",
      },
    ],
  });

  await prisma.feedback.create({
    data: {
      userId: demoUser.id,
      type: "FEATURE_REQUEST",
      title: "Exportar sesiones a PDF",
      description:
        "Sería muy útil poder exportar las notas de sesiones a PDF para tener un registro impreso o compartir con supervisores.",
      desiredBehavior:
        "Un botón en la vista de sesiones que genere un PDF con las notas formateadas, datos del paciente y fecha.",
      priority: "MEDIUM",
    },
  });

  // ─── Usuario 2: Micaela Vulcano ──────────────────────────────────────────────
  const micaelaPassword = await hash("micaela1234", 12);
  const micaelaUser = await prisma.user.create({
    data: {
      name: "Micaela Julieta Vulcano",
      email: "micaela@clinicmind.com",
      password: micaelaPassword,
      profession: "Licenciada en Psicología",
      role: "THERAPIST",
    },
  });

  const micaelaPaciente1 = await prisma.patient.create({
    data: {
      userId: micaelaUser.id,
      firstName: "Valentina",
      lastName: "Ríos",
      email: "valentina.rios@email.com",
      phone: "+54 11 3344-5566",
      birthDate: new Date("1995-06-20"),
      gender: "female",
      status: "ACTIVE",
      clinicalProfile: {
        create: {
          consultationReason: "Ataques de pánico y fobia social",
          background: "Sin antecedentes previos de tratamiento psicológico.",
          currentMedication: "Ninguna",
          previousTherapy: "Primera vez en terapia",
          actValues: "Libertad, conexión social, desarrollo profesional",
        },
      },
    },
  });

  const micaelaPaciente2 = await prisma.patient.create({
    data: {
      userId: micaelaUser.id,
      firstName: "Rodrigo",
      lastName: "Sosa",
      email: "rodrigo.sosa@email.com",
      phone: "+54 11 7788-9900",
      birthDate: new Date("1988-02-14"),
      gender: "male",
      status: "ACTIVE",
      clinicalProfile: {
        create: {
          consultationReason: "Procrastinación crónica y baja autoestima",
          background: "TDAH diagnosticado en la infancia, sin medicación actual.",
          currentMedication: "Ninguna",
          previousTherapy: "Psicopedagogía en la adolescencia",
          actValues: "Productividad, familia, salud mental",
        },
      },
    },
  });

  await prisma.session.createMany({
    data: [
      {
        patientId: micaelaPaciente1.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
        sessionNumber: 1,
        duration: 50,
        status: "COMPLETED",
        notes: `## Sesión inicial\n\nValentina describe episodios de pánico en situaciones sociales. Se realiza evaluación inicial y psicoeducación sobre ansiedad desde ACT.\n\n### Observaciones\nMuy motivada para el tratamiento. Buena alianza terapéutica.`,
        nextSessionGoal: "Introducir técnicas de defusión cognitiva",
        paymentStatus: "PAID",
        paymentAmount: 9000,
      },
      {
        patientId: micaelaPaciente1.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 16),
        sessionNumber: 2,
        duration: 50,
        status: "COMPLETED",
        notes: `## Sesión 2 — Defusión\n\nSe trabajan ejercicios de defusión cognitiva. Valentina logra distanciarse de pensamientos catastróficos con la técnica "hojas en el río".\n\n### Tarea\nPráctica diaria de 5 minutos de mindfulness.`,
        nextSessionGoal: "Exposición gradual a situaciones sociales",
        paymentStatus: "PAID",
        paymentAmount: 9000,
        meetLink: "https://meet.google.com/abc-defg-hij",
        meetProvider: "GOOGLE_MEET",
      },
      {
        patientId: micaelaPaciente1.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        sessionNumber: 3,
        duration: 50,
        status: "COMPLETED",
        notes: `## Sesión 3 — Exposición\n\nPrimer ejercicio de exposición: asistir a una reunión de trabajo. Valentina lo realizó con éxito. Procesa la experiencia con valores de libertad y conexión.\n\n### Avances notables\nReducción significativa de la intensidad del pánico.`,
        nextSessionGoal: "Consolidar logros y planificar nuevas exposiciones",
        paymentStatus: "PENDING",
        paymentAmount: 9000,
      },
      {
        patientId: micaelaPaciente2.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 25),
        sessionNumber: 1,
        duration: 50,
        status: "COMPLETED",
        notes: `## Sesión inicial\n\nRodrigo describe patrón de procrastinación que afecta su trabajo y vida personal. Se explora historia de TDAH y estrategias previas.\n\n### Plan terapéutico\nEnfoque ACT para aumentar flexibilidad psicológica y comprometerse con acciones valiosas.`,
        nextSessionGoal: "Identificar valores y patrones de evitación",
        paymentStatus: "PAID",
        paymentAmount: 9000,
      },
      {
        patientId: micaelaPaciente2.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 11),
        sessionNumber: 2,
        duration: 50,
        status: "COMPLETED",
        notes: `## Sesión 2 — Valores\n\nTrabajo profundo sobre valores de Rodrigo. Identifica que la procrastinación es evitación del miedo al fracaso.\n\n### Ejercicio realizado\nMatriz ACT completa. Acciones comprometidas para la semana.`,
        nextSessionGoal: "Revisar acciones comprometidas",
        paymentStatus: "PAID",
        paymentAmount: 9000,
        meetLink: "https://meet.google.com/xyz-uvwx-yz1",
        meetProvider: "GOOGLE_MEET",
      },
      {
        patientId: micaelaPaciente2.id,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
        sessionNumber: 3,
        duration: 60,
        status: "COMPLETED",
        notes: `## Sesión 3 — Compromisos\n\nRodrigo completó 4 de 5 acciones comprometidas. Celebración del avance. Se trabaja la autocompasión ante el paso no completado.\n\n### Observaciones\nMejora notable en autoestima y percepción de eficacia.`,
        nextSessionGoal: "Mantenimiento y prevención de recaídas",
        paymentStatus: "PENDING",
        paymentAmount: 9000,
      },
    ],
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: micaelaPaciente1.id,
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 9, 0),
        status: "CONFIRMED",
      },
      {
        patientId: micaelaPaciente2.id,
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 11, 0),
        status: "CONFIRMED",
      },
    ],
  });

  // ─── Usuario 3: Nahuel Bentos (Admin) ────────────────────────────────────────
  const nahuelPassword = await hash("nahuel1234", 12);
  await prisma.user.create({
    data: {
      name: "Nahuel Bentos",
      email: "nahuel@clinicmind.com",
      password: nahuelPassword,
      role: "ADMIN",
    },
  });

  // ─── Feature Flags globales ──────────────────────────────────────────────────
  await prisma.featureFlag.createMany({
    data: [
      { key: "DELETE_PATIENTS", enabled: false, scope: "GLOBAL" },
      { key: "DELETE_SESSIONS", enabled: false, scope: "GLOBAL" },
    ],
  });

  console.log("Seed completed successfully!");
  console.log(`Demo:    demo@ejemplo.com / demo1234`);
  console.log(`Micaela: micaela@clinicmind.com / micaela1234`);
  console.log(`Nahuel:  nahuel@clinicmind.com / nahuel1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
