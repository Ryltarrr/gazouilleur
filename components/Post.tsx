import Image from "next/image";
import Link from "next/link";
import { PostWithUser } from "../types";

type PostProps = { post: PostWithUser };

const PostComponent = ({ post: { content, id, User } }: PostProps) => {
  return (
    <div
      key={id}
      className="my-3 p-5 bg-slate-200 dark:bg-slate-800 rounded-md"
    >
      <p>{content}</p>
      <Link href={`/${id}`}>
        <a
          className="transition underline
                   decoration-orange-500 hover:text-orange-500
                   dark:decoration-orange-400 dark:hover:text-orange-400"
        >
          Open the post
        </a>
      </Link>
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
  );
};

export default PostComponent;
