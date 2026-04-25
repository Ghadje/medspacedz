import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import QuizClient from "./quiz-client"

export const metadata = {
  title: "Gestion des quiz | MedSpace",
}

export default async function AdminQuizzesPage() {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-[#082B66] mb-2">Gestion des quiz</h1>
        <p className="text-[#082B66]/60 text-lg font-medium">
          Créez, modifiez et organisez les quiz liés aux modules et supports de cours.
        </p>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <QuizClient />
      </Suspense>
    </div>
  )
}
