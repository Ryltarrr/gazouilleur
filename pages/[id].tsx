import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import PostComponent from "../components/Post";
import prisma from "../lib/prisma";
import { PostWithUser } from "../types";

type PostPageProps = {
  post: PostWithUser;
};

async function deletePost(id: string) {
  const response = await fetch(`/api/post/delete/${id}`, {
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
    include: { User: true },
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
  const router = useRouter();
  return (
    <Layout>
      <PostComponent post={post} />
      <div className="flex justify-end">
        <button
          className="px-3 py-2 rounded-md
        bg-red-500 hover:bg-red-600
        text-white
        transition
        disabled:bg-gray-500 dark:disabled:bg-gray-400
        disabled:text-gray-200 dark:disabled:text-gray-200 disabled:cursor-not-allowed"
          onClick={async () => {
            await deletePost(post.id);
            router.back();
          }}
        >
          Delete
        </button>
      </div>
    </Layout>
  );
};

export default PostPage;
