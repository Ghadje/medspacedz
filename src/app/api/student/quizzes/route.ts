import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const specialtyId = searchParams.get("specialtyId") || ""
    const studyYearId = searchParams.get("studyYearId") || ""
    const moduleId = searchParams.get("moduleId") || ""
    const courseSupportId = searchParams.get("courseSupportId") || ""
    const search = searchParams.get("search") || ""

    if (!moduleId) {
      return NextResponse.json({ quizzes: [] })
    }

    const where: any = {
      isPublished: true,
      moduleId,
    }

    if (specialtyId) where.specialtyId = specialtyId
    if (studyYearId) where.studyYearId = studyYearId
    if (courseSupportId) where.courseSupportId = courseSupportId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const quizzes = await prisma.quiz.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        module: { select: { title: true } },
        _count: { select: { questions: true } },
      },
    })

    return NextResponse.json({ quizzes })
  } catch (error) {
    console.error("STUDENT QUIZZES ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
