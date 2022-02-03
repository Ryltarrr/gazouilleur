import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { PostWithUserAndLikes } from "../types";
import PostActions from "./PostActions";

type PostProps = { post: PostWithUserAndLikes };

const PostComponent = ({
  post: { content, id, author, likes, postRepliedId: isReply },
}: PostProps) => {
  return (
    <>
      <Link href={`/${id}`} passHref>
        <div
          key={id}
          className={clsx(
            "flex my-3 px-3 py-4 rounded-md space-x-2 border",
            isReply
              ? "dark:hover:bg-zinc-700 hover:bg-zinc-300 dark:border-zinc-700"
              : "bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-300 border-none",
            "cursor-pointer"
          )}
        >
          <div>
            {author.image && (
              <div className={clsx("relative w-10 aspect-square")}>
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
                  "no-underline hover:underline transition-all",
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
      <PostActions id={id} likes={likes} />
      {!isReply ? <hr className="mt-3 mb-7 dark:border-zinc-700" /> : null}
    </>
  );
};

export default PostComponent;
