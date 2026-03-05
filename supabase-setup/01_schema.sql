-- =============================================================
-- FILE: 01_schema.sql
-- DESCRIPTION: Tablas principales del proyecto educativo Angular
-- ORDEN DE EJECUCIÓN: 1º (antes que policies y storage)
-- =============================================================


-- -------------------------------------------------------------
-- EXTENSIONES NECESARIAS
-- -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================
-- TABLA: profiles
-- Extiende auth.users con datos adicionales del usuario.
-- Se crea automáticamente al registrarse (ver trigger abajo).
-- =============================================================
CREATE TABLE public.profiles (
  id          UUID        NOT NULL,
  first_name  TEXT        NULL,
  last_name   TEXT        NULL,
  photo_path  TEXT        NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
    REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- TABLA: plantas
-- Plantas energéticas del usuario (solar, eólica, etc.)
-- =============================================================
CREATE TABLE public.plantas (
  id          UUID              NOT NULL DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT now(),
  name        TEXT              NOT NULL,
  capacity    BIGINT            NOT NULL,
  user_id     UUID              NOT NULL DEFAULT auth.uid(),
  photo_path  TEXT              NULL,
  latitude    DOUBLE PRECISION  NOT NULL,
  longitude   DOUBLE PRECISION  NOT NULL,
  description TEXT              NULL,
  active      BOOLEAN           NOT NULL DEFAULT TRUE,
  CONSTRAINT planta_pkey PRIMARY KEY (id),
  CONSTRAINT plantas_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users (id)
);

-- Habilitar RLS
ALTER TABLE public.plantas ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- TABLA: planta_logs
-- Registros de producción/consumo por planta.
-- =============================================================
CREATE TABLE public.planta_logs (
  id          UUID        NOT NULL DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  planta_id   UUID        NOT NULL,
  production  BIGINT      NOT NULL DEFAULT 0,
  consumption BIGINT      NOT NULL DEFAULT 0,
  message     TEXT        NULL,
  CONSTRAINT planta_logs_pkey PRIMARY KEY (id),
  CONSTRAINT planta_logs_planta_id_fkey FOREIGN KEY (planta_id)
    REFERENCES public.plantas (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.planta_logs ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- TABLA: favorites
-- Plantas marcadas como favoritas por el usuario.
-- Clave compuesta (user_id + planta_id), sin PK UUID extra.
-- =============================================================
CREATE TABLE public.favorites (
  user_id     UUID        NOT NULL DEFAULT auth.uid(),
  planta_id   UUID        NOT NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT now(),   -- sin TZ (igual que el original)
  CONSTRAINT favorites_planta_id_fkey FOREIGN KEY (planta_id)
    REFERENCES public.plantas (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- TRIGGER: auto-crear perfil al registrarse un usuario
-- Se dispara en cada INSERT en auth.users.
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
