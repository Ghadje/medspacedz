import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(specialties)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
