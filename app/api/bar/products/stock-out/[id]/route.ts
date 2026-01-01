import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function PUT(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const token = req.cookies.get("access_token")?.value;
    const { id } = await params;
    const { quantity, reason} = await req.json();
    try{
        const res = await fetch(`${api}/products/stock-out/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                quantity,
                reason
            })
        })
        if(res.status === 200) {
            return NextResponse.json({
                message: "Stock out successfully"
            }, {
                status: 200
            })
        }else{
            return NextResponse.json({
                message: "Stock out failed"
            }, {
                status: 500
            }
            )
        }
    }catch(error) {
        return NextResponse.json(error, {
            status: 500
        });
    }
}