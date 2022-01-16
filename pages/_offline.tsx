import { NextPage } from "next";
import Layout from "../components/Layout";

const OfflinePage: NextPage = () => {
  return (
    <Layout>
      <h1>This is offline fallback page</h1>
      <h2>When offline, any page route will fallback to this page</h2>
      test
    </Layout>
  );
};

export default OfflinePage;
