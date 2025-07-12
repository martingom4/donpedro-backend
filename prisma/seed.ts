import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { code: 'CLIENT' },
    update: {},                                 // si ya existe no lo toca
    create: { code: 'CLIENT', name: 'Cliente' } // si no existe lo crea
  });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
