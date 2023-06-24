import '@/styles/globals.sass';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSession, signIn, signOut } from 'next-auth/react';


export default function App({ Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return <SessionProvider session={session}>
    <header><Nav /></header>
    <main>
      <Component {...pageProps} />
    </main>
  </SessionProvider>;

}

const pages = [
  { name: 'Home', src: '/' },
  { name: 'Rick and Morty Characters', src: '/rickandmorty' },
  { name: 'My Account', src: '/myaccount', test(session:any) { return !!session;} },
  { name: 'Admin', src: '/admin', test(session:any) { return 'admin'===session?.user?.role; } },

];

function Nav() {
  const router = useRouter();
  const { data: session } = useSession();
  return <nav>
    <ul>
      {pages.filter(page=>page?.test ? page.test(session):true).map(({ name, src }) => <li key={name} className={router.pathname === src ? 'active' : ''}><Link href={src}>{name}</Link></li>)}
      <li><Login/></li>
    </ul>
  </nav>;

}

function Login(){
  const { data: session } = useSession();
  if(session) 
    return <>
      {session?.user?.image && <img src={session?.user?.image||''} width={32} height={32} alt="ava"/>}
      {session?.user?.name}
      <button onClick={() => signOut()}>Sign out</button>
    </>;
  return <>
    <button onClick={() => signIn()}>Sign in</button>
  </>;

}