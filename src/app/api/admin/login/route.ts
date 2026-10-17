import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_PASSWORD,
  ADMIN_AUTH_COOKIE_NAME,
  generateAdminToken,
} from "@/lib/proposals";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Password atau Kode PIN akses salah." },
        { status: 401 }
      );
    }

    const token = generateAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Autentikasi admin berhasil. Selamat datang kembali!",
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error admin login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
