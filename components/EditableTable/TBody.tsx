import { rowObj, columnsElement } from '../../datatypes/types';
import { memo } from 'react';


export default memo(function TBody<objType extends rowObj>({ rows, columns }
  : { rows: objType[], columns: columnsElement<objType>[] }) {
  return <tbody>
    {rows?.map(row =>
      <tr key={row.id}>
        {columns?.map(({ name, getVal }) => <td key={name}>
          {getVal(row)}
        </td>)}
      </tr>)}
  </tbody>;

});