import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SupportsClient } from "./supports-client"

export const metadata: Metadata = {
  title: "Supports de cours | MedSpace",
  description: "Accédez à vos supports de cours par spécialité, année et module.",
}

export default async function SupportsPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] overflow-hidden">
      <SupportsClient user={session.user} />
    </div>
  )
}
