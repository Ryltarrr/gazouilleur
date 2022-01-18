import type { Post } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
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
  const router = useRouter();
  return (
    <Layout>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          savePost({ content });
          router.back();
        }}
      >
        <label className="block">Content</label>
        <textarea
          className="block mb-5 rounded-md w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxLength}
        />
        <div className="flex justify-between items-center">
          {content.length}/{maxLength}
          <button
            className="px-3 py-2 rounded-md
          bg-orange-500 dark:bg-orange-400
          disabled:bg-gray-500 dark:disabled:bg-gray-400
          disabled:text-gray-200 dark:disabled:text-gray-200 disabled:cursor-not-allowed"
            disabled={content.length === 0 || content.length > maxLength}
            type="submit"
          >
            Valider
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreatePage;
