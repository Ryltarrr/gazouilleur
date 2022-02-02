import { Post } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { message: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: "Bad request" });
  }

  const reply: Post = { ...JSON.parse(req.body), authorId: session.user.id };
  const savedPost = await prisma.post.update({
    where: { id },
    data: { repliedBy: { create: [reply] } },
  });
  res.status(200).json(savedPost);
}
