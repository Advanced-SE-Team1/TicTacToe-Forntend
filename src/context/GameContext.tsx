import React, { createContext } from 'react';
export const GameContext = createContext({
  this_round_index:1,
  this_player:0,
  player1_id: 0,
  player2_id: 0,
  player1_name: '',
  player2_name: '',
  gameId: '',
  roundsWon: {
    player: 0,
    opponent: 0
  },
  currentRound: 1,
  updateScore: winner => {},
  finishGame: () => {}
});