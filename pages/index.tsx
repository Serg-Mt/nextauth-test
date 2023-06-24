import { useSession, signIn, signOut } from 'next-auth/react';



export default function Home() {
  const { data: session } = useSession();
  if(session) {
    console.log('session=',session);
    // console.log('user=',session.user);
    return <>
      Signed in as {session.user?.email} <br/>
      {session?.user?.image && <img src={session?.user?.image||''} width={32} height={32} alt="ava"/>}
      {session?.user?.name}<br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>;
  }
  return <>
    Not signed in <br/>
    <button onClick={() => signIn()}>Sign in</button>
  </>;
}