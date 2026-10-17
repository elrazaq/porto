import { NextRequest, NextResponse } from "next/server";
import {
  getAllProposals,
  saveProposal,
  ADMIN_AUTH_COOKIE_NAME,
  isValidAdminToken,
} from "@/lib/proposals";

// POST /api/proposals - Submit new project proposal from Hire Me Form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, title, category, budget, description } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Full name or organization name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Project title is required." },
        { status: 400 }
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "Project description must be at least 10 characters." },
        { status: 400 }
      );
    }

    const newProposal = saveProposal({
      name,
      email,
      phone,
      title,
      category: category || "Full Stack Web",
      budget,
      description,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project proposal submitted successfully. Thank you!",
        proposal: newProposal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Internal server error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/proposals - Protected by Admin Authentication
export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value;
    const headerKey = req.headers.get("x-admin-key");

    const isAuthorized =
      isValidAdminToken(cookie) || (headerKey && isValidAdminToken(headerKey));

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Akses ditolak. Halaman ini khusus untuk pemilik (Admin)." },
        { status: 401 }
      );
    }

    const proposals = getAllProposals();
    return NextResponse.json({ success: true, proposals });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengajuan proyek." },
      { status: 500 }
    );
  }
}
