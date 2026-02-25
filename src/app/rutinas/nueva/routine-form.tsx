'use client'

import { useState } from 'react'
import { Plus, X, GripVertical, Check } from 'lucide-react'
import { createRoutine } from './actions'
import { seedBasicExercises } from './seed-action'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Ejercicio {
    id: string
    nombre: string
}

export default function RoutineForm({ catalogo }: { catalogo: Ejercicio[] }) {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [seleccionados, setSeleccionados] = useState<Ejercicio[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSeeding, setIsSeeding] = useState(false)
    const router = useRouter()

    const addEjercicio = (ejer: Ejercicio) => {
        setSeleccionados([...seleccionados, ejer])
    }

    const removeEjercicio = (index: number) => {
        const list = [...seleccionados]
        list.splice(index, 1)
        setSeleccionados(list)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre) return alert('El nombre es obligatorio')
        if (seleccionados.length === 0) return alert('Añade al menos un ejercicio')

        setIsSubmitting(true)
        try {
            const result = await createRoutine({
                nombre,
                descripcion,
                ejercicios: seleccionados.map(e => e.id)
            })

            if (result.success) {
                router.push('/entrenar')
            }
        } catch (error: any) {
            console.error(error)
            alert('Error al guardar la rutina: ' + (error?.message || 'Error desconocido'))
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <label className="block">
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2 px-1">Nombre de la Rutina</span>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Empuje / Día A"
                        className="w-full glass bg-transparent border-none rounded-2xl p-4 text-xl font-bold placeholder:text-white/10 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono italic"
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest block mb-2 px-1">Descripción (Opcional)</span>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Ej: Enfoque en hipertrofia de pecho..."
                        className="w-full glass bg-transparent border-none rounded-2xl p-4 text-sm placeholder:text-white/10 outline-none focus:ring-2 focus:ring-primary/50 transition-all italic"
                        rows={2}
                    />
                </label>
            </div>

            <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-bold text-white/40 tracking-widest px-1">Ejercicios en la Rutina</h3>

                {seleccionados.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center">
                        <p className="text-white/20 text-xs italic italic">No has añadido ejercicios aún.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {seleccionados.map((ejer, index) => (
                            <div key={index} className="glass rounded-2xl p-4 flex items-center justify-between border-l-4 border-primary/40 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="flex items-center gap-3">
                                    <span className="text-primary font-black italic italic">{index + 1}</span>
                                    <span className="font-bold">{ejer.nombre}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeEjercicio(index)}
                                    className="p-2 text-white/30 hover:text-red-500 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Catálogo</h3>
                    <Link href="/ejercicios/nuevo" className="text-[10px] uppercase font-black text-primary hover:underline">
                        + Personalizado
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {catalogo.length > 0 ? (
                        catalogo.map((ejer) => (
                            <button
                                key={ejer.id}
                                type="button"
                                onClick={() => addEjercicio(ejer)}
                                className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 active:scale-[0.98] transition-all text-left"
                            >
                                <span className="text-sm font-medium">{ejer.nombre}</span>
                                <Plus size={16} className="text-primary" />
                            </button>
                        ))
                    ) : (
                        <div className="glass rounded-3xl p-6 text-center space-y-4 border-dashed border-2 border-white/10">
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Catalogo Vacío</p>
                            <button
                                type="button"
                                onClick={async () => {
                                    setIsSeeding(true)
                                    await seedBasicExercises()
                                    router.refresh()
                                    setIsSeeding(false)
                                }}
                                disabled={isSeeding}
                                className="w-full py-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary/20 transition-all"
                            >
                                {isSeeding ? 'Generando...' : 'Sembrar Ejercicios Básicos'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 transition-all ${isSubmitting ? 'bg-white/10 text-white/20' : 'bg-primary text-black active:scale-95 shadow-primary/20'
                        }`}
                >
                    {isSubmitting ? 'Guardando...' : (
                        <>
                            <Check size={20} strokeWidth={3} />
                            Guardar Rutina
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
