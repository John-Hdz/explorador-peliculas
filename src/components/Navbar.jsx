import React from 'react';

export default function Navbar({ user, searchTerm, setSearchTerm, onLogout }) {
  return (
    <nav className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800">
      <div className="flex items-center gap-6">
        <h1 className="text-3xl font-black text-red-600 tracking-wider">NETFLIX</h1>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700 hidden md:inline">
          Supabase DB Engine
        </span>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Buscar película por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black/60 border border-gray-700 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:border-red-600 w-full sm:w-64 transition"
        />

        {user && (
          <button
            onClick={onLogout}
            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50 text-xs font-semibold px-3 py-2 rounded transition whitespace-nowrap"
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}