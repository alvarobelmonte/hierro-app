'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Check, RefreshCcw, Timer, Trash2, ChevronRight } from 'lucide-react'
import { saveSet, toggleSetStatus, finishSession, getPreviousWeights, copyPreviousSets } from '../../actions'

export default function WorkoutSession({ sessionId, initialEjercicios, initialSeries }: any) {
    const [ejercicios, setEjercicios] = useState(initialEjercicios)
    const [series, setSeries] = useState(initialSeries)
    const [restTime, setRestTime] = useState(0)
    const [showTimer, setShowTimer] = useState(false)
    const [loadingPrevious, setLoadingPrevious] = useState<string | null>(null)

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (showTimer) {
            timerRef.current = setInterval(() => {
                setRestTime(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [showTimer])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleAddSet = async (ejerSesionId: string) => {
        const newRecord = {
            ejercicio_sesion_id: ejerSesionId,
            peso: 0,
            repeticiones: 0,
            completada: false
        }

        // Optimistic UI could be here, but let's keep it simple for now
        await saveSet(newRecord)
        // Re-fetch or update state (Next.js revalidate should help, but since we are in client state...)
        // For MVP, we'll just manually update state
        window.location.reload()
    }

    const handleToggleComplete = async (setId: string, completed: boolean) => {
        await toggleSetStatus(setId, !completed)
        if (!completed) {
            setRestTime(0)
            setShowTimer(true)
        }
        // Update local state
        setSeries(series.map((s: any) => s.id === setId ? { ...s, completada: !completed } : s))
    }

    const handleLoadPrevious = async (ejerSesionId: string, ejercicioId: string) => {
        setLoadingPrevious(ejerSesionId)
        await copyPreviousSets(ejerSesionId, ejercicioId)
        setLoadingPrevious(null)
        window.location.reload()
    }

    const updateSetOptimistic = (setId: string, field: string, value: number) => {
        setSeries(series.map((s: any) => s.id === setId ? { ...s, [field]: value } : s))
        // we could debounced save here, but for MVP +/- buttons are for visual only until save
    }

    return (
        <div className="space-y-6">
            {/* Sticky Rest Timer */}
            {showTimer && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300">
                    <div className="glass px-6 py-2 rounded-full border border-primary/30 flex items-center gap-3 shadow-[0_0_20px_rgba(32,217,212,0.2)]">
                        <Timer className="text-primary animate-pulse" size={18} />
                        <span className="font-mono font-black text-primary text-xl">{formatTime(restTime)}</span>
                        <button onClick={() => setShowTimer(false)} className="text-white/30 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {ejercicios.map((ejer: any) => (
                <section key={ejer.id} className="glass rounded-3xl overflow-hidden border border-white/5">
                    <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold italic uppercase tracking-tight text-white/90">
                                {ejer.ejercicios_catalogo.nombre}
                            </h2>
                            {ejer.ejercicios_catalogo.notas_tecnicas && (
                                <p className="text-[10px] text-white/30 italic mt-1 line-clamp-1 italic italic">
                                    💡 {ejer.ejercicios_catalogo.notas_tecnicas}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => handleLoadPrevious(ejer.id, ejer.ejercicio_id)}
                            disabled={loadingPrevious === ejer.id}
                            className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform"
                        >
                            <RefreshCcw size={12} className={loadingPrevious === ejer.id ? 'animate-spin' : ''} />
                            Anterior
                        </button>
                    </div>

                    <div className="p-4 space-y-3">
                        <div className="grid grid-cols-12 px-2 text-[8px] uppercase font-black tracking-widest text-white/20">
                            <div className="col-span-1">#</div>
                            <div className="col-span-11 flex justify-around">
                                <span>Peso (kg)</span>
                                <span>Reps</span>
                                <span className="w-10"></span>
                            </div>
                        </div>

                        {series.filter((s: any) => s.ejercicio_sesion_id === ejer.id).map((set: any, idx: number) => (
                            <div
                                key={set.id}
                                className={`grid grid-cols-12 items-center gap-2 p-1 rounded-2xl transition-all ${set.completada ? 'bg-primary/10 border-primary/20 border opacity-60' : 'bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="col-span-1 text-center text-xs font-black text-white/20 italic">
                                    {idx + 1}
                                </div>

                                <div className="col-span-11 flex items-center justify-between gap-1 overflow-hidden">
                                    {/* Weight Input Group */}
                                    <div className="flex-1 flex items-center bg-black/40 rounded-xl px-1 border border-white/5">
                                        <button
                                            onClick={() => updateSetOptimistic(set.id, 'peso', Math.max(0, set.peso - 1.25))}
                                            disabled={set.completada}
                                            className="w-8 h-10 flex items-center justify-center text-white/30 active:text-primary transition-colors"
                                        >
                                            <span className="text-lg font-bold">−</span>
                                        </button>
                                        <input
                                            type="number"
                                            value={set.peso}
                                            onChange={(e) => updateSetOptimistic(set.id, 'peso', parseFloat(e.target.value) || 0)}
                                            disabled={set.completada}
                                            className="w-full bg-transparent text-center font-black text-sm outline-none text-primary"
                                        />
                                        <button
                                            onClick={() => updateSetOptimistic(set.id, 'peso', set.peso + 1.25)}
                                            disabled={set.completada}
                                            className="w-8 h-10 flex items-center justify-center text-white/30 active:text-primary transition-colors"
                                        >
                                            <span className="text-lg font-bold">+</span>
                                        </button>
                                    </div>

                                    {/* Reps Input Group */}
                                    <div className="flex-1 flex items-center bg-black/40 rounded-xl px-1 border border-white/5">
                                        <button
                                            onClick={() => updateSetOptimistic(set.id, 'repeticiones', Math.max(0, set.repeticiones - 1))}
                                            disabled={set.completada}
                                            className="w-8 h-10 flex items-center justify-center text-white/30 active:text-white transition-colors"
                                        >
                                            <span className="text-lg font-bold">−</span>
                                        </button>
                                        <input
                                            type="number"
                                            value={set.repeticiones}
                                            onChange={(e) => updateSetOptimistic(set.id, 'repeticiones', parseInt(e.target.value) || 0)}
                                            disabled={set.completada}
                                            className="w-full bg-transparent text-center font-black text-sm outline-none"
                                        />
                                        <button
                                            onClick={() => updateSetOptimistic(set.id, 'repeticiones', set.repeticiones + 1)}
                                            disabled={set.completada}
                                            className="w-8 h-10 flex items-center justify-center text-white/30 active:text-white transition-colors"
                                        >
                                            <span className="text-lg font-bold">+</span>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleToggleComplete(set.id, set.completada)}
                                        className={`shrink-0 w-12 h-10 rounded-xl flex items-center justify-center transition-all ${set.completada ? 'bg-primary text-black scale-90' : 'bg-primary/20 text-primary hover:bg-primary/30'
                                            }`}
                                    >
                                        <Check size={20} strokeWidth={4} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => handleAddSet(ejer.id)}
                            className="w-full py-3 text-white/30 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            <Plus size={14} />
                            Añadir Serie
                        </button>
                    </div>
                </section>
            ))}

            {/* Footer Finish Button */}
            <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40">
                <button
                    onClick={() => finishSession(sessionId)}
                    className="w-full py-4 rounded-3xl bg-white text-black font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    Finalizar Entrenamiento
                    <ChevronRight size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
    )
}

function X({ size, className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
