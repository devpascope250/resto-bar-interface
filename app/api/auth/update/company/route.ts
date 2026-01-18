import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function PUT(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const ebm_token = request.headers.get("x-ebmToken-id");
    try {
        const role = request.headers.get("x-user-role");
        const partnerId = request.headers.get("x-partner-id");
        if (!role || role !== "PARTNER_ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        if (!partnerId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const partner = await prisma.partner.findUnique({
            where: {
                id: partnerId
            }
        })

        if (!partner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const data = await request.json();
        //products/migrate-items/txType
        //check tax

        if (partner.taxStatus === "ENABLED" && data.taxStatus === "DISABLED") {
            return NextResponse.json({ message: "Can not Return to Non VAT after Migrate VAT" }, { status: 400 });
        }

        if (partner.taxStatus === "DISABLED" && data.taxStatus === "ENABLED") {
            const migrate = await fetch(`${api}/products/migrate-items/txType/confirm`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "EbmToken": `Bearer ${ebm_token}`
                    }
                }
            );
            if (!migrate.ok) {
                return NextResponse.json({ message: "There is An Error While Migrating From Non VAT to VAT" }, { status: 400 });
            }
            await prisma.partner.update({
                where: {
                    id: partnerId,
                },
                data: {
                    ...data,
                    isTaxTypeMigrated: true,
                }
            });
        } else {

            await prisma.partner.update({
                where: {
                    id: partnerId
                },
                data: {
                    ...data,
                }
            });
        }
        return NextResponse.json({ message: (partner.taxStatus === "DISABLED" && data.taxStatus === "ENABLED") ? "You Have migrated from Non VAT to VAT well!" : "Updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }

}



export async function GET(request: NextRequest) {
    try {
        const role = request.headers.get("x-user-role");
        const partnerId = request.headers.get("x-partner-id");
        if (!role || role !== "PARTNER_ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        if (!partnerId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const partner = await prisma.partner.findUnique({
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
        if (!partner) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        return NextResponse.json(partner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}




