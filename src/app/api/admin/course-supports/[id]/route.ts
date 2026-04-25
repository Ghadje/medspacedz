import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { FileType } from "@prisma/client"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseSupport = await prisma.courseSupport.findUnique({
      where: { id: params.id },
      include: {
        specialty: true,
        studyYear: true,
        module: true,
      },
    })

    if (!courseSupport) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 })
    }

    return NextResponse.json(courseSupport)
  } catch (error) {
    console.error("GET COURSE SUPPORT ID ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { 
      title, 
      description, 
      specialtyId, 
      studyYearId, 
      moduleId, 
      professorName, 
      googleDriveUrl, 
      fileType, 
      fileSize, 
      order, 
      isPublished 
    } = body

    const courseSupport = await prisma.courseSupport.update({
      where: { id: params.id },
      data: {
        title,
        description,
        specialtyId,
        studyYearId,
        moduleId,
        professorName,
        googleDriveUrl,
        fileType: fileType as FileType,
        fileSize,
        order: order !== undefined ? parseInt(order || "0") : undefined,
        isPublished,
      },
    })

    return NextResponse.json(courseSupport)
  } catch (error) {
    console.error("PATCH COURSE SUPPORT ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.courseSupport.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE COURSE SUPPORT ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
