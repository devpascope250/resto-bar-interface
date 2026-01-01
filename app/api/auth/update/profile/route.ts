import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if(!userId){
        return NextResponse.json({message: "unauthorized access!"}, {status: 401})
    }
    try{

    const data = await request.json();
    const existedEmail = await prisma.user.findFirst(
        {
            where: {
                email: data.email
            }
        }
    );

    if(existedEmail?.id !== userId){
        return NextResponse.json({message: "The email is Alreay Exist"}, {status: 400});
    }
    await prisma.user.update(
        {
            where: {
                id: userId
            },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            }
        }
    );

    return NextResponse.json({message: "successFull Updated"}, {status: 200});
}catch(err){
    return NextResponse.json({message: "internal server error"}, {status: 500});
}
    
}