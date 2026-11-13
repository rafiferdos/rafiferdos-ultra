-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "challenge" TEXT,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "solution" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
