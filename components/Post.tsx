import Image from "next/image";
import Link from "next/link";
import { PostWithUser } from "../types";

type PostProps = { post: PostWithUser };

const PostComponent = ({ post: { content, id, author } }: PostProps) => {
  return (
    <Link href={`/${id}`} passHref>
      <div
        key={id}
        className="flex cursor-pointer my-3 px-3 py-4 bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-300 rounded-md space-x-2"
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
          <Link href={`/profile/${author.id}`}>
            <span className="no-underline hover:underline transition-all">
              {author.name && author.name}
            </span>
          </Link>
          <div className="text-sm opacity-70">{content}</div>
        </div>
      </div>
    </Link>
  );
};

export default PostComponent;
