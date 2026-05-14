import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params;
    const body = await req.json()
    const { isPublished } = body

    const updated = await prisma.courseSupport.update({
      where: { id },
      data: { isPublished: !!isPublished },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUBLISH COURSE SUPPORT ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
