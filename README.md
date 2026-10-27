# Explorador de Películas

Aplicación web para la búsqueda y visualización de catálogo cinematográfico, desarrollada con React, Vite y Supabase. El proyecto implementa un patrón de arquitectura desacoplada que separa la extracción y carga de datos externos del consumo directo en la interfaz de usuario.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Arquitectura de Software](#arquitectura-de-software)
- [Stack Tecnológico](#stack-tecnológico)
- [Modelo de Datos](#modelo-de-datos)
- [Instalación y Configuración](#instalación-y-configuración)
  - [Prerrequisitos](#prerrequisitos)
  - [Variables de Entorno](#variables-de-entorno)
  - [Base de Datos y Seguridad (RLS)](#base-de-datos-y-seguridad-rls)
  - [Proceso de Carga de Datos (ETL)](#proceso-de-carga-de-datos-etl)
  - [Servidor de Desarrollo](#servidor-de-desarrollo)

---

## Descripción General

El objetivo de esta aplicación es ofrecer una experiencia fluida de exploración de películas, garantizando el cumplimiento de restricciones de arquitectura donde la interfaz de usuario interactúa de manera exclusiva con una base de datos propia alojada en Supabase, evitando llamadas directas a APIs de terceros durante la navegación.

---

## Características Principales

- **Autenticación OAuth:** Acceso restringido gestionado mediante proveedor de terceros (GitHub) a través de Supabase Auth.
- **Consumo Exclusivo de Base de Datos:** La interfaz realiza consultas dirigidas únicamente a la instancia de PostgreSQL en Supabase.
- **Búsqueda y Paginación en Servidor:** Filtrado por título mediante cláusulas `ilike` y paginación eficiente de resultados con límites de rango (`range`).
- **Diseño Responsivo e Inmersivo:** Interfaz adaptativa construida con Tailwind CSS v4, que incluye vista de cuadrícula y componente modal para el detalle de registros.

---

## Arquitectura de Software

El sistema está dividido en dos capas independientes:

1. **Pipeline de Migración (ETL / Backend):** Un script ejecutable en Node.js consulta la API pública de The Movie Database (TMDb), aplica las transformaciones requeridas al esquema de datos y ejecuta operaciones de actualización e inserción (*upsert*) en Supabase.
2. **Aplicación Cliente (Frontend):** Una aplicación en React que gestiona la sesión del usuario y consulta los datos persistidos en Supabase mediante `@supabase/supabase-js`.

---

## Stack Tecnológico

- **Frontend:** React, Vite, Tailwind CSS v4, React Router DOM
- **Backend & Almacenamiento:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Herramientas ETL:** Node.js, Fetch API
- **Fuente de Datos Externa:** The Movie Database (TMDb REST API)

---

## Modelo de Datos

Estructura de la tabla `movies` en Supabase:

| Campo | Tipo | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY | Identificador único de la película (asociado a TMDb) |
| `title` | TEXT | NOT NULL | Título oficial de la obra |
| `poster_url` | TEXT | NULLABLE | Dirección URL del póster promocional |
| `release_year` | VARCHAR(4) | NULLABLE | Año de estreno |
| `description` | TEXT | NULLABLE | Sinopsis o resumen argumental |
| `rating` | DECIMAL(3,1) | NULLABLE | Calificación promedio |

---

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 20.6.0 o superior para el soporte nativo de `--env-file`).
- Proyecto activo en Supabase.
- Clave de API de desarrollador en The Movie Database (TMDb).

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con la siguiente configuración:

```env
VITE_SUPABASE_URL=[https://tu-proyecto.supabase.co](https://tu-proyecto.supabase.co)
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
TMDB_API_KEY=tu_api_key_de_tmdb

```

### Base de Datos y Seguridad (RLS)

Ejecuta el siguiente bloque SQL en el **SQL Editor** de Supabase para estructurar la tabla y definir las políticas de acceso:

```sql
CREATE TABLE movies (
    id BIGINT PRIMARY KEY, 
    title TEXT NOT NULL,
    poster_url TEXT,
    release_year VARCHAR(4),
    description TEXT,
    rating DECIMAL(3,1)
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso total a movies" ON movies
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

```

### Proceso de Carga de Datos (ETL)

Para transferir los registros desde la API de TMDb hacia la base de datos de Supabase, ejecuta:

```bash
node --env-file=.env.local migrador.js

```

### Servidor de Desarrollo

1. Instala las dependencias del proyecto:
```bash
npm install

```


2. Inicia el servidor local de desarrollo:
```bash
npm run dev

```


3. Accede a la aplicación desde el navegador en `http://localhost:5173`.
