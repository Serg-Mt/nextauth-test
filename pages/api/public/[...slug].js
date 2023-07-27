import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient({
  // log: ['query','info'],
  // errorFormat:'pretty'
});

export default async function handler(req, res) {
  const { slug } = req.query,
    [table, id] = slug;
  // console.debug('req.query=',req.query);
  console.debug('>> ', req.method, ' запрос на', req.url, 'slug =', { table, id });
  if (req.body) console.log('req.body=', JSON.stringify(req.body));

  if (!['character','todoItem'].includes(table)) {
    return res.status(404).send({ error: 'wrong table' });
  }
  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await prisma[table].findMany({orderBy: {id:'asc'}}));
      case 'POST':
        return res.status(200).json(await prisma[table].create({
          data: Object.fromEntries(new URLSearchParams(req.body).entries())
        }));
      case 'DELETE':
        return res.status(204).json(await prisma[table].delete({
          where: {
            id: +id
          }
        }));
      case 'PUT':
        return res.status(201).json(await prisma[table].update({
          where: {
            id: +id
          },
          data: Object.fromEntries([...new URLSearchParams(req.body).entries()].filter(([n]) => 'id' !== n))
        }));

    }
  } catch (error) {
    console.log(__filename, error);
    res.status(500).json({ error });
  }
}