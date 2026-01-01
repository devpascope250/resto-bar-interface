import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function POST(req: NextRequest) {
    const body = await req.json();
    const token = req.cookies.get("access_token")?.value;
    const ebm_token = req.headers.get("x-ebmToken-id");
    try {
        const res = await fetch(`${api}/products/stock-in/many`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "EbmToken": `Bearer ${ebm_token}`
            },
            body: JSON.stringify(body)
        });
        if (res.status === 200) {
            return NextResponse.json({ message: "Stock in successful" }, {
                status: 200
            }
            );
        } else {
            console.log(res);
            
            return NextResponse.json({ message: "Stock in failed" }, {
                status: 500
            }
            );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, {
            status: 500
        });
    }
}