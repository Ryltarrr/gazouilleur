import { Prisma } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../components/Layout";

export async function savePost(post: Prisma.PostCreateInput) {
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
        onSubmit={async (e) => {
          e.preventDefault();
          await savePost({ content });
          router.back();
        }}
      >
        <label className="block">Contenu</label>
        <textarea
          className="block mb-5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxLength}
        ></textarea>
        <div>
          {content.length}/{maxLength}
        </div>
        <button
          className="px-3 py-2 rounded-md
          bg-orange-500 dark:bg-orange-400
          disabled:bg-gray-500 dark:disabled:bg-gray-400
          disabled:text-gray-200 dark:disabled:text-gray-200 disabled:cursor-not-allowed"
          disabled={content.length > maxLength}
          type="submit"
        >
          Valider
        </button>
      </form>
    </Layout>
  );
};

export default CreatePage;
