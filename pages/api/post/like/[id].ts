import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { message: string }>
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const postId = req.query.id as string;
    if (!postId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });
    if (existingLike) {
      const deleted = await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      if (!deleted) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.status(200).json({ message: "Successfully deleted like" });
    } else {
      const created = await prisma.like.create({
        data: { postId, userId },
      });
      if (!created) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.status(200).json({ message: "Successfully added like" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
