import { nanoquery } from '@nanostores/query';
import HotToast from 'react-hot-toast';


function getMutator(method, suffix, updateFn, { createMutatorStore, getBody, apiPath, toastPromise, toastPromiseOptions }) {
  return createMutatorStore(async ({ newVal, getCacheUpdater }) => {
    const [updateCache, oldData] = getCacheUpdater(apiPath);
    updateCache(updateFn(oldData, newVal));
    const promise = (async () => {
      const
        response = await fetch(apiPath + suffix(newVal), {
          method,
          body: getBody?.(newVal)
        });
      const res = await response.json();
      if (res.error) throw res.error;
      if (!response.ok) throw response.statusText;
      return res;
    })();

    toastPromise(promise, { toastPromiseOptions });
    return promise;
  });
}


export default function getStores(apiPath, {
  fetcher = (...keys) => fetch(keys.join('')).then(r => r.json()),
  toast = HotToast,
}) {

  const
    [createFetcherStore, createMutatorStore] = nanoquery({ fetcher }),
    options = {
      createMutatorStore,
      apiPath,
      getBody: data => (new URLSearchParams(data)).toString(),
      toastPromise: toast.promise,
      toastPromiseOptions: {
        success: <b>ok</b>,
        error: err => `error: ${JSON.stringify(err)}`,
      }
    },
    fetcherStore = createFetcherStore([apiPath]),
    addStore = getMutator('POST', () => '',
      (oldData, newVal) => [...oldData, newVal],
      Object.assign({}, options, { toastPromiseOptions: { loading: 'Inserting...' } })),
    delStore = getMutator('DELETE', ({ id }) => id,
     (oldData, newVal) => oldData.filter(d => +newVal.id !== +d.id),
      Object.assign({}, options, { toastPromiseOptions: { loading: 'Deleting...' } })),
    updateStore = getMutator('PUT', ({ id }) => id, 
    (oldData, newVal) => oldData.map(d => +newVal.id === +d.id ? newVal : d), 
    Object.assign({}, options, { toastPromiseOptions: { loading: 'Updating...' } }));
  return {fetcherStore,  addStore, delStore, updateStore };
}