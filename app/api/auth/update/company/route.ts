import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    try{
    const role = request.headers.get("x-user-role");
    const partnerId = request.headers.get("x-partner-id");
    if(!role || role !== "PARTNER_ADMIN") {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }
    if(!partnerId) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const partner =  await prisma.partner.findUnique({
        where: {
            id: partnerId
        }
    })

    if(!partner) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const data = await request.json();

    await prisma.partner.update({
        where: {
            id: partnerId
        },
        data: {
            ...data
        }
    });

    return NextResponse.json({message: "Updated successfully"},{status: 200});
}catch(error){
    return NextResponse.json({message: "Something went wrong"}, {status: 500})
}

}



export async function GET(request: NextRequest) {
    try{
        const role = request.headers.get("x-user-role");
        const partnerId = request.headers.get("x-partner-id");
        if(!role || role !== "PARTNER_ADMIN") {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        if(!partnerId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
    
        const partner =  await prisma.partner.findUnique({
            where: {
                id: partnerId
            },
            select: {
                companyName: true,
                contactEmail: true,
                contactPhone: true,
                id: true,
                logoUrl: true,
                status: true,
                partnerType: true,
                taxRate: true,
                taxStatus: true,
                tinNumber: true,
                createdAt: true,
                address: true,
                topMsg: true,
                bottomMsg: true,
                mrcCode: true
            }
        });
        if(!partner) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        return NextResponse.json(partner, {status: 200});
    }catch(error){
        return NextResponse.json({message: "Something went wrong"}, {status: 500})
    }
}




