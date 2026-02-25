import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TrendingUp, Award, Activity } from 'lucide-react'

export default async function ProgresoPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Obtener PRs (Mejor peso por ejercicio)
    // Nota: En un entorno de producción con muchos datos, esto se haría con un View o una función RPC
    const { data: records } = await supabase
        .from('series')
        .select(`
      peso,
      ejercicio_sesion (
        ejercicio_id,
        ejercicios_catalogo (nombre)
      )
    `)
        .eq('completada', true)

    // Agrupar por ejercicio y encontrar el máximo
    const prs = (records || []).reduce((acc: any, curr: any) => {
        const nombre = curr.ejercicio_sesion.ejercicios_catalogo.nombre
        const peso = parseFloat(curr.peso)
        if (!acc[nombre] || acc[nombre] < peso) {
            acc[nombre] = peso
        }
        return acc
    }, {})

    const prList = Object.entries(prs).sort((a: any, b: any) => b[1] - a[1])

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">Progreso</h1>
                <p className="text-white/40 text-sm font-medium italic">Tus récords personales</p>
            </header>

            {/* PR Cards View */}
            <div className="grid grid-cols-1 gap-4">
                {prList.length > 0 ? (
                    prList.map(([nombre, peso]: any) => (
                        <div key={nombre} className="glass rounded-3xl p-6 border-l-4 border-primary flex justify-between items-center overflow-hidden relative">
                            <div className="z-10">
                                <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">Récord Personal</p>
                                <h3 className="text-xl font-bold italic uppercase">{nombre}</h3>
                            </div>
                            <div className="text-right z-10">
                                <span className="text-3xl font-black text-primary italic">{peso}</span>
                                <span className="text-xs font-bold text-primary/40 ml-1">KG</span>
                            </div>
                            <TrendingUp className="absolute -right-4 -bottom-4 text-primary/5" size={120} />
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center glass rounded-3xl border-dashed border-2 border-white/10">
                        <p className="text-white/20 italic text-sm">Empieza a entrenar para ver tus récords.</p>
                    </div>
                )}
            </div>

            {/* Stats Summary Section */}
            <div className="glass rounded-3xl p-6 space-y-4">
                <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 flex items-center gap-2">
                    <Activity size={12} className="text-primary" />
                    Resumen de Cargas
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white/60">Volumen Total Mes</span>
                        <span className="text-xl font-black text-white italic">0 <span className="text-[10px] font-bold text-white/20">TON</span></span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/20 w-[60%] rounded-full shadow-[0_0_10px_rgba(32,217,212,0.3)]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
