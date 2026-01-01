import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken, setTokenCookieApp, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { email, password } = data;

        const login = await prisma.user.findUnique(
            {
                where: {
                    email: email
                },
                include: {
                    partner: {
                        select: {
                            partnerType: true
                        }
                    }
                }
            }
        );

        if (!login) {
            return NextResponse.json(
                {
                    message: 'The Email Is not Registered in system'
                }, {
                status: 404
            }
            )
        }

        const verifyPass = await verifyPassword(password, login.password);
        if (!verifyPass) {
            return NextResponse.json(
                {
                    message: 'The password is Inccorect Try correct one!'
                }, {
                status: 401
            }
            )
        }
        if (!login.isVerified) {
            return NextResponse.json({
                message: 'Your Account is not verified'
            }, {
                status: 401
            });
        }

        const token = await generateToken({ id: login.id, role: login.role, partnerId: login.partnerId ?? '' });
        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: login.id,
                    role: login.role,
                    name: login.firstName,
                    lastName: login.lastName,
                    email: login.email,
                    partnerType: login.partner?.partnerType
                }
            },
            { status: 200 }
        );

        setTokenCookieApp(response, token);
        return response;
    } catch (err) {
        return NextResponse.json(
            {
                message: err
            },
            {
                status: 500
            }
        )
    }
}