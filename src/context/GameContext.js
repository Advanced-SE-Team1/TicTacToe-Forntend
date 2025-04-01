import React, { createContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  return (
    <GameContext.Provider value={{ board, setBoard, isXNext, setIsXNext, scores, setScores }}>
      {children}
    </GameContext.Provider>
  );
};