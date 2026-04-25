import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const specialtyId = searchParams.get("specialtyId")

  try {
    const studyYears = await prisma.studyYear.findMany({
      where: specialtyId ? { specialtyId } : {},
      orderBy: { order: "asc" },
    })
    return NextResponse.json(studyYears)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
