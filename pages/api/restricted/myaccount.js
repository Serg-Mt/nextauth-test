import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.debug('>> ', req.method, ' запрос на', req.url, 'session =', session);
  console.debug('____', session?.user?.id);
  if (session) {
    try {
      return res.status(200)
        .json({
          user: await prisma.user.findUnique({
            where: { id: session?.user?.id }
          }),
          accouts: await prisma.account.findMany({
            where: { userId: session?.user?.id }
          })
        });
    } catch (error) {
      console.log(__filename, error);
      res.status(500).send({ error });
    }


  } else {
    res.send({
      error: 'You must be signed in to view the protected content on this page.',
    });
  }
}
