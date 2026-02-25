# Product Requirements Document (PRD): Hierro App

## 1. Resumen Ejecutivo

- **Declaración del Problema**: Las aplicaciones de entrenamiento actuales suelen ser complejas, lentas o están saturadas de publicidad y funciones innecesarias, lo cual dificulta el registro rápido de ejercicios durante sesiones de alta intensidad donde la fatiga física y mental es alta.
- **Solución Propuesta**: Una Progressive Web App (PWA) minimalista, de alto contraste y "fatigue-proof", optimizada para registrar entrenamientos en segundos, con autenticación exclusiva de Google y persistencia de datos en tiempo real.
- **Criterios de Éxito**:
  - Registro de una serie completada en menos de 3 segundos.
  - Tiempo de carga inicial inferior a 2 segundos en conexiones móviles.
  - El 100% de los entrenamientos realizados por el usuario y su círculo cercano quedan registrados sin pérdida de datos.
  - Interfaz visual funcional bajo condiciones de luz de gimnasio (alto brillo/contraste).

## 2. Experiencia de Usuario y Funcionalidad

- **User Personas**:
  - **El Atleta Enfocado**: El usuario o amigo que entrena seriamente y necesita una herramienta que no le distraiga. Valora la rapidez de entrada de datos y el historial inmediato de pesos anteriores.
- **Historias de Usuario**:
  - **Como usuario**, quiero iniciar sesión con Google para no tener que gestionar credenciales adicionales.
  - **Como usuario**, quiero seleccionar una rutina predefinida (ej: "Push Day") para comenzar mi sesión sin configurar ejercicios cada vez.
  - **Como usuario**, quiero ver automáticamente el peso y repeticiones de la sesión anterior para aplicar sobrecarga progresiva eficazmente.
  - **Como usuario**, quiero que un temporizador de descanso se inicie automáticamente al marcar una serie como completada.
- **Criterios de Aceptación**:
  - El sistema debe permitir crear, editar y eliminar rutinas y ejercicios maestros.
  - Al completar una serie, el botón debe cambiar visualmente de estado y disparar el contador.
  - La UI debe ser 100% utilizable en modo oscuro (Dark Mode obligatorio).
  - Los datos deben guardarse instantáneamente en Supabase mediante Server Actions o Supabase Client.
- **No-Objetivos**:
  - No se implementará feed social ni sistema de "amigos" dentro de la app (la compartición es implícita por el uso del grupo).
  - No se integrarán vídeos de ejercicios (solo notas técnicas en texto).
  - No se realizará seguimiento nutricional ni conteo de calorías avanzado en esta versión MVP.

## 3. Requisitos del Sistema (Técnicos)

- **Arquitectura**:
  - **Framework**: Next.js 15 (App Router) para SSR y rendimiento optimizado.
  - **Base de Datos**: PostgreSQL (Supabase) con esquema de 3 niveles: Catálogo -> Plantillas -> Sesiones.
  - **Autenticación**: Supabase Auth (Proveedores externos: Google únicamente).
  - **Estilizado**: Tailwind CSS 4 con un sistema de diseño basado en colores neón (Lime #ddee5e) sobre fondos oscuros.
- **Puntos de Integración**:
  - API de Supabase para operaciones CRUD.
  - Google OAuth para el flujo de identidad.
- **Seguridad y Privacidad**:
  - Implementación estricta de **Row Level Security (RLS)** en Supabase para asegurar que cada usuario solo acceda a sus propias rutinas e historial.
  - Cumplimiento básico de protección de datos (los datos son privados por defecto por usuario_id).

## 4. Riesgos y Hoja de Ruta (Roadmap)

- **Rollout Faseado**:
  - **MVP (Hoy)**: Autenticación, gestión de rutinas, registro de sesión en vivo con "Cargar Anterior" y temporizador de descanso.
  - **v1.1**: Heatmap de actividad en el dashboard y gestión de récords personales (PRs).
  - **v2.0**: Gráficas de volumen total por músculo y exportación de datos a CSV.
- **Riesgos Técnicos**:
  - **Conectividad**: La falta de señal en algunos gimnasios (sótanos) podría fallar los guardados. *Mitigación: Considerar implementación de PWA con soporte offline en el futuro.*
  - **Sincronización de Sesiones**: Riesgo de pérdida de datos si se cierra el navegador accidentalmente. *Mitigación: Guardado automático por serie completada.*
