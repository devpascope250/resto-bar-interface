import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function PUT(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if(!userId){
        return NextResponse.json({message: "unauthorized access!"}, {status: 401})
    }
    try{

    const data = await request.json();
    const currentPass = await prisma.user.findUnique(
        {
            where: {
                id: userId
            },
            select: {
                password: true
            }
        }
    );
    if(!currentPass){
        return NextResponse.json({message: "There is no current password found!"}, {status: 400})
    }
    if(data.newPassword !== data.confirmPassword){
        return NextResponse.json({message: 'Password is not matching'}, {status: 400});
    }
    if(!await verifyPassword(data.currentPassword, currentPass?.password)){
        return NextResponse.json({message: "The current Password provided is Incorrect! "}, {status: 400});
    }

    const password = await hashPassword(data.newPassword);
    await prisma.user.update(
        {
            where: {
                id: userId
            },
            data: {
                password: password
            }
        }
    );

    return NextResponse.json({message: "Passwords updated successFull"}, {status: 200});
}catch(err){
    return NextResponse.json({message: "internal server error"}, {status: 500});
}
    
}