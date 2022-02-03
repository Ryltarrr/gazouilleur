import { NextApiRequest, NextApiResponse } from "next";
import { getPostsWithAuthorsAndLikes } from "../../../lib/queries";
import { PostWithAuthorAndLikes } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let cursor = req.query.cursor;
    if (typeof cursor === "object") {
      cursor = cursor[0];
    }
    const posts: PostWithAuthorAndLikes[] = await getPostsWithAuthorsAndLikes(
      cursor
    );
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }
}
