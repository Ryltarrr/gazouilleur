import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import { Post } from "@prisma/client";
import Link from "next/link";
import prisma from "../lib/prisma";

type Props = {
  posts: Post[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const posts = await prisma.post.findMany();
  return {
    props: {
      posts,
    },
  };
};

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <Head>
        <title>Gazouilleur</title>
        <meta name="description" content="Twitter Clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href="/create">
          <a
            className="transition underline
                decoration-orange-500 hover:text-orange-500
                dark:decoration-orange-400 dark:hover:text-orange-400"
          >
            Create new post
          </a>
        </Link>
        {posts.map((p) => (
          <div
            key={p.id}
            className="my-3 p-5 bg-slate-200 dark:bg-slate-800 rounded-md"
          >
            <p>{p.content}</p>
            <Link href={`/${p.id}`}>
              <a
                className="transition underline
                decoration-orange-500 hover:text-orange-500
                dark:decoration-orange-400 dark:hover:text-orange-400"
              >
                Open the post
              </a>
            </Link>
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default Home;
