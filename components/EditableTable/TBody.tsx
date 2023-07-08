import { rowObj, columnsArray, accordionSymbol } from '../../datatypes/types';
import { Fragment, memo } from 'react';


export default memo(function TBody<objType extends rowObj>({ rows, columns }
  : { rows: objType[], columns: columnsArray<objType>[] }) {
  console.log('columns=',columns);
  return <tbody>
    {rows?.map(row =>
      <Fragment key={row.id}>
        <tr key={row.id} data-accordion={accordionSymbol in columns ? 'yes' : 'no'} data-d2={columns[accordionSymbol] ? '1':'0'}> 
          {columns?.map(({ name, getVal }) => <td key={name}>
            {getVal(row)}
          </td>)}
        </tr>
        
      </Fragment>)}
  </tbody>;

});