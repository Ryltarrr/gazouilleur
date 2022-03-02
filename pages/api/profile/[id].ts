import { NextApiRequest, NextApiResponse } from "next";
import { getUserProfile } from "../../../lib/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.id as string;
    if (!userId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const post = await getUserProfile(userId);
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
  }
}
