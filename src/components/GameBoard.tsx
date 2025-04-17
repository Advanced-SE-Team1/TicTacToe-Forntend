import React, { useEffect, useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { XIcon, CircleIcon, TrophyIcon, AlertTriangleIcon } from 'lucide-react';
import { log } from 'console';
import { getData, postData, putData } from '../api';
import { on } from 'events';
export const GameBoard = ({
  roundfinished,roundwaiting
}) => {
  const {
    this_round_index,
    this_player,
    player1_id,
    player2_id,
    player1_name,
    player2_name,
    gameId,
    roundsWon,
    currentRound,
    updateScore,
    finishGame
  } = useContext(GameContext);
  const[currentRound1,setCurrentRound1]=useState(currentRound)
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [ongoingRound, setOngoingRound] = useState(this_round_index);
  const [next_player, setNextPlayer] = useState(player1_id);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [roundWinner, setRoundWinner] = useState(0);
  const [round, setRound] = useState(this_round_index);
  // Check for winner
  const calculateWinnerOrDraw = (squares: any[]):any => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
  
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // 'X' or 'O'
      }
    }
  
    const isBoardFull = squares.every(square => square !== null);
    return isBoardFull ? 'draw' : null;
  };
  
  // Check if board is full
  const isBoardFull = (squares: any[]) => {
    return squares.every((square: null) => square !== null);
  };
