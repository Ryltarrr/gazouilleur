import { NextApiRequest, NextApiResponse } from "next";
import { getPostsWithAuthorsAndLikes } from "../../../lib/queries";
import { PostWithAuthorAndLikes } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let { cursor, user } = req.query;
    if (typeof cursor === "object") {
      cursor = cursor[0];
    }
    if (typeof user === "object") {
      user = user[0];
    }
    const posts: PostWithAuthorAndLikes[] = await getPostsWithAuthorsAndLikes(
      cursor,
      user
    );
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }
}
