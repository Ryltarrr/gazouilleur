import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const posts = await prisma.post.findMany({
      include: { User: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }
}
