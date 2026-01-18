import { EbmDataRequest } from "@/lib/EbmDataRequest";
import { NextResponse, NextRequest } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function GET(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const ebmToken = req.headers.get("x-ebmToken-id");
    if(!token || !ebmToken){
        return NextResponse.json({error: "No token found"}, {status: 401});
    }
    const start_date = req.nextUrl.searchParams.get("start_date");
    const end_date = req.nextUrl.searchParams.get("end_date");
    try{
    const ebmDatarequest = new EbmDataRequest(token, ebmToken);
    const data = await ebmDatarequest.getAllPurchasedSalesTransactions(start_date ?? "", end_date ?? "");
    return NextResponse.json(data);
    }catch(error){
        return NextResponse.json({error: error ?? "Internal Server Error"}, {status: 500});
    }
    
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const ebmToken = req.headers.get("x-ebmToken-id");
    if (!token || !ebmToken) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    // /products/import/items
     const purchases = await req.json();
    
    try {
       
        const purchasesItems = await fetch(`${api}/products/save/purchases`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "EbmToken": `Bearer ${ebmToken}`
                },
                body: JSON.stringify(purchases)
            }
        );
       
        const data = await purchasesItems.json();
        console.log(data);
        
        if (purchasesItems.status !== 200) {
            return NextResponse.json({ message: data.message ?? data?.error?.resultMsg ?? data?.resultMsg  ?? data.message.message  }, { status: 500 });
        } else {
            return NextResponse.json({ message: data.message ?? data?.resultMsg }, { status: 200 });
        }
    } catch (error) {
        console.log("errorrrr",error);
        
        return NextResponse.json({ message: error ?? "Internal Server Error" }, { status: 500 });
    }
}