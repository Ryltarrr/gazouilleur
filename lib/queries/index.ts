import { PAGE_SIZE } from "../constants";
import prisma from "../prisma";

export const getPostsWithAuthorsAndLikes = (
  cursor?: string,
  userId?: string
) => {
  return prisma.post.findMany({
    take: PAGE_SIZE,
    skip: cursor ? 1 : 0,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    include: { author: true, likes: true },
    where: { postRepliedId: null, authorId: userId },
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

export const getUserProfile = (userId: string) => {
  return prisma.user.findUnique({
    select: { id: true, image: true, name: true },
    where: { id: userId },
  });
};
