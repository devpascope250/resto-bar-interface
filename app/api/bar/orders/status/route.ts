import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function PUT(request: NextRequest) {
    try{
        const role = request.headers.get("x-user-role");
        // get token from cookies
        const token = request.cookies.get("access_token")?.value;
        if(!token){
            return NextResponse.json({message: "You are not authorized to access this service"}, {status: 401});
        }
        if(role !== "MANAGER" ){
            return NextResponse.json({message: "You are not authorized to access this service"}, {status: 401});
        }
        const data = await request.json();

        const response = await fetch(`${api}/orders/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
        );
        const res = await response.json();
        console.log(res);
        
        if(response.status === 200){
            return NextResponse.json({message: "Order status updated successfully"}, {status: 200});
        }
        else{
            return NextResponse.json({message: "Error updating order status"}, {status: 500});
        }
    }catch(error){
       
        
        return NextResponse.json({message: "Error updating order status"}, {status: 500});
    }
    
}