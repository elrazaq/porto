import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE_NAME, isValidAdminToken } from "@/lib/proposals";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value;
  const isAuthorized = isValidAdminToken(cookie);

  return NextResponse.json({
    authenticated: isAuthorized,
  });
}
