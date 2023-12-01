import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("breeze_csrf");
  const searchParams = req.nextUrl.searchParams;

  const refreshToken = searchParams.get("cookie");

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if (!cookie?.value) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.rewrite(
    new URL(`/dashboard?cookie=${refreshToken}`, req.url)
  );
}

export const config = {
  matcher: ["/dashboard"],
};
