import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WorkoutSession from './workout-session'

export default async function LiveWorkoutPage({ params }: { params: { sessionId: string } }) {
    const { sessionId } = params
    const supabase = await createClient()

    // 1. Obtener datos de la sesión
    const { data: sesion } = await supabase
        .from('sesiones')
        .select('*, rutina_id')
        .eq('id', sessionId)
        .single()

    if (!sesion) {
        redirect('/entrenar')
    }

    // 2. Obtener los ejercicios de la sesión con sus nombres del catálogo
    const { data: ejercicios } = await supabase
        .from('ejercicios_sesion')
        .select(`
      id,
      orden,
      comentarios_ejercicio_dia,
      ejercicio_id,
      ejercicios_catalogo (
        nombre,
        notas_tecnicas
      )
    `)
        .eq('sesion_id', sessionId)
        .order('orden')

    // 3. Obtener las series ya registradas (por si refresca la página)
    const { data: series } = await supabase
        .from('series')
        .select('*')
        .in('ejercicio_sesion_id', ejercicios?.map(e => e.id) || [])
        .order('creado_el')

    return (
        <div className="space-y-6 pb-24">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-primary italic uppercase tracking-tighter leading-none">{sesion.nombre}</h1>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">En vivo • {new Date(sesion.fecha).toLocaleDateString()}</p>
                </div>
            </header>

            <WorkoutSession
                sessionId={sessionId}
                initialEjercicios={ejercicios || []}
                initialSeries={series || []}
            />
        </div>
    )
}
