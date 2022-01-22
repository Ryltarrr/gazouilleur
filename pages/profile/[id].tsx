import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";

type ProfilePageProps = {
  user: User;
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (
  context
) => {
  const userId = context.params?.id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (user) {
    return {
      props: {
        user,
      },
    };
  }
  return {
    notFound: true,
  };
};

const ProfilePage: NextPage<ProfilePageProps> = ({ user }) => {
  return (
    <Layout>
      <div className="flex items-center space-x-5">
        {user.image ? (
          <div className="relative w-16 aspect-square">
            <Image
              layout="fill"
              className="rounded-full"
              alt="Author profile image"
              src={user.image}
            />
          </div>
        ) : null}
        <div className="font-bold text-lg">{user.name ? user.name : null}</div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
