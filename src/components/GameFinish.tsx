import React, { useEffect, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { getData, postData } from '../api';
export const GameFinish = ({roundsWon,roundWinner,this_player}) => {
  const [waitTime, setWaitTime] = useState(0);
  useEffect(() => {
   
  });
  return <div className="py-10 text-center">
      
    
      <div className="text-center">
      <h2 className="mb-2 text-xl font-semibold"> {roundsWon.player} - {roundsWon.opponent}</h2>
         
        </div>
      {/* <div className="flex justify-center mb-6">
        <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin" />
      </div> */}
      <p className="text-gray-500">
      
      </p>
      { <div className={`mb-4 py-2 px-4 rounded-md text-center ${roundWinner == this_player ? 'bg-green-100 text-green-800' :  ((roundWinner != this_player) && (roundWinner!=0)) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          {roundWinner == this_player ? <p>You won !</p> :  ((roundWinner != this_player) && (roundWinner!=0))? <p>
          You Loss !
            </p> : <p>Ended in a draw!</p>}
        </div>}
    </div>;
};