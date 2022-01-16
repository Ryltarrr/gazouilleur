import Image from "next/image";
import Link from "next/link";
import { PostWithUser } from "../types";

type PostProps = { post: PostWithUser };

const PostComponent = ({ post: { content, id, User } }: PostProps) => {
  return (
    <Link href={`/${id}`} passHref>
      <a
        key={id}
        className="flex my-3 px-3 py-4 bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-300 rounded-md space-x-2"
      >
        <div>
          {User.image && (
            <div className="relative w-10 aspect-square">
              <Image
                layout="fill"
                className="rounded-full"
                alt="Author profile image"
                src={User.image}
              />
            </div>
          )}
        </div>
        <div className="flex-1">
          <Link href="/">
            <a className="no-underline hover:underline transition-all">
              {User.name && User.name}
            </a>
          </Link>
          <div className="text-sm opacity-70">{content}</div>
        </div>
        {/* <Link href={`/${id}`}>
        <a
          className="transition underline
                   decoration-orange-500 hover:text-orange-500
                   dark:decoration-orange-400 dark:hover:text-orange-400"
        >
          Open the post
        </a>
      </Link> */}
      </a>
    </Link>
  );
};

export default PostComponent;
