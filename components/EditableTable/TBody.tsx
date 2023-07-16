import { rowObj, columnsArray, accordionSymbol } from '../../datatypes/types';
import { Fragment, memo } from 'react';


export default memo(function TBody<objType extends rowObj>({ rows, columns }
  : { rows: objType[], columns: columnsArray<objType>[] }) {
  console.log('columns=',columns);
  return <tbody>
    {rows?.map(row =>
      <Fragment key={row.id}>
        <tr key={row.id} data-id={row.id}> 
          {columns?.map(({ name, getVal }) => <td key={name}>
            {getVal(row)}
          </td>)}
        </tr>
        {accordionSymbol in columns && 
          <tr className="accordion">
            <td colSpan={columns.length}>
              ok
            </td>
          </tr>
        }
        
      </Fragment>)}
  </tbody>;

});