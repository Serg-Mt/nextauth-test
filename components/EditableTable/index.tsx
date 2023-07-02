import TBody from './TBody';
import THead from './THead';
import { rowObj, columnsElement } from '../../datatypes/types';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';

export default function EditableTable<objType extends rowObj>(
  { rows: allRows, columns, onDelete, onAdd, onEdit }
    : {
      rows: objType[],
      columns: columnsElement<objType>[],
      onDelete: (_: objType) => Promise<any>,
      onAdd: (_: objType) => Promise<any>,
      onEdit: (_: objType) => Promise<any>,
    }) {
  const
    [filterValue, setFilter] = useState(''),
    [addInputsVal, setAddInputsVal] = useState<string[]>(Array(columns.length).fill('')),
    [editRowId, setEditRowId] = useState<number | null>(null),
    [editInputsVal, setEditInputsVal] = useState(Array(columns.length).fill('')),
    addButton = useCallback(() => <button className='add'>➕ add</button>, []),
    delButton = useCallback((obj: objType) => <button data-id={obj.id} className='delete'>❌delete</button>, []),
    editButton = useCallback((obj: objType) => <button data-id={obj.id} className='start-edit'>✏️edit</button>, []),
    updateButton = useMemo(() => <button className='update'>✔️ok</button>, []),
    cancelButton = useMemo(() => <button className='cancel'>✖️cancel</button>, []),
    headColumns = useMemo(() => [...columns, { name: 'actions' } as columnsElement<objType>], [columns]),
    bodyColumns = useMemo(() => [...columns, {
      name: 'actions',
      getVal: obj => editRowId === obj.id
        ? <>{updateButton}{cancelButton}</>
        : <>{onEdit && editButton(obj)}{onDelete && delButton(obj)}</>
    } as columnsElement<objType>], [columns, editRowId, onEdit, onDelete]),
    footColumns = useMemo(() => onAdd && [...columns.map(
      ({ name, setVal }, i) => ({
        name,
        getVal: () => <>{setVal //  @ts-ignore
          ? <input name={name} value={addInputsVal[i]} onInput={evt => setAddInputsVal(addInputsVal.with(i, evt.currentTarget.value))} />
          : ''
        }</>
      })), { name: 'actions', getVal: addButton }], [columns, addInputsVal, onAdd]),
    onClick: MouseEventHandler = useCallback((evt) => {
      const
        { target } = evt,
        button = (target as HTMLElement).closest('button'),
        newRow: objType = {} as objType,
        id: number = +(button?.dataset.id || NaN),
        elem = allRows.find(el => id === el.id);
      switch (true) {
        case button?.matches('.delete'):
          return onDelete({ id } as objType);
        case button?.matches('.start-edit'):
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
          //  console.log('char=',char);
          setAddInputsVal(addInputsVal.map(() => ''));
          return onAdd(newRow);
        case button?.matches('.update'):
          if (editRowId) newRow.id = editRowId;
          setEditRowId(null);
          // Object.assign(newRow, allRows.find(el => editRowId === el.id));
          columns.forEach((col, i) => {
            if (col?.setVal)
              Object.assign(newRow, col.setVal(editInputsVal[i]));
          });
          return onEdit(newRow);
      }
    }, [onDelete, columns, addInputsVal, onAdd, allRows, onEdit, editRowId, editInputsVal]),
    rows = useMemo(() => {
      let
        res = [...allRows];
      if (filterValue)
        res = res.filter(obj => columns
          .map(col => col.getVal(obj)?.toString().toLowerCase())
          .some(str => str?.includes(filterValue.toLowerCase())));
      if (editRowId) {
        const
          index = res.findIndex(el => editRowId === el.id);
        if (index) { // startTransition(() => 
          const
            dataCopy = { ...res[index] };
          res[index] = dataCopy;
          columns.forEach(({ setVal }, i) => {
            if (setVal) {
              Object.assign(dataCopy, setVal(
                <input value={editInputsVal[i]} onInput={evt => setEditInputsVal(editInputsVal.with(i, evt.currentTarget.value))} />
              ));
            }
          });
        }
      }
      return res;
    }, [allRows, columns, editInputsVal, editRowId, filterValue]);
  // console.log('table render rows=',rows);
  return <>
    filter:<input type="search" value={filterValue} onInput={evt => setFilter(evt.currentTarget.value)} />
    <table {...{ onClick }} >
      <THead columns={headColumns as columnsElement<rowObj>[]} />
      <TBody {...{ rows }} columns={bodyColumns as columnsElement<rowObj>[]} />
      <tfoot>
        <tr>
          {footColumns?.map(({ name, getVal }) => <td key={name}>
            {getVal()}
          </td>)}
          {/* {footColumns.map(({ name, setVal }, i) => <td key={name}>
            {setVal &&  //  @ts-ignore
              <input name={name} value={addInputsVal[i]} onInput={evt => setAddInputsVal(addInputsVal.with(i, evt.currentTarget.value))} />
            }
          </td>)} 
          <td>{addButton}</td> */}
        </tr>
      </tfoot>
    </table >
  </>;
}