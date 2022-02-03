import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { DeleteButton } from "../components/Button";
import Layout from "../components/Layout";
import PostComponent from "../components/Post";
import { PREVIEW_IMAGE_URL } from "../lib/constants";
import { useGetPostsInfinite } from "../lib/hooks";
import prisma from "../lib/prisma";
import { deletePost } from "../lib/requests";
import { PostWithUserAndLikes } from "../types";

type PostPageProps = {
  post: PostWithUserAndLikes & { repliedBy: PostWithUserAndLikes[] };
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (
  context
) => {
  const postId = context.params?.id as string;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      likes: true,
      repliedBy: { include: { author: true, likes: true } },
    },
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
    <>
      <Head>
        <title>Post by {post.author.name}</title>
        <meta property="og:title" content={`Post by ${post.author.name}`} />
        <meta name="twitter:title" content={`Post by ${post.author.name}`} />
        <meta name="description" content={post.content} />
        <meta property="og:description" content={post.content} />
        <meta name="twitter:description" content={post.content} />
        <meta property="og:image" content={PREVIEW_IMAGE_URL} />
        <meta name="twitter:image" content={PREVIEW_IMAGE_URL}></meta>
      </Head>
      <Layout>
        <PostComponent post={post} />
        {post.repliedBy.map((reply) => (
          <PostComponent key={reply.id} post={reply} />
        ))}
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
    </>
  );
};

export default PostPage;
