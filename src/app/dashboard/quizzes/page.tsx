import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { QuizzesClient } from "./quizzes-client"

export const metadata: Metadata = {
  title: "Quiz & Entraînement | MedSpace",
  description: "Testez vos connaissances avec des quiz filtrés par spécialité, année et module.",
}

export default async function QuizzesPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] overflow-hidden">
      <QuizzesClient user={session.user} />
    </div>
  )
}
