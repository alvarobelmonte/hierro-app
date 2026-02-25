import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function PerfilPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const handleSignOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">Mi Perfil</h1>
                <p className="text-white/40 text-sm font-medium italic">Configuración de cuenta</p>
            </header>

            <div className="glass rounded-3xl p-8 flex flex-col items-center space-y-4">
                {user.user_metadata.avatar_url && (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                        <Image
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="text-center">
                    <p className="text-xl font-bold">{user.user_metadata.full_name || user.email}</p>
                    <p className="text-white/40 text-sm">{user.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                <form action={handleSignOut}>
                    <button className="w-full glass text-red-500 font-bold py-4 rounded-xl active:scale-95 transition-transform uppercase tracking-wider">
                        Cerrar Sesión
                    </button>
                </form>
            </div>

            <div className="glass rounded-3xl p-6">
                <h3 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-4">Estadísticas Rápidas</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-2xl font-black text-primary italic">0</p>
                        <p className="text-[10px] uppercase font-bold text-white/40">Entrenamientos</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-primary italic">0kg</p>
                        <p className="text-[10px] uppercase font-bold text-white/40">Volumen Total</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
