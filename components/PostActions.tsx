import {
  RefreshIcon,
  SparklesIcon,
  ReplyIcon,
  ShareIcon,
} from "@heroicons/react/solid";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useGetPostQuery, useGetPostsInfinite } from "../lib/hooks";
import { toggleLike, addToPost } from "../lib/requests";
import { PostWithAuthorLikesAndReplies, Timeout } from "../types";

const PostActions = ({
  id,
  initialData,
}: {
  id: string;
  initialData: PostWithAuthorLikesAndReplies;
}) => {
  const { data: post, refetch } = useGetPostQuery(id, initialData);
  const { data: session } = useSession();
  const isUserConnected = !!session?.user.id;
  const currentUserLikesThisPost = post?.likes.find(
    (l) => l.userId === session?.user.id
  );
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: mutateAllPosts } = useGetPostsInfinite();
  // TODO: export this into a useCopyText
  const [isCopied, setIsCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<null | Timeout>(null);

  const sharePost = async () => {
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }

    await navigator.clipboard.writeText(`${window.location.origin}/${id}`);
    setIsCopied(true);

    const timeoutId: Timeout = setTimeout(() => {
      setIsCopied(false);
      setCopyTimeout(null);
    }, 5000);

    setCopyTimeout(timeoutId);
  };

  const replyPrompt = async () => {
    const answer = window.prompt("Your reply?");
    if (answer) {
      await addToPost(id, {
        content: answer,
      });
      mutateAllPosts();
    }
  };

  const likePost = async () => {
    setIsLoading(true);
    await toggleLike(id);
    refetch();
    mutateAllPosts().finally(() => setIsLoading(false));
  };

  if (!isUserConnected) {
    return null;
  }

  return (
    <div className="flex space-x-5">
      <button className="group flex items-center transition" onClick={likePost}>
        <>
          {isLoading ? (
            <RefreshIcon className="mr-1 aspect-square h-5 animate-reverse-spin" />
          ) : (
            <SparklesIcon
              className={clsx(
                "mr-1 aspect-square h-4",
                "group-hover:text-yellow-200",
                {
                  "text-yellow-500": currentUserLikesThisPost,
                }
              )}
            />
          )}
          {post?.likes.length}
        </>
      </button>
      <button onClick={replyPrompt}>
        <ReplyIcon className="mr-1 aspect-square h-5 transition hover:text-blue-400" />
      </button>
      <button className="flex items-center" onClick={sharePost}>
        <ShareIcon className="mr-1 aspect-square h-5 transition hover:text-blue-400" />
        <>{isCopied ? "Link copied!" : null}</>
      </button>
    </div>
  );
};

export default PostActions;
