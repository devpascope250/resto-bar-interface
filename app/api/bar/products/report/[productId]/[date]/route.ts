import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;

export async function GET(req: NextRequest, { params }: {params:Promise<{productId: string, date: string}>}) {
    const token = req.cookies.get("access_token")?.value;
    const { productId, date } = await params;
    try {
        const response = await fetch(`${api}/orders/${productId}/${date}`, {
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