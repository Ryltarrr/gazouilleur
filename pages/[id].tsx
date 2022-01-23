import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { DeleteButton } from "../components/Button";
import Layout from "../components/Layout";
import PostComponent from "../components/Post";
import { API_POSTS } from "../lib/constants";
import prisma from "../lib/prisma";
import { PostWithUserAndLikes } from "../types";

type PostPageProps = {
  post: PostWithUserAndLikes;
};

async function deletePost(id: string) {
  const response = await fetch(`${API_POSTS}/delete/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (
  context
) => {
  const postId = context.params?.id as string;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true, likes: true },
  });
  if (post) {
    return {
      props: {
        post,
      },
    };
  }
  return {
    notFound: true,
  };
};

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  return (
    <Layout>
      <PostComponent post={post} />
      {session?.user.id === post.authorId ? (
        <div className="flex justify-end">
          <DeleteButton
            onClick={() => {
              deletePost(post.id).then(() => mutate(API_POSTS));
              router.back();
            }}
          >
            Delete
          </DeleteButton>
        </div>
      ) : null}
    </Layout>
  );
};

export default PostPage;
