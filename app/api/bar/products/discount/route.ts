import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;

// POST, PUT, DELETE
export async function POST(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
    };
    try {
        // get formData
        const body = await request.json();
        const discount = await fetch(`${api}/products/discount`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body)
            }
        );

        const data = await discount.json();
        // check status code
        if(discount.status === 200) {
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