import { nanoquery } from '@nanostores/query';

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: (...keys ) => fetch(keys.join('')).then(r => r.json()),
});


export const $characters = createFetcherStore(['/api/public/character/']);

export const $addCharacters = createMutatorStore(
  async ({ data, invalidate, getCacheUpdater }) => {
    // You can either invalidate the author…
    // invalidate(`/api/users/${comment.authorId}`);

    // …or you can optimistically update current cache.
    const [updateCache, char] = getCacheUpdater('/api/public/character/');
    updateCache([...char, data]);

    // Even though `fetch` is called after calling `invalidate`, we will only
    // invalidate the keys after `fetch` resolves
    return fetch('/api/public/character/',{
      method: 'POST',
      body:{data}
    });
  }
);