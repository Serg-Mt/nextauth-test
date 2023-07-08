/* eslint-disable @next/next/no-img-element */
import { User, Prisma } from '@prisma/client';

import { columnsElement } from './types';

export const columns: columnsElement<User>[] =
  Object.keys(Prisma.UserScalarFieldEnum)
    // .filter(key => !'id_token'.includes(key))
    .map(key => ({
      name: key,
      getVal: (k => {
        switch (k) {
          case'image':
            // eslint-disable-next-line react/display-name
            return ({image}: User) => image ? <img src={image} className="icon" alt={''} /> : '-';
          case 'emailVerified':
            return ({emailVerified}: User) => emailVerified ? emailVerified.toLocaleString(): '' ;
          default:
            return (obj: User) => obj[k];
        }
      })(key as keyof User)
    }));
