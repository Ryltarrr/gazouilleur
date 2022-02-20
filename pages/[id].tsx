import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { DeleteButton } from "../components/Button";
import PostComponent from "../components/Post";
import PostReplies from "../components/PostReplies";
import { PREVIEW_IMAGE_URL } from "../lib/constants";
import { useGetPostQuery } from "../lib/hooks";
import { getPost } from "../lib/queries";
import { deletePost } from "../lib/requests";
import { PostWithAuthorAndLikes } from "../types";

type PostPageProps = {
  post: PostWithAuthorAndLikes & { repliedBy: PostWithAuthorAndLikes[] };
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (
  context
) => {
  const postId = context.params?.id as string;
  const post = await getPost(postId);
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

const PostPage: NextPage<PostPageProps> = (props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = useGetPostQuery(id as string, props.post);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Head>
        <title>Post by {post?.author.name}</title>
        <meta property="og:title" content={`Post by ${post?.author.name}`} />
        <meta name="twitter:title" content={`Post by ${post?.author.name}`} />
        <meta name="description" content={post?.content} />
        <meta property="og:description" content={post?.content} />
        <meta name="twitter:description" content={post?.content} />
        <meta property="og:image" content={PREVIEW_IMAGE_URL} />
        <meta name="twitter:image" content={PREVIEW_IMAGE_URL} />
      </Head>
      <>
        {post ? (
          <>
            <PostComponent post={post} />
            {session?.user.id === post.authorId ? (
              <div className="flex justify-end">
                <DeleteButton
                  onClick={async () => {
                    setIsLoading(true);
                    await deletePost(post.id);
                    router.back();
                  }}
                  isLoading={isLoading}
                >
                  Delete
                </DeleteButton>
              </div>
            ) : null}
            {!post.postRepliedId ? (
              <hr className="mt-3 mb-7 dark:border-zinc-700" />
            ) : null}
            <PostReplies replies={post.repliedBy} />
          </>
        ) : null}
      </>
    </>
  );
};

export default PostPage;
