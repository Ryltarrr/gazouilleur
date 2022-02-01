import type { Post } from "@prisma/client";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../components/Button";
import Layout from "../components/Layout";
import { API_POSTS } from "../lib/constants";
import { useGetPostsInfinite } from "../lib/hooks";

export async function savePost(post: Partial<Post>) {
  const response = await fetch(`${API_POSTS}/create`, {
    method: "POST",
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

const maxLength = 280;
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

  return (
    <Layout>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          await savePost({ content });
          mutate().finally(() => setIsLoading(false));
          router.back();
        }}
      >
        <label className="block mb-1">Content</label>
        <textarea
          className="block mb-5 rounded-md w-full border-2 border-orange-500 focus:outline-none"
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxLength}
        />
        <div className="flex justify-between items-center">
          {content.length}/{maxLength}
          <PrimaryButton
            disabled={content.length === 0 || content.length > maxLength}
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
