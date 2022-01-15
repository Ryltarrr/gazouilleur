import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Gazouilleur</title>
        <meta name="description" content="Twitter Clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-3xl text-slate-800">Gazouilleur</h1>
      </main>
    </div>
  );
};

export default Home;
