import EditableTable from './EditableTable';
import { rowObj, columnsElement } from '../datatypes/types';
import { StoresSetType } from '../store/generateStores';
import { useStore } from '@nanostores/react';

export default function RTable<objType extends rowObj>(
  { columns, apiStores }: {
    apiStores: StoresSetType<objType>,
    columns: columnsElement<objType>[],
  }) {
  const
    { fetcherStore, addStore, delStore, updateStore } = apiStores,
    { data: rows, loading, error } = useStore(fetcherStore),
    { mutate: onAdd } = useStore(addStore),
    { mutate: onDelete } = useStore(delStore),
    { mutate: onEdit } = useStore(updateStore);

  if (error) return <>Error={error}</>;
  // тут важен порядок проверки, при использовании MutatorStore loading = true 
  if (rows) return <EditableTable<objType> columns={columns} {...{ rows, onDelete, onAdd, onEdit }} />;
  if (loading) return <>Loading={loading}</>;
}