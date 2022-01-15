import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | string>
) {
  if (req.method !== "POST") {
    return res.status(405).json("Method not allowed");
  }
  const newPost = JSON.parse(req.body);
  const savedPost = await prisma.post.create({ data: newPost });
  res.status(200).json(savedPost);
}
