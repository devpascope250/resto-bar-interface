import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;

// POST, PUT, DELETE

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await params;
        const discount = await fetch(`${api}/products/discount/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        const data = await discount.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 }
        )
    }
}