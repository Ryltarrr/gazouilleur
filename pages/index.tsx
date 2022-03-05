import LoadMoreButton from "./../components/LoadMoreButton";
import { RefreshIcon } from "@heroicons/react/solid";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { dehydrate, DehydratedState, QueryClient } from "react-query";
import PostComponent from "../components/Post";
import { INFINITE_POSTS_QUERY, PREVIEW_IMAGE_URL } from "../lib/constants";
import { useGetPostsInfiniteQuery } from "../lib/hooks";
import { getPostsWithAuthorsAndLikes } from "../lib/queries";

type Props = {
  dehydratedState: DehydratedState;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([INFINITE_POSTS_QUERY], () =>
    getPostsWithAuthorsAndLikes()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Home: NextPage<Props> = () => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPostsInfiniteQuery();
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
          <LoadMoreButton
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </main>
      </>
    </>
  );
};

export default Home;
