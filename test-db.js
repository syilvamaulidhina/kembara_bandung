const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const review = await prisma.review.findFirst({ include: { user: true } });
    if (!review) {
      console.log('No reviews found');
      return;
    }
    console.log('Testing with reviewId:', review.id, 'userId:', review.userId);
    
    // First, try findUnique
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId: review.userId,
          reviewId: review.id
        }
      }
    });
    console.log('Existing like:', existingLike);
    
    // Try transaction
    await prisma.$transaction([
      prisma.reviewLike.create({ data: { userId: review.userId, reviewId: review.id } }),
      prisma.review.update({
        where: { id: review.id },
        data: { helpfulCount: { increment: 1 } }
      })
    ]);
    console.log('Transaction Success!');
    
    // Clean up
    const createdLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId: review.userId,
          reviewId: review.id
        }
      }
    });
    
    if (createdLike) {
      await prisma.$transaction([
        prisma.reviewLike.delete({ where: { id: createdLike.id } }),
        prisma.review.update({
          where: { id: review.id },
          data: { helpfulCount: { decrement: 1 } }
        })
      ]);
      console.log('Cleanup Success!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
