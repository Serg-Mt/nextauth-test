import { columns, Character } from '../datatypes/rickAndMortyCharacter';
import RTable from '../components/RTable';
import getStores from '../store/generateStores';

const 
  charactersStores = getStores<Character>('/api/public/character/');
  

export default function RTableDemoPage() {
  return <RTable<Character> apiStores={charactersStores} {...{columns}}/>;
}