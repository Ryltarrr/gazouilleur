import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {
  PostWithAuthorAndLikes,
  PostWithAuthorLikesAndReplies,
} from "../types";
import PostActions from "./PostActions";

type PostProps = {
  post: PostWithAuthorAndLikes | PostWithAuthorLikesAndReplies;
  isReply?: boolean;
};

const PostComponent = ({
  post: { content, id, likes, author, postRepliedId },
  isReply = false,
}: PostProps) => {
  return (
    <div className="animate-fade-in">
      <Link href={`/${id}`} passHref>
        <div
          key={id}
          className={clsx(
            "my-3 flex space-x-2 rounded-md border px-3 py-4",
            isReply
              ? "hover:bg-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
              : "border-none bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700",
            "cursor-pointer"
          )}
        >
          <div>
            {author.image && (
              <div className={clsx("relative aspect-square w-10")}>
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
              <span
                className={clsx(
                  "no-underline transition-all hover:underline",
                  "text-sm"
                )}
              >
                {author.name && author.name}
              </span>
            </Link>
            <div className={clsx("opacity-70", "text-sm")}>{content}</div>
          </div>
        </div>
      </Link>
      <PostActions id={id} likes={likes} postRepliedId={postRepliedId} />
    </div>
  );
};

export default PostComponent;
