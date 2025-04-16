import React, { useState } from 'react';
import { UserIcon } from 'lucide-react';
export const UserRegistration = ({
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    onSubmit(name);
  };
  return <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">Enter Your Name</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className={`pl-10 w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your name" value={name} onChange={e => {
          setName(e.target.value);
          setError('');
        }} maxLength={20} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Continue
        </button>
      </form>
    </div>;
};