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
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
