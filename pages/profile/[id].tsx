import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { dehydrate, DehydratedState, QueryClient, useQuery } from "react-query";
import LoadMoreButton from "../../components/LoadMoreButton";
import PostComponent from "../../components/Post";
import { DEFAULT_LOCALE, INFINITE_USER_POSTS_QUERY } from "../../lib/constants";
import { useGetPostsInfiniteQuery } from "../../lib/hooks";
import { getPostsWithAuthorsAndLikes, getUserProfile } from "../../lib/queries";

type ProfilePageProps = {
  dehydratedState: DehydratedState;
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async ({
  params,
  locale = DEFAULT_LOCALE,
}) => {
  const cursor = undefined;
  const userId = params?.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["profile", userId], () =>
    getUserProfile(userId)
  );
  await queryClient.prefetchInfiniteQuery(
    [INFINITE_USER_POSTS_QUERY, userId],
    () => getPostsWithAuthorsAndLikes(cursor, userId)
  );

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const ProfilePage: NextPage<ProfilePageProps> = () => {
  const router = useRouter();
  const { id: userId }: { id?: string } = router.query;
  const { data: user } = useQuery(["profile", userId], async () => {
    const res = await fetch(`/api/profile/${userId}`);
    return res.json();
  });
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPostsInfiniteQuery(userId);
  return (
    <>
      <div className="mb-8 flex items-center space-x-5">
        {user.image ? (
          <div className="relative aspect-square w-16">
            <Image
              layout="fill"
              className="rounded-full"
              alt="Author profile image"
              src={user.image}
            />
          </div>
        ) : null}
        <div className="text-lg font-bold">{user.name ? user.name : null}</div>
      </div>
      {data?.pages?.map((posts) =>
        posts?.map((p) => <PostComponent key={p.id} post={p} />)
      )}
      <LoadMoreButton
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export default ProfilePage;
