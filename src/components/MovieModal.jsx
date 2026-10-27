import React from 'react';

export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#181818] text-white rounded-xl overflow-hidden max-w-2xl w-full border border-gray-700 shadow-2xl relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center z-10 font-bold"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full md:w-1/2 object-cover h-80 md:h-auto"
            />
          ) : (
            <div className="w-full md:w-1/2 bg-gray-800 h-80 flex items-center justify-center text-gray-500">
              Sin Poster
            </div>
          )}

          <div className="p-6 flex flex-col justify-between md:w-1/2">
            <div>
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                <span className="text-green-400 font-semibold">{movie.release_year}</span>
                <span className="border border-gray-600 px-1.5 py-0.5 rounded text-xs">HD</span>
                <span className="text-yellow-400 font-bold">★ {movie.rating}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {movie.description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}