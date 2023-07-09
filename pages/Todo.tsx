import RTable from '../components/RTable';
import getStores from '../store/generateStores';
import { columnsArray } from '../datatypes/types';
import { TodoItem } from '@prisma/client';





const
  TodoItemStores = getStores<TodoItem>('/api/public/todoItem/'),
  columns: columnsArray<TodoItem>[] = [
    { name: 'id', getVal: ({ id }) => id },
    {
      name: 'Status', getVal: ({ id, complete }) => <input type='checkbox' checked={complete}
        /** @ts-ignore */
        onClick={() => TodoItemStores.updateStore.get().mutate({ id, complete: !complete })}
      />
    },
    { name: 'Label', getVal: ({ label }) => label, setVal: label => ({ label }) },
  ];



export default function TodoPage() {
  return <RTable<TodoItem> columns={columns} apiStores={TodoItemStores} />;
}