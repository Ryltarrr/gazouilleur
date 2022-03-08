import { useTranslation } from "next-i18next";
import { PostWithAuthorAndLikes } from "../types";
import PostComponent from "./Post";

type PostRepliesProps = {
  replies: PostWithAuthorAndLikes[];
};

const PostReplies = ({ replies }: PostRepliesProps) => {
  const { t } = useTranslation();
  if (replies.length === 0) {
    return <div>{t("no-replies")}</div>;
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
