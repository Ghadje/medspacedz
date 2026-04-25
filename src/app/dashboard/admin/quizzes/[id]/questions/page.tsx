import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import QuestionClient from "./question-client"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Gestion des questions | MedSpace",
}

export default async function AdminQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  const { id } = await params

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      module: true
    }
  })

  if (!quiz) {
    redirect("/dashboard/admin/quizzes")
  }

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/dashboard/admin/quizzes" 
          className="inline-flex items-center text-[#1368E8] font-bold text-sm mb-6 hover:underline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour aux quiz
        </Link>
        <h1 className="text-4xl font-black text-[#082B66] mb-2">Questions du quiz</h1>
        <p className="text-[#082B66]/60 text-lg font-medium">
          {quiz.title} • {quiz.module?.title}
        </p>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <QuestionClient quizId={id} />
      </Suspense>
    </div>
  )
}
