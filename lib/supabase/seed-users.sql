-- Script para crear usuarios de prueba en Supabase
-- Ejecutar en Supabase SQL Editor después de configurar el esquema

-- IMPORTANTE: Estos usuarios deben crearse primero en Supabase Auth
-- Ve a Authentication > Users en el dashboard de Supabase y crea:
-- 1. admin@equusapp.com (contraseña: admin123)
-- 2. comercial@equusapp.com (contraseña: comercial123)

-- Una vez creados en Auth, ejecuta este script para crear sus perfiles

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

-- Insertar perfiles de usuario
-- NOTA: Reemplaza los UUIDs con los IDs reales de auth.users después de crear los usuarios

-- Usuario Administrador
INSERT INTO user_profiles (
  id, -- Reemplazar con el UUID real del usuario admin de auth.users
  company_id,
  email,
  full_name,
  role,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- CAMBIAR por UUID real
  '123e4567-e89b-12d3-a456-426614174000',
  'admin@equusapp.com',
  'Administrador EQUUS',
  'admin',
  true
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Usuario Comercial
INSERT INTO user_profiles (
  id, -- Reemplazar con el UUID real del usuario comercial de auth.users
  company_id,
  email,
  full_name,
  role,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000002', -- CAMBIAR por UUID real
  '123e4567-e89b-12d3-a456-426614174000',
  'comercial@equusapp.com',
  'Usuario Comercial',
  'comercial',
  true
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Insertar algunos contactos de ejemplo si no existen
INSERT INTO contacts (
  id,
  company_id,
  name,
  tax_id,
  email,
  phone,
  type
) VALUES 
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  '123e4567-e89b-12d3-a456-426614174000',
  'Club Hípico Madrid',
  'B12345678',
  'info@clubhipicomadrid.com',
  '+34 911 222 333',
  'client'
),
(
  'b2c3d4e5-f6a7-8901-2345-678901bcdef0',
  '123e4567-e89b-12d3-a456-426614174000',
  'Escuela Los Pinos',
  'B11223344',
  'escuela@lospinos.com',
  '+34 633 444 555',
  'client'
),
(
  'c3d4e5f6-a7b8-9012-3456-789012cdef01',
  '123e4567-e89b-12d3-a456-426614174000',
  'Veterinaria Equina S.L.',
  'B87654321',
  'contacto@veterinariaequina.es',
  '+34 622 333 444',
  'supplier'
) ON CONFLICT (id) DO NOTHING;

-- Asignar solo el Club Hípico Madrid al usuario comercial
-- NOTA: Cambiar el user_id por el UUID real del usuario comercial
INSERT INTO user_client_permissions (
  user_id,
  contact_id
) VALUES (
  '00000000-0000-0000-0000-000000000002', -- CAMBIAR por UUID real del comercial
  'a1b2c3d4-e5f6-7890-1234-567890abcdef' -- UUID del Club Hípico Madrid
) ON CONFLICT (user_id, contact_id) DO NOTHING;

-- Verificar que todo se insertó correctamente
SELECT 'Empresas creadas:' as info, count(*) as total FROM companies;
SELECT 'Perfiles de usuario creados:' as info, count(*) as total FROM user_profiles;
SELECT 'Contactos creados:' as info, count(*) as total FROM contacts;
SELECT 'Permisos asignados:' as info, count(*) as total FROM user_client_permissions;
