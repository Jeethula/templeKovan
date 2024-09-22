import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Auth } from "firebase/auth";
import { stat } from "fs";


export async function GET(req: NextApiRequest, res: NextApiResponse) {

try{

    const user = {
        name: "John Doe",
        email: "  "  
    }
    return NextResponse.json({ user,status:200 });

}catch(e){
    return NextResponse.json({ error: "error in user",status:404 });
}
}