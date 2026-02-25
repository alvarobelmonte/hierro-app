'use client'

import { Dumbbell, History, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', icon: Dumbbell, label: 'Entrenar' },
        { href: '/historial', icon: History, label: 'Historial' },
        { href: '/progreso', icon: TrendingUp, label: 'Progreso' },
        { href: '/perfil', icon: User, label: 'Perfil' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass h-20 px-6 border-t border-white/10 flex items-center justify-between max-w-md mx-auto z-50">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <Icon size={isActive ? 28 : 22} strokeWidth={isActive ? 3 : 2} />
                        <span className={`text-[8px] uppercase tracking-widest font-black ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
