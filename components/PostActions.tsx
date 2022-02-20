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
import { useMutation, useQueryClient } from "react-query";
import { toggleLike, addToPost } from "../lib/requests";
import { Timeout } from "../types";

const PostActions = ({ id, likes }: { id: string; likes: Like[] }) => {
  const queryClient = useQueryClient();
  const likeMutation = useMutation((postId: string) => toggleLike(postId), {
    onSuccess() {
      queryClient.invalidateQueries(["post", id]);
    },
  });
  const replyMutation = useMutation(
    (promptAnswer: string) =>
      addToPost(id, {
        content: promptAnswer,
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(["post", id]);
      },
    }
  );

  const { data: session } = useSession();
  const isUserConnected = !!session?.user.id;
  const currentUserLikesThisPost = likes.find(
    (l) => l.userId === session?.user.id
  );
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
      replyMutation.mutate(answer);
    }
  };

  const likePost = async () => {
    likeMutation.mutate(id);
  };

  if (!isUserConnected) {
    return null;
  }

  return (
    <div className="flex space-x-5">
      <button className="group flex items-center transition" onClick={likePost}>
        <>
          {likeMutation.isLoading ? (
            <RefreshIcon className="mr-1 aspect-square h-4 animate-reverse-spin" />
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
          {likes.length}
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
