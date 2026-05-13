import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params;
    const original = await prisma.courseSupport.findUnique({
      where: { id },
    })

    if (!original) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 })
    }

    const { id: _oldId, createdAt, updatedAt, ...data } = original
    
    const duplicated = await prisma.courseSupport.create({
      data: {
        ...data,
        title: `${data.title} (Copie)`,
        isPublished: false,
      },
    })

    return NextResponse.json(duplicated)
  } catch (error) {
    console.error("DUPLICATE COURSE SUPPORT ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
