import { Like, Post, User } from "@prisma/client";

export type PostWithUserAndLikes = Post & { author: User } & { likes: Like[] };

export type Timeout = ReturnType<typeof setTimeout>;
