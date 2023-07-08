import { nanoquery, MutatorStore, FetcherStore, ManualMutator } from '@nanostores/query';
import HotToast from 'react-hot-toast';

import { rowObj } from '../datatypes/types';


export interface StoresSetType<objType> {
  fetcherStore: FetcherStore<objType[]>;
  addStore: MutatorStore<objType>;
  delStore: MutatorStore<objType>;
  updateStore: MutatorStore<objType>;
}

type HotToastPromiseParameters = Parameters<typeof HotToast.promise>;
type HotToastPromiseMsgs = HotToastPromiseParameters[1];


type GetMutatorOptions<objType> = {
  // eslint-disable-next-line no-unused-vars
  createMutatorStore: <Data = objType, Result = unknown, E_1 = any>(mutator: ManualMutator<Data, Result>) => MutatorStore<Data, Result, E_1>,
  getBody: (_: objType) => string,
  apiPath: string,
  toastPromiseFn: typeof HotToast.promise,
  toastPromiseOptions: HotToastPromiseMsgs
};

function getMutator<objType extends rowObj>(
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  getSuffixFn: (_: any) => string,
  updateFn: (_: objType[], __: objType) => objType[],
  { createMutatorStore, getBody, apiPath, toastPromiseFn: toastPromise, toastPromiseOptions }: GetMutatorOptions<objType>) {
  return createMutatorStore<objType>(async ({ data: newVal, getCacheUpdater }:
    { data: objType, getCacheUpdater: any }) => {
    const [updateCache, oldData] = getCacheUpdater(apiPath);
    updateCache(updateFn(oldData, newVal));
    const promise = (async () => {
      const
        response = await fetch(apiPath + getSuffixFn(newVal), {
          method,
          body: getBody?.(newVal)
        });
      const res = await response.json();
      if (res.error) throw res.error;
      if (!response.ok) throw response.statusText;
      return res;
    })();

    toastPromise(promise, toastPromiseOptions);
    return promise;
  });
}
const defaultFetcher = (...keys: string[]) => fetch(keys.join('')).then(r => r.json());

export default function getStores<objType extends rowObj>(apiPath: string, {
  fetcher = defaultFetcher, toast = HotToast }:
  { fetcher?: typeof defaultFetcher, toast?: typeof HotToast } | undefined = {}): StoresSetType<objType> {
  const
    [createFetcherStore, createMutatorStore] = nanoquery({ fetcher }),
    options: GetMutatorOptions<objType> = {
      createMutatorStore,
      apiPath,
      getBody: (data: objType) => (new URLSearchParams(data as unknown as Record<string, string>)).toString(),
      toastPromiseFn: toast.promise,
      toastPromiseOptions: {
        loading: 'Sending...',
        success: <b>ok </b>,
        error: (err: any) => `error: ${JSON.stringify(err)}`,
      }
    },
    fetcherStore = createFetcherStore<objType[]>([apiPath]),
    addStore = getMutator<objType>('POST', () => '',
      (oldData, newVal) => [...oldData, newVal],
      Object.assign({}, options, { toastPromiseOptions: { loading: 'Inserting...' } })),
    delStore = getMutator<objType>('DELETE', ({ id }) => id,
      (oldData, newVal) => oldData.filter(d => +newVal.id !== +d.id),
      Object.assign({}, options, { toastPromiseOptions: { loading: 'Deleting...' } })),
    updateStore = getMutator<objType>('PUT', ({ id }) => id,
      (oldData, newVal) => oldData.map(d => +newVal.id === +d.id ? newVal : d),
      Object.assign({}, options, { toastPromiseOptions: { loading: 'Updating...' } }));
  return { fetcherStore, addStore, delStore, updateStore };
}