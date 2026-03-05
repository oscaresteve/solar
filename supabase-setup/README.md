# 🌿 Supabase Setup — Solar

Guía para replicar desde cero la base de datos, políticas de seguridad y storage del proyecto.

---

## 📁 Estructura de archivos

```
supabase-setup/
├── 01_schema.sql       # Tablas + trigger de auto-perfil
├── 02_rls_policies.sql # Row Level Security (RLS) policies
├── 03_storage.sql      # Buckets de Storage + sus policies
├── 04_seed_data.sql    # Datos de prueba realistas (opcional)
└── README.md           # Esta guía
```

---

## 🗄️ Modelo de datos

```
auth.users (Supabase interno)
    │
    ├── profiles          (1:1) — Datos del usuario (nombre, foto)
    ├── plantas           (1:N) — Plantas energéticas del usuario
    │       └── planta_logs   (1:N) — Logs de producción/consumo
    └── favorites         (N:M) — Plantas favoritas del usuario
```

### Tablas

| Tabla         | Descripción                                                                               |
| ------------- | ----------------------------------------------------------------------------------------- |
| `profiles`    | Perfil extendido del usuario. Se crea automáticamente al registrarse mediante un trigger. |
| `plantas`     | Instalaciones energéticas (solar, eólica…). Cada una pertenece a un usuario.              |
| `planta_logs` | Registros históricos de producción y consumo de cada planta.                              |
| `favorites`   | Relación entre usuarios y sus plantas favoritas.                                          |

### Buckets de Storage

| Bucket     | Acceso       | Límite | Tipos permitidos |
| ---------- | ------------ | ------ | ---------------- |
| `plantas`  | Autenticado  | 5 MB   | JPEG, PNG, WebP  |
| `profiles` | Público/Auth | 2 MB   | JPEG, PNG, WebP  |

---

## ⚙️ Prerrequisitos

