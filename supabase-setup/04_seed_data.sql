-- =============================================================
-- FILE: 04_seed_full.sql
-- SEED COMPLETO PARA TESTING DE LA APLICACIÓN
-- Genera:
--   - Profile del admin
--   - Plantas solares por toda España
--   - Logs variados (muchas fechas)
--   - Favoritos
--
-- IMPORTANTE:
-- 1. Crear primero el usuario en Supabase Auth
-- 2. Reemplazar REEMPLAZAR_UUID_ADMIN
-- =============================================================

DO $$
DECLARE

admin_uuid UUID := 'REEMPLAZAR_UUID_ADMIN';

i INTEGER;
planta_record RECORD;

mensajes TEXT[] := ARRAY[
'Producción dentro de parámetros normales.',
'Radiación solar excepcionalmente alta.',
'Producción reducida por nubosidad.',
'Pico de producción durante horas centrales.',
'Mantenimiento preventivo realizado.',
'Revisión técnica sin incidencias.',
'Variación en el consumo interno.',
'Condiciones meteorológicas adversas.',
'Producción máxima registrada en el periodo.',
'Optimización del inversor aplicada.',
'Pequeñas fluctuaciones en la red.',
'Monitorización automática activa.',
'Producción afectada por mantenimiento.',
'Condiciones óptimas de funcionamiento.',
'Sistema operando a plena capacidad.'
];

BEGIN

-- =============================================================
-- PROFILE
-- =============================================================

INSERT INTO public.profiles
(id, first_name, last_name)
VALUES
(admin_uuid,'Admin','Energy')
ON CONFLICT (id) DO UPDATE
SET
first_name = EXCLUDED.first_name,
last_name = EXCLUDED.last_name,


-- =============================================================
-- PLANTAS SOLARES POR ESPAÑA
-- =============================================================

INSERT INTO public.plantas
(name,capacity,user_id,latitude,longitude,description)
VALUES

(
'Complejo Solar Extremadura I',
18000,
admin_uuid,
38.8794,
-6.9707,
'Uno de los mayores complejos fotovoltaicos del suroeste peninsular. Miles de paneles solares con tecnología de seguimiento permiten maximizar la producción energética en una región con altísima irradiación solar.'
),

(
'Parque Solar Andalucía Sur',
15000,
admin_uuid,
37.3891,
-5.9845,
'Infraestructura energética diseñada para aprovechar las más de tres mil horas de sol anuales del sur de España, convirtiéndose en un pilar estratégico para la transición energética.'
),

(
'Central Solar Castilla La Mancha',
13000,
admin_uuid,
39.8628,
-4.0273,
'Parque fotovoltaico situado en una extensa llanura con condiciones ideales para la generación de energía renovable a gran escala.'
),

(
'Complejo Solar Aragón Horizonte',
16000,
admin_uuid,
41.6488,
-0.8891,
'Instalación solar de última generación diseñada para maximizar la captación de energía incluso en condiciones atmosféricas variables.'
),

(
'Parque Solar Levante Mediterráneo',
14000,
admin_uuid,
38.3452,
-0.4810,
'Planta fotovoltaica costera que combina eficiencia energética con integración ambiental en el ecosistema mediterráneo.'
),

(
'Central Solar Cataluña Energía',
13500,
admin_uuid,
41.3874,
2.1686,
'Centro avanzado de producción energética que contribuye al suministro renovable del noreste peninsular.'
),

(
'Parque Fotovoltaico Castilla Norte',
11000,
admin_uuid,
41.6523,
-4.7245,
'Instalación solar situada en una meseta con gran exposición solar anual y condiciones óptimas de generación.'
),

(
'Planta Solar Galicia Atlántica',
9000,
admin_uuid,
42.8782,
-8.5448,
'Proyecto fotovoltaico diseñado para mantener una producción estable incluso en entornos de climatología variable.'
),

(
'Complejo Solar Madrid Central',
10000,
admin_uuid,
40.4168,
-3.7038,
'Infraestructura energética que contribuye al suministro sostenible del área metropolitana.'
),

(
'Parque Solar Baleares Renovables',
8000,
admin_uuid,
39.5696,
2.6502,
'Instalación fotovoltaica diseñada para reforzar la autosuficiencia energética del archipiélago.'
);


-- =============================================================
-- GENERACIÓN MASIVA DE LOGS (FECHAS MUY VARIADAS)
-- =============================================================

FOR planta_record IN
SELECT id FROM public.plantas WHERE user_id = admin_uuid
LOOP

FOR i IN 1..250 LOOP

INSERT INTO public.planta_logs
(
planta_id,
created_at,
production,
consumption,
message
)
VALUES
(
planta_record.id,

timestamp '2022-01-01'
+ random() * (timestamp '2026-12-31' - timestamp '2022-01-01'),

(random()*18000)::BIGINT,

(random()*5000)::BIGINT,

mensajes[(floor(random()*array_length(mensajes,1))+1)::int]
);

END LOOP;

END LOOP;


-- =============================================================
-- CASOS EXTREMOS PARA TESTING
-- =============================================================

INSERT INTO public.planta_logs
(planta_id,created_at,production,consumption,message)
SELECT
id,
now(),
0,
0,
'Fallo total del sistema detectado.'
FROM public.plantas
WHERE user_id = admin_uuid;


INSERT INTO public.planta_logs
(planta_id,created_at,production,consumption,message)
SELECT
id,
now() - interval '2 days',
25000,
100,
'Récord histórico de producción solar.'
FROM public.plantas
WHERE user_id = admin_uuid;


-- =============================================================
-- FAVORITOS
-- =============================================================

INSERT INTO public.favorites
(user_id,planta_id)
SELECT
admin_uuid,
id
FROM public.plantas
WHERE user_id = admin_uuid
ORDER BY random()
LIMIT 4;


END $$;