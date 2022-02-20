import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../components/Button";
import { MAX_POST_LENGTH } from "../lib/constants";
import { useGetPostsInfiniteQuery } from "../lib/hooks";
import { savePost } from "../lib/requests";

const CreatePage: NextPage = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const { refetch } = useGetPostsInfiniteQuery();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await savePost({ content });
    refetch().finally(() => setIsLoading(false));
    router.back();
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setContent(e.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <label className="mb-1 block">Content</label>
      <textarea
        className="mb-5 block w-full rounded-md border-2 border-orange-500 focus:outline-none"
        autoFocus
        value={content}
        onChange={handleChange}
        maxLength={MAX_POST_LENGTH}
      />
      <div className="flex items-center justify-between">
        {content.length}/{MAX_POST_LENGTH}
        <PrimaryButton
          disabled={content.length === 0 || content.length > MAX_POST_LENGTH}
          isLoading={isLoading}
          type="submit"
        >
          Create
        </PrimaryButton>
      </div>
    </form>
  );
};

export default CreatePage;
