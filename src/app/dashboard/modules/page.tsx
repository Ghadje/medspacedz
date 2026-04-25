import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ModulesClient } from "./modules-client"

export const metadata: Metadata = {
  title: "Gestion des modules | MedSpace AI",
  description: "Gérez les modules par spécialité et année d'étude.",
}

export default async function AdminModulesPage() {
  const session = await auth()

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard")
  }

  return <ModulesClient />
}
