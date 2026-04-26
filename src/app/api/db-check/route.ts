import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      users,
      patients,
      clinicalProfiles,
      sessions,
      appointments,
      documents,
      feedbacks,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.patient.count(),
      prisma.clinicalProfile.count(),
      prisma.session.count(),
      prisma.appointment.count(),
      prisma.document.count(),
      prisma.feedback.count(),
    ]);

    return NextResponse.json({
      ok: true,
      counts: {
        users,
        patients,
        clinicalProfiles,
        sessions,
        appointments,
        documents,
        feedbacks,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
