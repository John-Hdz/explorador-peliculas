import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Navbar from './components/Navbar';
import MovieModal from './components/MovieModal';

const MOVIES_PER_PAGE = 12;

export default function App() {
  const [session, setSession] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 1. Manejo de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Consulta de películas EXCLUSIVAMENTE desde Supabase
  useEffect(() => {
    if (session) {
      fetchMoviesFromSupabase();
    }
  }, [session, currentPage, searchTerm]);

  const fetchMoviesFromSupabase = async () => {
    setLoading(true);

    const from = (currentPage - 1) * MOVIES_PER_PAGE;
    const to = from + MOVIES_PER_PAGE - 1;

    let query = supabase
      .from('movies')
      .select('*', { count: 'exact' });

    // Filtro por búsqueda de título en Supabase
    if (searchTerm.trim() !== '') {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    // Paginación nativa de Supabase
    const { data, count, error } = await query
      .order('rating', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error al consultar Supabase:', error.message);
    } else {
      setMovies(data || []);
      setTotalMovies(count || 0);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <div>
        <Navbar
          user={session?.user}
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            setCurrentPage(1); // Reiniciar a la primera página en cada búsqueda
          }}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-wide">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Películas Populares'}
            </h2>
            <span className="text-sm text-gray-400">
              Total en BD: <strong className="text-white">{totalMovies}</strong>
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 text-red-600 font-bold text-lg">
              Cargando películas desde Supabase...
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No se encontraron películas en la base de datos.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="group relative bg-[#1f1f1f] rounded-md overflow-hidden cursor-pointer transform hover:scale-105 hover:z-30 transition duration-300 shadow-lg border border-gray-800"
                >
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                      Sin Poster
                    </div>
                  )}

                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span>{movie.release_year}</span>
                      <span className="text-yellow-400 font-bold">★ {movie.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <footer className="flex justify-center items-center gap-4 py-8 bg-[#101010] border-t border-gray-800">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded text-sm font-semibold transition"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-400">
            Página <strong className="text-white">{currentPage}</strong> de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 rounded text-sm font-semibold transition"
          >
            Siguiente →
          </button>
        </footer>
      )}

      {/* Modal de Detalle */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}