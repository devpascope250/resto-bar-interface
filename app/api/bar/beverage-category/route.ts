import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const api = process.env.BAR_BACKEND_URL;
export async function GET(request: NextRequest) {
    try{
    const categories = await fetch(`${api}/bvgcat`).then((res) => res.json());
    return NextResponse.json(categories);
    }catch(error){
        console.log(error);
        return NextResponse.json({error: error});
    } 
}