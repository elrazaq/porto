import { NextRequest, NextResponse } from "next/server";
import {
  updateProposalStatus,
  deleteProposal,
  ADMIN_AUTH_COOKIE_NAME,
  isValidAdminToken,
} from "@/lib/proposals";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const cookie = req.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value;
    if (!isValidAdminToken(cookie)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["unread", "replied", "archived"].includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const updated = updateProposalStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Proposal tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, proposal: updated });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const cookie = req.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value;
    if (!isValidAdminToken(cookie)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = deleteProposal(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Proposal tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Proposal berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
