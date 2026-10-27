import React from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const handleLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 px-4">
      <div className="bg-[#141414] p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-800 text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-2 tracking-wider">NETFLIX</h1>
        <h2 className="text-xl text-white font-semibold mb-6">Explorador de Películas</h2>
        <p className="text-gray-400 text-sm mb-8">
          Inicia sesión para consultar el catálogo alojado en Supabase.
        </p>
        
        <button
          onClick={() => handleLogin('github')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Continuar con GitHub</span>
        </button>
      </div>
    </div>
  );
}