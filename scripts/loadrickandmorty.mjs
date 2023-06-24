import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient({ log: ['query'] });


async function main() {
  const
    characters = (await (await fetch('https://rickandmortyapi.com/api/character/?page=1')).json()).results;
  for (const character of characters) {
    delete character.origin;
    delete character.location;
    delete character.episode;
  }
  const res = await prisma.character.createMany({
    data: characters,
    skipDuplicates: true
  });
  console.info(res);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });