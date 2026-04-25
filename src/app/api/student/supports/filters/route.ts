import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const specialtyId = searchParams.get("specialtyId")
    const studyYearId = searchParams.get("studyYearId")

    // Fetch specialties
    const specialties = await prisma.specialty.findMany({
      orderBy: { name: "asc" }
    })

    // Fetch years
    const studyYears = await prisma.studyYear.findMany({
      where: specialtyId ? { specialtyId } : {},
      orderBy: { order: "asc" }
    })

    // Fetch modules with support counts
    const modules = await prisma.module.findMany({
      where: {
        AND: [
          specialtyId ? { specialtyId } : {},
          studyYearId ? { studyYearId } : {},
        ]
      },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { courseSupports: { where: { isPublished: true } } }
        }
      }
    })

    return NextResponse.json({
      specialties,
      studyYears,
      modules: modules.map(m => ({
        ...m,
        supportCount: m._count.courseSupports
      }))
    })
  } catch (error) {
    console.error("STUDENT FILTERS ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
