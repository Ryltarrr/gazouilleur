import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DEFAULT_LOCALE } from "../lib/constants";

export async function getStaticProps({ locale = DEFAULT_LOCALE }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const OfflinePage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("offline-title")}</h1>
      <h2>{t("offline-description")}</h2>
    </>
  );
};

export default OfflinePage;
