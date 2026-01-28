import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-4 border-none rounded-xl bg-white shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-base transition-shadow"
        placeholder="Bina adı veya adres ara..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
