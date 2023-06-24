import EditableTable from './EditableTable';

import { useStore } from '@nanostores/react';


export default function RESTTable({ store, columns }) {
  const {data,mutate, loading, error} = useStore(store);
  console.log('hook=',{data,mutate, loading, error});
  if (error) return <>Error={error}</>;
  if (loading) return <>Loading...</>;
  return <>
    <EditableTable rows={data} {...{columns}} />
  </>;

}