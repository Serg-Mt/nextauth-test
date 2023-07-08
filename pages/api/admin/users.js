import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.debug('>> ', req.method, ' запрос на', req.url, 'session =', session);
  if (session && 'admin' === session.user.role) {
    try {
      return res.status(200)
        .json( await prisma.user.findMany());
    } catch (error) {
      console.log(__filename, error);
      res.status(500).send({ error });
    }

  } else {
    res.status(403).send({
      error: 'You must be ADMIN to view the protected content on this page.',
    });
  }
}
