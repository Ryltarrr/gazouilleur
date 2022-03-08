import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { dehydrate, DehydratedState, QueryClient } from "react-query";
import { DeleteButton } from "../components/Button";
import PostComponent from "../components/Post";
import PostReplies from "../components/PostReplies";
import { DEFAULT_LOCALE, PREVIEW_IMAGE_URL } from "../lib/constants";
import { useGetPostQuery } from "../lib/hooks";
import { getPost } from "../lib/queries";
import { deletePost } from "../lib/requests";

type PostPageProps = {
  dehydratedState: DehydratedState;
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async ({
  locale = DEFAULT_LOCALE,
  ...context
}) => {
  const postId = context.params?.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["post", postId], () => getPost(postId));

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const PostPage: NextPage<PostPageProps> = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = useGetPostQuery(id as string);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

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
                  {t("delete-post")}
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
