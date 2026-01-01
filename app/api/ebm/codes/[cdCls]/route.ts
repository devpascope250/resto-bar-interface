import { EbmDataRequest } from "@/lib/EbmDataRequest";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ cdCls: string }>}) {
    const token = req.cookies.get("access_token")?.value;
    const ebmToken = req.headers.get("x-ebmToken-id");
    if(!token || !ebmToken){
        return NextResponse.json({error: "No token found"}, {status: 401});
    }
    try{
    const ebmDatarequest = new EbmDataRequest(token, ebmToken);
    const { cdCls } = await params;
    const data = await ebmDatarequest.getCodesByType(cdCls);
    return NextResponse.json(data);
    }catch(error){
        return NextResponse.json({error: error ?? "Internal Server Error"}, {status: 500});
    }
    
}