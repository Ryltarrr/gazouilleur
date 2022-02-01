import { RefreshIcon, SparklesIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { API_POSTS } from "../lib/constants";
import { useGetPostsInfinite } from "../lib/hooks";
import { PostWithUserAndLikes } from "../types";

type PostProps = { post: PostWithUserAndLikes };

async function toggleLike(postId: string) {
  const response = await fetch(`${API_POSTS}/like/${postId}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

const PostComponent = ({ post: { content, id, author, likes } }: PostProps) => {
  const { data: session } = useSession();
  const currentUserLikesThisPost = likes.find(
    (l) => l.userId === session?.user.id
  );
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetPostsInfinite();

  return (
    <>
      <Link href={`/${id}`} passHref>
        <div
          key={id}
          className={clsx(
            "flex my-3 px-3 py-4 rounded-md space-x-2",
            "bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-300",
            "cursor-pointer"
          )}
        >
          <div>
            {author.image && (
              <div className="relative w-10 aspect-square">
                <Image
                  layout="fill"
                  className="rounded-full"
                  alt="Author profile image"
                  src={author.image}
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Link passHref href={`/profile/${author.id}`}>
              <span className="no-underline hover:underline transition-all">
                {author.name && author.name}
              </span>
            </Link>
            <div className="text-sm opacity-70">{content}</div>
          </div>
        </div>
      </Link>
      <button
        className="flex space-x-2 items-center transition group"
        onClick={async () => {
          setIsLoading(true);
          await toggleLike(id);
          mutate().finally(() => setIsLoading(false));
        }}
      >
        <>
          {isLoading ? (
            <RefreshIcon className="h-4 aspect-square animate-reverse-spin" />
          ) : (
            <SparklesIcon
              className={clsx(
                "h-4 aspect-square",
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
    </>
  );
};

export default PostComponent;
