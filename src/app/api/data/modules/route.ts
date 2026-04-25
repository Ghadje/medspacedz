import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const specialtyId = searchParams.get("specialtyId")
  const studyYearId = searchParams.get("studyYearId")

  const where: any = {}
  if (specialtyId) where.specialtyId = specialtyId
  if (studyYearId) where.studyYearId = studyYearId

  try {
    const modules = await prisma.module.findMany({
      where,
      orderBy: { title: "asc" },
    })
    return NextResponse.json(modules)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
