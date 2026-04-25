import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"


export async function GET(
  req: NextRequest,
  context: any
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseSupport = await prisma.courseSupport.findUnique({
      where: { id: (await context.params).id },
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
  context: any
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    console.log(`UPDATING COURSE SUPPORT ${(await context.params).id} WITH BODY:`, JSON.stringify(body, null, 2))
    const { 
      title, 
      description, 
      specialtyId, 
      studyYearId, 
      moduleId, 
      professorName, 
      googleDriveUrl, 
      order, 
      isPublished 
    } = body

    const courseSupport = await prisma.courseSupport.update({
      where: { id: (await context.params).id },
      data: {
        title,
        description,
        specialtyId,
        studyYearId,
        moduleId,
        professorName,
        googleDriveUrl,
        order: order !== undefined ? parseInt(order || "0") : undefined,
        isPublished,
      },
    })

    return NextResponse.json(courseSupport)
  } catch (error: any) {
    console.error("PATCH COURSE SUPPORT ERROR:", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.courseSupport.delete({
      where: { id: (await context.params).id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE COURSE SUPPORT ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
