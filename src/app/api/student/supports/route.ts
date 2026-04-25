import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const specialtyId = searchParams.get("specialtyId")
  const studyYearId = searchParams.get("studyYearId")
  const moduleId = searchParams.get("moduleId")
  const search = searchParams.get("search") || ""

  if (!moduleId) {
    return NextResponse.json({ error: "Module ID is required" }, { status: 400 })
  }

  try {
    const supports = await prisma.courseSupport.findMany({
      where: {
        moduleId,
        isPublished: true,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { professorName: { contains: search, mode: "insensitive" } },
        ]
      },
      orderBy: { order: "asc" },
      include: {
        module: true,
        specialty: true,
        studyYear: true,
      }
    })

    return NextResponse.json(supports)
  } catch (error) {
    console.error("STUDENT SUPPORTS ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
