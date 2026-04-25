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
    const quizSession = await prisma.quizSession.update({
      where: { 
        id: sessionId,
        userId: session.user.id
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      }
    })

    return NextResponse.json(quizSession)
  } catch (error) {
    console.error("COMPLETE SESSION ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
