import TBody from '@/components/EditableTable/TBody';
import { columns } from '@/datatypes/rickAndMortyCharacter';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient;

async function getCharacters() {
  return await prisma.character.findMany();
}

export default async function RnM() {
  const characters = await getCharacters();
  return <>
    <h1>Rick and Morty</h1>
    <table>
      <TBody rows={characters} columns={columns} />
    </table>
  </>;
}