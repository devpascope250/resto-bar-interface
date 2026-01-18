import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;

export async function PUT(request: NextRequest) {
    const data = await request.json();
     const token = request.cookies.get("access_token")?.value;
    const ebm_token = request.headers.get("x-ebmToken-id");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    try {
        const update = await fetch(`${api}/products/update/migrated-item/confirm`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "EbmToken": `Bearer ${ebm_token}`
                },
                body: JSON.stringify(data) 
            }
        );
        if(!update.ok){
            console.log(await update.json());
            
            return NextResponse.json({message: 'There is an erroor while Updating tax type'}, {status: 400});
        }
        return NextResponse.json({message: "SuccessFull Updated!"}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}