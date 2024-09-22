// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type Data = {
  name: string;
};

export async function GET(req: NextApiRequest, res: NextApiResponse) {
 
    return NextResponse.json({ name: "John Doe" });
}