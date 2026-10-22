import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";

export interface Proposal {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  category: string;
  budget?: string;
  description: string;
  createdAt: string;
  status: "unread" | "replied" | "archived";
}

declare global {
  // eslint-disable-next-line no-var
  var __ELRAZAQ_PROPOSALS_STORE__: Proposal[] | undefined;
}

function getMemoryStore(): Proposal[] {
  if (!globalThis.__ELRAZAQ_PROPOSALS_STORE__) {
    globalThis.__ELRAZAQ_PROPOSALS_STORE__ = [];
  }
  return globalThis.__ELRAZAQ_PROPOSALS_STORE__;
}

function resolveDataFilePath(): string | null {
  // Try project data/ directory first (works in local dev & VPS)
  const localDir = path.join(process.cwd(), "data");
  const localFile = path.join(localDir, "proposals.json");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    if (!fs.existsSync(localFile)) {
      fs.writeFileSync(localFile, JSON.stringify([], null, 2), "utf8");
    }
    fs.accessSync(localFile, fs.constants.W_OK);
    return localFile;
  } catch {
    // Fallback to os.tmpdir() for read-only serverless environments (Vercel / AWS Lambda)
    try {
      const tmpDir = path.join(os.tmpdir(), "elrazaq_portfolio_data");
      const tmpFile = path.join(tmpDir, "proposals.json");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      if (!fs.existsSync(tmpFile)) {
        const initialData = getMemoryStore();
        fs.writeFileSync(tmpFile, JSON.stringify(initialData, null, 2), "utf8");
      }
      return tmpFile;
    } catch {
      return null;
    }
  }
}

export function getAllProposals(): Proposal[] {
  const dataFile = resolveDataFilePath();
  if (dataFile) {
    try {
      const raw = fs.readFileSync(dataFile, "utf8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        globalThis.__ELRAZAQ_PROPOSALS_STORE__ = sorted;
        return sorted;
      }
    } catch (err) {
      console.error("Warning reading proposals file, using memory store:", err);
    }
  }
  return getMemoryStore().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function persistProposals(proposals: Proposal[]) {
  globalThis.__ELRAZAQ_PROPOSALS_STORE__ = proposals;
  const dataFile = resolveDataFilePath();
  if (dataFile) {
    try {
      fs.writeFileSync(dataFile, JSON.stringify(proposals, null, 2), "utf8");
    } catch (err) {
      console.error("Warning writing proposals file, kept in memory store:", err);
    }
  }
}

export function saveProposal(
  input: Omit<Proposal, "id" | "createdAt" | "status">
): Proposal {
  const proposals = getAllProposals();

  const newProposal: Proposal = {
    id: `prop_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    title: input.title.trim(),
    category: input.category || "Full Stack Web",
    budget: input.budget?.trim() || undefined,
    description: input.description.trim(),
    createdAt: new Date().toISOString(),
    status: "unread",
  };

  proposals.unshift(newProposal);
  persistProposals(proposals);
  return newProposal;
}

export function updateProposalStatus(
  id: string,
  status: "unread" | "replied" | "archived"
): Proposal | null {
  const proposals = getAllProposals();
  const index = proposals.findIndex((p) => p.id === id);
  if (index === -1) return null;

  proposals[index].status = status;
  persistProposals(proposals);
  return proposals[index];
}

export function deleteProposal(id: string): boolean {
  const proposals = getAllProposals();
  const filtered = proposals.filter((p) => p.id !== id);
  if (filtered.length === proposals.length) return false;

  persistProposals(filtered);
  return true;
}

// Master Admin Secret / Token validation
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "elrazaq2026";
export const ADMIN_AUTH_COOKIE_NAME = "elrazaq_admin_session";

export function generateAdminToken(): string {
  const secret = process.env.ADMIN_JWT_SECRET || "elrazaq-royal-vault-secret-key-2026";
  const dateStamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)); // Valid for ~7 days
  return crypto
    .createHmac("sha256", secret)
    .update(`admin_session_${dateStamp}`)
    .digest("hex");
}

export function isValidAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const currentToken = generateAdminToken();
  return token === currentToken;
}
