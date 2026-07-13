import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/db";
import { leadSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const lead = await createLead(parsed.data);

  return NextResponse.json({ leadId: lead.id });
}
