import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ChevronRight, Dumbbell } from 'lucide-react'
import CalendarHeatmap from '@/components/calendar-heatmap'

export default async function HistorialPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Obtener las últimas sesiones para el historial y heatmap
    const { data: sesiones } = await supabase
        .from('sesiones')
        .select(`
      *,
      ejercicios_sesion (
        id,
        ejercicios_catalogo (nombre),
        series (id)
      )
    `)
        .eq('usuario_id', user.id)
        .order('fecha', { ascending: false })
        .limit(100) // Pedimos más para el calendario navegable

    // Generar datos para el heatmap (últimos 3 meses)
    const today = new Date()
    const activeDates = new Set(
        sesiones?.map(s => new Date(s.fecha).toISOString().split('T')[0])
    )

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">Historial</h1>
                <p className="text-white/40 text-sm font-medium italic">Tu rastro de hierro</p>
            </header>

            {/* Mini Heatmap Section */}
            <CalendarHeatmap activeDates={activeDates} />

            {/* Session List */}
            <div className="space-y-4">
                {sesiones && sesiones.length > 0 ? (
                    sesiones.map((sesion) => (
                        <div key={sesion.id} className="glass rounded-3xl p-6 border border-white/5 active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold italic uppercase">{sesion.nombre}</h3>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                                        {new Date(sesion.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                                <div className="bg-primary/10 px-3 py-1 rounded-full">
                                    <span className="text-primary font-black text-[10px] uppercase italic">
                                        {sesion.ejercicios_sesion.length} EJER.
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {sesion.ejercicios_sesion.slice(0, 3).map((es: any) => (
                                    <div key={es.id} className="flex items-center gap-2 text-xs text-white/60">
                                        <Dumbbell size={10} className="text-primary/40" />
                                        <span>{es.ejercicios_catalogo.nombre}</span>
                                        <span className="text-[10px] text-white/20 font-bold">
                                            • {es.series.length} series
                                        </span>
                                    </div>
                                ))}
                                {sesion.ejercicios_sesion.length > 3 && (
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-tighter pl-5">
                                        + {sesion.ejercicios_sesion.length - 3} ejercicios más
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center glass rounded-3xl border-dashed border-2 border-white/10">
                        <p className="text-white/20 italic text-sm">Aún no has forjado ninguna sesión.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
