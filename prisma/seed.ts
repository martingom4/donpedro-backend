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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/HD_transparent_picture.png',
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
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
