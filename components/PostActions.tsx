import {
  RefreshIcon,
  SparklesIcon,
  ReplyIcon,
  ShareIcon,
} from "@heroicons/react/solid";
import { Like } from "@prisma/client";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toggleLike, addToPost } from "../lib/requests";
import { Timeout } from "../types";

const PostActions = ({
  id,
  likes,
  postRepliedId,
}: {
  id: string;
  likes: Like[];
  postRepliedId: string | null;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const likeMutation = useMutation((postId: string) => toggleLike(postId), {
    onSuccess() {
      // TODO: change the invalidation depending on the page/context
      // try to use invalidateQueries only once
      queryClient.invalidateQueries(["post", id]);
      if (postRepliedId) {
        queryClient.invalidateQueries(["post", postRepliedId]);
      }
      queryClient.invalidateQueries(["postsInfinite"]);
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
    const answer = window.prompt(t("post-reply"));
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
      <button
        className="sm:group flex items-center transition"
        onClick={likePost}
      >
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
        <ReplyIcon className="mr-1 aspect-square h-5 transition sm:hover:text-blue-400" />
      </button>
      <button className="flex items-center" onClick={sharePost}>
        <ShareIcon
          className={clsx(
            "mr-1 aspect-square h-5 transition sm:hover:text-blue-400",
            { "animate-spin-once": isCopied }
          )}
        />
        <>{isCopied ? t("link-copied") : null}</>
      </button>
    </div>
  );
};

export default PostActions;
