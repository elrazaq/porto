import fs from "fs";
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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "proposals.json");

// Ensure data folder and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export function getAllProposals(): Proposal[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [];
  } catch (err) {
    console.error("Error reading proposals.json:", err);
    return [];
  }
}

export function saveProposal(
  input: Omit<Proposal, "id" | "createdAt" | "status">
): Proposal {
  ensureDataFile();
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
  fs.writeFileSync(DATA_FILE, JSON.stringify(proposals, null, 2), "utf8");
  return newProposal;
}

export function updateProposalStatus(
  id: string,
  status: "unread" | "replied" | "archived"
): Proposal | null {
  ensureDataFile();
  const proposals = getAllProposals();
  const index = proposals.findIndex((p) => p.id === id);
  if (index === -1) return null;

  proposals[index].status = status;
  fs.writeFileSync(DATA_FILE, JSON.stringify(proposals, null, 2), "utf8");
  return proposals[index];
}

export function deleteProposal(id: string): boolean {
  ensureDataFile();
  const proposals = getAllProposals();
  const filtered = proposals.filter((p) => p.id !== id);
  if (filtered.length === proposals.length) return false;

  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf8");
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
