-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Ejercicios Maestros (Catálogo)
-- Se quita usuario_id si es un catálogo global, pero el usuario quiere poder crear nuevos.
-- Así que añadimos usuario_id (opcional para predefinidos) para que cada uno tenga los suyos.
CREATE TABLE ejercicios_catalogo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES auth.users(id), -- NULL para ejercicios globales del sistema
  nombre TEXT NOT NULL,
  grupo_muscular TEXT,
  notas_tecnicas TEXT,
  creado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, nombre) -- Un usuario no puede tener dos ejercicios con el mismo nombre
);

-- 3. Tabla de Rutinas (Plantillas)
CREATE TABLE rutinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  creado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Ejercicios por Rutina (Estructura de la plantilla)
CREATE TABLE ejercicios_rutina (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rutina_id UUID NOT NULL REFERENCES rutinas(id) ON DELETE CASCADE,
  ejercicio_id UUID NOT NULL REFERENCES ejercicios_catalogo(id) ON DELETE CASCADE,
  orden INTEGER NOT NULL,
  comentarios_tecnicos_personalizados TEXT -- Notas que el usuario quiere ver siempre en esta rutina para este ejercicio
);

-- 5. Tabla de Sesiones (Instancias reales de entrenamiento)
CREATE TABLE sesiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rutina_id UUID REFERENCES rutinas(id) ON DELETE SET NULL, -- Puede ser una sesión improvisada
  nombre TEXT DEFAULT 'Entrenamiento sin nombre',
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  comentarios_dia TEXT
);

-- 6. Tabla de Ejercicios por Sesión
CREATE TABLE ejercicios_sesion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesion_id UUID NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
  ejercicio_id UUID NOT NULL REFERENCES ejercicios_catalogo(id) ON DELETE CASCADE,
  orden INTEGER NOT NULL,
  comentarios_ejercicio_dia TEXT -- Notas específicas del esfuerzo de hoy
);

-- 7. Tabla de Series (Sets)
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ejercicio_sesion_id UUID NOT NULL REFERENCES ejercicios_sesion(id) ON DELETE CASCADE,
  peso DECIMAL NOT NULL DEFAULT 0,
  repeticiones INTEGER NOT NULL DEFAULT 0,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  completada BOOLEAN DEFAULT FALSE,
  creado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Seguridad (RLS)
ALTER TABLE ejercicios_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ejercicios_rutina ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ejercicios_sesion ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;

-- Políticas de ejercicios_catalogo (Ver globales o propios)
CREATE POLICY "Usuarios pueden ver ejercicios globales y propios" 
ON ejercicios_catalogo FOR SELECT 
USING (usuario_id IS NULL OR auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propios ejercicios" 
ON ejercicios_catalogo FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

-- Políticas generales (Solo dueño)
CREATE POLICY "Solo dueños pueden gestionar sus rutinas" ON rutinas
FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Solo dueños pueden gestionar sus ejercicios_rutina" ON ejercicios_rutina
FOR ALL USING (EXISTS (
  SELECT 1 FROM rutinas WHERE id = rutina_id AND usuario_id = auth.uid()
));

CREATE POLICY "Solo dueños pueden gestionar sus sesiones" ON sesiones
FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Solo dueños pueden gestionar sus ejercicios_sesion" ON ejercicios_sesion
FOR ALL USING (EXISTS (
  SELECT 1 FROM sesiones WHERE id = sesion_id AND usuario_id = auth.uid()
));

CREATE POLICY "Solo dueños pueden gestionar sus series" ON series
FOR ALL USING (EXISTS (
  SELECT 1 FROM ejercicios_sesion 
  JOIN sesiones ON ejercicios_sesion.sesion_id = sesiones.id
  WHERE ejercicios_sesion.id = ejercicio_sesion_id AND sesiones.usuario_id = auth.uid()
));

-- 9. Índices para rendimiento (supabase-postgres-best-practices)
CREATE INDEX idx_sesiones_usuario_fecha ON sesiones(usuario_id, fecha);
CREATE INDEX idx_rutinas_usuario ON rutinas(usuario_id);
CREATE INDEX idx_ejercicios_sesion_sesion ON ejercicios_sesion(sesion_id);
CREATE INDEX idx_series_ejercicio_sesion ON series(ejercicio_sesion_id);
