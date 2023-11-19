import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("breeze_csrf");
  if (cookie?.name !== "breeze_csrf") {
    return NextResponse.redirect("/");
  }
  return NextResponse.rewrite(
    new URL(`/dashboard?cookie=${cookie?.value}`, req.url)
  );
}

export const config = {
  matcher: ["/dashboard"],
};
