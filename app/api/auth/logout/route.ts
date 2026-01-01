import { clearAuthCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const response = NextResponse.json(
        {
            message: "Successfully logged out"
        },
        {
            status: 200
        }
    );
    clearAuthCookies(response);
    return response; 
}