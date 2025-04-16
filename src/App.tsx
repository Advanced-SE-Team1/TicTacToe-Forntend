import React, { useState } from "react";
import { UserRegistration } from "./components/UserRegistration";
import { GameLobby } from "./components/GameLobby";
import { WaitingRoom } from "./components/WaitingRoom";
import { GameBoard } from "./components/GameBoard";
import { GameContext } from "./context/GameContext";
import { getData, postData, putData } from "./api";
import { GameFinish } from "./components/GameFinish";

export function App() {
  const [userName, setUserName] = useState("");
  const [this_player, setThisPlayer] = useState(0);
  const [this_round_index, setThisRoundIndex] = useState(1);
  const [player1, setPlayer1] = useState(0);
  const [player2, setPlayer2] = useState(0);
  const [gameWin, setgameWin] = useState(0);
  const [gameState, setGameState] = useState("registration"); // registration, lobby, waiting, started,finish
  const [opponent, setOpponent] = useState("");
  const [gameId, setGameId] = useState("");
  const [roundsWon, setRoundsWon] = useState({ player: 0, opponent: 0 });
  const [currentRound, setCurrentRound] = useState(0);
  const startGame = () => {
    postData("games/start", { playerId: this_player })
      .then((response) => {
        setGameState("waiting");
        setGameId(response.gameId);
      })
      .catch((error) => console.error(error));
  };
  const joinGame = (hostName: any, id: any) => {
    postData("games/join", { gameId: id, playerId: this_player })
      .then((response) => {
        setGameId(id);

        getData("games/" + id + "/status", { gameId: id })
          .then((response) => {
            if (response.status === "started") {
              setPlayer1(response.player1Id);
              setPlayer2(response.player2Id);
              setUserName(response.player1Name);
              setOpponent(response.player2Name);

              postData("games/round", {
                gameId: id,
                roundNumber: 1,
                next_player: Number(response.player1Id),
              })
                .then((response2) => {
                  setCurrentRound(response2.round.id);
                  setGameState("started");
                  console.log("Round started:", response2);
                })
                .catch((error) => {
                  console.error("Error starting round:", error);
                });
            }
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  const simulateOpponentJoin = () => {
    getData("games/" + gameId + "/status", { gameId: gameId })
      .then((response) => {
        if (response.status === "started") {
          setPlayer1(response.player1Id);
          setPlayer2(response.player2Id);
          setUserName(response.player1Name);
          setOpponent(response.player2Name);
          getData("games/rounds/" + gameId, {
            gameId: gameId,
          })
            .then((response) => {
              setCurrentRound(response.rounds[0].id);
              setGameState("started");
              console.log("Round started:", response);
            })
            .catch((error) => {
              console.error("Error starting round:", error);
            });
        }
      })
      .catch((error) => console.error(error));
  };
  const finishGame = () => {
    // Reset game state after a game is finished
    setGameState("finish");
    if(roundsWon.player>roundsWon.opponent){
      setgameWin(player1)
    }else if(roundsWon.player<roundsWon.opponent){
      setgameWin(player2)
    }
    
  };

  const roundfinished = (gameid: any, round: any,round_index:any, winner: any, board: any) => {
    if(winner==player1){
      roundsWon.player=roundsWon.player+1
    }else if(winner==player2){
      roundsWon.opponent=roundsWon.opponent+1
    }
   
   if(round_index>4){
    finishGame();

    setGameState("finish");
   }else{
    setGameState("waiting1");
    getData(`games/round/` + round, { gameId: gameid })
      .then((response) => {
        if (response.round[0].winner == null) {
          putData(`games/round`, { roundId: round, game_id: gameid, board: board, next_player: player1, winner: winner })
            .then((response2) => {
             
              
              postData("games/round", {
                gameId: gameid,
                roundNumber: round_index+1,
                next_player: Number(player1),
              })
                .then((response3) => {
                  setCurrentRound(response3.round.id);
               setThisRoundIndex(round_index+1);
                  setGameState("started");
                  console.log("Round started:", response3);
                })
                .catch((error) => {
                  console.error("Error starting round:", error);
                });
            })
            .catch((error) => {
              console.error("Error sending move to server:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error receiving move from server:", error);
      });
   }
   
  };
  const roundwaiting=(gameid: any, round: any,round_index:any,winner:any)=>{

    if(winner==player1){
      roundsWon.player=roundsWon.player+1
    }else if(winner==player2){
      roundsWon.opponent=roundsWon.opponent+1
    }
    if(round_index>=5){
      finishGame()
    }else{
      setGameState("waiting1");
      const timeout=setInterval(() => {
       getData(`games/rounds/`+gameid, { gameId: gameid })
       .then((response) => {
       
        if(response.rounds[round_index]){
         setCurrentRound(response.rounds[round_index].id)
         setThisRoundIndex(round_index+1);
         setGameState("started");
         clearInterval(timeout)
        }
        
       }).catch((error) => {
         console.error("Error receiving move from server:", error);
       });
      }, 1000);
    }
 

  }
  const updateScore = (winner: any) => {
    if (winner === "player") {
      setRoundsWon((prev) => ({
        ...prev,
        player: prev.player + 1,
      }));
    } else if (winner === "opponent") {
      setRoundsWon((prev) => ({
        ...prev,
        opponent: prev.opponent + 1,
      }));
    }
  };
  const createPlayer = (name: any) => {
    // eslint-disable-next-line no-unused-expressions
    postData("players", { username: name })
      .then((response) => {
        setThisPlayer(response.playerId);
        setUserName(name);
        setGameState("lobby");
      })
      .catch((error) => console.error(error));
  };
  return (
    <GameContext.Provider
      value={{
        this_round_index:this_round_index,
        this_player: this_player,
        player1_id: player1,
        player2_id: player2,
        player1_name: userName,
        player2_name: opponent,
        gameId,
        roundsWon,
        currentRound,
        updateScore,
        finishGame,
      }}
    >
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-center text-blue-600">
            Tic-Tac-Toe
          </h1>
          {gameState === "registration" && (
            <UserRegistration
              onSubmit={(name: any) => {
                createPlayer(name);
              }}
            />
          )}
          {gameState === "lobby" && (
            <GameLobby
              userName={userName}
              onStartGame={startGame}
              onJoinGame={joinGame}
            />
          )}
          {gameState === "waiting" && (
            <WaitingRoom
              gameId={gameId}
              onOpponentJoin={simulateOpponentJoin}
            />
          )}
          {gameState === "started" && (
            <GameBoard roundfinished={roundfinished} roundwaiting={roundwaiting} />
          )}
          {gameState === "finish" && (
            <GameFinish roundsWon={roundsWon} roundWinner={gameWin} this_player={this_player}/>
          )}
        </div>
      </div>
    </GameContext.Provider >
  );
}
