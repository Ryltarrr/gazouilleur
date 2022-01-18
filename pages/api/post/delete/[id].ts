import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { message: string }>
) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ message: "Bad request" });
    }

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await prisma.post.deleteMany({
      where: { id, authorId: session.user.id },
    });
    if (deleted.count === 0) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ message: "Successfully deleted post" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
