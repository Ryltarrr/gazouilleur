import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { DeleteButton } from "../components/Button";
import Layout from "../components/Layout";
import PostComponent from "../components/Post";
import { API_POSTS } from "../lib/constants";
import { useGetPostsInfinite } from "../lib/hooks";
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
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetPostsInfinite();
  const router = useRouter();
  return (
    <Layout>
      <PostComponent post={post} />
      {session?.user.id === post.authorId ? (
        <div className="flex justify-end">
          <DeleteButton
            onClick={async () => {
              setIsLoading(true);
              await deletePost(post.id);
              mutate().finally(() => setIsLoading(false));
              router.back();
            }}
            isLoading={isLoading}
          >
            Delete
          </DeleteButton>
        </div>
      ) : null}
    </Layout>
  );
};

export default PostPage;
