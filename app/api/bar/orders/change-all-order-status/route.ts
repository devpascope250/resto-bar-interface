import { NextResponse, NextRequest } from "next/server";
import { Role } from "@prisma/client";
const api = process.env.BAR_BACKEND_URL;

export async function POST(request: NextRequest) {
    try{
    const token = request.cookies.get("access_token")?.value;
    const { orderId } = await request.json();
    const role = request.headers.get("x-user-role");
    if ((role as Role) !== "MANAGER") {
        return NextResponse.json({ message: "You are not authorized to perform this action" }, { status: 401 });
    }

    const response = await fetch(`${api}/orders/change-all-order-status`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            orderId
        })
    });
    const data = await response.json();
    if (response.status === 200) {
        return NextResponse.json(data, { status: 200 });
    } else {
        return NextResponse.json({ message: data.message ?? "Error confirming order" }, { status: 500 });
    }
}catch(err){
    return NextResponse.json({ message: "Error confirming order" }, { status: 500 });
}
}
