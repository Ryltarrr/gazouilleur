import { PAGE_SIZE } from "../constants";
import prisma from "../prisma";

export const getPostsWithAuthorsAndLikes = (cursor: string | undefined) => {
  return prisma.post.findMany({
    take: PAGE_SIZE,
    skip: cursor ? 1 : 0,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    include: { author: true, likes: true },
    where: { postRepliedId: null },
    orderBy: { createdAt: "desc" },
  });
};

export const getPost = (id: string) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      likes: true,
      repliedBy: {
        include: {
          author: true,
          likes: true,
        },
      },
    },
  });
};
