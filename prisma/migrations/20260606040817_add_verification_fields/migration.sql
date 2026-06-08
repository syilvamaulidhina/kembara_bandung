-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "verificationDocument" TEXT,
ADD COLUMN     "verificationStatus" "VerificationStatus";

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
