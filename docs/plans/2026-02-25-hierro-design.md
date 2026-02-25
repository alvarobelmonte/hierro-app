# Diseño Técnico: Hierro PWA (Workout Tracker)

**Fecha**: 2026-02-25
**Estado**: Borrador (Esperando Aprobación)

## 1. Arquitectura de Datos (SQL)

La base de datos se estructurará en 3 niveles: **Catálogo**, **Plantillas (Rutinas)** y **Ejecución (Sesiones)**.

```sql
-- Catálogo de ejercicios maestros
CREATE TABLE ejercicios_catalogo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT UNIQUE NOT NULL,
  grupo_muscular TEXT,
  notas_tecnicas TEXT -- Comentarios persistentes sobre técnica
);

-- Plantillas de entrenamiento
CREATE TABLE rutinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  creado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Composición de las plantillas (Ejercicios que pertenecen a una rutina)
CREATE TABLE ejercicios_rutina (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rutina_id UUID REFERENCES rutinas(id) ON DELETE CASCADE,
  ejercicio_id UUID REFERENCES ejercicios_catalogo(id),
  orden INTEGER
);

-- Instancias de entrenamiento REALES
CREATE TABLE sesiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL,
  rutina_id UUID REFERENCES rutinas(id) ON DELETE SET NULL,
  nombre TEXT DEFAULT 'Entrenamiento sin nombre',
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  comentarios_dia TEXT -- Notas generales del entreno
);

CREATE TABLE ejercicios_sesion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesion_id UUID REFERENCES sesiones(id) ON DELETE CASCADE,
  ejercicio_id UUID REFERENCES ejercicios_catalogo(id),
  orden INTEGER,
  comentarios_ejercicio_dia TEXT -- Notas específicas de hoy
);

CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ejercicio_sesion_id UUID REFERENCES ejercicios_sesion(id) ON DELETE CASCADE,
  peso DECIMAL NOT NULL,
  repeticiones INTEGER NOT NULL,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  completada BOOLEAN DEFAULT FALSE,
  creado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Componentes Clave y Lógica

### Heatmap (Actividad Binaria)
- Se consultará la tabla `sesiones` agrupando por día.
- Si existe al menos 1 fila en un día X, el cuadro se pinta de color `#ddee5e`.
- Optimización: Vista SQL simple o RPC en Supabase.

### Lógica de PRs (Récords Personales)
- Consulta dinámica: `MAX(peso)` agrupado por `ejercicio_id` filtrando por `usuario_id`.
- Se mostrará el Récord Histórico y la fecha en la pestaña de "Progreso".

### Rest Timer (Pasivo)
- Al marcar `completada = true` en una serie, se captura el `timestamp` actual.
- Un componente de cliente en el UI calcula la diferencia con el `Date.now()` para mostrar el contador persistente.

### Fatigue-Proof UI
- **Color Primario**: `#ddee5e` (Verde lima/fluor).
- **Modo**: Dark Mode Obligatorio.
- **Interacción**: Botones de gran tamaño y controles táctiles +/- para pesos y repeticiones.

## 3. Flujo de Usuario

1. **Pantalla Inicio**: Calorías/Heatmap + Botón "Entrenar Hoy".
2. **Selección**: Elegir Plantilla (ej: "Día 1: Empuje").
3. **Entreno**:
   - Se listan ejercicios de la plantilla.
   - Botón "Cargar Anterior" para rellenar campos con datos de la última vez.
   - Al marcar serie, inicia Rest Timer.
4. **Finalizar**: Resumen de sesión y guardado.
