import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: number, type: string }> }) {
    const token = req.cookies.get("access_token")?.value;
    const ebmToken = req.headers.get("x-ebmToken-id");
    const partnerId = req.headers.get("x-partner-id");
    const rfdRsnCd = req.nextUrl.searchParams.get("rfdRsnCd");
    const { orderId, type } = await params;
    if (!token || !ebmToken || !partnerId) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    try {
        const custData = await req.json();
        const partner = await prisma.partner.findUnique({
                    where: {
                        id: partnerId
                    },
                    select: {
                        companyName: true,
                        address: true,
                        topMsg: true,
                        bottomMsg: true,
                        contactEmail: true,
                        mrcCode: true
                    }
                });
                if (!partner) {
                    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
                }
        const data = await fetch(`${api}/sales/get-invoice`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "EbmToken": `Bearer ${ebmToken}`,
                    "MRC-code": partner?.mrcCode || "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ orderId, type, ...(rfdRsnCd ? { rfdRsnCd } : {}), custData })
            }
        )
        const result = await data.json();
        
        if (data.status !== 200) {
            return NextResponse.json({ message: result?.message ?? result?.resultMsg ?? "Internal Server Errors" }, { status: 500 });
        }
        
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ message: error ?? "Internal Server Error" }, { status: 500 });
    }

}