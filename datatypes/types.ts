import { JSX } from 'react';


export interface rowObj {
  id:number;
}

export type columnsElement<objType extends rowObj> = {
  name: string,
  getVal: (_: objType) => JSX.Element | string | number | null,
  setVal?: (_: string) => ({})
};

