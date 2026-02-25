'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NuevoEjercicioPage() {
    const [nombre, setNombre] = useState('')
    const [grupo, setGrupo] = useState('')
    const [notas, setNotas] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre) return

        setIsSubmitting(true)
        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase.from('ejercicios_catalogo').insert({
            nombre,
            grupo_muscular: grupo,
            notas_tecnicas: notas,
            usuario_id: user?.id
        })

        if (error) {
            alert('Error al crear el ejercicio: ' + error.message)
            setIsSubmitting(false)
        } else {
            router.back() // Volver a donde viniera
        }
    }

    const grupos = [
        'Pecho', 'Espalda', 'Pierna', 'Hombro', 'Bíceps', 'Tríceps', 'Core', 'Cardio', 'Otros'
    ]

    return (
        <div className="space-y-8 min-h-[90vh]">
            <header>
                <button onClick={() => router.back()} className="text-primary text-xs uppercase font-bold tracking-widest mb-2 block flex items-center gap-1">
                    <ChevronLeft size={14} /> Volver
                </button>
                <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">Nuevo Ejercicio</h1>
                <p className="text-white/40 text-sm font-medium italic">Añade una variante o ejercicio específico</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2 px-1">Nombre del Ejercicio</span>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Press Francés con Mancuerna"
                            className="w-full glass bg-transparent border-none rounded-2xl p-4 text-lg font-bold placeholder:text-white/10 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono italic"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2 px-1">Grupo Muscular Principal</span>
                        <div className="grid grid-cols-3 gap-2">
                            {grupos.map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setGrupo(g)}
                                    className={`py-3 rounded-xl text-[10px] uppercase font-black transition-all ${grupo === g
                                            ? 'bg-primary text-black'
                                            : 'glass text-white/40'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label className="block">
                        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2 px-1">Notas Técnicas / Tips</span>
                        <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Ej: Retracción escapular máxima..."
                            className="w-full glass bg-transparent border-none rounded-2xl p-4 text-sm placeholder:text-white/10 outline-none focus:ring-2 focus:ring-primary/50 transition-all italic"
                            rows={3}
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 transition-all mt-8 ${isSubmitting ? 'bg-white/10 text-white/20' : 'bg-primary text-black active:scale-95 shadow-primary/20'
                        }`}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Crear Ejercicio</>}
                </button>
            </form>
        </div>
    )
}
