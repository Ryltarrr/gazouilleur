import { NextApiRequest, NextApiResponse } from "next";
import getPostsWithUsersAndLikes from "../../../lib/getPostsAndUsers";
import { PostWithUserAndLikes } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let cursor = req.query.cursor;
    if (typeof cursor === "object") {
      cursor = cursor[0];
    }
    const posts: PostWithUserAndLikes[] = await getPostsWithUsersAndLikes(cursor);
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }
}
