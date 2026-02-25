'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSession(rutinaId: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('No autorizado')

    // 1. Obtener datos de la rutina para el nombre por defecto
    const { data: rutina } = await supabase
        .from('rutinas')
        .select('nombre')
        .eq('id', rutinaId)
        .single()

    // 2. Crear la sesión real
    const { data: sesiones, error: errorSesion } = await supabase
        .from('sesiones')
        .insert({
            usuario_id: user.id,
            rutina_id: rutinaId,
            nombre: rutina?.nombre || 'Sesión improvisada',
            fecha: new Date().toISOString(),
        })
        .select()
        .single()

    if (errorSesion) throw errorSesion

    // 3. Copiar los ejercicios de la rutina a ejercicios_sesion para esta instancia
    const { data: ejerRutina } = await supabase
        .from('ejercicios_rutina')
        .select('ejercicio_id, orden')
        .eq('rutina_id', rutinaId)

    if (ejerRutina && ejerRutina.length > 0) {
        const ejerSesionData = ejerRutina.map((er) => ({
            sesion_id: sesiones.id,
            ejercicio_id: er.ejercicio_id,
            orden: er.orden,
        }))

        await supabase.from('ejercicios_sesion').insert(ejerSesionData)
    }

    return sesiones.id
}

export async function saveSet(setData: any) {
    const supabase = await createClient()
    const { error } = await supabase.from('series').insert(setData)
    if (error) throw error
    revalidatePath(`/entrenar/${setData.session_id}`)
}

export async function toggleSetStatus(setId: string, completed: boolean) {
    const supabase = await createClient()
    await supabase.from('series').update({ completada: completed }).eq('id', setId)
}

export async function getPreviousWeights(ejercicioId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Buscar el último ejercicio_sesion del mismo ejercicio_id (que no sea el actual)
    const { data: lastExercise } = await supabase
        .from('ejercicios_sesion')
        .select('id, sesiones!inner(fecha)')
        .eq('ejercicio_id', ejercicioId)
        .eq('sesiones.usuario_id', user.id)
        .order('sesiones(fecha)', { ascending: false })
        .limit(1)
        .single()

    if (!lastExercise) return null

    const { data: lastSeries } = await supabase
        .from('series')
        .select('peso, repeticiones')
        .eq('ejercicio_sesion_id', lastExercise.id)
        .order('creado_el')

    return lastSeries
}

export async function copyPreviousSets(ejercicioSesionId: string, ejercicioId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const previousSeries = await getPreviousWeights(ejercicioId)
    if (!previousSeries || previousSeries.length === 0) return

    const newSeriesData = previousSeries.map((s: any) => ({
        ejercicio_sesion_id: ejercicioSesionId,
        peso: s.peso,
        repeticiones: s.repeticiones,
        completada: false
    }))

    await supabase.from('series').insert(newSeriesData)
    revalidatePath(`/entrenar/live`) // Revalidate the live session
}

export async function finishSession(sessionId: string) {
    revalidatePath('/')
    redirect('/')
}
