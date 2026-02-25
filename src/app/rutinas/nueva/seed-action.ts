'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function seedBasicExercises() {
    const supabase = await createClient();

    const exercises = [
        { nombre: 'Press de Banca', grupo_muscular: 'Pecho', notas_tecnicas: 'Retracción escapular y pies firmes.' },
        { nombre: 'Sentadillas', grupo_muscular: 'Pierna', notas_tecnicas: 'Mantener la espalda neutra.' },
        { nombre: 'Peso Muerto', grupo_muscular: 'Espalda', notas_tecnicas: 'Barra pegada a las espinillas.' },
        { nombre: 'Press Militar', grupo_muscular: 'Hombro', notas_tecnicas: 'Glúteos apretados para estabilidad.' },
        { nombre: 'Dominadas', grupo_muscular: 'Espalda', notas_tecnicas: 'Rango completo de movimiento.' },
        { nombre: 'Remo con Barra', grupo_muscular: 'Espalda', notas_tecnicas: 'Tronco paralelo al suelo.' },
        { nombre: 'Curl de Bíceps', grupo_muscular: 'Bíceps', notas_tecnicas: 'No balancear el cuerpo.' },
        { nombre: 'Press Francés', grupo_muscular: 'Tríceps', notas_tecnicas: 'Codos cerrados.' },
        { nombre: 'Zancadas', grupo_muscular: 'Pierna', notas_tecnicas: 'Pancita apretada.' },
        { nombre: 'Press Inclinado', grupo_muscular: 'Pecho', notas_tecnicas: 'Enfoque en haz clavicular.' }
    ];

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('No estás autenticado');

    const exercisesWithUser = exercises.map(ex => ({
        ...ex,
        usuario_id: user.id
    }));

    const { error } = await supabase
        .from('ejercicios_catalogo')
        .insert(exercisesWithUser);

    if (error) throw new Error(error.message);

    revalidatePath('/rutinas/nueva');
}
