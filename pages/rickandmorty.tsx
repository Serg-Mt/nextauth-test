import { $characters, $addCharacters, $deleteCharacters, $updateCharacters } from '../store/characters';
import { columns } from '../datatypes/rickAndMortyCharacter';
import { useStore } from '@nanostores/react';

import { Character } from '@prisma/client';


import EditableTable from '../components/EditableTable';


export default function RickAndMortyPage() {
  const
    { data : rows, loading, error } = useStore($characters),
    { mutate: onDelete } = useStore($deleteCharacters),
    { mutate: onAdd } = useStore($addCharacters),
    { mutate: onEdit } = useStore($updateCharacters);
  
  if (error) return <>Error={error}</>;
  // тут важен порядок проверки, при использовании MutatorStore loading = true 
  if (rows) return <EditableTable<Character> rows={rows as Character[]} columns={columns} {...{ onDelete, onAdd, onEdit}} />;
  if (loading) return <>Loading={loading}</>;

}