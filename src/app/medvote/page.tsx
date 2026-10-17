import React from "react";
import { MedVoteApp } from "@/components/medvote/MedVoteApp";

export const metadata = {
  title: "MedVote DApp — Blockchain E-Voting Komite Medik RSUD | Abdul Razak",
  description:
    "Tamper-proof Web3 E-Voting Decentralized Application (DApp) for Hospital Medical Committee Chairman Election on Polygon Testnet.",
};

export default function MedVotePage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-50">
      <MedVoteApp deviceMode="desktop" />
    </div>
  );
}