- Cuenta en [supabase.com](https://supabase.com) (plan Free es suficiente)
- Proyecto Supabase creado

---

## 🚀 Setup

### 1. Crear el proyecto en Supabase

1. Ve a [app.supabase.com](https://app.supabase.com) → **New Project**
2. Elige nombre, contraseña de BD y región
3. Espera ~2 minutos a que esté listo

### 2. Habilitar autenticación por email

1. En el Dashboard: **Authentication → Providers**
2. Activa **Email** y desactiva "Confirm email" si estás en desarrollo
3. Guarda los cambios

### 3. Ejecutar los SQL en orden

Ve a **SQL Editor** en el Dashboard y ejecuta cada archivo en este orden:

#### 3.1 — Tablas y trigger (`01_schema.sql`)

```sql
-- Pega y ejecuta el contenido completo de 01_schema.sql
```

✅ Verifica en **Table Editor** que aparecen: `profiles`, `plantas`, `planta_logs`, `favorites`

#### 3.2 — RLS Policies (`02_rls_policies.sql`)

```sql
-- Pega y ejecuta el contenido completo de 02_rls_policies.sql
```

✅ Verifica en **Database → Policies** que cada tabla tiene sus políticas

#### 3.3 — Storage y sus policies (`03_storage.sql`)

```sql
-- Pega y ejecuta el contenido completo de 03_storage.sql
```

✅ Verifica en **Storage** que aparecen los buckets: `plantas` y `profiles`

### 4. Configurar el proyecto Angular

Crea o edita el archivo `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  SUPABASE_URL: 'https://TU_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'TU_ANON_KEY', // Dashboard → Settings → API → anon public
};
```

> ⚠️ **Nunca** comitees el `service_role` key en el repositorio.
> El `anon` key es seguro para el frontend gracias a las RLS policies.

### 5. (Opcional) Cargar datos de prueba

El seed requiere que exista un usuario real en Supabase. Sigue estos pasos antes de ejecutarlo:

**Paso 1 — Crear el usuario en el Dashboard:**

1. Ve a **Authentication → Users → Add user**
2. Introduce el email y contraseña que quieras usar
3. Copia el **UUID** que Supabase genera para ese usuario (columna `UID`)

**Paso 2 — Reemplazar el UUID en el archivo:**

Abre `04_seed_data.sql` y sustituye **todas las ocurrencias** de:

```
a1b2c3d4-aaaa-aaaa-aaaa-000000000001
```

por el UUID real que copiaste. Hay ocurrencias en las secciones de `profiles`, `plantas` y `favorites`.

**Paso 3 — Ejecutar el seed:**

Pega y ejecuta el contenido de `04_seed_data.sql` en el **SQL Editor**. Al final del script se mostrará una tabla de verificación con los conteos esperados: 1 / 1 / 10 / 78 / 5.

---

## 🔐 Resumen de seguridad (RLS)

### Tabla `profiles`

| Operación | Quién puede | Condición         |
| --------- | ----------- | ----------------- |
| INSERT    | public      | `auth.uid() = id` |
| SELECT    | public      | `auth.uid() = id` |
| UPDATE    | public      | `auth.uid() = id` |
| DELETE    | public      | `auth.uid() = id` |

> **Nota:** Se usa rol `public` para permitir que el trigger `handle_new_user` inserte el perfil automáticamente al registrarse.

### Tabla `plantas`

| Operación | Quién puede   | Condición              |
| --------- | ------------- | ---------------------- |
| INSERT    | authenticated | `user_id = auth.uid()` |
| SELECT    | authenticated | `user_id = auth.uid()` |
| UPDATE    | authenticated | `user_id = auth.uid()` |
| DELETE    | authenticated | `user_id = auth.uid()` |

### Tabla `planta_logs`

| Operación | Quién puede   | Condición                                      |
| --------- | ------------- | ---------------------------------------------- |
| INSERT    | authenticated | `planta_id` pertenece a una planta del usuario |
| SELECT    | authenticated | `planta_id` pertenece a una planta del usuario |

### Tabla `favorites`

| Operación | Quién puede   | Condición              |
| --------- | ------------- | ---------------------- |
| ALL       | authenticated | `user_id = auth.uid()` |

---

## 🪣 Resumen de Storage

### Bucket `plantas`

| Operación | Rol           | Condición               |
| --------- | ------------- | ----------------------- |
| INSERT    | authenticated | `bucket_id = 'plantas'` |
| SELECT    | authenticated | `bucket_id = 'plantas'` |
| UPDATE    | authenticated | `bucket_id = 'plantas'` |
| DELETE    | authenticated | `bucket_id = 'plantas'` |

### Bucket `profiles`

| Operación | Rol           | Condición                |
| --------- | ------------- | ------------------------ |
| INSERT    | authenticated | `bucket_id = 'profiles'` |
| SELECT    | public        | `bucket_id = 'profiles'` |
| UPDATE    | authenticated | `bucket_id = 'profiles'` |
| DELETE    | public        | `bucket_id = 'profiles'` |

---

## 🔄 Trigger automático de perfiles

Al registrarse un usuario, se crea automáticamente su fila en `profiles`:

```sql
-- Se ejecuta sólo con: supabase.auth.signUp({ email, password })
-- No necesitas llamarlo manualmente desde Angular.
```

En Angular, después del registro solo necesitas actualizar el nombre/foto:

```typescript
const {
  data: { user },
} = await this.supabase.auth.signUp({ email, password });
// El perfil ya existe en profiles con id = user.id
// Solo actualiza los campos extra si los tienes:
await this.supabase.from('profiles').update({ first_name, last_name }).eq('id', user.id);
```

---

## ❓ Problemas frecuentes

**`new row violates row-level security policy`**
→ Asegúrate de estar autenticado antes de hacer queries. Verifica que ejecutaste `02_rls_policies.sql`.

**`relation "public.plantas" does not exist`**
→ Ejecuta `01_schema.sql` primero. El orden importa.

**`insert or update violates foreign key constraint "profiles_id_fkey"`**
→ El UUID del seed no coincide con ningún usuario real. Crea el usuario en **Authentication → Users** y reemplaza el UUID en `04_seed_data.sql` antes de ejecutarlo.

**Bucket ya existe al re-ejecutar**
→ Normal. El SQL usa `ON CONFLICT DO NOTHING`, es seguro volver a ejecutar.

**Las fotos no se cargan**
→ Verifica que el bucket no sea público y usa `supabase.storage.from('plantas').createSignedUrl(...)` para generar URLs firmadas temporales.

---

## 📚 Referencias

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/access-control)
- [Angular + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-angular)
