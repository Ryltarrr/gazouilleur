import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { message: string }>
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const id = req.query.id as string;

  if (!id) {
    // TODO: return corresponding error
  }

  await prisma.post.delete({ where: { id } });
  res.status(200).json({ message: "Successfully deleted post" });
}
