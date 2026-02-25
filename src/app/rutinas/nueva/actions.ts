'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRoutine(formData: any) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('No autorizado')

    const { nombre, descripcion, ejercicios } = formData

    // 1. Crear la rutina
    const { data: rutina, error: errorRutina } = await supabase
        .from('rutinas')
        .insert({
            usuario_id: user.id,
            nombre,
            descripcion,
        })
        .select()
        .single()

    if (errorRutina) {
        console.error('Error al insertar rutina:', errorRutina)
        throw new Error(`DB Rutina Error: ${errorRutina.message} (${errorRutina.code})`)
    }

    // 2. Añadir los ejercicios a la rutina
    if (ejercicios && ejercicios.length > 0) {
        const ejerciciosData = ejercicios.map((ejerId: string, index: number) => ({
            rutina_id: rutina.id,
            ejercicio_id: ejerId,
            orden: index + 1,
        }))

        const { error: errorEjercicios } = await supabase
            .from('ejercicios_rutina')
            .insert(ejerciciosData)

        if (errorEjercicios) {
            console.error('Error al insertar ejercicios_rutina:', errorEjercicios)
            throw new Error(`DB Ejercicios Error: ${errorEjercicios.message} (${errorEjercicios.code})`)
        }
    }

    revalidatePath('/entrenar')
    return { success: true }
}
