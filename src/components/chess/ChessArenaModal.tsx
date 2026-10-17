"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Chess, Square, Move } from "chess.js";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { RenderPiece } from "./ChessPieces";
import { ChessBotAI, CHESS_BOT_QUOTES } from "./ChessEngine";
import { playMoveSound, playCaptureSound, playCheckSound, playGameOverSound } from "./ChessAudio";
import { 
  X, 
  RotateCcw, 
  Flag, 
  Volume2, 
  VolumeX, 
  ArrowLeftRight, 
  Trophy, 
  Swords, 
  Bot, 
  User, 
  Sparkles,
  Camera,
  Check,
  Tag,
  Percent,
  ExternalLink,
  Gift
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

interface ChessArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

export function ChessArenaModal({ isOpen, onClose }: ChessArenaModalProps) {
  const [chess] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [botQuote, setBotQuote] = useState<string>(
    "Welcome. Test your strategic vision and tactical execution against my chess bot."
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [evalScore, setEvalScore] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [isPlayerVictorious, setIsPlayerVictorious] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);

  // Clocks: 10 minutes each (Rapid)
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);

  const botRef = useRef<ChessBotAI>(new ChessBotAI("b"));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Audio helper with sound check
  const playSound = useCallback(
    (type: "move" | "capture" | "check" | "gameover") => {
      if (!soundEnabled) return;
      if (type === "move") playMoveSound();
      else if (type === "capture") playCaptureSound();
      else if (type === "check") playCheckSound();
      else if (type === "gameover") playGameOverSound();
    },
    [soundEnabled]
  );

  // Trigger special victory celebration
  const triggerVictory = useCallback((message: string) => {
    setGameResult(message);
    setIsPlayerVictorious(true);
    playSound("gameover");
    setBotQuote("Luar biasa! Taktik Anda sangat tajam. Ambil screenshot papan kemenangan ini untuk klaim bonus diskon proyek Anda!");

    // Confetti fanfare
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 280);
  }, [playSound]);

  // Clock countdown timer
  useEffect(() => {
    if (!isOpen || gameResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (chess.turn() === "w") {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            if (playerColor === "b") {
              triggerVictory("Waktu bot habis! Anda memenangkan pertandingan!");
            } else {
              setGameResult("Waktu Anda habis. AI Bot memenangkan pertandingan.");
              setIsPlayerVictorious(false);
              playSound("gameover");
            }
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            if (playerColor === "w") {
              triggerVictory("Waktu bot habis! Anda memenangkan pertandingan!");
            } else {
              setGameResult("Waktu Anda habis. AI Bot memenangkan pertandingan.");
              setIsPlayerVictorious(false);
              playSound("gameover");
            }
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, gameResult, chess, playerColor, triggerVictory, playSound]);

  // Execute bot move
  const triggerBotMove = useCallback(() => {
    if (chess.isGameOver()) return;
    setIsBotThinking(true);

    setTimeout(() => {
      const { move, quote } = botRef.current.getBestMove(chess, 3);
      if (move) {
        const moveResult = chess.move(move);
        setFen(chess.fen());
        setLastMove({ from: move.from as Square, to: move.to as Square });
        setBotQuote(quote);

        if (chess.isCheckmate()) {
          setGameResult(`Skakmat! Bot catur memenangkan permainan.`);
          setIsPlayerVictorious(false);
          playSound("gameover");
        } else if (chess.isDraw()) {
          setGameResult("Pertandingan berakhir remis (Draw).");
          setIsPlayerVictorious(false);
          playSound("gameover");
        } else if (chess.isCheck()) {
          playSound("check");
        } else if (moveResult.captured) {
          playSound("capture");
        } else {
          playSound("move");
        }

        const score = botRef.current.evaluate(chess);
        setEvalScore(score);
      }
      setIsBotThinking(false);
    }, 350);
  }, [chess, playSound]);

  // Reset or start new game
  const handleNewGame = (color: "w" | "b" = playerColor) => {
    chess.reset();
    setFen(chess.fen());
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setGameResult(null);
    setIsPlayerVictorious(false);
    setScreenshotSuccess(false);
    setWhiteTime(600);
    setBlackTime(600);
    setEvalScore(0);
    setPlayerColor(color);
    botRef.current.setEngineColor(color === "w" ? "b" : "w");
    setBotQuote("New game. May the most accurate tactician win.");

    if (color === "b") {
      setTimeout(() => triggerBotMove(), 400);
    }
  };

  const handleResign = () => {
    if (gameResult) return;
    setGameResult(`${playerColor === "w" ? "Putih" : "Hitam"} menyerah (Resign). AI Bot menang.`);
    setIsPlayerVictorious(false);
    setBotQuote("A prudent resignation. Precise tactical play leaves no margin for error.");
    playSound("gameover");
  };

  const handleSquareClick = (square: Square) => {
    if (chess.isGameOver() || isBotThinking || gameResult) return;
    if (chess.turn() !== playerColor) return;

    // If already selected a square and clicking on a legal move destination
    if (selectedSquare) {
      const isLegal = legalMoves.some((m) => m.to === square);
      if (isLegal) {
        // Execute player move
        const moveResult = chess.move({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });

        if (moveResult) {
          setFen(chess.fen());
          setLastMove({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          setLegalMoves([]);

          // Sound trigger & win check
          if (chess.isCheckmate()) {
            triggerVictory("Skakmat! Anda berhasil menumbangkan bot catur saya!");
            return;
          } else if (chess.isDraw()) {
            setGameResult("Pertandingan berakhir remis (Draw).");
            setIsPlayerVictorious(false);
            playSound("gameover");
            return;
          } else if (chess.isCheck()) {
            playSound("check");
          } else if (moveResult.captured) {
            playSound("capture");
          } else {
            playSound("move");
          }

          const score = botRef.current.evaluate(chess);
          setEvalScore(score);

          // Bot's turn
          triggerBotMove();
          return;
        }
      }
    }

    // Select piece
    const piece = chess.get(square);
    if (piece && piece.color === playerColor) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // 1-Click Screen Capture function
  const handleTakeScreenshot = async () => {
    if (!modalContainerRef.current) return;
    setIsCapturing(true);

    try {
      const canvas = await html2canvas(modalContainerRef.current, {
        scale: 1.5,
        backgroundColor: "#1f1e1b",
        useCORS: true,
        logging: false,
      });

      // Automatically trigger image download
      const link = document.createElement("a");
      link.download = `bukti-kemenangan-catur-abdul-razak-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Attempt to copy image blob to clipboard
      canvas.toBlob((blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          try {
            navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob })
            ]);
          } catch {
            // Ignore clipboard write rejection
          }
        }
      });

      setScreenshotSuccess(true);
      setTimeout(() => setScreenshotSuccess(false), 5000);
    } catch (err) {
      console.error("Screenshot capture error:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!isOpen) return null;

  // Visual coordinates based on orientation
  const displayFiles = playerColor === "w" ? FILES : [...FILES].reverse();
  const displayRanks = playerColor === "w" ? RANKS : [...RANKS].reverse();

  // Captured pieces calculation
  const historyMoves = chess.history({ verbose: true });
  const capturedWhitePieces: string[] = [];
  const capturedBlackPieces: string[] = [];
  historyMoves.forEach((m) => {
    if (m.captured) {
      if (m.color === "w") capturedBlackPieces.push(m.captured);
      else capturedWhitePieces.push(m.captured);
    }
  });

  const clampedScore = Math.max(-1000, Math.min(1000, evalScore));
  const whiteBarPercent = Math.round(50 + (clampedScore / 1000) * 45);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // WhatsApp claim discount prefilled link
  const claimWhatsAppUrl = `https://wa.me/6282169441179?text=${encodeURIComponent(
    "Halo Mas Abdul Razak, saya baru saja berhasil mengalahkan bot catur di website portofolio Anda! Berikut bukti screenshot kemenangan saya. Saya ingin klaim bonus diskon untuk pengerjaan project saya."
  )}`;

  return (
    <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      {/* Main Tactical Arena Container (Target for screen capture) */}
      <div 
        ref={modalContainerRef}
        className="relative w-full max-w-6xl h-[92vh] max-h-[820px] bg-[#262522] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10 flex overflow-hidden"
      >
        
        {/* LEFT / BOARD REGION */}
        <div className="flex-1 flex flex-col justify-between p-6 bg-[#1f1e1b] relative">
          
          {/* TOP: BOT HEADER CARD */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/40 bg-[#302e2b] shadow-md flex items-center justify-center">
                <Image
                  src="/porto-nobg.png"
                  alt="Abdul Razak Bot"
                  width={48}
                  height={48}
                  className="object-cover scale-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm tracking-wide">
                    Abdul Razak
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">
                    BOT
                  </span>
                </div>
                {/* Captured pieces */}
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                  <span className="text-[10px] text-zinc-500">AI Engine</span>
                  {capturedWhitePieces.length > 0 && (
                    <span className="ml-2 font-mono text-xs text-amber-200/80">
                      +{capturedWhitePieces.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Bot Speech Bubble */}
            <div className="hidden xl:flex items-center max-w-md bg-[#302e2b] border border-white/10 px-3 py-1.5 rounded-xl shadow text-xs text-zinc-200 italic gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">&ldquo;{botQuote}&rdquo;</span>
            </div>

            {/* Bot Timer Clock */}
            <div
              className={`px-3 py-1.5 rounded-lg font-mono text-base font-bold tracking-wider ${
                chess.turn() === (playerColor === "w" ? "b" : "w") && !gameResult
                  ? "bg-zinc-800 text-white border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : "bg-zinc-900 text-zinc-400 border border-white/5"
              }`}
            >
              {playerColor === "w" ? formatTime(blackTime) : formatTime(whiteTime)}
            </div>
          </div>

          {/* CENTER: EVAL BAR + 8x8 CHESSBOARD */}
          <div className="my-auto flex items-center justify-center gap-3">
            {/* Vertical Eval Bar */}
            <div className="relative w-4 h-[480px] bg-[#262522] rounded-full overflow-hidden border border-white/10 flex flex-col justify-end shadow-inner">
              <div
                className="w-full bg-[#ebecd0] transition-all duration-300"
                style={{ height: `${playerColor === "w" ? whiteBarPercent : 100 - whiteBarPercent}%` }}
              />
              <span className="absolute inset-x-0 bottom-1 text-[8px] font-mono font-bold text-center text-black pointer-events-none">
                {evalScore >= 0 ? `+${(evalScore / 100).toFixed(1)}` : (evalScore / 100).toFixed(1)}
              </span>
            </div>

            {/* 8x8 Chessboard */}
            <div className="relative w-[480px] h-[480px] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#302e2b]">
              <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                {displayRanks.map((rank, rIdx) =>
                  displayFiles.map((file, fIdx) => {
                    const square = `${file}${rank}` as Square;
                    const isLightSquare = (rIdx + fIdx) % 2 === 0;
                    const piece = chess.get(square);
                    const isSelected = selectedSquare === square;
                    const isLastMoveSquare =
                      lastMove && (lastMove.from === square || lastMove.to === square);
                    const isLegalMove = legalMoves.some((m) => m.to === square);
                    const isLegalCapture = isLegalMove && piece !== null;
                    const isCheckSquare =
                      chess.isCheck() &&
                      piece?.type === "k" &&
                      piece.color === chess.turn();

                    return (
                      <div
                        key={square}
                        onClick={() => handleSquareClick(square)}
                        className={`relative w-full h-full flex items-center justify-center cursor-pointer transition-colors ${
                          isLightSquare ? "bg-[#ebecd0]" : "bg-[#739552]"
                        } ${
                          isSelected
                            ? "!bg-[#f7f769]/80"
                            : isLastMoveSquare
                            ? "!bg-[#f7f769]/40"
                            : ""
                        } ${isCheckSquare ? "!bg-red-600/70" : ""}`}
                      >
                        {/* Board Coordinates on Edges */}
                        {fIdx === 0 && (
                          <span
                            className={`absolute top-0.5 left-1 text-[10px] font-bold font-mono ${
                              isLightSquare ? "text-[#739552]" : "text-[#ebecd0]"
                            }`}
                          >
                            {rank}
                          </span>
                        )}
                        {rIdx === 7 && (
                          <span
                            className={`absolute bottom-0.5 right-1 text-[10px] font-bold font-mono ${
                              isLightSquare ? "text-[#739552]" : "text-[#ebecd0]"
                            }`}
                          >
                            {file}
                          </span>
                        )}

                        {/* Chess Piece Vector */}
                        {piece && (
                          <div className="w-[82%] h-[82%] relative z-10 transition-transform duration-100 hover:scale-105">
                            <RenderPiece piece={piece} />
                          </div>
                        )}

                        {/* Legal Move Indicators */}
                        {isLegalMove && !isLegalCapture && (
                          <div className="absolute z-20 w-3.5 h-3.5 rounded-full bg-black/25 pointer-events-none" />
                        )}
                        {isLegalCapture && (
                          <div className="absolute z-20 w-full h-full border-4 border-black/30 rounded-full scale-90 pointer-events-none" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* GAME RESULT OVERLAY */}
              {gameResult && (
                <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
                  
                  {/* VICTORY STATE: SPECIAL REWARD & SCREEN CAPTURE INSTRUCTIONS */}
                  {isPlayerVictorious ? (
                    <div className="flex flex-col items-center max-w-sm w-full space-y-3">
                      {/* Top Header Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold font-chess tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                        <Gift className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bonus Diskon Khusus Tersedia</span>
                      </div>

                      <div className="flex items-center gap-2 my-0.5">
                        <Trophy className="w-9 h-9 text-amber-400 drop-shadow-[0_0_16px_rgba(245,158,11,0.6)] animate-pulse" />
                        <h3 className="text-xl font-black text-white font-chess uppercase tracking-wider">
                          Skakmat! Anda Menang!
                        </h3>
                      </div>

                      {/* Reward Voucher Box */}
                      <div className="w-full bg-gradient-to-b from-[#11382f] to-[#0a231d] border border-emerald-400/50 rounded-xl p-3.5 shadow-lg text-left relative overflow-hidden">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Percent className="w-4 h-4 text-emerald-300" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wide font-chess">
                              Klaim Bonus Diskon Proyek
                            </h4>
                            <p className="text-[11px] text-zinc-300 leading-snug mt-1">
                              Selamat! Anda berhasil mengalahkan bot catur saya. Ambil screenshot layar ini dan kirimkan ke saya untuk mendapatkan <strong className="text-emerald-300 font-bold">Bonus Diskon Spesial</strong> pengerjaan project / website / aplikasi Anda!
                            </p>
                          </div>
                        </div>

                        {/* Capture Instruction Guide */}
                        <div className="mt-2.5 pt-2 border-t border-emerald-500/20 text-[10px] text-zinc-400 flex items-center justify-between">
                          <span>Shortcut Cepat:</span>
                          <span className="font-mono text-emerald-300/90 font-bold">Win + Shift + S / Cmd + Shift + 4</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full space-y-2 pt-1">
                        {/* 1-Click Screen Capture Button */}
                        <button
                          type="button"
                          onClick={handleTakeScreenshot}
                          disabled={isCapturing}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs font-chess tracking-wider shadow-lg transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          {screenshotSuccess ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-200" />
                              <span>Bukti Tersimpan &amp; Tersalin!</span>
                            </>
                          ) : isCapturing ? (
                            <span>Sedang Mengambil Gambar...</span>
                          ) : (
                            <>
                              <Camera className="w-4 h-4 text-emerald-200" />
                              <span>Ambil &amp; Unduh Screenshot Bukti</span>
                            </>
                          )}
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Direct WhatsApp Claim */}
                          <a
                            href={claimWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-[11px] font-chess tracking-wider transition-colors"
                          >
                            <FaWhatsapp className="w-3.5 h-3.5" />
                            <span>Klaim ke WhatsApp</span>
                          </a>

                          {/* Rematch Button */}
                          <button
                            type="button"
                            onClick={() => handleNewGame()}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-[11px] font-chess tracking-wider transition-colors border border-white/10"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Main Lagi</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* REGULAR GAME OVER (DEFEAT OR DRAW) */
                    <div className="flex flex-col items-center max-w-xs space-y-3">
                      <Trophy className="w-12 h-12 text-zinc-500 mb-1 drop-shadow" />
                      <h3 className="text-lg font-black text-white font-chess uppercase tracking-wider">
                        Permainan Selesai
                      </h3>
                      <p className="text-zinc-300 text-xs font-medium leading-relaxed">
                        {gameResult}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleNewGame()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-chess tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer mt-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Rematch AI Bot</span>
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: CHALLENGER (PLAYER) CARD */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 bg-[#302e2b] flex items-center justify-center text-white font-bold">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm tracking-wide">
                    You (Challenger)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                  <span>Playing as {playerColor === "w" ? "White" : "Black"}</span>
                  {capturedBlackPieces.length > 0 && (
                    <span className="ml-2 font-mono text-xs text-amber-200/80">
                      +{capturedBlackPieces.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Player Timer Clock */}
            <div
              className={`px-3 py-1.5 rounded-lg font-mono text-base font-bold tracking-wider ${
                chess.turn() === playerColor && !gameResult
                  ? "bg-zinc-800 text-white border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : "bg-zinc-900 text-zinc-400 border border-white/5"
              }`}
            >
              {playerColor === "w" ? formatTime(whiteTime) : formatTime(blackTime)}
            </div>
          </div>
        </div>

        {/* RIGHT / SIDEBAR */}
        <div className="w-80 bg-[#262522] border-l border-white/10 flex flex-col justify-between p-5">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-emerald-500" />
                <span className="font-black text-white text-sm font-chess tracking-wider uppercase">
                  Tactical Chess Arena
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                title="Close Arena (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Game Meta & Bot Badge */}
            <div className="mt-4 p-3 rounded-xl bg-[#1f1e1b] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-zinc-300 tracking-wider uppercase font-chess flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  Abdul Razak (AI Bot)
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                  PORTFOLIO BOT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                An interactive algorithmic chess engine built directly into this portfolio. Play a friendly match and test your strategic foresight across the board.
              </p>
            </div>

            {/* Move History Table */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 font-chess">
                <span>Move History</span>
                <span className="font-mono text-zinc-500">
                  {Math.ceil(historyMoves.length / 2)} moves
                </span>
              </div>
              <div className="h-64 overflow-y-auto rounded-xl bg-[#1f1e1b] border border-white/5 p-2 font-mono text-xs">
                {historyMoves.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-500 text-[11px] italic">
                    Game has not started yet. Make your first move!
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {Array.from({ length: Math.ceil(historyMoves.length / 2) }).map((_, idx) => {
                      const whiteMove = historyMoves[idx * 2];
                      const blackMove = historyMoves[idx * 2 + 1];
                      return (
                        <div
                          key={idx}
                          className="flex items-center text-xs py-1 px-2 rounded hover:bg-white/5"
                        >
                          <span className="w-8 text-zinc-500 font-bold">{idx + 1}.</span>
                          <span className="w-20 font-semibold text-zinc-200">
                            {whiteMove?.san || ""}
                          </span>
                          <span className="w-20 font-semibold text-amber-200/90">
                            {blackMove?.san || ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Control Panel */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNewGame()}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#302e2b] hover:bg-[#3d3a37] text-white font-bold text-xs font-chess tracking-wider transition-colors border border-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
                <span>New Game</span>
              </button>

              <button
                onClick={handleResign}
                disabled={!!gameResult}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#302e2b] hover:bg-red-950/40 hover:text-red-300 text-zinc-400 font-bold text-xs font-chess tracking-wider transition-colors border border-white/5 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Resign</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNewGame(playerColor === "w" ? "b" : "w")}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1f1e1b] hover:bg-[#282723] text-zinc-300 text-xs font-medium transition-colors border border-white/5"
              >
                <ArrowLeftRight className="w-3 h-3 text-zinc-400" />
                <span>Flip Side ({playerColor === "w" ? "White" : "Black"})</span>
              </button>

              <button
                onClick={() => setSoundEnabled((v) => !v)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1f1e1b] hover:bg-[#282723] text-zinc-300 text-xs font-medium transition-colors border border-white/5"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3 text-zinc-500" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[10px] text-zinc-500 text-center font-chess pt-1">
              Desktop Exclusive Experience &bull; Press ESC to exit
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
