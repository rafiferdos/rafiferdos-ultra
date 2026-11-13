-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "coverBlur" TEXT,
ADD COLUMN     "coverHeight" INTEGER,
ADD COLUMN     "coverWidth" INTEGER,
ADD COLUMN     "gallery" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "videoUrl" TEXT;
