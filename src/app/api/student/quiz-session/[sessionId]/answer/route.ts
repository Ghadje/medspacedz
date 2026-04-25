import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(
  req: NextRequest,
  context: any
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { sessionId } = await context.params

  try {
    const { questionId, answerId, isCorrect } = await req.json()

    // Create or update the session answer
    const sessionAnswer = await prisma.quizSessionAnswer.upsert({
      where: {
        // We need a unique constraint or we use findFirst + create/update
        // Since there is no unique constraint on sessionId+questionId in schema, 
        // we'll find existing and update or create new.
        id: (await prisma.quizSessionAnswer.findFirst({
          where: { sessionId, questionId }
        }))?.id || "new-id-trigger"
      },
      update: {
        selectedAnswerId: answerId,
        isCorrect: isCorrect,
        answeredAt: new Date(),
      },
      create: {
        sessionId,
        questionId,
        selectedAnswerId: answerId,
        isCorrect: isCorrect,
      }
    })

    // Update session counts
    const allAnswers = await prisma.quizSessionAnswer.findMany({
      where: { sessionId }
    })

    const correctCount = allAnswers.filter(a => a.isCorrect).length
    const wrongCount = allAnswers.filter(a => !a.isCorrect).length
    const score = (correctCount / allAnswers.length) * 100

    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        score: score,
      }
    })

    return NextResponse.json(sessionAnswer)
  } catch (error) {
    console.error("SAVE ANSWER ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
