import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

interface StartQuizPageProps {
  params: Promise<{ id: string }>
}

export default async function StartQuizPage({ params }: StartQuizPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const { id } = await params

  let redirectPath = ""
  
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    if (!quiz) {
      redirectPath = "/dashboard/quizzes"
    } else {
      // Create the session directly in the server component for faster redirect
      const quizSession = await prisma.quizSession.create({
        data: {
          userId: session.user.id,
          quizId: id,
          mode: quiz.mode,
          totalQuestions: quiz._count.questions,
          status: "IN_PROGRESS",
        }
      })
      redirectPath = `/dashboard/quiz-session/${quizSession.id}`
    }
  } catch (error) {
    console.error("START QUIZ ERROR:", error)
    redirectPath = "/dashboard/quizzes"
  }

  if (redirectPath) {
    redirect(redirectPath)
  }
}
