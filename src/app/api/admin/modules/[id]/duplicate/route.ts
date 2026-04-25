import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const original = await prisma.module.findUnique({
      where: { id },
    })

    if (!original) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    const duplicated = await prisma.module.create({
      data: {
        title: `${original.title} (copie)`,
        description: original.description,
        specialtyId: original.specialtyId,
        studyYearId: original.studyYearId,
        order: original.order,
        isPublished: false, // Always start as draft
      },
    })

    return NextResponse.json(duplicated)
  } catch (error) {
    console.error("DUPLICATE MODULE ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
