import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"

const moduleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable(),
  specialtyId: z.string().min(1, "La spécialité est requise"),
  studyYearId: z.string().min(1, "L'année d'étude est requise"),
  order: z.number().int().optional(),
  isPublished: z.boolean().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        specialty: true,
        studyYear: true,
        _count: {
          select: {
            courses: true,
            quizzes: true,
          },
        },
      },
    })

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    return NextResponse.json(module)
  } catch (error) {
    console.error("GET MODULE ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

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
    const validatedData = moduleSchema.parse(body)

    const module = await prisma.module.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(module)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("UPDATE MODULE ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Check if module has courses or quizzes
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: true,
            quizzes: true,
            courseSupports: true,
          }
        }
      }
    })

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    // We allow deletion but the UI will show a warning
    await prisma.module.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
