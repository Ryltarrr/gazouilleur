import { PAGE_SIZE } from "./constants";
import prisma from "./prisma";

const getPostsWithUsersAndLikes = (cursor: string | undefined) => {
  return prisma.post.findMany({
    take: PAGE_SIZE,
    skip: cursor ? 1 : 0,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    include: { author: true, likes: true },
    orderBy: { createdAt: "desc" },
  });
};

export default getPostsWithUsersAndLikes;
