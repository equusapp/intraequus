-- MIGRACIÓN PARA AÑADIR AUTENTICACIÓN A ESQUEMA EXISTENTE
-- Ejecutar este script en Supabase SQL Editor

-- Añadir columnas faltantes a la tabla companies si no existen
DO $$ 
BEGIN
    -- Añadir columna email si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'email') THEN
        ALTER TABLE companies ADD COLUMN email VARCHAR(255);
    END IF;
    
    -- Añadir columna website si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'website') THEN
        ALTER TABLE companies ADD COLUMN website VARCHAR(255);
    END IF;
    
    -- Añadir columna logo_url si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'logo_url') THEN
        ALTER TABLE companies ADD COLUMN logo_url TEXT;
    END IF;
END $$;

-- Crear tabla user_profiles si no existe
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'comercial' CHECK (role IN ('admin', 'comercial')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla user_client_permissions si no existe
CREATE TABLE IF NOT EXISTS user_client_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, contact_id)
);

-- Verificar que las tablas se crearon correctamente
SELECT 'Migración completada' as status;
SELECT 'Tablas de autenticación:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'user_client_permissions')
ORDER BY table_name;
