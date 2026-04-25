import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const quizSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  specialtyId: z.string().min(1, "Spécialité requise"),
  studyYearId: z.string().min(1, "Année d'étude requise"),
  moduleId: z.string().min(1, "Module requis"),
  courseSupportId: z.string().optional().nullable(),
  mode: z.enum(["TRAINING", "EXAM"]),
  durationMinutes: z.number().int().positive().optional().nullable(),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const specialtyId = searchParams.get("specialtyId") || ""
    const studyYearId = searchParams.get("studyYearId") || ""
    const moduleId = searchParams.get("moduleId") || ""
    const courseSupportId = searchParams.get("courseSupportId") || ""
    const mode = searchParams.get("mode") || ""
    const status = searchParams.get("status") || ""
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { module: { title: { contains: search, mode: "insensitive" } } },
      ]
    }
    
    if (specialtyId) where.specialtyId = specialtyId
    if (studyYearId) where.studyYearId = studyYearId
    if (moduleId) where.moduleId = moduleId
    if (courseSupportId) where.courseSupportId = courseSupportId
    if (mode) where.mode = mode
    if (status === "PUBLISHED") where.isPublished = true
    if (status === "DRAFT") where.isPublished = false

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          specialty: { select: { id: true, name: true } },
          studyYear: { select: { id: true, name: true } },
          module: { select: { id: true, title: true } },
          courseSupport: { select: { id: true, title: true } },
          _count: { select: { questions: true } }
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.quiz.count({ where }),
    ])

    return NextResponse.json({ quizzes, total, page, limit })
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    
    // Ensure courseSupportId is either valid or undefined/null
    if (body.courseSupportId === "") {
      body.courseSupportId = null
    }

    // Convert string inputs to numbers if necessary
    if (typeof body.durationMinutes === 'string' && body.durationMinutes) {
      body.durationMinutes = parseInt(body.durationMinutes)
    }
    if (typeof body.order === 'string' && body.order) {
      body.order = parseInt(body.order)
    }

    const validatedData = quizSchema.parse(body)

    const quiz = await prisma.quiz.create({
      data: validatedData,
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error("Error creating quiz:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: (error as any).issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
