import RTable from '../components/RTable';
import getStores from '../store/generateStores';
import { columnsArray } from '../datatypes/types';

type JSPUser = {
  id: string,
  name: string,
  email: string,
  username: string,
  phone: string,
  website: string,
  address?: {
    street: string,
    suite: string,
    city: string,
    zipcode: string,
    geo: {
      lat: string,
      lng: string
    }
  }
}



const
  jsonplaceholderStores = getStores<JSPUser>('https://jsonplaceholder.typicode.com/users/'),
  columns: columnsArray<JSPUser>[] = [
    { name: 'id', getVal: ({ id }) => id },
    { name: 'Name', getVal: ({ name }) => name, setVal: val => ({ name: val }) },
    { name: 'Email', getVal: ({ email }) => email, setVal: val => ({ email: val }) },
    { name: 'Address city', getVal: obj => obj?.address?.city || '-', setVal: city => ({ address: { city } }) },
    // { name: 'Geo Coordinates', getVal: ({ address: { geo: { lat, lng } } = { geo: { lat: NaN, lng: NaN } } }) => lat + ',' + lng }
    // { name: 'Geo Coordinates', getVal: ({ address: { geo: { lat, lng } } }) => lat + ',' + lng }
  ];

// Object.assign(columns,{[accordionSymbol]:()=>
//   <RTable />});


export default function RTableDemoPage() {
  return <RTable<JSPUser> columns={columns} apiStores={jsonplaceholderStores} />;
}