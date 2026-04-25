import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(specialties)
  } catch (error) {
    console.error("GET SPECIALTIES ERROR:", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
