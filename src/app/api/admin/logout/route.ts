import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE_NAME } from "@/lib/proposals";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout admin berhasil.",
  });

  response.cookies.set({
    name: ADMIN_AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
