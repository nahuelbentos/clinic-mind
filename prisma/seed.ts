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
  await prisma.feedback.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.clinicalProfile.deleteMany();
  await prisma.document.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await hash("demo1234", 12);
  const user = await prisma.user.create({
    data: {
      name: "Dra. Demo García",
      email: "demo@ejemplo.com",
      password: hashedPassword,
      profession: "Psicóloga",
      licenseNumber: "MN 12345",
    },
  });

  // Create patients
  const patient1 = await prisma.patient.create({
    data: {
      userId: user.id,
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
      userId: user.id,
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
      userId: user.id,
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

  // Create sessions
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

  // Create upcoming appointments
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

  // Create feedback
  await prisma.feedback.create({
    data: {
      userId: user.id,
      type: "FEATURE_REQUEST",
      title: "Exportar sesiones a PDF",
      description:
        "Sería muy útil poder exportar las notas de sesiones a PDF para tener un registro impreso o compartir con supervisores.",
      desiredBehavior:
        "Un botón en la vista de sesiones que genere un PDF con las notas formateadas, datos del paciente y fecha.",
      priority: "MEDIUM",
    },
  });

  console.log("Seed completed successfully!");
  console.log(`User: ${user.email} / demo1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
