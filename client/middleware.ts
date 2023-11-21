import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("breeze_csrf");

  return NextResponse.rewrite(
    new URL(`http://localhost:3000/dashboard?cookie=${cookie?.value}`, req.url)
  );
}

export const config = {
  matcher: ["/dashboard"],
};
