import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import PostComponent from "../components/Post";
import { PostWithUser } from "../types";
import { SWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { RefreshIcon } from "@heroicons/react/solid";
import getPostsWithUsers from "../lib/getPostsAndUsers";
import Button from "../components/Button";
import { PAGE_SIZE } from "../lib/constants";
import { useSession } from "next-auth/react";

type Props = {
  fallback: {
    "/api/post": PostWithUser[];
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  let cursor = query.cursor;
  if (typeof cursor === "object") {
    cursor = cursor[0];
  }

  const postsAndUsers: PostWithUser[] = await getPostsWithUsers(cursor);

  return {
    props: {
      fallback: {
        "/api/post": postsAndUsers,
      },
    },
  };
};

const getKey = (pageIndex: number, previousPageData: PostWithUser[]) => {
  // reached the end
  if (previousPageData && previousPageData.length === 0) {
    return null;
  }

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/api/post`;

  // add the cursor to the API endpoint
  const cursor = previousPageData[previousPageData.length - 1].id;
  return `/api/post?cursor=${cursor}`;
};

const Home: NextPage<Props> = ({ fallback }) => {
  const {
    data: postsPages,
    error,
    size,
    setSize,
  } = useSWRInfinite<PostWithUser[]>(getKey, (key) =>
    fetch(key).then((res) => res.json())
  );

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
                className="transition underline
        decoration-orange-500 hover:text-orange-500
        dark:decoration-orange-400 dark:hover:text-orange-400"
              >
                Create new post
              </a>
            </Link>
          ) : null}
          {isLoadingInitialData && (
            <div className="absolute top-10 inset-x-0">
              <div className="flex justify-center transition-all">
                <RefreshIcon className="h-7 w-7 animate-reverse-spin" />
              </div>
            </div>
          )}
          {postsPages?.map((posts) =>
            posts?.map((p) => <PostComponent key={p.id} post={p} />)
          )}
          {!isLoadingInitialData && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                className="my-3"
                disabled={isReachingEnd}
                onClick={() => setSize(size + 1)}
              >
                load more
              </Button>

              {isLoadingMore && (
                <RefreshIcon className="h-7 w-7 animate-reverse-spin" />
              )}
            </div>
          )}
        </main>
      </Layout>
    </SWRConfig>
  );
};

export default Home;
