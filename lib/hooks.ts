import { useInfiniteQuery, useQuery } from "react-query";
import {
  PostWithAuthorAndLikes,
  PostWithAuthorLikesAndReplies,
} from "../types";
import { API_POSTS } from "./constants";

export const useGetPostQuery = (id: string) => {
  return useQuery<PostWithAuthorLikesAndReplies>(["post", id], async () => {
    const res = await fetch(`${API_POSTS}/${id}`);
    return res.json();
  });
};

const fetchPosts = async ({ pageParam = 0 }) => {
  let cursor = undefined;
  if (pageParam !== 0) {
    cursor = pageParam;
  }
  if (!cursor) {
    const res = await fetch(`${API_POSTS}`);
    return res.json();
  } else {
    const res = await fetch(`${API_POSTS}?cursor=${cursor}`);
    return res.json();
  }
};

export const useGetPostsInfiniteQuery = (
  initialData?: PostWithAuthorAndLikes[]
) => {
  return useInfiniteQuery<PostWithAuthorAndLikes[]>(
    "postsInfinite",
    fetchPosts,
    {
      initialData: { pageParams: [], pages: [initialData || []] },
      getNextPageParam: (lastPage) => {
        if (lastPage && lastPage.length === 0) {
          return undefined;
        }
        return lastPage[lastPage.length - 1].id;
      },
    }
  );
};
