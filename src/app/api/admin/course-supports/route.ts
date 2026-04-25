import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { FileType } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const specialtyId = searchParams.get("specialtyId")
  const studyYearId = searchParams.get("studyYearId")
  const moduleId = searchParams.get("moduleId")
  const status = searchParams.get("status") // published | draft
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const skip = (page - 1) * limit

  const where: any = {
    OR: [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { professorName: { contains: search, mode: "insensitive" } },
    ],
  }

  if (specialtyId) where.specialtyId = specialtyId
  if (studyYearId) where.studyYearId = studyYearId
  if (moduleId) where.moduleId = moduleId
  if (status === "published") where.isPublished = true
  if (status === "draft") where.isPublished = false

  try {
    const [total, data] = await Promise.all([
      prisma.courseSupport.count({ where }),
      prisma.courseSupport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          specialty: true,
          studyYear: true,
          module: true,
        },
      }),
    ])

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET COURSE SUPPORTS ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    if (!title || !specialtyId || !studyYearId || !moduleId || !googleDriveUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const courseSupport = await prisma.courseSupport.create({
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
        order: parseInt(order || "0"),
        isPublished: !!isPublished,
      },
    })

    return NextResponse.json(courseSupport)
  } catch (error) {
    console.error("POST COURSE SUPPORT ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
