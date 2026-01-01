import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await params;
        const products = await fetch(`${api}/products/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        );
        const data = await products.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await params;
        const body = await request.formData();
        const products = await fetch(`${api}/products/${id}`, {
            method: "PUT",
            headers: {
                // "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: body
        }
        );
        if(products.status === 200){
            return NextResponse.json({message: "Product updated successfully"}, {status: 200})
        }else{
            return NextResponse.json({message: "Error updating product"}, {status: 500})
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 })
    }
}