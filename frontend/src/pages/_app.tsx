import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { useEffect } from 'react'
import { ensureValidOrLogout, setupAutoLogout } from 'lib/auth'
import { useRouter } from 'next/router'
import Footer from 'components/Footer'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // If expired on load, redirect to /login
    ensureValidOrLogout(() => router.replace('/login'));
    // Schedule automatic logout when token expires
    const cleanup = setupAutoLogout(() => {
      alert('Your session expired. Please sign in again.');
      router.replace('/login');
    });
    return cleanup;
  }, [router]);

  return (
             <div className="page">
               <main className="main">
                 <Component {...pageProps} />
               </main>
               <Footer />
             </div>
           )
}
