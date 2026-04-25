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

export async function PATCH(
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

    const correctCount = validatedData.answers.filter(a => a.isCorrect).length
    if (correctCount === 0) {
      return NextResponse.json({ error: "Au moins une réponse doit être correcte" }, { status: 400 })
    }
    if ((validatedData.type === "QCS" || validatedData.type === "TRUE_FALSE") && correctCount > 1) {
      return NextResponse.json({ error: "QCS et VRAI/FAUX n'acceptent qu'une seule réponse correcte" }, { status: 400 })
    }

    // Prisma update for question and its answers
    // Easiest is to delete existing answers and create new ones
    
    // Use transaction
    const question = await prisma.$transaction(async (tx) => {
      await tx.answer.deleteMany({
        where: { questionId: (await context.params).id }
      })

      return await tx.question.update({
        where: { id: (await context.params).id },
        data: {
          statement: validatedData.statement,
          explanation: validatedData.explanation,
          difficulty: validatedData.difficulty as any,
          yearReference: validatedData.yearReference,
          type: validatedData.type as any,
          order: validatedData.order,
          answers: {
            create: validatedData.answers.map(a => ({
              text: a.text,
              isCorrect: a.isCorrect,
              order: a.order
            }))
          }
        },
        include: { answers: true }
      })
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error updating question:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: (error as any).issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.answer.deleteMany({
        where: { questionId: (await context.params).id }
      })
      await tx.question.delete({
        where: { id: (await context.params).id }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
