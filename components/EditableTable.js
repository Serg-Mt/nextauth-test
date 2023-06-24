// import { useState } from 'react';


export default function EditableTable({ rows, columns, className }) {
  // const
  //   [filterValue, setFilter] = useState(''),

  //   [sortCol, setSortCol] = useState(0); //+1,+2,+3... : asc by 0,1,2-th col,   -1,-2,-3 : desc 0,1,2-th col





  return <>
    {/* {filter && <>filter:<input type="search" value={filterValue} onInput={evt => setFilter(evt.target.value)}></input></>} */}
    <table {...{ className }}>
      <thead>
        <tr>
          {columns?.map(el =>
            <th key={el.name}>{el.name}</th>)
          }
        </tr>

      </thead>
      <tbody>
        {rows?.map(row =>
          <tr key={row.id}>
            {columns?.map(({name,getVal,Wrap,val=getVal(row)})=><td key={name}>

              { Wrap ? <Wrap value={val}/> : val }
            </td>)}
          </tr>)}
      </tbody>

    </table>
  </>;

}