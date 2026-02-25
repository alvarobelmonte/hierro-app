'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarHeatmapProps {
    activeDates: Set<string> // Formato YYYY-MM-DD
}

export default function CalendarHeatmap({ activeDates }: CalendarHeatmapProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(currentDate)

    // Primer día del mes
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    // El día de la semana del primer día (0=domingo, 1=lunes)
    // Lo ajustamos para que 0=Lunes, 6=Domingo
    const startDay = (firstDayOfMonth.getDay() + 6) % 7

    // Días del mes actual
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Días del mes anterior para rellenar el inicio
    const prevMonthDaysCount = new Date(currentYear, currentMonth, 0).getDate()
    const padding = Array.from({ length: startDay }, (_, i) => prevMonthDaysCount - startDay + i + 1)

    const isToday = (day: number) => {
        const today = new Date()
        return today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear
    }

    const hasSession = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return activeDates.has(dateStr)
    }

    const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

    return (
        <section className="glass rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">Consistencia</span>
                    <h2 className="text-xl font-black italic uppercase text-white/90">{monthName} <span className="text-primary/40 not-italic font-mono text-sm">{currentYear}</span></h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 glass rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-90"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 glass rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-90"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {/* Días de la semana */}
                {weekDays.map(day => (
                    <div key={day} className="text-[8px] font-black text-white/20 pb-2">{day}</div>
                ))}

                {/* Padding mes anterior */}
                {padding.map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square rounded-lg flex items-center justify-center text-[10px] text-white/5 font-bold">
                        {/* Vacío visualmente para mantener el estilo de heatmap */}
                        <div className="w-full h-full p-1">
                            <div className="w-full h-full bg-white/[0.02] rounded-md" />
                        </div>
                    </div>
                ))}

                {/* Días reales */}
                {days.map(day => {
                    const active = hasSession(day)
                    const today = isToday(day)

                    return (
                        <div key={day} className="aspect-square relative flex items-center justify-center">
                            <div className="w-full h-full p-1">
                                <div
                                    className={`w-full h-full rounded-md transition-all duration-500 flex items-center justify-center text-[9px] font-bold ${active
                                            ? 'bg-primary shadow-[0_0_12px_rgba(32,217,212,0.4)] text-black'
                                            : today
                                                ? 'bg-white/10 border border-primary/30 text-primary'
                                                : 'bg-white/5 text-white/20'
                                        }`}
                                >
                                    {day}
                                </div>
                            </div>
                            {today && !active && (
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full border border-black" />
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-sm shadow-[0_0_5px_rgba(32,217,212,0.4)]" />
                    <span className="text-[8px] uppercase font-bold text-white/30 tracking-widest">Entrenado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white/5 rounded-sm" />
                    <span className="text-[8px] uppercase font-bold text-white/30 tracking-widest">Descanso</span>
                </div>
            </div>
        </section>
    )
}
