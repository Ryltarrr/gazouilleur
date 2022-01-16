import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import prisma from "../lib/prisma";
import PostComponent from "../components/Post";
import { PostWithUser } from "../types";

type Props = {
  posts: PostWithUser[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const postsAndUsers: PostWithUser[] = await prisma.post.findMany({
    include: { User: true },
    orderBy: { createdAt: "desc" },
  });
  return {
    props: {
      posts: postsAndUsers,
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
          <PostComponent key={p.id} post={p} />
        ))}
      </main>
    </Layout>
  );
};

export default Home;
