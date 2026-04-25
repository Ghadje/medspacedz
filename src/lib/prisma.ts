import { PrismaClient } from '@prisma/client'
// Force reload after schema update

import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not defined in environment variables!")
  } else {
    console.log("INITIALIZING PRISMA WITH URL:", url.split("@")[1]) // Log only the host part for security
  }
  const pool = new pg.Pool({ connectionString: url })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
