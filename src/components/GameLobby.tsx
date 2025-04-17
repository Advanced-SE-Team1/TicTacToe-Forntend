import React, { useEffect, useState } from 'react';
import { UsersIcon, PlayIcon, ArrowRightIcon } from 'lucide-react';
import { getData } from "../api";

export const GameLobby = ({ userName, onStartGame, onJoinGame }) => {
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      getData("games")
        .then((response) => setWaitingPlayers(response))
        .catch(console.error);

      getData("players/leaderboard")
        .then((data) => setLeaderboard(data))
        .catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h2 className="mb-2 text-xl font-semibold">Welcome, {userName}!</h2>
      <div className="row">

      </div>
      <p className="mb-6 text-gray-600">Start a new game or join an existing one</p>

      <button
        onClick={onStartGame}
        className="flex items-center justify-center w-full gap-2 px-4 py-3 mb-6 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
      >
        <PlayIcon className="w-5 h-5" />
        <span>Start New Game</span>
      </button>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <UsersIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium">Waiting Players</h3>
        </div>
        {waitingPlayers.length === 0 ? (
          <p className="italic text-gray-500">No players waiting</p>
        ) : (
          <ul className="border-t border-b divide-y divide-gray-200">
            {waitingPlayers.map((game) => (
              <li key={game.gameId} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{game.player1Name}</p>
                  <p className="text-xs text-gray-500">
                    {/* {new Date(game.timestamp).toLocaleTimeString()} */}
                  </p>
                </div>
                <button
                  onClick={() => onJoinGame(game.player1Name, game.gameId)}
                  className="flex items-center gap-1 px-3 py-1 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                >
                  <span>Join</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 mt-10 border rounded shadow-md">
        <h3 className="mb-3 text-lg font-bold text-purple-600">Lead Board</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-700 bg-blue-100">
              <th className="p-2 border border-gray-300">Player Name</th>
              <th className="p-2 border border-gray-300">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={index} className="bg-white">
                <td className="p-2 border border-gray-300">{player?.username}</td>
                <td className="p-2 border border-gray-300">{player?.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};