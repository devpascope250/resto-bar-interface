import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function GET(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const ebm_token = request.headers.get("x-ebmToken-id");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        const products = await fetch(`${api}/products`,
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

// POST, PUT, DELETE
export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
     const ebm_token = request.headers.get("x-ebmToken-id");
    if (!token) {
        return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
    };
    try {
        // get formData
        const body = await request.formData();
        const products = await fetch(`${api}/products`,
            {
                method: "POST",
                headers: {
                    // "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                    "EbmToken": `Bearer ${ebm_token}`
                },
                body: body
            }
        );

        const data = await products.json();
        console.log(data);
        
        // check status code
        if(products.status === 200) {
            return NextResponse.json(data);
        }else{
            return NextResponse.json({ message: data.message}, { status: 400 })
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}