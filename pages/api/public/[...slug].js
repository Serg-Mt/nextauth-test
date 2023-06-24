import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient;

export default async function handler(req, res) {
  const { slug } = req.query,
    [table, id] = slug;

  console.debug('>> ', req.method, ' запрос на', req.url, 'slug =', { table, id });

  if (!['character'].includes(slug[0])) {
    return res.status(404).send({ error: 'wrong table' });
  }
  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await prisma[table].findMany());

    }
  } catch (error) {
    console.log(__filename, error);
    res.status(500).send({ error });
  }





}