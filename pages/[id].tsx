import { Post } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";

type PostPageProps = {
  post: Post;
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
  const post = await prisma.post.findUnique({ where: { id: postId } });
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
      <div className="my-3 p-5 bg-slate-200 dark:bg-slate-800 rounded-md">
        {post.content}
      </div>
      <button
        className="px-3 py-2 rounded-md
          bg-red-500
          hover:bg-red-600
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
    </Layout>
  );
};

export default PostPage;
