-- CreateEnum
CREATE TYPE "public"."DestinationStatus" AS ENUM ('pending', 'aktif', 'butuh_perbaikan', 'canceled');

-- CreateTable
CREATE TABLE "public"."Destination" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "openTime" TEXT,
    "closeTime" TEXT,
    "ticketPrice" INTEGER,
    "maxPrice" INTEGER,
    "website" TEXT,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."DestinationStatus" NOT NULL DEFAULT 'pending',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DestinationCategory" (
    "id" SERIAL NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "DestinationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CategoryKeyword" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedDestination" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Itinerary" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Rencana Perjalananku',
    "totalDistance" DOUBLE PRECISION,
    "estimatedTime" INTEGER,
    "estimatedCost" INTEGER,
    "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItineraryItem" (
    "id" SERIAL NOT NULL,
    "itineraryId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "visitTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItineraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "photoUrl" TEXT,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VisitedPlace" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VisitedPlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationCategory_destinationId_categoryId_key" ON "public"."DestinationCategory"("destinationId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryKeyword_categoryId_keyword_key" ON "public"."CategoryKeyword"("categoryId", "keyword");

-- CreateIndex
CREATE UNIQUE INDEX "SavedDestination_userId_destinationId_key" ON "public"."SavedDestination"("userId", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryItem_itineraryId_order_key" ON "public"."ItineraryItem"("itineraryId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_destinationId_key" ON "public"."Review"("userId", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitedPlace_userId_destinationId_key" ON "public"."VisitedPlace"("userId", "destinationId");

-- AddForeignKey
ALTER TABLE "public"."DestinationCategory" ADD CONSTRAINT "DestinationCategory_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DestinationCategory" ADD CONSTRAINT "DestinationCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryKeyword" ADD CONSTRAINT "CategoryKeyword_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedDestination" ADD CONSTRAINT "SavedDestination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedDestination" ADD CONSTRAINT "SavedDestination_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Itinerary" ADD CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItineraryItem" ADD CONSTRAINT "ItineraryItem_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "public"."Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItineraryItem" ADD CONSTRAINT "ItineraryItem_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VisitedPlace" ADD CONSTRAINT "VisitedPlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VisitedPlace" ADD CONSTRAINT "VisitedPlace_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "public"."Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
