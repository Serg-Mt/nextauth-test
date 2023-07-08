/* eslint-disable @next/next/no-img-element */
import { Account, Prisma } from '@prisma/client';

import { columnsElement } from './types';

export const columns: columnsElement<Account>[] =
  Object.keys(Prisma.AccountScalarFieldEnum)
    .filter(key => !'id_token'.split(/\s/).includes(key))
    .map((key) => ({
      name: key,
      getVal: (fkey => {
        switch (fkey) {
          case 'expires_at':
            // eslint-disable-next-line camelcase
            return ({expires_at}:Account)=>expires_at ? (new Date(1e3*expires_at)).toLocaleString():'';
          default:
            return (obj:Account) => obj?.[fkey];
        }
      })(key as keyof Account)
      // (obj) => obj?.[key as keyof Account]
    }));




