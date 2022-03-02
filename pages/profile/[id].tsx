import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { dehydrate, DehydratedState, QueryClient, useQuery } from "react-query";
import { getUserProfile } from "../../lib/queries";

type ProfilePageProps = {
  dehydratedState: DehydratedState;
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (
  context
) => {
  const userId = context.params?.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["profile", userId], () =>
    getUserProfile(userId)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const ProfilePage: NextPage<ProfilePageProps> = () => {
  const router = useRouter();
  const { id: userId } = router.query;
  const { data: user } = useQuery(["profile", userId], async () => {
    const res = await fetch(`/api/profile/${userId}`);
    return res.json();
  });

  return (
    <div className="flex items-center space-x-5">
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
  );
};

export default ProfilePage;
