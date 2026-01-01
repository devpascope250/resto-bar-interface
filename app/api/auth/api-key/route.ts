import { verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    if (!userId) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (!userRole) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
    }
    try {
        const getApiKey = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                partner: {
                    select: {
                        apiKey: true
                    }
                }
            }
        });
        if (!getApiKey) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        return NextResponse.json({apiKey: getApiKey.partner?.apiKey} , { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}