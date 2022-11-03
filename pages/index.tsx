import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>Desert Bake | Homepage</title>
        <meta name="description" content="Desert Bake homepage" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>

      <Navbar />

      <main>Main</main>

      <footer>Footer</footer>
    </>
  );
}
