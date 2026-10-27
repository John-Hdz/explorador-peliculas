import { createClient } from '@supabase/supabase-js';

// Leer variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const tmdbApiKey = process.env.TMDB_API_KEY;

if (!supabaseUrl || !supabaseKey || !tmdbApiKey) {
  console.error('❌ Error: Faltan variables de entorno en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrarPeliculas() {
  console.log('🚀 Iniciando la transferencia de datos desde TMDb a Supabase...');
  
  const totalPaginas = 5; // Descargaremos 5 páginas (~100 películas)
  let peliculasInsertadas = 0;

  for (let page = 1; page <= totalPaginas; page++) {
    console.log(`📥 Obteniendo página ${page}...`);
    
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=es-MX&page=${page}`
      );
      
      const data = await response.json();

      if (!data.results) {
        console.error(`❌ Error en la respuesta de TMDb:`, data);
        break;
      }

      // Mapear los datos de TMDb al formato de nuestra tabla 'movies'
      const moviesToInsert = data.results.map((item) => ({
        id: item.id,
        title: item.title,
        poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        release_year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
        description: item.overview || 'Sin descripción disponible.',
        rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0.0,
      }));

      // Insertar o actualizar (upsert) en Supabase para evitar duplicados
      const { error } = await supabase.from('movies').upsert(moviesToInsert, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error al insertar la página ${page} en Supabase:`, error.message);
      } else {
        peliculasInsertadas += moviesToInsert.length;
        console.log(`✅ Página ${page} migrada correctamente (${moviesToInsert.length} películas).`);
      }
    } catch (err) {
      console.error(`❌ Error inesperado en la página ${page}:`, err);
    }
  }

  console.log(`\n🎉 Migración finalizada. Total de películas procesadas: ${peliculasInsertadas}`);
}

migrarPeliculas();