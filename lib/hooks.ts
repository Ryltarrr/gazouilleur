import { useQuery } from "react-query";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import {
  PostWithAuthorAndLikes,
  PostWithAuthorLikesAndReplies,
} from "../types";
import { API_POSTS } from "./constants";

const getKey = (
  pageIndex: number,
  previousPageData: PostWithAuthorAndLikes[]
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

const fetcher = (key: any) => fetch(key).then((res) => res.json());

export const useGetPostsInfinite = () => {
  return useSWRInfinite<PostWithAuthorAndLikes[]>(getKey, fetcher);
};

export const useGetPost = (id: string) => {
  return useSWR<PostWithAuthorLikesAndReplies>(`${API_POSTS}/${id}`, fetcher);
};

export const useGetPostQuery = (
  id: string,
  initialData: PostWithAuthorLikesAndReplies
) => {
  return useQuery<PostWithAuthorLikesAndReplies>(
    ["post", id],
    async () => {
      const res = await fetch(`${API_POSTS}/${id}`);
      return res.json();
    },
    { initialData }
  );
};
