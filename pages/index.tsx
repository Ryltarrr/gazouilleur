import { RefreshIcon } from "@heroicons/react/solid";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Button from "../components/Button";
import PostComponent from "../components/Post";
import { API_POSTS, PREVIEW_IMAGE_URL } from "../lib/constants";
import { useGetPostsInfiniteQuery } from "../lib/hooks";
import { getPostsWithAuthorsAndLikes } from "../lib/queries";
import { PostWithAuthorAndLikes } from "../types";

type Props = {
  [API_POSTS]: PostWithAuthorAndLikes[];
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
      [API_POSTS]: postsAndUsers,
    },
  };
};

const Home: NextPage<Props> = (props) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPostsInfiniteQuery(props[API_POSTS]);
  const { status: sessionStatus } = useSession();

  return (
    <>
      <Head>
        <title>Gazouilleur</title>
        <meta property="og:title" content="Gazouilleur" />
        <meta name="twitter:title" content="Gazouilleur" />
        <meta name="description" content="Twitter clone for fun" />
        <meta property="og:description" content="Twitter clone for fun" />
        <meta name="twitter:description" content="Twitter clone for fun" />
        <meta property="og:image" content={PREVIEW_IMAGE_URL} />
        <meta name="twitter:image" content={PREVIEW_IMAGE_URL}></meta>
      </Head>
      <>
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
          {isLoading && (
            <div className="absolute inset-x-0 top-10">
              <div className="flex justify-center transition-all">
                <RefreshIcon className="aspect-square h-7 animate-reverse-spin" />
              </div>
            </div>
          )}
          {data?.pages?.map((posts) =>
            posts?.map((p) => <PostComponent key={p.id} post={p} />)
          )}
          {!isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                className="my-3"
                disabled={!hasNextPage}
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                load more
              </Button>
            </div>
          )}
        </main>
      </>
    </>
  );
};

export default Home;
