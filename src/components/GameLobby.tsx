import React, { useEffect, useState } from 'react';
import { UsersIcon, PlayIcon, ArrowRightIcon } from 'lucide-react';
import { getData } from "../api";
export const GameLobby = ({
  userName,
  onStartGame,
  onJoinGame
}) => {
  // Simulated waiting players
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  useEffect(() => {
    setInterval(function () {
      getData("games").then((response) => {
        setWaitingPlayers(response);
      })
       .catch((error) => console.error(error));

    }, 2000);
    

  }, []);


  
  return <div className="text-center">
      <h2 className="mb-2 text-xl font-semibold">Welcome, {userName}!</h2>
      <p className="mb-6 text-gray-600">
        Start a new game or join an existing one
      </p>
      <button onClick={onStartGame} className="flex items-center justify-center w-full gap-2 px-4 py-3 mb-6 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
        <PlayIcon className="w-5 h-5" />
        <span>Start New Game</span>
      </button>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <UsersIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium">Waiting Players</h3>
        </div>
        {waitingPlayers.length === 0 ? <p className="italic text-gray-500">No players waiting</p> : <ul className="border-t border-b divide-y divide-gray-200">
            {waitingPlayers.map((game:any) => <li key={game.gameId} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{game.player1Name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(game.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button onClick={() => onJoinGame(game.player1Name, game.gameId)} className="flex items-center gap-1 px-3 py-1 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700">
                  <span>Join</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </li>)}
          </ul>}
      </div>
    </div>;
};