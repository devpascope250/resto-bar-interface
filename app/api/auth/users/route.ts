import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
export async function GET(request: NextRequest) {
    const userId = request.headers.get("x-user-id");
    const partnerId = request.headers.get("x-partner-id");
    if (!userId || !partnerId) return NextResponse.json({ message: "Missing user id or partner id" }, { status: 400 });
    // get all user from user except admin

    try {
        const users = await prisma.user.findMany({
            where: {
                partnerId: partnerId,
                NOT: {
                    role: "ADMIN"
                }
            }
        })
        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// create user
export async function POST(request: NextRequest) {
    const userId = request.headers.get("x-user-id");
    const partnerId = request.headers.get("x-partner-id");
    if (!userId || !partnerId) return NextResponse.json({ message: "Missing user id or partner id" }, { status: 401 });
    const data = await request.json();
    try {        // ckeck if user already exist
        const userexist = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        });
        if (userexist) return NextResponse.json({ message: "User already exist" }, { status: 400 });
               
        const hashedPass = await hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                password: hashedPass,
                partnerId: partnerId,
                role: data.role
            }
        })
        return NextResponse.json(user, {status: 201});
    } catch (err) {
        console.log(err);
        
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// update user
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const partnerId = request.headers.get("x-partner-id");
    if (!partnerId) return NextResponse.json({ message: "Missing user id or partner id" }, { status: 400 });
    const data = await request.json();
    try {
        // check if user exist not on this id
        const userexist = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if (!userexist) return NextResponse.json({ message: "User not found" }, { status: 400 });
        if (userexist.partnerId !== partnerId) return NextResponse.json({ message: "You are not authorized to update this user" }, {
            status: 400
        })
        // if email exist on user not on this id
        const useremailexist = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (useremailexist && useremailexist.id !== id) return NextResponse.json({ message: "Email already exist" }, { status: 400 });
        const savedata: Partial<User> = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            role: data.role
        }
        if (data.password) {
            savedata.password = await hashPassword(data.password);
        }
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: savedata
        })
        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}