// Check if board is Empty
  const isBoardEmpty = (squares: any[]): boolean => {
    return squares.every(square => square === null);
  };
  
  // Handle click on a square
  const handleClick = (i: any) => {

     if(this_player==next_player){
      const newBoard = [...board];
      let next_player_id = this_player;
      if(this_player==player1_id){
       next_player_id = player2_id;
       newBoard[i] = 'X';
      }else{
       next_player_id = player1_id;
       newBoard[i] = 'O';
      }
 
      putData(`games/round`, { roundId: currentRound1,game_id: currentRound1, board: newBoard,next_player: Number(next_player_id),winner: null })
      .then((response) => {
       
        setNextPlayer(Number(next_player_id));
      })
      .catch((error) => {
        console.error("Error sending move to server:", error);
      });
      // Update the board state
   
     setBoard(newBoard);
      setIsXNext(false);
     }
    
  };

  // Computer move
  useEffect(() => {

   const timeout = setTimeout(() => {
    
    
    const roundWinnerq = calculateWinnerOrDraw(board);
    if (roundWinnerq==null  ) {
      if(ongoingRound==round){
        getData(`games/round/`+currentRound1, { gameId: currentRound1 })
        .then((response) => {
         //  const newBoard = [...board];
         //  newBoard[response.index] = response.player;
         if(ongoingRound==round){
         if(response.round[0].board){
       
           setBoard(response.round[0].board);
         }
       
           setNextPlayer(response.round[0].next_player);
          console.log(response.round[0].next_player+"==" +player1_id);
          
           if(response.round[0].next_player== player1_id){
             setIsXNext(true);
           }else{
             setIsXNext(false);
           }
         }
        }).catch((error) => {
          console.error("Error receiving move from server:", error);
        });
      }
    }else{
  
      
      if(winner ){
        let rv=roundWinner;
        if(roundWinner==0){
         rv=0
        }
       if(this_player==player1_id){
        roundfinished(gameId,currentRound,round,rv,board)
       }
        
      else{
        roundwaiting(gameId,currentRound,round,rv)
      }
       
      }
      
        setWinner(roundWinnerq);
      
       
    
     
      clearTimeout(timeout)
    }
    
   
  
    // Simulate opponent's move
  }, 800);


    // return () => clearTimeout(timeout);

  }, [isXNext, board, winner,round, showRoundResult]);
  // Check game status after each move
  useEffect(() => {
  
    
    const roundWinner = calculateWinnerOrDraw(board);
    
    
    if (roundWinner || isBoardFull(board) ) {
     
    
      // setBoard(Array(9).fill(null));
      // setWinner(roundWinner);
      // setShowRoundResult(true);
      // if(ongoingRound==round){
       
      //   setRound(round + 1);
      // }
      
      // setRoundWinner(0);
     
      // Determine round winner
     
       let roundWinnerType;
       setShowRoundResult(true);
      if (roundWinner === 'X') {
        roundWinnerType = 'player';
        setRoundWinner(player1_id);
      } else if (roundWinner === 'O') {
        roundWinnerType = 'opponent';
        setRoundWinner(player2_id);
      } else {
        roundWinnerType = 'draw';
        setRoundWinner(0);
      }
      // setRoundWinner(null);
      // setBoard(Array(9).fill(null));
      // setIsXNext(true);
      // // Update score if not a draw
      // if (roundWinnerType !== 'draw') {
      //   updateScore(roundWinnerType);
      // } else {
      //   // Move to next round even on draw
      //   updateScore(null);
      // }
     
      // Check if game is over (best of 5)
     
      
    }
  }, [board, round, roundsWon, updateScore]);


  // Render a square
  const renderSquare = (i: number) => {
    return <button className={`w-full  border border-gray-300 flex items-center justify-center text-4xl 
                   ${!board[i] && !winner && isXNext ? 'hover:bg-gray-100' : ''}`}  style={{aspectRatio: '1/1'}} onClick={() => handleClick(i)} disabled={(board[i] !== null || winner !== null  || showRoundResult) && next_player !== this_player}>
        {board[i] === 'X' && <XIcon className="w-10 h-10 text-blue-600" />}
        {board[i] === 'O' && <CircleIcon className="w-10 h-10 text-red-600" />}
      </button>;
  };

  // Show game result and offer to play again
  if (gameOver) {
    const finalWinner = roundsWon.player > roundsWon.opponent ? 'player' : roundsWon.opponent > roundsWon.player ? 'opponent' : 'draw';
    return <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Game Over!</h2>
        <div className="flex justify-center mb-6">
          {finalWinner === 'player' ? <TrophyIcon className="w-16 h-16 text-yellow-500" /> : finalWinner === 'opponent' ? <AlertTriangleIcon className="w-16 h-16 text-red-500" /> : <div className="flex items-center justify-center w-16 h-16 text-gray-600 bg-gray-200 rounded-full">
              Draw
            </div>}
        </div>
        <div className="mb-6">
          {finalWinner === 'player' ? <p className="text-xl font-semibold text-green-600">
              You won the game!
            </p> : finalWinner === 'opponent' ? <p className="text-xl font-semibold text-red-600">
              {player2_name} won the game!
            </p> : <p className="text-xl font-semibold text-gray-600">
              The game ended in a draw!
            </p>}
          <p className="mt-2 text-gray-600">
            Final score: {roundsWon.player} - {roundsWon.opponent}
          </p>
        </div>
        <button onClick={finishGame} className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
          Back to Lobby
        </button>
      </div>;
  }


  return <div>
      <div className="flex items-center justify-between mb-4">
        <div className={`py-1 px-3 rounded-full ${isXNext ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          <span className="font-semibold">{player1_name}</span> (X)
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Round {round-1}/5</p>
          <p className="font-bold">
            {roundsWon.player} - {roundsWon.opponent}
          </p>
        </div>
        <div className={`py-1 px-3 rounded-full ${!isXNext ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          <span className="font-semibold">{player2_name}</span> (O)
        </div>
      </div>
      {showRoundResult && <div className={`mb-4 py-2 px-4 rounded-md text-center ${roundWinner == this_player ? 'bg-green-100 text-green-800' :  ((roundWinner != this_player) && (roundWinner!=0)) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          {roundWinner == this_player ? <p>You won round {round - 1}!</p> :  ((roundWinner != this_player) && (roundWinner!=0))? <p>
          You Loss round {round - 1}!
            </p> : <p>Round {round - 1} ended in a draw!</p>}
        </div>}
      <div className="grid grid-cols-3 gap-1 mb-4" style={{aspectRatio: '1/1'}}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => renderSquare(i))}
      </div>
      <div className="text-sm text-center text-gray-500">
        {next_player==this_player ? 'Your turn' : `Opponent's turn...`}
      </div>
    </div>;
};