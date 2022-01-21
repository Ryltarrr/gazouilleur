import type { Post } from "@prisma/client";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { PrimaryButton } from "../components/Button";
import Layout from "../components/Layout";

export async function savePost(post: Partial<Post>) {
  const response = await fetch("/api/post/create", {
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
  const { status } = useSession();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  return (
    <Layout>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          savePost({ content }).then(() => {
            mutate("/api/post");
          });
          router.back();
        }}
      >
        <label className="block mb-1">Content</label>
        <textarea
          className="block mb-5 rounded-md w-full border-2 border-orange-500 focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxLength}
        />
        <div className="flex justify-between items-center">
          {content.length}/{maxLength}
          <PrimaryButton
            disabled={content.length === 0 || content.length > maxLength}
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
