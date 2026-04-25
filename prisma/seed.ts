require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')
const bcrypt = require('bcryptjs')

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })



async function main() {
  // Create Specialties
  const medecine = await prisma.specialty.upsert({
    where: { slug: 'medecine' },
    update: {},
    create: { name: 'Médecine', slug: 'medecine' },
  })

  const dentaire = await prisma.specialty.upsert({
    where: { slug: 'medecine-dentaire' },
    update: {},
    create: { name: 'Médecine Dentaire', slug: 'medecine-dentaire' },
  })

  const pharmacie = await prisma.specialty.upsert({
    where: { slug: 'pharmacie' },
    update: {},
    create: { name: 'Pharmacie', slug: 'pharmacie' },
  })

  // Create Faculties
  const faculties = [
    { name: "Faculté de Médecine d'Alger", city: 'Alger' },
    { name: "Faculté de Médecine d'Oran", city: 'Oran' },
    { name: "Faculté de Médecine de Constantine", city: 'Constantine' },
  ]

  for (const f of faculties) {
    await prisma.faculty.create({ data: f })
  }

  // Create Study Years for Medicine
  const years = [
    '1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année'
  ]

  for (let i = 0; i < years.length; i++) {
    await prisma.studyYear.create({
      data: {
        name: years[i],
        order: i + 1,
        specialtyId: medecine.id
      }
    })
  }

  // Create some Modules
  const y1 = await prisma.studyYear.findFirst({ where: { name: '1ère année', specialtyId: medecine.id } })
  
  if (!y1) {
    throw new Error('Study year not found')
  }

  const modules = [
    { title: 'Anatomie', description: 'Étude de la structure du corps humain' },
    { title: 'Embryologie', description: 'Étude du développement de l\'embryon' },
    { title: 'Physiologie', description: 'Étude du fonctionnement des organes' },
  ]

  for (const m of modules) {
    await prisma.module.create({
      data: {
        ...m,
        studyYearId: y1.id,
        specialtyId: medecine.id
      }
    })
  }

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@medspace.dz' },
    update: {},
    create: {
      name: 'Admin MedSpace',
      email: 'admin@medspace.dz',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
