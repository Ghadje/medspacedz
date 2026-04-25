import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import CourseSupportClient from "./course-support-client"

export const metadata = {
  title: "Gestion des supports de cours | MedSpace",
}

export default async function AdminCourseSupportsPage() {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-[#082B66] mb-2">Gestion des supports de cours</h1>
        <p className="text-[#082B66]/60 text-lg font-medium">
          Créez, modifiez et organisez les supports liés aux modules.
        </p>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <CourseSupportClient />
      </Suspense>
    </div>
  )
}
