import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../components/Button";
import { DEFAULT_LOCALE, MAX_POST_LENGTH } from "../lib/constants";
import { savePost } from "../lib/requests";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale = DEFAULT_LOCALE }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const CreatePage: NextPage = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await savePost({ content });
    setIsLoading(false);
    router.back();
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setContent(e.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <label className="mb-1 block">{t("post-content")}</label>
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
          {t("publish-post")}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default CreatePage;
