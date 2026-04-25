const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const data = await prisma.courseSupport.findMany({
      take: 1,
      include: {
        specialty: true,
        studyYear: true,
        module: true,
      },
    })
    console.log('Query successful:', data)
  } catch (error) {
    console.error('Query failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
