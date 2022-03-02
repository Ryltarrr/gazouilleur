import { PostWithAuthorAndLikes } from "../types";
import PostComponent from "./Post";

type PostRepliesProps = {
  replies: PostWithAuthorAndLikes[];
};

const PostReplies = ({ replies }: PostRepliesProps) => {
  if (replies.length === 0) {
    return <div>This post has no replies.</div>;
  }

  return (
    <>
      {replies.map((reply) => (
        <PostComponent key={reply.id} post={reply} isReply />
      ))}
    </>
  );
};

export default PostReplies;
