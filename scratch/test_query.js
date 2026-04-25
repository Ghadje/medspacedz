const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')

async function main() {
  const pool = new pg.Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5433/medspacedz' })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const data = await prisma.module.findMany({
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
        take: 10,
      })
    console.log('SUCCESS:', data.length)
  } catch (e) {
    console.error('ERROR:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
