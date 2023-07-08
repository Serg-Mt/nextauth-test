import { JSX } from 'react';

export const accordionSymbol = Symbol('accordion');

export interface rowObj {
  id:string | number;
}

type Value = JSX.Element | string | number | null


export type columnsElement<objType extends rowObj> = {
  name: string,
  getVal: (_: objType) => Value,
  setVal?: (_: Value) => ({})
};

interface hasAccordion {
  [accordionSymbol]?:Function;
}

export type columnsArray<objType extends rowObj> = columnsElement<objType> & hasAccordion;
