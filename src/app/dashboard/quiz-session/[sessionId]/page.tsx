import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { QuizPlayerClient } from "./quiz-player-client"

export const metadata: Metadata = {
  title: "Quiz en cours | MedSpace",
}

interface QuizSessionPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function QuizSessionPage({ params }: QuizSessionPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const { sessionId } = await params

  const quizSession = await prisma.quizSession.findUnique({
    where: { 
      id: sessionId,
      userId: session.user.id
    },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              answers: {
                orderBy: { order: "asc" }
              }
            }
          }
        }
      },
      answers: true
    }
  })

  if (!quizSession) {
    redirect("/dashboard/quizzes")
  }

  if (quizSession.status === "COMPLETED") {
    redirect(`/dashboard/quiz-session/${sessionId}/result`)
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <QuizPlayerClient session={quizSession} />
    </div>
  )
}
