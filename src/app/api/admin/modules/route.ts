import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"

const moduleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  specialtyId: z.string().min(1, "La spécialité est requise"),
  studyYearId: z.string().min(1, "L'année d'étude est requise"),
  order: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const specialtyId = searchParams.get("specialtyId")
    const studyYearId = searchParams.get("studyYearId")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc"

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (specialtyId && specialtyId !== "all") where.specialtyId = specialtyId
    if (studyYearId && studyYearId !== "all") where.studyYearId = studyYearId
    if (status === "published") where.isPublished = true
    if (status === "draft") where.isPublished = false

    console.log("FETCHING MODULES WITH:", { where, sortBy, sortOrder, skip: (page - 1) * limit, take: limit })
    const [data, total] = await Promise.all([
      prisma.module.findMany({
        where,
        include: {
          specialty: true,
          studyYear: true,
          _count: {
            select: {
              courses: true,
              quizzes: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.module.count({ where }),
    ])

    return NextResponse.json({ data, total })
  } catch (error) {
    console.error("GET MODULES ERROR:", error)
    if (error instanceof Error) {
      console.error("ERROR MESSAGE:", error.message)
      console.error("ERROR STACK:", error.stack)
    }
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = moduleSchema.parse(body)

    const module = await prisma.module.create({
      data: validatedData,
    })

    return NextResponse.json(module)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).issues }, { status: 400 })
    }
    console.error("CREATE MODULE ERROR:", error)
    if (error instanceof Error) {
      console.error("ERROR MESSAGE:", error.message)
      console.error("ERROR STACK:", error.stack)
    }
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
