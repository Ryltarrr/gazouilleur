import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import PostComponent from "../components/Post";
import { PostWithAuthorAndLikes } from "../types";
import { SWRConfig } from "swr";
import { RefreshIcon } from "@heroicons/react/solid";
import Button from "../components/Button";
import { API_POSTS, PAGE_SIZE, PREVIEW_IMAGE_URL } from "../lib/constants";
import { useSession } from "next-auth/react";
import { useGetPostsInfinite } from "../lib/hooks";
import { getPostsWithAuthorsAndLikes } from "../lib/queries";

type Props = {
  fallback: {
    [API_POSTS]: PostWithAuthorAndLikes[];
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  let cursor = query.cursor;
  if (typeof cursor === "object") {
    cursor = cursor[0];
  }

  const postsAndUsers: PostWithAuthorAndLikes[] =
    await getPostsWithAuthorsAndLikes(cursor);

  return {
    props: {
      fallback: {
        [API_POSTS]: postsAndUsers,
      },
    },
  };
};

const Home: NextPage<Props> = ({ fallback }) => {
  const { data: postsPages, error, size, setSize } = useGetPostsInfinite();
  const { status: sessionStatus } = useSession();

  const isLoadingInitialData = !postsPages && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && postsPages && typeof postsPages[size - 1] === "undefined");
  const isEmpty = postsPages?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (postsPages && postsPages[postsPages.length - 1]?.length < PAGE_SIZE);

  return (
    <>
      <Head>
        <meta property="og:title" content="Gazouilleur" />
        <meta name="twitter:title" content="Gazouilleur" />
        <meta name="description" content="Twitter clone for fun" />
        <meta property="og:description" content="Twitter clone for fun" />
        <meta name="twitter:description" content="Twitter clone for fun" />
        <meta property="og:image" content={PREVIEW_IMAGE_URL} />
        <meta name="twitter:image" content={PREVIEW_IMAGE_URL}></meta>
      </Head>
      <SWRConfig value={{ fallback }}>
        <Layout>
          <Head>
            <title>Gazouilleur</title>
            <meta name="description" content="Twitter Clone" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
            {sessionStatus === "authenticated" ? (
              <Link href="/create">
                <a
                  className="underline decoration-orange-500
        transition hover:text-orange-500
        dark:decoration-orange-400 dark:hover:text-orange-400"
                >
                  Create new post
                </a>
              </Link>
            ) : null}
            {isLoadingInitialData && (
              <div className="absolute inset-x-0 top-10">
                <div className="flex justify-center transition-all">
                  <RefreshIcon className="aspect-square h-7 animate-reverse-spin" />
                </div>
              </div>
            )}
            {postsPages?.map((posts) =>
              posts?.map((p) => <PostComponent key={p.id} post={p} />)
            )}
            {!isLoadingInitialData && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  className="my-3"
                  disabled={isReachingEnd}
                  onClick={() => setSize(size + 1)}
                  isLoading={isLoadingMore}
                >
                  load more
                </Button>
              </div>
            )}
          </main>
        </Layout>
      </SWRConfig>
    </>
  );
};

export default Home;
