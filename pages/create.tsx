import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../components/Button";
import Layout from "../components/Layout";
import { MAX_POST_LENGTH } from "../lib/constants";
import { useGetPostsInfinite } from "../lib/hooks";
import { savePost } from "../lib/requests";

const CreatePage: NextPage = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const { mutate } = useGetPostsInfinite();
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
    mutate().finally(() => setIsLoading(false));
    router.back();
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setContent(e.target.value);

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Content</label>
        <textarea
          className="block mb-5 rounded-md w-full border-2 border-orange-500 focus:outline-none"
          autoFocus
          value={content}
          onChange={handleChange}
          maxLength={MAX_POST_LENGTH}
        />
        <div className="flex justify-between items-center">
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
    </Layout>
  );
};

export default CreatePage;
