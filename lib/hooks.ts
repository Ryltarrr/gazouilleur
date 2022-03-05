import { useInfiniteQuery, useQuery } from "react-query";
import {
  PostWithAuthorAndLikes,
  PostWithAuthorLikesAndReplies,
} from "../types";
import {
  API_POSTS,
  INFINITE_POSTS_QUERY,
  INFINITE_USER_POSTS_QUERY,
} from "./constants";

export const useGetPostQuery = (id: string) => {
  return useQuery<PostWithAuthorLikesAndReplies>(["post", id], async () => {
    const res = await fetch(`${API_POSTS}/${id}`);
    return res.json();
  });
};

const fetchPosts = async (
  { pageParam }: { pageParam?: number },
  userId?: string
) => {
  let params = new URLSearchParams();
  if (pageParam) {
    params.append("cursor", pageParam.toString(10));
  }
  if (userId) {
    params.append("user", userId);
  }

  let res: Response;
  if (!params.toString()) {
    res = await fetch(`${API_POSTS}`);
  } else {
    res = await fetch(`${API_POSTS}?${params.toString()}`);
  }
  return res.json();
};

export const useGetPostsInfiniteQuery = (userId?: string) => {
  return useInfiniteQuery<PostWithAuthorAndLikes[]>(
    userId ? [INFINITE_USER_POSTS_QUERY, userId] : INFINITE_POSTS_QUERY,
    (params) => fetchPosts(params, userId),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage && lastPage.length === 0) {
          return undefined;
        }
        return lastPage[lastPage.length - 1].id;
      },
    }
  );
};
