import { rowObj, columnsElement } from '../../datatypes/types';
import { memo } from 'react';

export default memo(function THead<objType extends rowObj>({ columns }: { columns: columnsElement<objType>[] }) {
  return <thead>
    <tr>
      {columns?.map(el =>
        <th key={el.name}>{el.name}</th>)
      }
    </tr>
  </thead>;
});