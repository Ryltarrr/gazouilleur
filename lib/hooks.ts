import useSWRInfinite from "swr/infinite";
import { PostWithUserAndLikes } from "../types";
import { API_POSTS } from "./constants";

const getKey = (
  pageIndex: number,
  previousPageData: PostWithUserAndLikes[]
) => {
  // reached the end
  if (previousPageData && previousPageData.length === 0) {
    return null;
  }

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return API_POSTS;

  // add the cursor to the API endpoint
  const cursor = previousPageData[previousPageData.length - 1].id;
  return `${API_POSTS}?cursor=${cursor}`;
};

export const useGetPostsInfinite = () => {
  return useSWRInfinite<PostWithUserAndLikes[]>(getKey, (key) =>
    fetch(key).then((res) => res.json())
  );
};
