import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const specialtyId = searchParams.get("specialtyId")
    const studyYearId = searchParams.get("studyYearId")
    const moduleId = searchParams.get("moduleId")

    const specialties = await prisma.specialty.findMany({ orderBy: { name: "asc" } })

    const studyYears = await prisma.studyYear.findMany({
      where: specialtyId ? { specialtyId } : {},
      orderBy: { order: "asc" },
    })

    const modules = await prisma.module.findMany({
      where: {
        AND: [
          specialtyId ? { specialtyId } : {},
          studyYearId ? { studyYearId } : {},
          { isPublished: true },
        ],
      },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { quizzes: { where: { isPublished: true } } },
        },
      },
    })

    // Supports for a specific module (with quiz counts per support)
    let supports: any[] = []
    if (moduleId) {
      const rawSupports = await prisma.courseSupport.findMany({
        where: { moduleId, isPublished: true },
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { quizzes: { where: { isPublished: true } } },
          },
        },
      })
      supports = rawSupports.map(s => ({ ...s, quizCount: s._count.quizzes }))
    }

    return NextResponse.json({
      specialties,
      studyYears,
      modules: modules.map(m => ({ ...m, quizCount: m._count.quizzes })),
      supports,
    })
  } catch (error) {
    console.error("QUIZ FILTERS ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
