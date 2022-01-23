import { Post, User } from "@prisma/client";

export type PostWithUser = Post & { author: User };
