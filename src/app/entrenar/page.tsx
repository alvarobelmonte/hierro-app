import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, ChevronRight } from 'lucide-react'
import RoutineList from './routine-list'

export default async function EntrenarPage() {
    const supabase = await createClient()

    // Obtener rutinas del usuario
    const { data: rutinas } = await supabase
        .from('rutinas')
        .select('*')
        .order('creado_el', { ascending: false })

    return (
        <div className="space-y-8">
            <header>
                <Link href="/" className="text-primary text-xs uppercase font-bold tracking-widest mb-2 block">← Volver</Link>
                <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">Entrenar</h1>
                <p className="text-white/40 text-sm font-medium italic">Selecciona una plantilla para empezar</p>
            </header>

            <div className="space-y-4">
                {rutinas && rutinas.length > 0 ? (
                    <RoutineList rutinas={rutinas} />
                ) : (
                    <div className="glass rounded-3xl p-8 text-center space-y-4 border-dashed border-2 border-white/10">
                        <p className="text-white/40 italic">No tienes plantillas creadas todavía.</p>
                        <Link href="/rutinas/nueva" className="inline-block bg-primary text-black font-black px-6 py-3 rounded-xl uppercase text-xs tracking-wider">
                            Crear mi primera rutina
                        </Link>
                    </div>
                )}

                {rutinas && rutinas.length > 0 && (
                    <Link href="/rutinas/nueva" className="flex items-center justify-center gap-2 w-full py-4 text-white/40 hover:text-primary transition-colors border-2 border-dashed border-white/10 rounded-3xl mt-8">
                        <Plus size={18} />
                        <span className="text-xs uppercase font-bold tracking-widest">Añadir Nueva Rutina</span>
                    </Link>
                )}
            </div>

            <section className="pt-8">
                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                    <h4 className="text-[10px] uppercase font-bold text-primary tracking-[0.2em] mb-2">Consejo Fatigue-Proof</h4>
                    <p className="text-white/60 text-xs italic line-clamp-2">"Las plantillas te ayudan a entrar en el 'flow' rápidamente. Configúralas con tus ejercicios favoritos para no perder tiempo en el rack."</p>
                </div>
            </section>
        </div>
    )
}
