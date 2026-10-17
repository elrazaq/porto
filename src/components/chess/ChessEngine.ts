import { Chess, Move, Square, PieceSymbol, Color } from "chess.js";

// Piece values in centipawns
const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece Square Tables (from White's perspective, index 0 is a8, 63 is h1)
// We mirror them for Black.
const PAWN_PST = [
   0,   0,   0,   0,   0,   0,   0,   0,
  50,  50,  50,  50,  50,  50,  50,  50,
  10,  10,  20,  30,  30,  20,  10,  10,
   5,   5,  10,  25,  25,  10,   5,   5,
   0,   0,   0,  20,  20,   0,   0,   0,
   5,  -5, -10,   0,   0, -10,  -5,   5,
   5,  10,  10, -20, -20,  10,  10,   5,
   0,   0,   0,   0,   0,   0,   0,   0,
];

const KNIGHT_PST = [
 -50, -40, -30, -30, -30, -30, -40, -50,
 -40, -20,   0,   0,   0,   0, -20, -40,
 -30,   0,  10,  15,  15,  10,   0, -30,
 -30,   5,  15,  20,  20,  15,   5, -30,
 -30,   0,  15,  20,  20,  15,   0, -30,
 -30,   5,  10,  15,  15,  10,   5, -30,
 -40, -20,   0,   5,   5,   0, -20, -40,
 -50, -40, -30, -30, -30, -30, -40, -50,
];

const BISHOP_PST = [
 -20, -10, -10, -10, -10, -10, -10, -20,
 -10,   0,   0,   0,   0,   0,   0, -10,
 -10,   0,   5,  10,  10,   5,   0, -10,
 -10,   5,   5,  10,  10,   5,   5, -10,
 -10,   0,  10,  10,  10,  10,   0, -10,
 -10,  10,  10,  10,  10,  10,  10, -10,
 -10,   5,   0,   0,   0,   0,   5, -10,
 -20, -10, -10, -10, -10, -10, -10, -20,
];

const ROOK_PST = [
   0,   0,   0,   0,   0,   0,   0,   0,
   5,  10,  10,  10,  10,  10,  10,   5,
  -5,   0,   0,   0,   0,   0,   0,  -5,
  -5,   0,   0,   0,   0,   0,   0,  -5,
  -5,   0,   0,   0,   0,   0,   0,  -5,
  -5,   0,   0,   0,   0,   0,   0,  -5,
  -5,   0,   0,   0,   0,   0,   0,  -5,
   0,   0,   0,   5,   5,   0,   0,   0,
];

const QUEEN_PST = [
 -20, -10, -10,  -5,  -5, -10, -10, -20,
 -10,   0,   0,   0,   0,   0,   0, -10,
 -10,   0,   5,   5,   5,   5,   0, -10,
  -5,   0,   5,   5,   5,   5,   0,  -5,
   0,   0,   5,   5,   5,   5,   0,  -5,
 -10,   5,   5,   5,   5,   5,   0, -10,
 -10,   0,   5,   0,   0,   0,   0, -10,
 -20, -10, -10,  -5,  -5, -10, -10, -20,
];

const KING_MID_PST = [
 -30, -40, -40, -50, -50, -40, -40, -30,
 -30, -40, -40, -50, -50, -40, -40, -30,
 -30, -40, -40, -50, -50, -40, -40, -30,
 -30, -40, -40, -50, -50, -40, -40, -30,
 -20, -30, -30, -40, -40, -30, -30, -20,
 -10, -20, -20, -20, -20, -20, -20, -10,
  20,  20,   0,   0,   0,   0,  20,  20,
  20,  30,  10,   0,   0,  10,  30,  20,
];

const KING_END_PST = [
 -50, -40, -30, -20, -20, -30, -40, -50,
 -30, -20, -10,   0,   0, -10, -20, -30,
 -30, -10,  20,  30,  30,  20, -10, -30,
 -30, -10,  30,  40,  40,  30, -10, -30,
 -30, -10,  30,  40,  40,  30, -10, -30,
 -30, -10,  20,  30,  30,  20, -10, -30,
 -30, -30,   0,   0,   0,   0, -30, -30,
 -50, -30, -30, -30, -30, -30, -30, -50,
];

function getSquareIndex(square: Square): number {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = 8 - parseInt(square[1], 10); // 8=0, 1=7
  return rank * 8 + file;
}

function getMirroredIndex(square: Square): number {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1], 10) - 1; // 1=0, 8=7
  return rank * 8 + file;
}

