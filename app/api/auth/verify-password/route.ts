import { verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    if (!userId) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (!userRole) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    try {
        const getPass = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                password: true
            }
        });
        if (!getPass) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        const verify = await verifyPassword(data.password, getPass?.password);
        if (!verify) {
            return NextResponse.json({ message: "Password is incorrect" }, { status: 401 })
        }
        return NextResponse.json({ message: "Password is correct" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}