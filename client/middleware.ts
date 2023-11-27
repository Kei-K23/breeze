import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
const NEXT_ROOT_URL = process.env.NEXT_ROOT_URL;

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("breeze_csrf");
  if (!cookie?.value) {
    return NextResponse.redirect(NEXT_ROOT_URL as string);
  }

  try {
    return NextResponse.rewrite(
      new URL(`${NEXT_ROOT_URL}/dashboard?cookie=${cookie?.value}`, req.url)
    );
  } catch (e: any) {
    return NextResponse.redirect(NEXT_ROOT_URL as string);
  }
}

export const config = {
  matcher: [`${NEXT_ROOT_URL}/dashboard`],
};
