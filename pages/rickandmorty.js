import RESTTable from '../components/RESTTable';
import { Img } from '../components/cell-wrappers';
import { $characters } from '../store/characters';




const columns = [
  { name: 'Image', getVal: obj => obj.image, Wrap: Img },
  { name: 'Name', getVal: obj => obj.name },
  { name: 'Status', getVal: obj => obj.status },
];



export default function rickandmortyPage(){
  return <RESTTable store={$characters} {...{columns}}/>;
}