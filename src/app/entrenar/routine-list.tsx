'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Loader2 } from 'lucide-react'
import { createSession } from './actions'
import { useRouter } from 'next/navigation'

export default function RoutineList({ rutinas }: { rutinas: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const router = useRouter()

    const handleStart = async (rutinaId: string) => {
        setLoadingId(rutinaId)
        try {
            const sessionId = await createSession(rutinaId)
            router.push(`/entrenar/live/${sessionId}`)
        } catch (error) {
            console.error(error)
            alert('Error al iniciar sesión')
            setLoadingId(null)
        }
    }

    return (
        <div className="space-y-4">
            {rutinas.map((rutina) => (
                <button
                    key={rutina.id}
                    disabled={!!loadingId}
                    onClick={() => handleStart(rutina.id)}
                    className="w-full text-left block group"
                >
                    <div className="glass rounded-3xl p-6 flex justify-between items-center group-active:scale-[0.98] transition-all border border-white/5 hover:border-primary/30">
                        <div>
                            <h3 className="text-xl font-bold italic">{rutina.nombre}</h3>
                            <p className="text-white/40 text-xs mt-1">{rutina.descripcion || 'Sin descripción'}</p>
                        </div>
                        {loadingId === rutina.id ? (
                            <Loader2 className="animate-spin text-primary" size={20} />
                        ) : (
                            <ChevronRight className="text-primary group-hover:translate-x-1 transition-transform" />
                        )}
                    </div>
                </button>
            ))}
        </div>
    )
}
