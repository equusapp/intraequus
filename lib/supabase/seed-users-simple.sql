-- Script simplificado para crear usuarios de prueba en Supabase
-- Ejecutar en Supabase SQL Editor después de migration-auth.sql

-- IMPORTANTE: Estos usuarios deben crearse primero en Supabase Auth
-- Ve a Authentication > Users en el dashboard de Supabase y crea:
-- 1. admin@equusapp.com (contraseña: admin123)
-- 2. comercial@equusapp.com (contraseña: comercial123)

-- Insertar empresa EQUUS si no existe
INSERT INTO companies (
  id,
  name,
  tax_id,
  address,
  city,
  postal_code,
  country,
  email
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'EQUUS THE HORSING APP, S.L.',
  'B22810535',
  'Calle Ginzo de Limia 53, Piso 17 Puerta A',
  'Madrid',
  '28034',
  'España',
  'info@equusapp.com'
) ON CONFLICT (id) DO NOTHING;

-- Insertar contactos usando UUIDs generados automáticamente
WITH contact_inserts AS (
  INSERT INTO contacts (
    company_id,
    name,
    tax_id,
    email,
    phone,
    type
  ) VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174000',
    'Club Hípico Madrid',
    'B12345678',
    'info@clubhipicomadrid.com',
    '+34 911 222 333',
    'client'
  ),
  (
    '123e4567-e89b-12d3-a456-426614174000',
    'Escuela Los Pinos',
    'B11223344',
    'escuela@lospinos.com',
    '+34 633 444 555',
    'client'
  ),
  (
    '123e4567-e89b-12d3-a456-426614174000',
    'Veterinaria Equina S.L.',
    'B87654321',
    'contacto@veterinariaequina.es',
    '+34 622 333 444',
    'supplier'
  )
  ON CONFLICT DO NOTHING
  RETURNING id, name
)
SELECT 'Contactos insertados:' as info, count(*) as total FROM contact_inserts;

-- PASO MANUAL: Después de ejecutar este script
-- 1. Ve a Authentication > Users y copia los UUIDs de los usuarios creados
-- 2. Ejecuta estos comandos reemplazando los UUIDs:

-- Ejemplo para insertar perfiles (REEMPLAZAR UUIDs):
/*
INSERT INTO user_profiles (
  id,
  company_id,
  email,
  full_name,
  role,
  is_active
) VALUES 
(
  'UUID_REAL_DEL_ADMIN', -- Reemplazar con UUID real
  '123e4567-e89b-12d3-a456-426614174000',
  'admin@equusapp.com',
  'Administrador EQUUS',
  'admin',
  true
),
(
  'UUID_REAL_DEL_COMERCIAL', -- Reemplazar con UUID real
  '123e4567-e89b-12d3-a456-426614174000',
  'comercial@equusapp.com',
  'Usuario Comercial',
  'comercial',
  true
) ON CONFLICT (id) DO NOTHING;
*/

-- Ejemplo para asignar cliente al comercial (REEMPLAZAR UUIDs):
/*
INSERT INTO user_client_permissions (
  user_id,
  contact_id
) 
SELECT 
  'UUID_REAL_DEL_COMERCIAL', -- Reemplazar con UUID real del comercial
  id
FROM contacts 
WHERE name = 'Club Hípico Madrid'
ON CONFLICT (user_id, contact_id) DO NOTHING;
*/

-- Verificar datos insertados
SELECT 'Empresas:' as tabla, count(*) as total FROM companies
UNION ALL
SELECT 'Contactos:' as tabla, count(*) as total FROM contacts
UNION ALL
SELECT 'Perfiles de usuario:' as tabla, count(*) as total FROM user_profiles
UNION ALL
SELECT 'Permisos de cliente:' as tabla, count(*) as total FROM user_client_permissions;
