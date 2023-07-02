/* eslint-disable @next/next/no-img-element */
import { User, Prisma } from '@prisma/client';

import { columnsElement } from './types';


export const columns: columnsElement<User>[] =
  Object.keys(Prisma.UserScalarFieldEnum)
    // .filter(key => !'id_token'.includes(key))
    .map(key => ({
      name: key,
      getVal: 'image'===key 
        ? ({image}: User) => image && <img src={image} className="icon" alt={''} /> 
        : (obj: User) => obj[key]
    }));




