import { EbmDataRequest } from "@/lib/EbmDataRequest";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const ebmToken = req.headers.get("x-ebmToken-id");
    if(!token || !ebmToken){
        return NextResponse.json({error: "No token found"}, {status: 401});
    }
    try{
    const ebmDatarequest = new EbmDataRequest(token, ebmToken);
    const data = await ebmDatarequest.getAllNotice();
    return NextResponse.json(data);
    }catch(error){
        return NextResponse.json({error: error ?? "Internal Server Error"}, {status: 500});
    }
    
}