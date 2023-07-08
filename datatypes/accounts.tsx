/* eslint-disable @next/next/no-img-element */
import { Account, Prisma } from '@prisma/client';

import { columnsElement } from './types';

export const columns: columnsElement<Account>[] =
  Object.keys(Prisma.AccountScalarFieldEnum)
    .filter(key => !'id_token'.split(/\s/).includes(key))
    .map((key) => ({
      name: key,
      getVal: (obj) => obj?.[key as keyof Account]
    }));




