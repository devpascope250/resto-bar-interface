import { EbmDataRequest } from "@/lib/EbmDataRequest";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ cdClsNm: string }> }) {
    const token = req.cookies.get("access_token")?.value;
    const ebmToken = req.headers.get("x-ebmToken-id");
    if (!token || !ebmToken) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    try {
        const ebmDatarequest = new EbmDataRequest(token, ebmToken);
        const { cdClsNm } = await params;
        const query = req.nextUrl.searchParams.get('query');
        const data = await ebmDatarequest.getALLCodesByCdClsNm(cdClsNm, query ?? "");
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error ?? "Internal Server Error" }, { status: 500 });
    }

}


