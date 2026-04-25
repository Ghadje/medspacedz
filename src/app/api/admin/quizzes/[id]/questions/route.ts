import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Texte requis"),
  isCorrect: z.boolean().default(false),
  order: z.number().int().default(0)
})

const questionSchema = z.object({
  statement: z.string().min(1, "Énoncé requis"),
  explanation: z.string().optional().nullable(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional().nullable(),
  yearReference: z.string().optional().nullable(),
  type: z.enum(["QCM", "QCS", "TRUE_FALSE"]),
  order: z.number().int().default(0),
  answers: z.array(answerSchema).min(2, "Au moins 2 réponses requises")
})

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const difficulty = searchParams.get("difficulty") || ""
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = { quizId: (await context.params).id }

    if (search) {
      where.OR = [
        { statement: { contains: search, mode: "insensitive" } },
        { yearReference: { contains: search, mode: "insensitive" } },
      ]
    }
    
    if (type) where.type = type
    if (difficulty) where.difficulty = difficulty

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          answers: { orderBy: [{ id: 'asc' }] }
        },
        orderBy: [{ order: 'asc' }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.question.count({ where }),
    ])

    return NextResponse.json({ questions, total, page, limit })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  context: any
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = questionSchema.parse(body)

    // Validate QCS and TRUE_FALSE logic
    const correctCount = validatedData.answers.filter(a => a.isCorrect).length
    if (correctCount === 0) {
      return NextResponse.json({ error: "Au moins une réponse doit être correcte" }, { status: 400 })
    }
    if ((validatedData.type === "QCS" || validatedData.type === "TRUE_FALSE") && correctCount > 1) {
      return NextResponse.json({ error: "QCS et VRAI/FAUX n'acceptent qu'une seule réponse correcte" }, { status: 400 })
    }

    const question = await prisma.question.create({
      data: {
        quizId: (await context.params).id,
        statement: validatedData.statement,
        explanation: validatedData.explanation,
        type: validatedData.type as any,
        difficulty: validatedData.difficulty as any,
        yearReference: validatedData.yearReference,
        order: validatedData.order,
        answers: {
          create: validatedData.answers.map(a => ({
            text: a.text,
            isCorrect: a.isCorrect,
            order: a.order
          }))
        }
      },
      include: {
        answers: true
      }
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error("Error creating question:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: (error as any).issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
