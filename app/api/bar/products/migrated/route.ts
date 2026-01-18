import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function GET(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const ebm_token = request.headers.get("x-ebmToken-id");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        const products = await fetch(`${api}/products/migrated`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "EbmToken": `Bearer ${ebm_token}`
                }
            }
        );

        const data = await products.json();

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}



export async function PUT(request: NextRequest) {
     const token = request.cookies.get("access_token")?.value;
    const ebm_token = request.headers.get("x-ebmToken-id");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        const products = await fetch(`${api}/products/migrated`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "EbmToken": `Bearer ${ebm_token}`
                }
            }
        );

        const data = await products.json();

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}