// Master Opening Book: Solid responses as Black and White
const OPENING_BOOK: Record<string, string[]> = {
  // Initial position
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1": ["e4", "d4", "Nf3", "c4"],
  // After 1. e4 -> Plays Sicilian (c5) or Open Game (e5)
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1": ["c5", "e5"],
  // After 1. e4 c5 2. Nf3
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2": ["d6", "Nc6", "e6"],
  // After 1. e4 e5 2. Nf3
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2": ["Nc6", "Nf6"],
  // After 1. d4 -> Magnus plays Nf6 or d5
  "rnbqkbnr/pppppppp/8/8/3P4/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1": ["Nf6", "d5"],
  // After 1. d4 Nf6 2. c4
  "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2": ["e6", "g6"],
  // After 1. c4
  "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1": ["e5", "Nf6", "c5"],
};

// Quotes reflecting sharp chess bot playstyle and tactical psychology
export const CHESS_BOT_QUOTES = {
  opening: [
    "Let's see your preparation. Theory is only as good as your understanding.",
    "Interesting choice. I'm ready to contest any structural advantage.",
    "A classical system. Let's see if you can handle the positional tension.",
  ],
  tactical: [
    "Calculation is about seeing concrete lines, not hoping for mistakes.",
    "An interesting piece trade, but my piece activity is decisively superior.",
    "Every square counts. You gave away a critical outpost.",
  ],
  check: [
    "Check. Your king safety is fundamentally compromised.",
    "The king must move. Squeezing every remaining square on the board.",
  ],
  endgame: [
    "Now we enter the endgame. That's where the real chess begins.",
    "Endgames don't require miracles—just microscopic, relentless technique.",
  ],
  winning: [
    "The position is technically winning from here. Tactical precision active.",
    "You cannot escape this pawn structure bind. Resistance is futile.",
  ],
  gameover_win: [
    "Checkmate! Well played, but tight endgame technique leaves no margin for error.",
  ],
  gameover_draw: [
    "Draw. A solid defensive performance. Respect.",
  ],
};

export const GRANDMASTER_QUOTES = CHESS_BOT_QUOTES;

export class ChessBotAI {
  private engineColor: Color;

  constructor(engineColor: Color = "b") {
    this.engineColor = engineColor;
  }

  public setEngineColor(color: Color) {
    this.engineColor = color;
  }

  // Evaluates board from White's perspective (+ for White, - for Black)
  public evaluate(chess: Chess): number {
    if (chess.isCheckmate()) {
      return chess.turn() === "w" ? -50000 : 50000;
    }
    if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
      return 0;
    }

    let score = 0;
    const board = chess.board();

