import { Like, Post, User } from "@prisma/client";

export type PostWithAuthorAndLikes = Post & { author: User } & {
  likes: Like[];
};

export type PostWithAuthorLikesAndReplies = PostWithAuthorAndLikes & {
  repliedBy: PostWithAuthorAndLikes[];
};

export type Timeout = ReturnType<typeof setTimeout>;
