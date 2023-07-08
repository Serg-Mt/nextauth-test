import { JSX } from 'react';


export interface rowObj {
  id:string | number;
}

type Value = JSX.Element | string | number | null


export type columnsElement<objType extends rowObj> = {
  name: string,
  getVal: (_: objType) => Value,
  setVal?: (_: Value) => ({})
};

