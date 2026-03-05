-- =============================================================
-- FILE: 03_storage.sql
-- DESCRIPTION: Buckets de Storage y sus policies
-- ORDEN DE EJECUCIÓN: 3º (después de 01_schema.sql)
-- NOTA: Ejecutar desde el SQL Editor del Dashboard de Supabase.
--       La extensión "storage" ya está habilitada por defecto.
-- =============================================================


-- =============================================================
-- BUCKETS
-- public = false → acceso controlado por policies (recomendado)
-- Si quieres URLs públicas directas, cambia a public = true,
-- pero entonces cualquiera con la URL puede ver el archivo.
-- =============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'plantas',
    'plantas',
    TRUE,
    5242880,                                           -- 5 MB máximo por archivo
    ARRAY['image/jpeg', 'image/png', 'image/webp']    -- solo imágenes
  ),
  (
    'profiles',
    'profiles',
    TRUE,
    2097152,                                           -- 2 MB máximo por archivo
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO NOTHING;   -- idempotente: no falla si ya existen


-- =============================================================
-- STORAGE POLICIES: bucket "plantas"
-- Solo usuarios autenticados pueden operar sobre sus archivos.
-- =============================================================

-- INSERT (subir foto de planta)
CREATE POLICY "Authenticated users can insert files to plantas"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'plantas');

-- SELECT (leer/descargar foto de planta)
CREATE POLICY "Authenticated users can select files from plantas"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'plantas');

-- UPDATE (reemplazar foto de planta)
CREATE POLICY "Authenticated users can update files in plantas"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'plantas');

-- DELETE (borrar foto de planta)
CREATE POLICY "Authenticated users can delete files from plantas"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'plantas');


-- =============================================================
-- STORAGE POLICIES: bucket "profiles"
-- Rol "public" para que el trigger pueda crear el perfil
-- y subir avatar antes de que el JWT esté disponible.
-- =============================================================

-- INSERT (subir avatar de perfil)
CREATE POLICY "Authenticated users can insert files to profiles"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profiles');

-- SELECT (leer avatar de perfil)
CREATE POLICY "Public can select files from profiles"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profiles');

-- UPDATE (actualizar avatar de perfil)
CREATE POLICY "Authenticated users can update files in profiles"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profiles');

-- DELETE (borrar avatar de perfil)
CREATE POLICY "Public can delete files from profiles"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'profiles');
