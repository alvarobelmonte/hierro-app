import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RoutineForm from './routine-form'

export default async function NuevaRutinaPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Obtener el catálogo de ejercicios (globales y propios)
    const { data: catalogo } = await supabase
        .from('ejercicios_catalogo')
        .select('*')
        .order('nombre')

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">Nueva Plantilla</h1>
                <p className="text-white/40 text-sm font-medium italic">Define tu estructura de entrenamiento</p>
            </header>

            <RoutineForm catalogo={catalogo || []} />
        </div>
    )
}
