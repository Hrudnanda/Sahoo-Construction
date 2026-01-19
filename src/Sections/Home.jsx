import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

// --- CRACKER PARTICLE COMPONENT ---
const Firework = ({ color }) => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i * 30 * Math.PI) / 180) * 150,
            y: Math.sin((i * 30 * Math.PI) / 180) * 150,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}, 0 0 30px ${color}` 
          }}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(null);
  const [computer, setComputer] = useState(null);
  const [turn, setTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [scores, setScores] = useState({ win: 0, loss: 0, draw: 0 });
  const [firstMove, setFirstMove] = useState("player");
  const [showCrackers, setShowCrackers] = useState(false);

  const totalGames = scores.win + scores.loss + scores.draw;
  const winRate = totalGames > 0 ? ((scores.win / totalGames) * 100).toFixed(1) : 0;

  const checkWinnerStatic = useCallback((board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combo };
      }
    }
    return board.includes(null) ? null : { winner: "Draw", line: null };
  }, []);

  // AI Logic (Minimax)
  const minimax = (tempBoard, depth, isMaximizing) => {
    const res = checkWinnerStatic(tempBoard);
    if (res?.winner === computer) return 10 - depth;
    if (res?.winner === player) return depth - 10;
    if (res?.winner === "Draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!tempBoard[i]) {
          tempBoard[i] = computer;
          let score = minimax(tempBoard, depth + 1, false);
          tempBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!tempBoard[i]) {
          tempBoard[i] = player;
          let score = minimax(tempBoard, depth + 1, true);
          tempBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (currentBoard) => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        currentBoard[i] = computer;
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const handlePlayerMove = (index) => {
    if (board[index] || winner || turn !== player) return;
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setTurn(computer);
  };

  useEffect(() => {
    const result = checkWinnerStatic(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === player) {
        setScores(s => ({ ...s, win: s.win + 1 }));
        setShowCrackers(true);
        setTimeout(() => setShowCrackers(false), 2000);
      }
      else if (result.winner === computer) setScores(s => ({ ...s, loss: s.loss + 1 }));
      else if (result.winner === "Draw") setScores(s => ({ ...s, draw: s.draw + 1 }));
    }
  }, [board, player, computer, checkWinnerStatic]);

  useEffect(() => {
    if (turn && turn === computer && !winner) {
      const timer = setTimeout(() => {
        const move = findBestMove([...board]);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = computer;
          setBoard(newBoard);
          setTurn(player);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [turn, winner]);

  const startGame = (choice) => {
    const pcChoice = choice === "X" ? "O" : "X";
    setPlayer(choice);
    setComputer(pcChoice);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setTurn(firstMove === "player" ? choice : pcChoice);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-black text-white font-sans p-4 gap-8 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className={`fixed inset-0 transition-opacity duration-1000 pointer-events-none ${winner === player ? 'opacity-40' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(0,0,0,1) 70%)' }} />

      {/* LEFT: Game Board */}
      <div className={`relative transition-all duration-700 p-1 rounded-[40px] 
        ${winner === player ? 'shadow-[0_0_100px_rgba(34,197,94,0.4)] scale-105' : winner === computer ? 'shadow-[0_0_60px_rgba(239,68,68,0.2)]' : 'shadow-[0_0_40px_rgba(59,130,246,0.1)]'}`}>
        
        {/* CRACKER OVERLAYS */}
        {showCrackers && (
          <>
            <div className="absolute -top-10 -left-10"><Firework color="#4ade80" /></div>
            <div className="absolute -bottom-10 -right-10"><Firework color="#60a5fa" /></div>
            <div className="absolute top-1/2 left-1/2"><Firework color="#facc15" /></div>
          </>
        )}

        <div className="bg-gray-900/90 backdrop-blur-2xl p-8 rounded-[38px] border border-gray-800 w-full max-w-[400px] relative z-10">
          <h1 className="text-3xl font-black mb-6 text-center tracking-tighter italic">
            NEON <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">BATTLE</span>
          </h1>

          {!player ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <p className="text-gray-500 text-[10px] tracking-[0.3em] font-bold mb-4 uppercase">Who starts?</p>
              <div className="flex bg-gray-800 p-1 rounded-xl mb-8 border border-gray-700">
                <button 
                  onClick={() => setFirstMove("player")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${firstMove === "player" ? "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] text-white" : "text-gray-400"}`}
                >
                  YOU
                </button>
                <button 
                  onClick={() => setFirstMove("computer")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${firstMove === "computer" ? "bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.6)] text-white" : "text-gray-400"}`}
                >
                  AI
                </button>
              </div>

              <p className="text-gray-400 mb-6 uppercase tracking-widest text-[10px]">Select Weapon</p>
              <div className="flex justify-center gap-6">
                {["X", "O"].map((sym) => (
                  <button key={sym} onClick={() => startGame(sym)} className="group relative w-24 h-24 bg-gray-800 rounded-3xl text-3xl font-bold transition-all hover:scale-110 active:scale-95 border border-gray-700 overflow-hidden">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${sym === 'X' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <span className={sym === "X" ? "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" : "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"}>{sym}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {board.map((cell, idx) => {
                  const isWinningSquare = winningLine?.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePlayerMove(idx)}
                      className={`relative w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black transition-all duration-300
                        ${isWinningSquare ? 'bg-white/10 ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]' : 'bg-gray-800/50 hover:bg-gray-700/50'}
                        border border-gray-700/50 overflow-hidden`}
                    >
                      <AnimatePresence>
                        {cell && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0, rotate: -90 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className={cell === "X" ? "text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.9)]" : "text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.9)]"}
                          >
                            {cell}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>

              <div className="text-center h-8 mb-4">
                {winner ? (
                  <motion.p 
                    initial={{ y: 10, opacity: 0, scale: 0.5 }} 
                    animate={{ y: 0, opacity: 1, scale: 1.2 }} 
                    className={`text-xl font-black italic tracking-widest ${winner === player ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,1)]' : 'text-red-500'}`}
                  >
                    {winner === "Draw" ? "🤝 TIED GAME" : winner === player ? "🏆 YOU WIN!" : "🤖 AI OVERLORD"}
                  </motion.p>
                ) : (
                  <p className="text-gray-500 text-xs tracking-[0.2em] animate-pulse">
                    {turn === player ? "YOUR TURN" : "AI COMPUTING..."}
                  </p>
                )}
              </div>

              <button onClick={() => setPlayer(null)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all font-bold tracking-widest text-[10px] uppercase hover:text-blue-400">
                Change Settings
              </button>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Stats Dashboard */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        className="w-full max-w-[300px] flex flex-col gap-4"
      >
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-[32px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <p className="text-gray-500 text-[10px] tracking-[0.3em] font-bold mb-4 uppercase">Analytics</p>
          <div className="space-y-4">
            <StatRow label="Wins" value={scores.win} color="text-green-400" />
            <StatRow label="Losses" value={scores.loss} color="text-red-400" />
            <StatRow label="Draws" value={scores.draw} color="text-gray-400" />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-1">Win Rate</p>
            <h2 className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{winRate}<span className="text-xl text-gray-600">%</span></h2>
            <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden border border-gray-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400 font-medium">{label}</span>
    <span className={`text-xl font-bold ${color} drop-shadow-[0_0_8px_currentColor]`}>{value}</span>
  </div>
);

export default Home;  