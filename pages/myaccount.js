import { useSession, signIn } from 'next-auth/react';
import { nanoquery } from '@nanostores/query';
import { useStore } from '@nanostores/react';

import EditableTable from '../components/EditableTable';
import { columns } from '../datatypes/accounts';

const
  [createFetcherStore] = nanoquery(
    { fetcher: (...keys) => fetch(keys.join('')).then(r => r.json()), }),
  $accounts = createFetcherStore(['/api/restricted/myaccount']);


export default function MyAccount() {
  const
    sessionHookResult = useSession(), // специально без деструктуризации чтоб увидеть все 
    storeHookResult = useStore($accounts), // специально без деструктуризации чтоб увидеть все 
    { data, loading, error } = storeHookResult,
    rows = data?.accounts;
  return <>
    <button onClick={() => signIn()}>Link Account</button>
    loading={loading} error={error}<br/>
    {Array.isArray(rows) && <EditableTable {...{ columns, rows }} />}
    <h3>frontend:</h3>
    <pre>{JSON.stringify(sessionHookResult, null, '\t')}</pre>
    <h3>backend:</h3>
    <pre>{JSON.stringify(storeHookResult, null, '\t')}</pre>
  </>;



}