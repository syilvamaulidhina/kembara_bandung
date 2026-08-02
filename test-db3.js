require('dotenv').config();
const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const reviewId = 2;
  const userId = 17;
  try {
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId
        }
      }
    });

    console.log('existingLike:', existingLike);

    await prisma.$transaction([
      prisma.reviewLike.create({ data: { userId, reviewId } }),
      prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } }
      })
    ]);
    console.log('SUCCESS');
  } catch (e) {
    console.error('CAUGHT PRISMA ERROR:', e);
  } finally {
    prisma.$disconnect();
  }
}
main();
