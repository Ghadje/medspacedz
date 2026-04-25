import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const moduleId = searchParams.get("moduleId")
  const search = searchParams.get("search") || ""

  const where: any = {
    isPublished: true,
    OR: [
      { title: { contains: search, mode: "insensitive" } },
      { professorName: { contains: search, mode: "insensitive" } },
    ],
  }

  if (moduleId && moduleId !== "all") {
    where.moduleId = moduleId
  }

  try {
    const data = await prisma.courseSupport.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        module: true,
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("GET COURSE SUPPORTS STUDENT ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
