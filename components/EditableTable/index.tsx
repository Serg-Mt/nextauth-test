/* eslint-disable react/display-name */
import TBody from './TBody';
import THead from './THead';
import { rowObj, columnsElement } from '../../datatypes/types';
import { MouseEventHandler, useCallback, useMemo, useState, memo } from 'react';

const 
  AddButton = memo(() => <button className='add'>➕ add</button>),
  DelButton = memo(() => <button  className='delete'>❌delete</button>),
  EditButton = memo(() => <button className='start-edit'>✏️edit</button>),
  UpdateButton = memo(() => <button className='update'>✔️ok</button>),
  CancelButton = memo(() => <button className='cancel'>✖️cancel</button>);


export default function EditableTable<objType extends rowObj>(
  { rows: allRows, columns, onDelete, onAdd, onEdit }
    : {
      rows: objType[],
      columns: columnsElement<objType>[],
      onDelete?: (_: objType) => Promise<any>,
      onAdd?: (_: objType) => Promise<any>,
      onEdit?: (_: objType) => Promise<any>,
    }) {
  const
    [filterValue, setFilter] = useState(''),
    [addInputsVal, setAddInputsVal] = useState<string[]>(Array(columns.length).fill('')),
    [editRowId, setEditRowId] = useState<number | null>(null),
    [editInputsVal, setEditInputsVal] = useState(Array(columns.length).fill('')),

    headColumns = useMemo(() => [...columns, { name: 'actions' } as columnsElement<objType>], [columns]),
    bodyColumns = useMemo(() => {
      const res = Object.assign([], columns);
      res.push({
        name: 'actions',
        getVal: obj => editRowId === obj.id
          ? <><UpdateButton /> <CancelButton /></>
          : <>{onEdit && <EditButton />}{onDelete && <DelButton />}</>
        // eslint-disable-next-line react-hooks/exhaustive-deps
      });
      return res;
    }, [columns, editRowId, onEdit, onDelete]),

    footColumns = useMemo(() => onAdd && [...columns.map(
      ({ name, setVal }, i) => ({
        name,
        getVal: () => <>{setVal //  @ts-ignore   
          ? <input name={name} value={addInputsVal[i]} onInput={evt => setAddInputsVal(addInputsVal.with(i, evt.currentTarget.value))} />
          : ''
        }</>
      })), { name: 'actions', getVal: ()=><AddButton /> }], [columns, addInputsVal, onAdd]),
    onClick: MouseEventHandler = useCallback((evt) => {
      const
        { target } = evt,
        button = (target as HTMLElement).closest('button'),
        newRow: objType = {} as objType,
        id: number = +((button?.closest('[data-id]') as HTMLElement)?.dataset.id || NaN),
        elem = allRows.find(el => id === el.id);
      switch (true) {
        case button?.matches('.delete'):
          onDelete?.({ id } as objType);
          return;
        case button?.matches('.start-edit'):
          console.log('start-edit',id);
          setEditRowId(id);
          elem && setEditInputsVal(columns.map(({ getVal }) => getVal(elem)));
          return;
        case button?.matches('.cancel'):
          setEditRowId(null);
          return;
        case button?.matches('.add'):
          columns.forEach((col, i) => {
            if (col?.setVal)
              Object.assign(newRow, col.setVal(addInputsVal[i]));
          });
          setAddInputsVal(addInputsVal.map(() => ''));
          onAdd?.(newRow);
          return;
        case button?.matches('.update'):
          if (editRowId) newRow.id = editRowId;
          setEditRowId(null);
          // Object.assign(newRow, allRows.find(el => editRowId === el.id));
          columns.forEach((col, i) => {
            if (col?.setVal)
              Object.assign(newRow, col.setVal(editInputsVal[i]));
          });
          onEdit?.(newRow);
          return;
      }
    }, [onDelete, columns, addInputsVal, onAdd, allRows, onEdit, editRowId, editInputsVal]),
    rows = useMemo(() => {
      let
        res: (objType | Record<string, Element>)[] = [...allRows];
      if (filterValue)
        res = res.filter(obj => columns
          .map(col => col.getVal(obj as objType)?.toString().toLowerCase())
          .some(str => str?.includes(filterValue.toLowerCase())));
      if (editRowId) {
        const
          index = res.findIndex(el => editRowId === el.id);
        if (~index) { // startTransition(() => 
          const
            dataCopy = { ...res[index] };
          res[index] = dataCopy;
          columns.forEach(({ setVal }, i) => {
            if (setVal) {
              Object.assign(dataCopy, setVal( //  @ts-ignore
                <input value={editInputsVal[i]} onInput={evt => setEditInputsVal(editInputsVal.with(i, evt.currentTarget.value))} />
              ));
            }
          });
        }
      }
      return res;
    }, [allRows, columns, editInputsVal, editRowId, filterValue]);
  return <>
    filter:<input type="search" value={filterValue} onInput={evt => setFilter(evt.currentTarget.value)} />
    <table {...{ onClick }} >
      <THead columns={headColumns as columnsElement<rowObj>[]} />
      <TBody rows={rows as rowObj[]} columns={bodyColumns as columnsElement<rowObj>[]} />
      <tfoot>
        <tr>
          {footColumns?.map(({ name, getVal }) => <td key={name}>
            {getVal()}
          </td>)}
        </tr>
      </tfoot>
    </table >
  </>;
}