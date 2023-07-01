import { nanoquery } from '@nanostores/query';
import { useStore } from '@nanostores/react';

import EditableTable from '../components/EditableTable';
import { columns } from '../datatypes/users';

const
  [createFetcherStore] = nanoquery(
    { fetcher: (...keys) => fetch(keys.join('')).then(r => r.json()), }),
  $users = createFetcherStore(['/api/admin/users']);



export default function Admin() {
  const
    { data: rows, loading, error } = useStore($users);
  return <>
    <h1>admin</h1>
    {Array.isArray(rows) && <EditableTable {...{ columns, rows }} />}
  </>;
}