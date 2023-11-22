import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("breeze_csrf");
  if (!cookie?.value) {
    return NextResponse.redirect("http://localhost:3000/");
  }

  try {
    return NextResponse.rewrite(
      new URL(
        `http://localhost:3000/dashboard?cookie=${cookie?.value}`,
        req.url
      )
    );
  } catch (e: any) {
    console.log(e);

    return NextResponse.redirect("http://localhost:3000/");
  }
}

export const config = {
  matcher: ["/dashboard"],
};
