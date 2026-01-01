import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;

export async function GET(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");
    try {
        const response = await fetch(`${api}/orders${start&&end ? `?start=${start}&&end=${end}` : ''}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.status === 200 || response.status === 201) {
            for (const order of data) {
                order.distributor = await getUser(order.distributor);
            }
            return NextResponse.json(data, { status: 200 });
        }else{
             return NextResponse.json({ message:  data.message ?? "Error fetching orders"}, { status: 500 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const body = await req.json();
    // get orderId from searchQuery
    const orderId = req.nextUrl.searchParams.get("orderId");
    try {
        const response = await fetch(`${api}/orders${orderId ? `?orderId=${orderId}` : ''}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        console.log(data);
        
        if(response.status === 200 || response.status === 201){
            const message = data.message;
            return NextResponse.json({message: message ?? "successful Confirmed!", orderId: data.data?.id ?? -1}, { status: 200 });
        }else{
            return NextResponse.json({message:  data.message ?? 'Internal server error'}, { status: 500 });
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}

// delete order
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = req.cookies.get("access_token")?.value;
    const { id } = await params;
    try {
        const response = await fetch(`${api}/orders/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error deleting order" }, { status: 500 });
    }
}

// confirmOrder
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = req.cookies.get("access_token")?.value;
    const { id } = await params;
    try {
        const response = await fetch(`${api}/orders/confirm/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if(response.status === 200){
            return NextResponse.json(data, { status: 200 });
        }else{
            return NextResponse.json({ message: data.message ?? "Error confirming order" }, { status: 500 });
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error confirming order" }, { status: 500 });
    }
}


async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      firstName: true,
      lastName: true,
    },
  });
// return string name
  return `${user?.firstName} ${user?.lastName}`
}