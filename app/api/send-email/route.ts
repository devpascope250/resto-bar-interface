import { sendEmail } from "@/lib/email";
import { NextResponse, NextRequest } from "next/server";
import ejs from 'ejs'
import path from "path";
export async function GET(request: NextRequest) {
  // email for company that tell the to work with us using our services of web and mobile app form managing employee attendances and leave management
  const subject = "Invitation to work with us";
  const text = "We would like to invite you to work with us using our services of web and mobile app form managing employee attendances and leave management";

  const templatePath = path.join(process.cwd(), 'views', 'email.ejs');
  const html = await ejs.renderFile(templatePath);

  await sendEmail("lionelishimwe75@gmail.com", subject, text, html);
  return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
}
