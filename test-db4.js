require('dotenv').config();
const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const review = await prisma.review.findFirst();
    if (!review) return console.log('no review');
    const reviewId = review.id;
    const userId = review.userId;
    
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId
        }
      }
    });

    console.log('existingLike:', existingLike);

    if (!existingLike) {
        await prisma.$transaction([
        prisma.reviewLike.create({ data: { userId, reviewId } }),
        prisma.review.update({
            where: { id: reviewId },
            data: { helpfulCount: { increment: 1 } }
        })
        ]);
        console.log('SUCCESS like');
    } else {
        await prisma.$transaction([
        prisma.reviewLike.delete({ where: { id: existingLike.id } }),
        prisma.review.update({
            where: { id: reviewId },
            data: { helpfulCount: { decrement: 1 } }
        })
        ]);
        console.log('SUCCESS unlike');
    }
  } catch (e) {
    console.error('CAUGHT PRISMA ERROR:', e);
  } finally {
    prisma.$disconnect();
  }
}
main();
