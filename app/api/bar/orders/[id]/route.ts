import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const token = request.cookies.get("access_token")?.value;
    const orderDetail = request.nextUrl.searchParams.get("orderDetail");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const response = await fetch(`${api}/orders/${id}${orderDetail ? `?orderDetail=${orderDetail}` : ''}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    if (response.status === 401) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    if (response.status === 404) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 })
    }
    const data = await response.json();
    if (response.status === 200 || response.status === 201) {
      data.distributor = await getUser(data.distributor);
      return NextResponse.json(data, { status: 200 });
    }
  } catch (e) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
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