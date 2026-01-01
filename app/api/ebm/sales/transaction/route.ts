import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function POST(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const ebmToken = req.headers.get("x-ebmToken-id");
    const partnerId = req.headers.get("x-partner-id");
    const is_existed_order = req.nextUrl.searchParams.get("is_existed_order");
    const body = await req.json();
    if (!token || !ebmToken) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    if (!partnerId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    try {
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
        const receiptData = {
            address: partner?.address,
            topMsg: `${partner?.companyName}\n ${partner?.address}\n Email: ${partner?.contactEmail}`,
            btmMsg: partner?.bottomMsg,
            trdeNm: partner?.companyName,
        };

        const data = await fetch(`${api}/sales/create-sale-transaction${is_existed_order ? '?is_existed_order=true' : ''}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "EbmToken": `Bearer ${ebmToken}`,
                    "MRC-code": partner?.mrcCode || "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...body, ...receiptData })
            }
        );
        const result = await data.json();
        console.log(result);

        if (data.status !== 200) {
            return NextResponse.json({ message: result?.message ?? result?.error?.resultMsg ?? result?.resultMsg ?? "Internal Server Errors" }, { status: 500 });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error ?? "Internal Server Error" }, { status: 500 });
    }

}
