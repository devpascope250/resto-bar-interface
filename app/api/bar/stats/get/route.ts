import { NextResponse, NextRequest } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function GET(request: NextRequest) {
    const role = request.headers.get('x-user-role');
    const token = request.cookies.get('access_token')?.value;
    const start = request.nextUrl.searchParams.get('start');
    const end = request.nextUrl.searchParams.get('end');

    if(!role || !token){
        return NextResponse.json({message: 'Un Authorized'}, {status: 401});
    }
    try{
        const response = await fetch(`${api}/orders/stats/get${start&&end?`?start=${start}&end=${end}`: ''}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        if(response.status === 200){
            
            return NextResponse.json(data, {status: 200})
        }else{
            return NextResponse.json({message: data.message ?? 'Internal Server'}, {status: 500});
        }
    }catch(error){
        return NextResponse.json({message: 'Internal Server'}, {status: 500});
    }
}