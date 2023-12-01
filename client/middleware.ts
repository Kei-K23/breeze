import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("breeze_csrf");
  const searchParams = req.nextUrl.searchParams;

  const refreshToken = searchParams.get("cookie");

  if (!refreshToken) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const isCookieExist = cookies().has("breeze_csrf") ? 1 : 0;

  return NextResponse.rewrite(
    new URL(
      `/dashboard?cookie=${
        refreshToken ?? cookie?.value
      }&isCookieExist=${isCookieExist}`,
      req.url
    )
  );
}

export const config = {
  matcher: ["/dashboard"],
};
