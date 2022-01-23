import { Like, Post, User } from "@prisma/client";

export type PostWithUserAndLikes = Post & { author: User } & { likes: Like[] };
