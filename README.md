# 🌿 Solar

Proyecto de **DWEC (2.ª evaluación)** desarrollado con **Angular 21** y **Supabase (BaaS)**.

## ¿De qué trata?

Aplicación para gestionar plantas energéticas:

- Alta y edición de plantas.
- Registro de logs de producción/consumo por planta.
- Gestión de favoritos y perfil de usuario.
- Autenticación y almacenamiento de imágenes con Supabase.

## ⚙ Stack

- Angular 21
- Supabase (Auth, PostgreSQL, RLS y Storage)

## 🚀 Cómo arrancar el proyecto

1. Instala dependencias:

```bash
npm install
```

2. Configura variables de entorno en `src/environments/environment.development.ts`:

```ts
export const environment = {
  production: false,
  SUPABASE_URL: 'https://TU_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'TU_ANON_KEY',
};
```

3. Arranca en desarrollo:

```bash
npm start
```

La app quedará disponible en `http://localhost:4200/`.

## 🔌 Replicar backend (Supabase)

Todas las instrucciones para replicar la base de datos, políticas RLS, storage y seed están en:

- `supabase-setup/README.md`

Ejecuta los SQL en el orden indicado dentro de esa guía.
