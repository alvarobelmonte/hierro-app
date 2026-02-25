import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell, Calendar, History } from "lucide-react";
import CalendarHeatmap from "@/components/calendar-heatmap";

export default async function Home() {
    const supabase = await createClient();

    // Obtener últimas sesiones para el heatmap y la última card
    const { data: { user } } = await supabase.auth.getUser();

    const { data: sesiones } = await supabase
        .from('sesiones')
        .select('id, fecha, nombre, comentarios_dia')
        .eq('usuario_id', user?.id)
        .order('fecha', { ascending: false })
        .limit(30);

    const ultimaSesion = sesiones?.[0];
    const activeDates = new Set(sesiones?.map(s => new Date(s.fecha).toISOString().split('T')[0]));
    const today = new Date();

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img
                        src="/icons/hierro-logo-no-bg.png"
                        alt="Hierro Logo"
                        className="w-32 h-auto object-contain drop-shadow-[0_0_15px_rgba(32,217,212,0.2)]"
                    />
                </div>
            </header>

            {/* Activity Section (Heatmap) */}
            <CalendarHeatmap activeDates={activeDates} />

            {/* Quick Start Card */}
            <section className="glass rounded-3xl p-6 border-l-4 border-primary bg-gradient-to-br from-primary/5 to-transparent">
                <h2 className="text-xl font-bold mb-2 italic uppercase">¿Listo para hoy?</h2>
                <p className="text-white/60 text-sm mb-6">Selecciona una de tus plantillas y entra en el flow.</p>
                <Link href="/entrenar" className="block w-full">
                    <button className="w-full bg-primary text-black font-black py-4 rounded-xl active:scale-95 transition-transform uppercase tracking-wider text-sm">
                        Empezar Entrenamiento
                    </button>
                </Link>
            </section>

            {/* Last Session Stats */}
            {ultimaSesion && (
                <section className="glass rounded-3xl p-6 space-y-4">
                    <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 flex items-center gap-2">
                        <History size={12} className="text-primary" />
                        Última Sesión
                    </h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black italic uppercase leading-none">{ultimaSesion.nombre}</h3>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                                {new Date(ultimaSesion.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                        <Link href="/historial" className="text-primary/60 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                            Ver más →
                        </Link>
                    </div>
                    {ultimaSesion.comentarios_dia && (
                        <p className="text-xs text-white/40 italic line-clamp-2">
                            "{ultimaSesion.comentarios_dia}"
                        </p>
                    )}
                </section>
            )}
        </div>
    );
}
