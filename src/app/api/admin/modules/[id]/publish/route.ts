import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const { isPublished } = body

    if (typeof isPublished !== "boolean") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const module = await prisma.module.update({
      where: { id },
      data: { isPublished },
    })

    return NextResponse.json(module)
  } catch (error) {
    console.error("PUBLISH MODULE ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
