-- =============================================================
-- FILE: 02_rls_policies.sql
-- DESCRIPTION: Row Level Security policies para todas las tablas
-- ORDEN DE EJECUCIÓN: 2º (después de 01_schema.sql)
-- =============================================================


-- =============================================================
-- POLICIES: profiles
-- Roles "public" = cualquier usuario (auth o anon).
-- Así el trigger handle_new_user puede hacer INSERT sin problemas.
-- =============================================================

CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  TO public
  USING (auth.uid() = id);


-- =============================================================
-- POLICIES: plantas
-- Solo usuarios autenticados, solo sus propias plantas.
-- =============================================================

CREATE POLICY "Users can create their own plants"
  ON public.plantas
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own plants"
  ON public.plantas
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own plants"
  ON public.plantas
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own plants"
  ON public.plantas
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- =============================================================
-- POLICIES: planta_logs
-- El usuario solo accede a logs de sus propias plantas.
-- =============================================================

CREATE POLICY "Users can insert their own planta logs"
  ON public.planta_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    planta_id IN (
      SELECT id FROM public.plantas
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their own planta logs"
  ON public.planta_logs
  FOR SELECT
  TO authenticated
  USING (
    planta_id IN (
      SELECT id FROM public.plantas
      WHERE user_id = auth.uid()
    )
  );


-- =============================================================
-- POLICIES: favorites
-- ALL = SELECT + INSERT + UPDATE + DELETE en una sola policy.
-- =============================================================

CREATE POLICY "Users can manage their favorites"
  ON public.favorites
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
