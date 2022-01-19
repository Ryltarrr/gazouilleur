import { NextApiRequest, NextApiResponse } from "next";
import getPostsWithUsers from "../../../lib/getPostsAndUsers";
import { PostWithUser } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let cursor = req.query.cursor;
    if (typeof cursor === "object") {
      cursor = cursor[0];
    }
    const posts: PostWithUser[] = await getPostsWithUsers(cursor);
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }
}
