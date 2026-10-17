import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  INITIAL_CANDIDATES,
  DEMO_WALLET_PROFILES,
  INITIAL_AUDIT_EVENTS,
  MedVoteCandidate,
  DoctorWalletProfile,
  OnChainAuditEvent,
} from "@/data/medvoteContract";

interface MedVoteLedgerState {
  candidates: MedVoteCandidate[];
  walletProfiles: DoctorWalletProfile[];
  auditEvents: OnChainAuditEvent[];
  isElectionActive: boolean;
  lastUpdated: string;
}

const LEDGER_FILE_PATH = path.join(process.cwd(), ".medvote-ledger.json");

function getInitialLedger(): MedVoteLedgerState {
  return {
    candidates: INITIAL_CANDIDATES,
    walletProfiles: DEMO_WALLET_PROFILES,
    auditEvents: INITIAL_AUDIT_EVENTS,
    isElectionActive: true,
    lastUpdated: new Date().toISOString(),
  };
}

function readLedger(): MedVoteLedgerState {
  try {
    if (fs.existsSync(LEDGER_FILE_PATH)) {
      const raw = fs.readFileSync(LEDGER_FILE_PATH, "utf-8");
      return JSON.parse(raw) as MedVoteLedgerState;
    }
  } catch {
    // Fallback to initial state if file system is read-only (e.g. serverless)
  }
  return getInitialLedger();
}

function writeLedger(state: MedVoteLedgerState) {
  try {
    fs.writeFileSync(LEDGER_FILE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    // Ignore write error on read-only serverless fs
  }
}

export async function GET() {
  const state = readLedger();
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<MedVoteLedgerState> & {
      action?: string;
    };

    if (body.action === "reset") {
      const fresh = getInitialLedger();
      writeLedger(fresh);
      return NextResponse.json(fresh);
    }

    const current = readLedger();
    const updated: MedVoteLedgerState = {
      candidates: body.candidates ?? current.candidates,
      walletProfiles: body.walletProfiles ?? current.walletProfiles,
      auditEvents: body.auditEvents ?? current.auditEvents,
      isElectionActive:
        typeof body.isElectionActive === "boolean"
          ? body.isElectionActive
          : current.isElectionActive,
      lastUpdated: new Date().toISOString(),
    };

    writeLedger(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid ledger payload" }, { status: 400 });
  }
}