    // Check if endgame (few queens/pieces remain)
    let totalPieces = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]) totalPieces++;
      }
    }
    const isEndgame = totalPieces <= 12;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const square = piece.square;
        const val = PIECE_VALUES[piece.type];
        let pstVal = 0;

        if (piece.color === "w") {
          const sqIdx = getSquareIndex(square);
          switch (piece.type) {
            case "p": pstVal = PAWN_PST[sqIdx]; break;
            case "n": pstVal = KNIGHT_PST[sqIdx]; break;
            case "b": pstVal = BISHOP_PST[sqIdx]; break;
            case "r": pstVal = ROOK_PST[sqIdx]; break;
            case "q": pstVal = QUEEN_PST[sqIdx]; break;
            case "k": pstVal = isEndgame ? KING_END_PST[sqIdx] : KING_MID_PST[sqIdx]; break;
          }
          score += val + pstVal;
        } else {
          const sqIdx = getMirroredIndex(square);
          switch (piece.type) {
            case "p": pstVal = PAWN_PST[sqIdx]; break;
            case "n": pstVal = KNIGHT_PST[sqIdx]; break;
            case "b": pstVal = BISHOP_PST[sqIdx]; break;
            case "r": pstVal = ROOK_PST[sqIdx]; break;
            case "q": pstVal = QUEEN_PST[sqIdx]; break;
            case "k": pstVal = isEndgame ? KING_END_PST[sqIdx] : KING_MID_PST[sqIdx]; break;
          }
          score -= (val + pstVal);
        }
      }
    }

    return score;
  }

  // Quiescence search to avoid the horizon effect on captures
  private quiescence(chess: Chess, alpha: number, beta: number, depth: number): number {
    const standPat = this.evaluate(chess);
    const isMaximizing = chess.turn() === "w";

    if (depth <= 0) return standPat;

    if (isMaximizing) {
      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;
    } else {
      if (standPat <= alpha) return alpha;
      if (standPat < beta) beta = standPat;
    }

    // Only search captures in quiescence
    const moves = chess.moves({ verbose: true }).filter((m) => m.captured !== undefined);
    // Sort captures by MVV-LVA
    moves.sort((a, b) => {
      const valA = (a.captured ? PIECE_VALUES[a.captured] : 0) - PIECE_VALUES[a.piece];
      const valB = (b.captured ? PIECE_VALUES[b.captured] : 0) - PIECE_VALUES[b.piece];
      return valB - valA;
    });

    for (const move of moves) {
      chess.move(move);
      const score = this.quiescence(chess, alpha, beta, depth - 1);
      chess.undo();

      if (isMaximizing) {
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
      } else {
        if (score <= alpha) return alpha;
        if (score < beta) beta = score;
      }
    }

    return isMaximizing ? alpha : beta;
  }

  // Minimax with Alpha-Beta pruning
  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): { score: number; bestMove?: Move } {
    if (depth === 0 || chess.isGameOver()) {
      return { score: this.quiescence(chess, alpha, beta, 2) };
    }

    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) {
      return { score: this.evaluate(chess) };
    }

    // Move ordering: Captures, checks, promotions first
    moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.captured) {
        scoreA += 10 * PIECE_VALUES[a.captured] - PIECE_VALUES[a.piece];
      }
      if (b.captured) {
        scoreB += 10 * PIECE_VALUES[b.captured] - PIECE_VALUES[b.piece];
      }
      if (a.promotion) scoreA += 800;
      if (b.promotion) scoreB += 800;
      return scoreB - scoreA;
    });

    let bestMove: Move = moves[0];

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const { score } = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();

        if (score > maxScore) {
          maxScore = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) break; // Beta cutoff
      }
      return { score: maxScore, bestMove };
    } else {
      let minScore = Infinity;
      for (const move of moves) {
        chess.move(move);
        const { score } = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();

        if (score < minScore) {
          minScore = score;
          bestMove = move;
        }
        beta = Math.min(beta, minScore);
        if (beta <= alpha) break; // Alpha cutoff
      }
      return { score: minScore, bestMove };
    }
  }

  // Finds the best move for the chess bot
  public getBestMove(chess: Chess, depth: number = 3): { move: Move | null; quote: string } {
    if (chess.isGameOver()) {
      return { move: null, quote: "Game over." };
    }

    // 1. Check opening book
    const fen = chess.fen();
    if (OPENING_BOOK[fen]) {
      const candidates = OPENING_BOOK[fen];
      const san = candidates[Math.floor(Math.random() * candidates.length)];
      try {
        const testMove = chess.move(san);
        if (testMove) {
          chess.undo(); // undo so caller can execute it cleanly
          const quote = CHESS_BOT_QUOTES.opening[Math.floor(Math.random() * CHESS_BOT_QUOTES.opening.length)];
          return { move: testMove, quote };
        }
      } catch {
        // Fallback to minimax
      }
    }

    // 2. Minimax search (Depth 3 with quiescence is master tier and evaluates in ~150ms)
    const isMaximizing = chess.turn() === "w";
    const { score, bestMove } = this.minimax(chess, depth, -Infinity, Infinity, isMaximizing);

    // Pick contextual quote
    let quote = CHESS_BOT_QUOTES.tactical[Math.floor(Math.random() * CHESS_BOT_QUOTES.tactical.length)];
    if (chess.isCheck()) {
      quote = CHESS_BOT_QUOTES.check[Math.floor(Math.random() * CHESS_BOT_QUOTES.check.length)];
    } else if (Math.abs(score) > 400) {
      quote = CHESS_BOT_QUOTES.winning[Math.floor(Math.random() * CHESS_BOT_QUOTES.winning.length)];
    } else if (chess.history().length > 30) {
      quote = CHESS_BOT_QUOTES.endgame[Math.floor(Math.random() * CHESS_BOT_QUOTES.endgame.length)];
    }

    return { move: bestMove || null, quote };
  }
}

export const GrandmasterBot = ChessBotAI;
