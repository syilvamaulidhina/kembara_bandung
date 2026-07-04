import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  console.log("Menghapus event lama...");
  await prisma.event.deleteMany({});

  const user = await prisma.user.findFirst({
    where: { role: "PENGELOLA" }
  }) || await prisma.user.findFirst();

  if (!user) {
    console.log("User not found");
    return;
  }

  const destinations = await prisma.destination.findMany({
    take: 5,
  });

  if (destinations.length === 0) {
    console.log("Destinations not found");
    return;
  }

  const eventsData = [
    {
      ownerId: user.id,
      destinationId: destinations[0]?.id || 16,
      name: "Festival Budaya Kembara 2026",
      description: "Acara tahunan untuk merayakan budaya lokal Bandung dengan berbagai pertunjukan seni, musik, dan kuliner khas. Jangan lewatkan kemeriahannya!",
      bannerUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Bandung_city_view.jpg/800px-Bandung_city_view.jpg",
      startDate: new Date("2026-08-15T09:00:00Z"),
      endDate: new Date("2026-08-17T21:00:00Z"),
      contact: "08123456789",
      status: "aktif",
    },
    {
      ownerId: user.id,
      destinationId: destinations[1]?.id || 1,
      name: "Pameran Fotografi Alam",
      description: "Nikmati pameran fotografi yang menampilkan keindahan alam Jawa Barat dari berbagai fotografer terkenal. Gratis untuk umum!",
      bannerUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tangkuban_Perahu_Crater.jpg/800px-Tangkuban_Perahu_Crater.jpg",
      startDate: new Date("2026-09-01T10:00:00Z"),
      endDate: new Date("2026-09-05T18:00:00Z"),
      contact: "08987654321",
      status: "aktif",
    },
    {
      ownerId: user.id,
      destinationId: destinations[2]?.id || 2,
      name: "Workshop Barista Kopi Lokal",
      description: "Pelajari cara menyeduh kopi asli Priangan langsung dari ahlinya. Termasuk sesi mencicipi kopi. Segera daftar karena kuota terbatas!",
      bannerUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Roasted_coffee_beans.jpg/800px-Roasted_coffee_beans.jpg",
      startDate: new Date("2026-10-10T13:00:00Z"),
      endDate: new Date("2026-10-10T16:00:00Z"),
      contact: "08111222333",
      registrationUrl: "https://example.com/daftar-kopi",
      status: "aktif",
    }
  ];

  for (const data of eventsData) {
    if (data.destinationId) {
      const event = await prisma.event.create({
        data: data as any,
      });
      console.log("Event created:", event.name);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
