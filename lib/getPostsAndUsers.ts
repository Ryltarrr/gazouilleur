import { PAGE_SIZE } from "./constants";
import prisma from "./prisma";

const getPostsWithUsers = (cursor: string | undefined) => {
  return prisma.post.findMany({
    take: PAGE_SIZE,
    skip: cursor ? 1 : 0,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    include: { User: true },
    orderBy: { createdAt: "desc" },
  });
};

export default getPostsWithUsers;
