'use client'

import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function LoginPage() {
    const supabase = createClient()

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center px-4">
            <div className="space-y-4 flex flex-col items-center">
                <div className="relative w-44 h-44">
                    <Image
                        src="/icons/hierro-logo-no-bg.png"
                        alt="Hierro Logo"
                        fill
                        className="object-contain drop-shadow-[0_0_20px_rgba(32,217,212,0.3)]"
                        priority
                    />
                </div>
                <p className="text-white/40 font-medium tracking-wide">Forja tu mejor versión.</p>
            </div>

            <div className="glass p-8 rounded-3xl w-full max-w-sm border-t border-white/10">
                <h2 className="text-xl font-bold mb-6">Bienvenido</h2>
                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-xl active:scale-95 transition-transform"
                >
                    <svg
                        className="w-5 h-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#ea4335"
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.2-1.92 4.28-1.2 1.2-3.12 2.52-6.4 2.52-5.24 0-9.52-4.24-9.52-9.48s4.28-9.48 9.52-9.48c3.08 0 5.48 1.16 7.2 2.76l2.32-2.32C19.16 1.04 16.12 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c3.68 0 6.44-1.2 8.64-3.48 2.2-2.2 2.92-5.28 2.92-7.96 0-.68-.04-1.36-.12-2.04h-11.4v.16z"
                        />
                    </svg>
                    Continuar con Google
                </button>
                <p className="mt-6 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                    Acceso exclusivo vía Gmail
                </p>
            </div>
        </div>
    )
}
