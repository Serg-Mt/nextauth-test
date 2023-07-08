/* eslint-disable @next/next/no-img-element */
import { Character } from '@prisma/client';

import { columnsElement } from './types';
export type { Character };

export const
  columns: columnsElement<Character>[] = [
    { name: 'Id', getVal: ({ id }) => id }, // обычно показывать не надо но мы будем использовать для отладки
    { name: 'Image', getVal: ({ image, name }) => image && <img src={image} className="icon" alt={name || ''} /> },
    { name: 'Name', getVal: ({ name }) => name, setVal: val => ({ name: val }) },
    { name: 'Status', getVal: ({ status }) => status, setVal: val => ({ status: val }) },
  ];



