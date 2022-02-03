import { Post } from "@prisma/client";
import { API_POSTS } from "../constants";

export async function deletePost(id: string) {
  const response = await fetch(`${API_POSTS}/delete/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function toggleLike(postId: string) {
  const response = await fetch(`${API_POSTS}/like/${postId}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function addToPost(postId: string, reply: Partial<Post>) {
  const response = await fetch(`${API_POSTS}/reply/${postId}`, {
    method: "POST",
    body: JSON.stringify(reply),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function savePost(post: Partial<Post>) {
  const response = await fetch(`${API_POSTS}/create`, {
    method: "POST",
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
