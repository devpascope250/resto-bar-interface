import { NextResponse, NextRequest } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function GET(request: NextRequest) {
    const start_date = request.nextUrl.searchParams.get("start_date");
    const end_date = request.nextUrl.searchParams.get("end_date");
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
        return NextResponse.json({
            message: "Token not found"
        }, { status: 404 });
    }
    try {
        const response = await fetch(`${api}/products/report${(start_date && end_date)?`?start_date=${start_date}&end_date=${end_date}` : ''}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            const data = await response.json();
            return NextResponse.json(data, { status: 200 });
        } else {
            return NextResponse.json({
                message: "Error"
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            message: "Error"
        }, { status: 500 });
    }

}