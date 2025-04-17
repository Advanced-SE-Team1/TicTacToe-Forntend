import React, { useEffect, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { getData, postData } from '../api';
export const WaitingRoom = ({
  gameId,
  onOpponentJoin
}) => {
  const [waitTime, setWaitTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);
    const gameStatesCheck=setInterval(() => {
      getData("games/"+gameId+"/status", {"gameId": gameId})
      .then((response) => {
        if (response.status === "started") {
          onOpponentJoin();
        }
      })
      .catch((error) => console.error(error));
    },2000);
    return () => {
      clearInterval(interval);
      clearInterval(gameStatesCheck);
    };
  }, [onOpponentJoin]);
  return <div className="text-center py-10">
      <h2 className="text-xl font-semibold mb-2">Waiting for an opponent...</h2>
      <p className="text-gray-600 mb-6">
        Game ID:{' '}
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
          {gameId}
        </span>
      </p>
      <div className="flex justify-center mb-6">
        <Loader2Icon className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
      <p className="text-gray-500">
        Waiting for <span className="font-medium">{waitTime}</span> seconds
      </p>
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700">
        <p className="text-sm">
          When another player joins, the game will start automatically.
        </p>
      </div>
    </div>;
};