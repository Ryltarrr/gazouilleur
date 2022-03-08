import LoadMoreButton from "./../components/LoadMoreButton";
import { RefreshIcon } from "@heroicons/react/solid";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import PostComponent from "../components/Post";
import { DEFAULT_LOCALE, PREVIEW_IMAGE_URL } from "../lib/constants";
import { useGetPostsInfiniteQuery } from "../lib/hooks";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type FrontPageProps = {};

export const getServerSideProps: GetServerSideProps<FrontPageProps> = async ({
  locale = DEFAULT_LOCALE,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const Home: NextPage<FrontPageProps> = () => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPostsInfiniteQuery();
  const { status: sessionStatus } = useSession();
  const { t } = useTranslation();

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
                {t("create-new-post")}
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
            isLoading={isLoading}
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
