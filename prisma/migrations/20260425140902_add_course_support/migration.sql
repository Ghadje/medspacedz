-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'DOC', 'VIDEO', 'OTHER');

-- CreateTable
CREATE TABLE "CourseSupport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "specialtyId" TEXT NOT NULL,
    "studyYearId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "professorName" TEXT,
    "googleDriveUrl" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL DEFAULT 'PDF',
    "fileSize" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSupport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseSupport" ADD CONSTRAINT "CourseSupport_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSupport" ADD CONSTRAINT "CourseSupport_studyYearId_fkey" FOREIGN KEY ("studyYearId") REFERENCES "StudyYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSupport" ADD CONSTRAINT "CourseSupport_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
