import { NextApiRequest, NextApiResponse } from "next";
import { getPost } from "../../../lib/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ message: "Bad request" });
    }

    const post = await getPost(id);
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
  }
}
