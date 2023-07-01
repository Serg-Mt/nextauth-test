import { nanoquery } from '@nanostores/query';
// import { onSet } from 'nanostores';



import toast from 'react-hot-toast';


export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: (...keys) => fetch(keys.join('')).then(r => r.json()),
});


export const $characters = createFetcherStore(['/api/public/character/']);

export const $deleteCharacters = createMutatorStore(
  async ({ data, getCacheUpdater }) => {
    console.debug('deleteCharacters data=', data);
    const [updateCache, chars] = getCacheUpdater('/api/public/character/');
    updateCache(chars.filter(c => +data.id !== c.id));
    const promise = (async () => {
      const
        response = await fetch(`/api/public/character/${data.id}`, {
          method: 'DELETE',
          // body: { data }
        });
      const res = await response.json();
      if (res.error) throw res.error;
      if (!response.ok) throw response.statusText;
      return res;
    })();

    toast.promise(promise, {
      loading: 'Deleting...',
      success: <b>ok</b>,
      error: err => `This just happened: ${JSON.stringify(err)}`,
    });
    return promise;

  });

export const $updateCharacters = createMutatorStore(
  async ({ data, getCacheUpdater }) => {
    const [updateCache, chars] = getCacheUpdater('/api/public/character/');
    updateCache(chars.map(c => +data.id === +c.id ? data : c));
    const promise = (async () => {
      const
        response = await fetch(`/api/public/character/${data.id}`, {
          method: 'PUT',
          body: (new URLSearchParams(data)).toString()
        });
      const res = await response.json();
      if (res.error) throw res.error;
      if (!response.ok) throw response.statusText;
      return res;

    })();
    toast.promise(promise, {
      loading: 'Updating...',
      success: <b>ok</b>,
      error: err => `This just happened: ${JSON.stringify(err)}`,
    });
    return promise;
  });

export const $addCharacters = createMutatorStore(
  async ({ data, getCacheUpdater }) => {
    console.log('$addCharacters data=', data);
    const [updateCache, chars] = getCacheUpdater('/api/public/character/');
    updateCache([...chars, data]);

    const promise = (async () => {
      const
        response = await fetch('/api/public/character/', {
          method: 'POST',
          body: (new URLSearchParams(data)).toString()
        });
      const res = await response.json();
      if (res.error) throw res.error;
      if (!response.ok) throw response.statusText;
      return res;
    })();

    toast.promise(promise, {
      loading: 'Inserting...',
      success: <b>ok</b>,
      error: err => `This just happened: ${JSON.stringify(err)}`,
    });

    return promise;


  }
);

// onSet($characters,obj => console.log('___ $characters', obj));
// onSet($deleteCharacters,obj => console.log('___ $deleteCharacters', obj));
