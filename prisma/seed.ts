import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roles = [
    { code: 'ADMIN',  name: 'Administrador' },
    { code: 'CLIENT', name: 'Cliente' },
  ];

  // upsert para cada rol (evita duplicados)
  await Promise.all(
    roles.map(r =>
      prisma.role.upsert({
        where:  { code: r.code },
        update: {},
        create: r,
      }),
    ),
  );

  // Insertar categorías de ejemplo
  await prisma.category.createMany({
    data: [
      { name: 'Hamburguesas' },
      { name: 'Hot Dogs' },
      { name: 'Salchipapas' },
    ],
    skipDuplicates: true,
  });


  // Obtener ids de las categorías
  const allCategories = await prisma.category.findMany();
  const hamburguesasId = allCategories.find(c => c.name === 'Hamburguesas')?.id!;
  const hotdogsId = allCategories.find(c => c.name === 'Hot Dogs')?.id!;
  const salchipapasId = allCategories.find(c => c.name === 'Salchipapas')?.id!;

  // Insertar productos de ejemplo
  await prisma.product.createMany({
    data: [
      // Hamburguesas
      {
        name: 'Clásica',
        description: 'Pan artesanal, carne 1/4 lb, bacon, vegetales frescos, mozzarella y salsa de la casa',
        price: 6,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 10,
        isActive: true,
        categoryId: hamburguesasId,
      },
      {
        name: 'Doble Smash',
        description: '180g carne premium, bacon, vegetales, cheddar y salsa',
        price: 7,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: hamburguesasId,
      },
      {
        name: 'Don Pedro',
        description: 'Carne, bacon, vegetales, mozzarella y salsa de la casa',
        price: 7.5,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: hamburguesasId,
      },
      // Hot Dogs
      {
        name: 'Clásico',
        description: 'Pan brioche, salchicha, mozzarella, papas y salsa',
        price: 3,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: hotdogsId,
      },
      {
        name: 'Panameño',
        description: 'Pan brioche, salchicha, repollo, cebolla y salsa',
        price: 2.5,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: hotdogsId,
      },
      {
        name: 'Pollo + Bacon',
        description: 'Salchicha, pollo, bacon, mozzarella y papas',
        price: 4,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: hotdogsId,
      },
      // Salchipapas
      {
        name: 'Clásica',
        description: 'Papas, salchicha, maíz, queso y salsa de la casa',
        price: 5,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: salchipapasId,
      },
      {
        name: 'Mexicana',
        description: 'Papas, carne mechada, queso, guacamole y salsa picante',
        price: 7,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: salchipapasId,
      },
      {
        name: 'Chili Papas',
        description: 'Papas, carne mechada, bacon, queso y salsa de la casa',
        price: 7.5,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
        stock: 10,
        isActive: true,
        categoryId: salchipapasId,
      },


    ],
    skipDuplicates: true,
  });

  /* ──────────────── PROMOCIONES ──────────────── */
  const Mexicana = await prisma.product.findFirst({ where: { name: 'Mexicana' } });
  const dobleSmash    = await prisma.product.findFirst({ where: { name: 'Doble Smash' } });

  // 1) Promoción UTP: incluye papas + soda (sin descuento adicional)
  if (Mexicana) {
    await prisma.promotion.create({
      data: {
        title: 'Combo 20% Mexicana',
        discountPct: 20,               // el precio ya incluye la promo
        startDate: new Date(),
        endDate: null,
        products: {
          create: { productId: Mexicana.id },
        },
      },
    });
  }

  // 2) Promo inventada: 15 % de descuento al Doble Smash
  if (dobleSmash) {
    await prisma.promotion.create({
      data: {
        title: 'Combo 15 % Doble Smash',
        discountPct: 15,
        startDate: new Date(),
        endDate: null,
        products: {
          create: { productId: dobleSmash.id },
        },
      },
    });
  }
  /* ───────────────────────────────────────────── */
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
