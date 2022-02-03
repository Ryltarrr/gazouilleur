import {
  RefreshIcon,
  SparklesIcon,
  ReplyIcon,
  ShareIcon,
} from "@heroicons/react/solid";
import { Like } from "@prisma/client";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useGetPostsInfinite } from "../lib/hooks";
import { toggleLike, addToPost } from "../lib/requests";
import { Timeout } from "../types";

const PostActions = ({ likes, id }: { likes: Like[]; id: string }) => {
  const { data: session } = useSession();
  const currentUserLikesThisPost = likes.find(
    (l) => l.userId === session?.user.id
  );
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetPostsInfinite();
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
      mutate();
    }
  };

  const likePost = async () => {
    setIsLoading(true);
    await toggleLike(id);
    mutate().finally(() => setIsLoading(false));
  };

  return (
    <div className="flex space-x-5">
      <button className="flex items-center transition group" onClick={likePost}>
        <>
          {isLoading ? (
            <RefreshIcon className="h-5 aspect-square animate-reverse-spin mr-1" />
          ) : (
            <SparklesIcon
              className={clsx(
                "h-4 aspect-square mr-1",
                "group-hover:text-yellow-200",
                {
                  "text-yellow-500": currentUserLikesThisPost,
                }
              )}
            />
          )}
          {likes.length}
        </>
      </button>
      <button onClick={replyPrompt}>
        <ReplyIcon className="h-5 aspect-square hover:text-blue-400 transition mr-1" />
      </button>
      <button className="flex items-center" onClick={sharePost}>
        <ShareIcon className="h-5 aspect-square hover:text-blue-400 transition mr-1" />
        <>{isCopied ? "Link copied!" : null}</>
      </button>
    </div>
  );
};

export default PostActions;
