-- CreateEnum
CREATE TYPE "ItineraryStatus" AS ENUM ('draft', 'aktif', 'selesai');

-- CreateEnum
CREATE TYPE "StartLocationType" AS ENUM ('gps', 'bandung', 'manual');

-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "startLabel" TEXT,
ADD COLUMN     "startLat" DOUBLE PRECISION,
ADD COLUMN     "startLng" DOUBLE PRECISION,
ADD COLUMN     "startType" "StartLocationType",
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ItineraryStatus" NOT NULL DEFAULT 'draft',
ADD COLUMN     "tripDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ItineraryItem" ADD COLUMN     "visited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visitedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Itinerary_userId_status_idx" ON "Itinerary"("userId", "status");
