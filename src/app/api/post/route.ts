import { NextRequest,NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const posts=await prisma.findMany({
        select:{
            id:true,
            title:true,
            content:true,
            liked_by:true,
            disliked_by:true,
            created_at:true,
        }
    })
}