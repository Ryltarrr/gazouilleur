import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { DeleteButton } from "../components/Button";
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
        <DeleteButton
          onClick={async () => {
            await deletePost(post.id);
            router.back();
          }}
        >
          Delete
        </DeleteButton>
      </div>
    </Layout>
  );
};

export default PostPage;
